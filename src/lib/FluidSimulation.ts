import * as THREE from 'three';

const SIMULATION_RESOLUTION = 256;
const DYE_RESOLUTION = 512;
const ITERATIONS = 12;
const VISCOSITY = 0.5;
const DISSIPATION = 0.98;
const VELOCITY_DISSIPATION = 0.99;
const PRESSURE_DISSIPATION = 0.8;
const CURL_STRENGTH = 10;
const SPLAT_RADIUS = 0.005;

// Shaders
const baseVertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const clearShader = `
    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float uValue;
    void main() {
        gl_FragColor = uValue * texture2D(uTexture, vUv);
    }
`;

const splatShader = `
    varying vec2 vUv;
    uniform sampler2D uTarget;
    uniform float uAspectRatio;
    uniform vec2 uPoint;
    uniform vec3 uColor;
    uniform float uRadius;
    void main() {
        vec2 p = vUv - uPoint.xy;
        p.x *= uAspectRatio;
        vec3 splat = exp(-dot(p, p) / uRadius) * uColor;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
    }
`;

const advectionShader = `
    varying vec2 vUv;
    uniform sampler2D uVelocity;
    uniform sampler2D uSource;
    uniform float uDt;
    uniform float uDissipation;
    void main() {
        vec2 coord = vUv - uDt * texture2D(uVelocity, vUv).xy;
        gl_FragColor = uDissipation * texture2D(uSource, coord);
    }
`;

const divergenceShader = `
    varying vec2 vUv;
    uniform sampler2D uVelocity;
    uniform vec2 uTexelSize;
    void main() {
        float L = texture2D(uVelocity, vUv - vec2(uTexelSize.x, 0.0)).x;
        float R = texture2D(uVelocity, vUv + vec2(uTexelSize.x, 0.0)).x;
        float T = texture2D(uVelocity, vUv + vec2(0.0, uTexelSize.y)).y;
        float B = texture2D(uVelocity, vUv - vec2(0.0, uTexelSize.y)).y;
        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
    }
`;

const curlShader = `
    varying vec2 vUv;
    uniform sampler2D uVelocity;
    uniform vec2 uTexelSize;
    void main() {
        float L = texture2D(uVelocity, vUv - vec2(uTexelSize.x, 0.0)).y;
        float R = texture2D(uVelocity, vUv + vec2(uTexelSize.x, 0.0)).y;
        float T = texture2D(uVelocity, vUv + vec2(0.0, uTexelSize.y)).x;
        float B = texture2D(uVelocity, vUv - vec2(0.0, uTexelSize.y)).x;
        float curl = R - L - T + B;
        gl_FragColor = vec4(curl, 0.0, 0.0, 1.0);
    }
`;

const vorticityShader = `
    varying vec2 vUv;
    uniform sampler2D uVelocity;
    uniform sampler2D uCurl;
    uniform float uDt;
    uniform float uCurlStrength;
    uniform vec2 uTexelSize;
    void main() {
        float L = texture2D(uCurl, vUv - vec2(uTexelSize.x, 0.0)).x;
        float R = texture2D(uCurl, vUv + vec2(uTexelSize.x, 0.0)).x;
        float T = texture2D(uCurl, vUv + vec2(0.0, uTexelSize.y)).x;
        float B = texture2D(uCurl, vUv - vec2(0.0, uTexelSize.y)).x;
        float C = texture2D(uCurl, vUv).x;
        vec2 force = vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001;
        force *= uCurlStrength * C;
        vec2 vel = texture2D(uVelocity, vUv).xy;
        gl_FragColor = vec4(vel + force * uDt, 0.0, 1.0);
    }
`;

const pressureShader = `
    varying vec2 vUv;
    uniform sampler2D uPressure;
    uniform sampler2D uDivergence;
    uniform vec2 uTexelSize;
    void main() {
        float L = texture2D(uPressure, vUv - vec2(uTexelSize.x, 0.0)).x;
        float R = texture2D(uPressure, vUv + vec2(uTexelSize.x, 0.0)).x;
        float T = texture2D(uPressure, vUv + vec2(0.0, uTexelSize.y)).x;
        float B = texture2D(uPressure, vUv - vec2(0.0, uTexelSize.y)).x;
        float C = texture2D(uPressure, vUv).x;
        float div = texture2D(uDivergence, vUv).x;
        float p = (L + R + B + T - div) * 0.25;
        gl_FragColor = vec4(p, 0.0, 0.0, 1.0);
    }
`;

const gradientSubtractShader = `
    varying vec2 vUv;
    uniform sampler2D uPressure;
    uniform sampler2D uVelocity;
    uniform vec2 uTexelSize;
    void main() {
        float L = texture2D(uPressure, vUv - vec2(uTexelSize.x, 0.0)).x;
        float R = texture2D(uPressure, vUv + vec2(uTexelSize.x, 0.0)).x;
        float T = texture2D(uPressure, vUv + vec2(0.0, uTexelSize.y)).x;
        float B = texture2D(uPressure, vUv - vec2(0.0, uTexelSize.y)).x;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity.xy -= vec2(R - L, T - B);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
    }
`;

export class FluidSimulation {
    private renderer: THREE.WebGLRenderer;
    private scene: THREE.Scene;
    private camera: THREE.Camera;
    
    private velocity: DoubleBuffer;
    private density: DoubleBuffer;
    private pressure: DoubleBuffer;
    private divergence: THREE.WebGLRenderTarget;
    private curl: THREE.WebGLRenderTarget;

    private mesh: THREE.Mesh;
    private materials: any = {};

    constructor(renderer: THREE.WebGLRenderer) {
        this.renderer = renderer;
        this.scene = new THREE.Scene();
        this.camera = new THREE.Camera();
        
        const params = {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
            type: THREE.FloatType,
            depthBuffer: false,
            stencilBuffer: false,
        };

        this.velocity = new DoubleBuffer(SIMULATION_RESOLUTION, SIMULATION_RESOLUTION, params);
        this.density = new DoubleBuffer(DYE_RESOLUTION, DYE_RESOLUTION, params);
        this.pressure = new DoubleBuffer(SIMULATION_RESOLUTION, SIMULATION_RESOLUTION, params);
        this.divergence = new THREE.WebGLRenderTarget(SIMULATION_RESOLUTION, SIMULATION_RESOLUTION, params);
        this.curl = new THREE.WebGLRenderTarget(SIMULATION_RESOLUTION, SIMULATION_RESOLUTION, params);

        this.initMaterials();
        this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.materials.clear);
        this.scene.add(this.mesh);
    }

    private initMaterials() {
        this.materials.clear = new THREE.ShaderMaterial({
            vertexShader: baseVertexShader,
            fragmentShader: clearShader,
            uniforms: { uTexture: { value: null }, uValue: { value: 1.0 } }
        });

        this.materials.splat = new THREE.ShaderMaterial({
            vertexShader: baseVertexShader,
            fragmentShader: splatShader,
            uniforms: { 
                uTarget: { value: null }, 
                uAspectRatio: { value: 1.0 },
                uPoint: { value: new THREE.Vector2() },
                uColor: { value: new THREE.Vector3() },
                uRadius: { value: SPLAT_RADIUS }
            }
        });

        this.materials.advection = new THREE.ShaderMaterial({
            vertexShader: baseVertexShader,
            fragmentShader: advectionShader,
            uniforms: { 
                uVelocity: { value: null },
                uSource: { value: null },
                uDt: { value: 0.016 },
                uDissipation: { value: 1.0 }
            }
        });

        this.materials.divergence = new THREE.ShaderMaterial({
            vertexShader: baseVertexShader,
            fragmentShader: divergenceShader,
            uniforms: { uVelocity: { value: null }, uTexelSize: { value: new THREE.Vector2(1/SIMULATION_RESOLUTION, 1/SIMULATION_RESOLUTION) } }
        });

        this.materials.curl = new THREE.ShaderMaterial({
            vertexShader: baseVertexShader,
            fragmentShader: curlShader,
            uniforms: { uVelocity: { value: null }, uTexelSize: { value: new THREE.Vector2(1/SIMULATION_RESOLUTION, 1/SIMULATION_RESOLUTION) } }
        });

        this.materials.vorticity = new THREE.ShaderMaterial({
            vertexShader: baseVertexShader,
            fragmentShader: vorticityShader,
            uniforms: { 
                uVelocity: { value: null },
                uCurl: { value: null },
                uDt: { value: 0.016 },
                uCurlStrength: { value: CURL_STRENGTH },
                uTexelSize: { value: new THREE.Vector2(1/SIMULATION_RESOLUTION, 1/SIMULATION_RESOLUTION) }
            }
        });

        this.materials.pressure = new THREE.ShaderMaterial({
            vertexShader: baseVertexShader,
            fragmentShader: pressureShader,
            uniforms: { 
                uPressure: { value: null },
                uDivergence: { value: null },
                uTexelSize: { value: new THREE.Vector2(1/SIMULATION_RESOLUTION, 1/SIMULATION_RESOLUTION) }
            }
        });

        this.materials.gradientSubtract = new THREE.ShaderMaterial({
            vertexShader: baseVertexShader,
            fragmentShader: gradientSubtractShader,
            uniforms: { 
                uPressure: { value: null },
                uVelocity: { value: null },
                uTexelSize: { value: new THREE.Vector2(1/SIMULATION_RESOLUTION, 1/SIMULATION_RESOLUTION) }
            }
        });
    }

    public splat(x: number, y: number, dx: number, dy: number) {
        this.mesh.material = this.materials.splat;
        
        // Splat Velocity
        this.materials.splat.uniforms.uTarget.value = this.velocity.read.texture;
        this.materials.splat.uniforms.uAspectRatio.value = this.renderer.domElement.width / this.renderer.domElement.height;
        this.materials.splat.uniforms.uPoint.value.set(x, y);
        this.materials.splat.uniforms.uColor.value.set(dx, dy, 0);
        this.materials.splat.uniforms.uRadius.value = SPLAT_RADIUS;
        this.renderer.setRenderTarget(this.velocity.write);
        this.renderer.render(this.scene, this.camera);
        this.velocity.swap();

        // Splat Density
        this.materials.splat.uniforms.uTarget.value = this.density.read.texture;
        this.materials.splat.uniforms.uColor.value.set(1.0, 1.0, 1.0); // Full density
        this.materials.splat.uniforms.uRadius.value = SPLAT_RADIUS * 2.0; // Slightly larger for density
        this.renderer.setRenderTarget(this.density.write);
        this.renderer.render(this.scene, this.camera);
        this.density.swap();
    }

    public update(dt: number) {
        this.renderer.setRenderTarget(null);

        // Curl
        this.mesh.material = this.materials.curl;
        this.materials.curl.uniforms.uVelocity.value = this.velocity.read.texture;
        this.renderer.setRenderTarget(this.curl);
        this.renderer.render(this.scene, this.camera);

        // Vorticity
        this.mesh.material = this.materials.vorticity;
        this.materials.vorticity.uniforms.uVelocity.value = this.velocity.read.texture;
        this.materials.vorticity.uniforms.uCurl.value = this.curl.texture;
        this.materials.vorticity.uniforms.uDt.value = dt;
        this.renderer.setRenderTarget(this.velocity.write);
        this.renderer.render(this.scene, this.camera);
        this.velocity.swap();

        // Divergence
        this.mesh.material = this.materials.divergence;
        this.materials.divergence.uniforms.uVelocity.value = this.velocity.read.texture;
        this.renderer.setRenderTarget(this.divergence);
        this.renderer.render(this.scene, this.camera);

        // Clear Pressure
        this.mesh.material = this.materials.clear;
        this.materials.clear.uniforms.uTexture.value = this.pressure.read.texture;
        this.materials.clear.uniforms.uValue.value = PRESSURE_DISSIPATION;
        this.renderer.setRenderTarget(this.pressure.write);
        this.renderer.render(this.scene, this.camera);
        this.pressure.swap();

        // Pressure
        this.mesh.material = this.materials.pressure;
        this.materials.pressure.uniforms.uDivergence.value = this.divergence.texture;
        for (let i = 0; i < ITERATIONS; i++) {
            this.materials.pressure.uniforms.uPressure.value = this.pressure.read.texture;
            this.renderer.setRenderTarget(this.pressure.write);
            this.renderer.render(this.scene, this.camera);
            this.pressure.swap();
        }

        // Gradient Subtract
        this.mesh.material = this.materials.gradientSubtract;
        this.materials.gradientSubtract.uniforms.uPressure.value = this.pressure.read.texture;
        this.materials.gradientSubtract.uniforms.uVelocity.value = this.velocity.read.texture;
        this.renderer.setRenderTarget(this.velocity.write);
        this.renderer.render(this.scene, this.camera);
        this.velocity.swap();

        // Advection Velocity
        this.mesh.material = this.materials.advection;
        this.materials.advection.uniforms.uVelocity.value = this.velocity.read.texture;
        this.materials.advection.uniforms.uSource.value = this.velocity.read.texture;
        this.materials.advection.uniforms.uDt.value = dt;
        this.materials.advection.uniforms.uDissipation.value = VELOCITY_DISSIPATION;
        this.renderer.setRenderTarget(this.velocity.write);
        this.renderer.render(this.scene, this.camera);
        this.velocity.swap();

        // Advection Density
        this.materials.advection.uniforms.uVelocity.value = this.velocity.read.texture;
        this.materials.advection.uniforms.uSource.value = this.density.read.texture;
        this.materials.advection.uniforms.uDissipation.value = DISSIPATION;
        this.renderer.setRenderTarget(this.density.write);
        this.renderer.render(this.scene, this.camera);
        this.density.swap();
    }

    public getDensityTexture() {
        return this.density.read.texture;
    }

    public dispose() {
        this.velocity.dispose();
        this.density.dispose();
        this.pressure.dispose();
        this.divergence.dispose();
        this.curl.dispose();
        for (const material of Object.values(this.materials) as THREE.ShaderMaterial[]) {
            material.dispose();
        }
        this.mesh.geometry.dispose();
    }
}

class DoubleBuffer {
    public read: THREE.WebGLRenderTarget;
    public write: THREE.WebGLRenderTarget;

    constructor(w: number, h: number, params: any) {
        this.read = new THREE.WebGLRenderTarget(w, h, params);
        this.write = new THREE.WebGLRenderTarget(w, h, params);
    }

    public swap() {
        const temp = this.read;
        this.read = this.write;
        this.write = temp;
    }

    public dispose() {
        this.read.dispose();
        this.write.dispose();
    }
}

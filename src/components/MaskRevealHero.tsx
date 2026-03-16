'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FluidSimulation } from '@/lib/FluidSimulation';

const MaskRevealHero = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const maskSceneRef = useRef<{
        renderer: THREE.WebGLRenderer;
        scene: THREE.Scene;
        camera: THREE.OrthographicCamera;
        fluid: FluidSimulation;
        material: THREE.ShaderMaterial;
    } | null>(null);

    useEffect(() => {
        if (!canvasRef.current || !containerRef.current) return;

        const container = containerRef.current;
        const canvas = canvasRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true,
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const fluid = new FluidSimulation(renderer);

        const textureLoader = new THREE.TextureLoader();
        const backTexture = textureLoader.load('/images/back_image.png');
        const frontTexture = textureLoader.load('/images/front_image.png');

        const material = new THREE.ShaderMaterial({
            uniforms: {
                uBackTexture: { value: backTexture },
                uFrontTexture: { value: frontTexture },
                uMaskTexture: { value: null },
                uResolution: { value: new THREE.Vector2(width, height) },
                uImageResolution: { value: new THREE.Vector2(1920, 1080) }, // Default, will update on load
                uTime: { value: 0 },
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec2 vUv;
                uniform sampler2D uBackTexture;
                uniform sampler2D uFrontTexture;
                uniform sampler2D uMaskTexture;
                uniform vec2 uResolution;
                uniform vec2 uImageResolution;

                vec2 getUv(vec2 uv, vec2 res, vec2 imgRes) {
                    float screenAspect = res.x / res.y;
                    float imgAspect = imgRes.x / imgRes.y;
                    vec2 newUv = uv;
                    if (screenAspect > imgAspect) {
                        float s = screenAspect / imgAspect;
                        newUv.y = (uv.y - 0.5) / s + 0.5;
                    } else {
                        float s = imgAspect / screenAspect;
                        newUv.x = (uv.x - 0.5) / s + 0.5;
                    }
                    return newUv;
                }

                void main() {
                    float maskValue = texture2D(uMaskTexture, vUv).r;
                    vec2 uv = getUv(vUv, uResolution, uImageResolution);
                    vec4 back = texture2D(uBackTexture, uv);
                    vec4 front = texture2D(uFrontTexture, uv);
                    
                    float mask = smoothstep(0.01, 0.4, maskValue);
                    vec4 finalImage = mix(back, front, mask);
                    
                    // Improved Transparency logic: Treat near-white as transparent
                    float brightness = (finalImage.r + finalImage.g + finalImage.b) / 3.0;
                    float imageAlpha = smoothstep(0.99, 0.95, brightness);
                    
                    gl_FragColor = vec4(finalImage.rgb, imageAlpha);
                }
            `,
            transparent: true,
        });

        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
        scene.add(mesh);

        maskSceneRef.current = { renderer, scene, camera, fluid, material };

        let lastMouse = new THREE.Vector2(0, 0);
        let currentMouse = new THREE.Vector2(0, 0);
        let isFirstMove = true;

        const onMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            currentMouse.set(
                (e.clientX - rect.left) / rect.width,
                1 - (e.clientY - rect.top) / rect.height
            );

            if (isFirstMove) {
                lastMouse.copy(currentMouse);
                isFirstMove = false;
            }

            const dx = (currentMouse.x - lastMouse.x) * 150.0;
            const dy = (currentMouse.y - lastMouse.y) * 150.0;

            if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
                fluid.splat(currentMouse.x, currentMouse.y, dx, dy);
            }

            lastMouse.copy(currentMouse);
        };

        window.addEventListener('mousemove', onMouseMove);

        let animationFrameId: number;
        let lastTime = performance.now();

        const render = (time: number) => {
            const dt = Math.min((time - lastTime) / 1000, 0.032);
            lastTime = time;

            fluid.update(dt);
            material.uniforms.uMaskTexture.value = fluid.getDensityTexture();
            material.uniforms.uTime.value = time * 0.001;

            renderer.setRenderTarget(null);
            renderer.render(scene, camera);

            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);

        const onResize = () => {
            const newWidth = container.clientWidth;
            const newHeight = container.clientHeight;
            renderer.setSize(newWidth, newHeight);
            material.uniforms.uResolution.value.set(newWidth, newHeight);
        };

        window.addEventListener('resize', onResize);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', onResize);
            cancelAnimationFrame(animationFrameId);
            renderer.dispose();
        };
    }, []);

    const textLine1 = "KALANA  SANDAKELUM  UNIVERSITY  OF  MORATUWA ";
    const textLine2 = "FULL  STACK  DEVELOPER  JAVA  SPRINGBOOT  NEXTJS  POSTGRESQL  MICROSERVICES  DOCKER  AWS";


    return (
        <div
            ref={containerRef}
            className="hero-container"
        >
            {/* ── Wavy SVG background ── */}
            <svg
                className="wave-bg"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <defs>
                    <pattern
                        id="waves"
                        x="0"
                        y="0"
                        width="40"
                        height="60"
                        patternUnits="userSpaceOnUse"
                    >
                        <path
                            d="M20 0 C26 10, 34 10, 40 20 C46 30, 34 30, 40 40 C46 50, 34 50, 40 60"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="0.6"
                        />
                        <path
                            d="M0 0 C6 10, 14 10, 20 20 C26 30, 14 30, 20 40 C26 50, 14 50, 20 60"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="0.6"
                        />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#waves)" />
            </svg>

            {/* Layer 1 – Back marquee (sits behind everything) */}
            <div className="marquee-layer back">
                <div className="marquee-row line-1">
                    <MarqueeTrack text={textLine1} reverse row={1} />
                </div>
                <div className="marquee-row line-2" style={{ marginTop: "0.15em" }}>
                    <MarqueeTrack text={textLine2} row={2} />
                </div>
            </div>

            <canvas
                ref={canvasRef}
                className="mask-canvas"
            />

            {/* Layer 4 – Front marquee (clips above person's waist) */}
            <div className="marquee-layer front">
                <div className="marquee-row line-1">
                    <MarqueeTrack text={textLine1} reverse row={1} />
                </div>
                <div className="marquee-row line-2" style={{ marginTop: "0.15em" }}>
                    <MarqueeTrack text={textLine2} row={2} />
                </div>
            </div>

            <style jsx>{`
                .hero-container {
                    width: 100%;
                    height: 100vh;
                    position: relative;
                    overflow: hidden;
                    background-color: #f5f4f0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .mask-canvas {
                    display: block;
                    width: 100%;
                    height: 100%;
                    position: relative;
                    z-index: 10;
                    pointer-events: auto;
                }
                .wave-bg {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    color: #c8c4bb;
                    pointer-events: none;
                    z-index: 0;
                }
                :global(.marquee-layer) {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    pointer-events: none;
                    overflow: hidden;
                }
                :global(.marquee-layer.back) {
                    z-index: 1;
                    color: #c5c1b9;
                }
                :global(.marquee-layer.front) {
                    z-index: 5;
                    color: #111;
                    clip-path: inset(54% 0 0 0);
                }
                :global(.marquee-row) {
                    display: flex;
                    white-space: pre;
                    overflow: hidden;
                    width: 100%;
                }
                :global(.marquee-track) {
                    display: flex;
                    width: max-content;
                    gap: 0;
                    font-size: clamp(80px, 15vw, 220px);
                    font-weight: 900;
                    line-height: 1.1;
                    letter-spacing: -0.05em;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
                    will-change: transform;
                }
                :global(.marquee-row.line-1 .marquee-track) {
                    animation: scrollLeft 120s linear infinite;
                }
                :global(.marquee-row.line-2 .marquee-track) {
                    animation: scrollLeft 120s linear infinite;
                }
                :global(.marquee-row.line-1 .marquee-track.reverse) {
                    animation: scrollRight 120s linear infinite;
                }
                :global(.marquee-row.line-2 .marquee-track.reverse) {
                    animation: scrollRight 120s linear infinite;
                }
                :global(.marquee-word) {
                    padding: 0 0.4em;
                    display: inline-block;
                }
                :global(.dot) {
                    margin-left: 0.4em;
                    opacity: 0.4;
                }
                @keyframes scrollLeft {
                    from { transform: translateX(0); }
                    to { transform: translateX(-50%); }
                }
                @keyframes scrollRight {
                    from { transform: translateX(-50%); }
                    to { transform: translateX(0); }
                }
                @media (max-width: 768px) {
                    :global(.marquee-layer.front) {
                        clip-path: inset(60% 0 0 0);
                    }
                }
            `}</style>
        </div>
    );
};

const MarqueeTrack = ({ text, reverse = false, row }: { text: string, reverse?: boolean, row: number }) => {
    // 8 tiles for short line, maybe 4 for long line to keep performance
    const words = Array(row === 1 ? 8 : 4).fill(text);
    return (
        <div className={`marquee-track ${reverse ? 'reverse' : ''}`}>
            {words.map((w, i) => (
                <span key={i} className="marquee-word">
                    {w}
                </span>
            ))}
        </div>
    );
};

export default MaskRevealHero;

'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FluidSimulation } from '@/lib/FluidSimulation';
import { useSettings } from '@/components/providers/SettingsProvider';

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

    const { heroBackUrl, heroFrontUrl } = useSettings();

    // Only the ≥md layout renders this WebGL hero (mobile uses <MobileHero/>).
    // The wrapper is hidden with CSS, but the component still mounts, so gate the
    // expensive simulation behind a matching media query — otherwise phones run a
    // full-resolution fluid sim + rAF loop + global listeners for an invisible canvas.
    const [isDesktop, setIsDesktop] = useState(
        () => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches,
    );

    useEffect(() => {
        const mq = window.matchMedia('(min-width: 768px)');
        const update = () => setIsDesktop(mq.matches);
        update();
        mq.addEventListener('change', update);
        return () => mq.removeEventListener('change', update);
    }, []);

    useEffect(() => {
        if (!isDesktop) return;
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
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const fluid = new FluidSimulation(renderer);

        const textureLoader = new THREE.TextureLoader();
        const backTexture = textureLoader.load(heroBackUrl ?? '/images/back_image.png');
        const frontTexture = textureLoader.load(heroFrontUrl ?? '/images/front_image.png');

        const material = new THREE.ShaderMaterial({
            uniforms: {
                uBackTexture: { value: backTexture },
                uFrontTexture: { value: frontTexture },
                uMaskTexture: { value: null },
                uResolution: { value: new THREE.Vector2(width, height) },
                uImageResolution: { value: new THREE.Vector2(1920, 1080) }, // Default, will update on load
                uImageScale: { value: 0.82 }, // <1 shrinks the subject so the head clears the navbar
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
                uniform float uImageScale;

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
                    uv = (uv - 0.5) / uImageScale + 0.5;
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
        let visible = true; // hero in viewport? (kept in sync by the observer below)

        const onMouseMove = (e: MouseEvent) => {
            if (!visible) return;
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

        // Pause the (expensive) fluid simulation whenever the hero is scrolled
        // out of view — this is the main fix for laggy scrolling.
        const io = new IntersectionObserver(
            ([entry]) => {
                visible = entry.isIntersecting;
            },
            { threshold: 0 },
        );
        io.observe(container);

        let animationFrameId: number;
        let lastTime = performance.now();

        const render = (time: number) => {
            animationFrameId = requestAnimationFrame(render);

            // Skip all GPU work while off-screen or the tab is hidden; keep the
            // loop alive so it resumes instantly when the hero returns.
            if (!visible || document.hidden) {
                lastTime = time;
                return;
            }

            const dt = Math.min((time - lastTime) / 1000, 0.032);
            lastTime = time;

            fluid.update(dt);
            material.uniforms.uMaskTexture.value = fluid.getDensityTexture();
            material.uniforms.uTime.value = time * 0.001;

            renderer.setRenderTarget(null);
            renderer.render(scene, camera);
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
            io.disconnect();
            cancelAnimationFrame(animationFrameId);
            fluid.dispose();
            mesh.geometry.dispose();
            material.dispose();
            backTexture.dispose();
            frontTexture.dispose();
            renderer.dispose();
        };
    }, [isDesktop, heroBackUrl, heroFrontUrl]);

    const textLine1 = "KALANA  SANDAKELUM  UNIVERSITY  OF  MORATUWA ";
    const textLine2 = "FULL  STACK  DEVELOPER  JAVA  SPRINGBOOT  NEXTJS  POSTGRESQL  MICROSERVICES  DOCKER  AWS";


    return (
        <div
            ref={containerRef}
            className="hero-container"
        >
            {/* ── Layer 0: subtle line pattern, far back ── */}
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

            {/* ── Layer 0.5: stage spotlight — soft warm glow centered on subject ── */}
            <div className="stage-spotlight" aria-hidden />

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

            {/* ── Layer 11: edge vignette + film grain — finishes the photograph ── */}
            <div className="vignette" aria-hidden />
            <div className="grain" aria-hidden />

            {/* ── Layer 13: top-fade scrim — gives the navbar a clean band to float over ── */}
            <div className="top-fade" aria-hidden />
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

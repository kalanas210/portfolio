"use client";

import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useRef, type PropsWithChildren, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  className?: string;
  /** max tilt in degrees */
  tilt?: number;
  /** rounded-* class for the glare overlay so it hugs the card's corners */
  radiusClassName?: string;
}

/**
 * Framer-style 3D hover card: the card tilts toward the cursor on a spring
 * and a soft light glare tracks the pointer. The glare is hidden on touch
 * devices (hide-on-touch) and the tilt is inert under prefers-reduced-motion.
 *
 * The DOM shape never branches on reduced motion — useReducedMotion is null
 * on the server but resolves on the first client render, so a structural
 * branch would mismatch the server HTML during hydration. Instead the
 * mousemove handler simply stops feeding the springs.
 */
export function TiltCard({
  children,
  className,
  tilt = 5,
  radiusClassName = "rounded-3xl",
}: PropsWithChildren<TiltCardProps>) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);

  // Cursor position normalized to 0..1 across the card
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 200, damping: 22, mass: 0.5 });
  const sy = useSpring(py, { stiffness: 200, damping: 22, mass: 0.5 });
  const rotateX = useTransform(sy, [0, 1], [tilt, -tilt]);
  const rotateY = useTransform(sx, [0, 1], [-tilt, tilt]);
  const glareX = useTransform(sx, (v) => `${v * 100}%`);
  const glareY = useTransform(sy, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(420px circle at ${glareX} ${glareY}, rgba(255,255,255,0.16), transparent 65%)`;

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || prefersReducedMotion) return;
    const rect = el.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  }

  function onLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <div className={cn("h-full [perspective:900px]", className)}>
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX, rotateY }}
        className="group/tilt relative h-full will-change-transform"
      >
        {children}
        <motion.div
          aria-hidden
          style={{ background: glare }}
          className={cn(
            "hide-on-touch pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100",
            radiusClassName,
          )}
        />
      </motion.div>
    </div>
  );
}

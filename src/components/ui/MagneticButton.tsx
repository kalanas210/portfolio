"use client";

import { motion, useMotionValue, useSpring, type HTMLMotionProps } from "framer-motion";
import { forwardRef, useRef, type PropsWithChildren, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

interface MagneticButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: Variant;
  size?: Size;
  strength?: number;
}

const variants: Record<Variant, string> = {
  primary:
    "btn-sheen bg-white text-ink-950 hover:bg-ink-100 dark:bg-white dark:text-ink-950 dark:hover:bg-ink-100 shadow-[0_10px_30px_-10px_rgba(255,255,255,0.4)]",
  ghost:
    "bg-white/5 text-ink-950 dark:text-white hover:bg-white/10 border border-black/10 dark:border-white/15 backdrop-blur-md",
  outline:
    "bg-transparent text-ink-950 dark:text-white border border-black/15 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-base",
};

export const MagneticButton = forwardRef<HTMLButtonElement, PropsWithChildren<MagneticButtonProps>>(
  function MagneticButton(
    { variant = "primary", size = "md", strength = 0.3, className, children, ...props },
    forwardedRef,
  ) {
    const localRef = useRef<HTMLButtonElement | null>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 200, damping: 18, mass: 0.4 });
    const sy = useSpring(y, { stiffness: 200, damping: 18, mass: 0.4 });

    function onMove(e: MouseEvent<HTMLButtonElement>) {
      const el = localRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const mx = e.clientX - (rect.left + rect.width / 2);
      const my = e.clientY - (rect.top + rect.height / 2);
      x.set(mx * strength);
      y.set(my * strength);
    }

    function onLeave() {
      x.set(0);
      y.set(0);
    }

    return (
      <motion.button
        ref={(node) => {
          localRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        style={{ x: sx, y: sy }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        whileTap={{ scale: 0.97 }}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 rounded-full font-medium",
          "transition-colors duration-200 ease-out-expo ring-focus",
          "disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  },
);

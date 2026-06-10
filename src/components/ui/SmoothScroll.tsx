"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "framer-motion";
import Lenis from "lenis";

// Module singleton so other components (hero scroll buttons, modals) can
// drive or pause the same instance instead of fighting it with native calls.
let lenisInstance: Lenis | null = null;

/** Smooth-scroll the window via Lenis when active, native otherwise. */
export function scrollWindowTo(top: number) {
  if (lenisInstance) {
    lenisInstance.scrollTo(top);
  } else {
    window.scrollTo({ top, behavior: "smooth" });
  }
}

/**
 * Buttery wheel scrolling — the signature "Framer site" feel. Touch devices
 * keep native momentum scrolling (Lenis only smooths wheel input by default)
 * and the whole thing is skipped under prefers-reduced-motion. Nested
 * scrollables (tool panes, textareas) keep native wheel via allowNestedScroll;
 * modals can opt out wholesale with data-lenis-prevent.
 */
export function SmoothScroll() {
  const prefersReducedMotion = useReducedMotion();
  const pathname = usePathname();
  const firstPath = useRef(true);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      allowNestedScroll: true,
    });
    lenisInstance = lenis;

    let rafId = requestAnimationFrame(function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    });

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisInstance = null;
    };
  }, [prefersReducedMotion]);

  // On route change, kill any in-flight inertia and re-sync to the top —
  // otherwise a wheel flick still easing out writes the OLD page's offset
  // back onto the new page (Lenis ignores external scrolls mid-animation).
  // Skipped on first render so browser scroll restoration on reload survives.
  useEffect(() => {
    if (firstPath.current) {
      firstPath.current = false;
      return;
    }
    lenisInstance?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return null;
}

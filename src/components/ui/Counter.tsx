"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface CounterProps {
  value: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

export function Counter({ value, duration = 1.6, suffix = "", className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState(0);

  // Keep the target's precision (e.g. 3.8 → 1 decimal) so fractional values like
  // a GPA aren't rounded up to a whole number.
  const decimals = Number.isInteger(value) ? 0 : (value.toString().split(".")[1]?.length ?? 0);

  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const start = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      setDisplay(value * ease(t));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration]);

  return (
    <motion.span ref={ref} className={className}>
      {display.toFixed(decimals)}
      {suffix}
    </motion.span>
  );
}

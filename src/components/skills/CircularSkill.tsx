"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface CircularSkillProps {
  name: string;
  level: number;
  gradientId: string;
  gradient: { from: string; to: string };
}

export function CircularSkill({ name, level, gradientId, gradient }: CircularSkillProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  const r = 38;
  const c = 2 * Math.PI * r;
  const offset = c - (level / 100) * c;

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className="relative h-24 w-24">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradient.from} />
              <stop offset="100%" stopColor={gradient.to} />
            </linearGradient>
          </defs>
          <circle
            cx="50"
            cy="50"
            r={r}
            stroke="currentColor"
            className="text-black/10 dark:text-white/10"
            strokeWidth="6"
            fill="none"
          />
          <motion.circle
            cx="50"
            cy="50"
            r={r}
            stroke={`url(#${gradientId})`}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDashoffset: c }}
            animate={inView ? { strokeDashoffset: offset } : {}}
            transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ strokeDasharray: c }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-xl font-bold tracking-tight">{level}</span>
          <span className="text-[10px] text-ink-400">/ 100</span>
        </div>
      </div>
      <div className="mt-3 text-center text-sm font-medium">{name}</div>
    </div>
  );
}

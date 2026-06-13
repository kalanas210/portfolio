"use client";

import { motion } from "framer-motion";

interface CircularSkillProps {
  name: string;
  level: number;
  // kept for call-site compatibility; the editorial design uses a mono ink ring.
  gradientId?: string;
  gradient?: { from: string; to: string };
}

export function CircularSkill({ name, level }: CircularSkillProps) {
  const r = 38;
  const c = 2 * Math.PI * r;
  const offset = c - (level / 100) * c;

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-24 w-24">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r={r}
            stroke="currentColor"
            className="text-ink-900/10 dark:text-white/10"
            strokeWidth="3"
            fill="none"
          />
          <motion.circle
            cx="50"
            cy="50"
            r={r}
            className="text-ink-900 dark:text-white"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDashoffset: c }}
            whileInView={{ strokeDashoffset: offset }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ strokeDasharray: c }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-xl font-bold tracking-tight tabular-nums">{level}</span>
          <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-ink-400">/ 100</span>
        </div>
      </div>
      <div className="mt-3 text-center text-sm font-medium tracking-tight">{name}</div>
    </div>
  );
}

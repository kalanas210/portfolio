"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useSettings } from "@/components/providers/SettingsProvider";

export function Portrait() {
  const { name, heroMobileUrl } = useSettings();
  const reduce = useReducedMotion();
  const src = heroMobileUrl ?? "/images/back_image.png";

  return (
    <div className="relative w-full max-w-sm">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-ink-900/10 bg-ink-100 dark:border-white/10 dark:bg-ink-900"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={name}
          className="h-full w-full object-cover object-[45%_10%] grayscale-[0.18] contrast-[1.04]"
        />

        {/* legibility scrim for the caption */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10"
        />

        {/* top-left index label */}
        <div className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/75">
          UoM · &rsquo;23—
        </div>

        {/* bottom caption */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 font-mono text-[10px] uppercase tracking-[0.18em] text-white">
          <span>{name}</span>
          <span className="text-white/60">Full-stack</span>
        </div>

        {/* hairline crop marks — editorial detail */}
        <span aria-hidden className="absolute left-3 top-3 h-3 w-3 border-l border-t border-white/40" />
        <span aria-hidden className="absolute right-3 bottom-3 h-3 w-3 border-b border-r border-white/40" />
      </motion.div>

      {/* one refined floating spec tag */}
      <motion.div
        animate={reduce ? undefined : { y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-3 bottom-12 rounded-xl border border-ink-900/10 bg-white px-3.5 py-2.5 shadow-[0_12px_30px_-16px_rgba(0,0,0,0.4)] dark:border-white/15 dark:bg-ink-950"
      >
        <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-400">Stack</div>
        <div className="mt-0.5 text-xs font-semibold tracking-tight">Next.js · Spring Boot</div>
      </motion.div>
    </div>
  );
}

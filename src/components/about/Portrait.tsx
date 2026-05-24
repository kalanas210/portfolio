"use client";

import { motion } from "framer-motion";

export function Portrait() {
  return (
    <div className="relative aspect-square w-full max-w-md">
      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-brand-violet via-brand-fuchsia to-brand-rose blur-2xl opacity-50" />
      <div className="relative h-full w-full overflow-hidden rounded-[2rem] border border-white/10 bg-ink-900">
        <motion.div
          animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
          transition={{ duration: 18, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0"
          style={{
            backgroundImage:
              "conic-gradient(from 0deg at 50% 50%, #8b5cf6, #d946ef, #fb7185, #fbbf24, #22d3ee, #34d399, #8b5cf6)",
            backgroundSize: "200% 200%",
            filter: "blur(40px)",
            opacity: 0.6,
          }}
        />
        <div className="absolute inset-0 grid-bg opacity-30" />

        {/* Centre monogram */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="absolute inset-0 -m-8 rounded-full bg-white/10 blur-2xl" />
            <span className="relative font-display text-[10rem] font-black leading-none text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
              K
            </span>
          </motion.div>
        </div>

        {/* Orbit ring */}
        <motion.div
          aria-hidden
          animate={{ rotate: 360 }}
          transition={{ duration: 24, ease: "linear", repeat: Infinity }}
          className="absolute inset-6 rounded-full border border-white/20"
        >
          <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-white shadow-[0_0_20px_4px_rgba(255,255,255,0.6)]" />
        </motion.div>
        <motion.div
          aria-hidden
          animate={{ rotate: -360 }}
          transition={{ duration: 36, ease: "linear", repeat: Infinity }}
          className="absolute inset-12 rounded-full border border-white/10"
        >
          <span className="absolute top-1/2 -right-1 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-brand-fuchsia shadow-[0_0_16px_3px_rgba(217,70,239,0.7)]" />
        </motion.div>
      </div>

      {/* Floating chips */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-6 top-12 rotate-[-6deg] rounded-2xl border border-black/10 dark:border-white/15 bg-white dark:bg-ink-900 px-4 py-3 shadow-xl"
      >
        <div className="text-[10px] uppercase tracking-[0.18em] text-ink-400">Currently</div>
        <div className="mt-1 text-sm font-semibold">Year 3 · UoM</div>
      </motion.div>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-4 bottom-10 rotate-[5deg] rounded-2xl border border-black/10 dark:border-white/15 bg-white dark:bg-ink-900 px-4 py-3 shadow-xl"
      >
        <div className="text-[10px] uppercase tracking-[0.18em] text-ink-400">Stack</div>
        <div className="mt-1 text-sm font-semibold">Next.js · Spring Boot</div>
      </motion.div>
    </div>
  );
}

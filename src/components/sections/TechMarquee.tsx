"use client";

import { motion } from "framer-motion";
import { techMarquee } from "@/lib/data";

export function TechMarquee() {
  const row = [...techMarquee, ...techMarquee];

  return (
    <section className="relative border-y border-black/10 dark:border-white/10 py-10 overflow-hidden">
      <div className="container">
        <p className="mb-6 text-center text-xs font-medium uppercase tracking-[0.24em] text-ink-400">
          Daily-driver toolkit
        </p>
      </div>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[rgb(var(--bg))] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[rgb(var(--bg))] to-transparent" />

        <motion.div
          aria-hidden
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, ease: "linear", repeat: Infinity }}
          className="flex w-max items-center gap-12 whitespace-nowrap px-4"
        >
          {row.map((label, i) => (
            <div
              key={`${label}-${i}`}
              className="flex items-center gap-3 text-lg sm:text-2xl font-display font-semibold text-ink-500 dark:text-ink-300"
            >
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 rounded-full bg-gradient-to-r from-brand-violet to-brand-fuchsia"
              />
              {label}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

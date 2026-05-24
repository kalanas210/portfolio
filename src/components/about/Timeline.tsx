"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { GraduationCap, Briefcase } from "lucide-react";
import { timeline } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 60%", "end 30%"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={ref} className="relative">
      <div className="absolute left-5 top-0 h-full w-px bg-black/10 dark:bg-white/10 sm:left-6" />
      <motion.div
        style={{ height: lineHeight }}
        className="absolute left-5 top-0 w-px bg-gradient-to-b from-brand-violet via-brand-fuchsia to-brand-rose sm:left-6"
      />

      <ul className="space-y-10">
        {timeline.map((entry, i) => {
          const Icon = entry.type === "education" ? GraduationCap : Briefcase;
          return (
            <motion.li
              key={entry.title + i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex gap-6 sm:gap-8"
            >
              <div
                className={cn(
                  "relative z-10 flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full border bg-white dark:bg-ink-900",
                  entry.type === "education"
                    ? "border-brand-violet/40 text-brand-violet"
                    : "border-brand-cyan/40 text-brand-cyan",
                )}
              >
                <Icon size={18} />
              </div>
              <div className="pb-2">
                <div className="text-xs font-medium uppercase tracking-[0.18em] text-ink-400">
                  {entry.year}
                </div>
                <h3 className="mt-1 font-display text-xl font-semibold tracking-tight">
                  {entry.title}
                </h3>
                <div className="mt-0.5 text-sm text-ink-500 dark:text-ink-300">{entry.org}</div>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-500 dark:text-ink-300">
                  {entry.description}
                </p>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

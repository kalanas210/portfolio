"use client";

import { motion } from "framer-motion";
import { skillGroups } from "@/lib/data";
import { cn } from "@/lib/utils";
import { RevealStagger, RevealItem } from "@/components/ui/Reveal";

export function SkillsBento() {
  return (
    <RevealStagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" amount={0.1}>
      {skillGroups.map((g) => {
        const Icon = g.icon;
        return (
          <RevealItem key={g.category}>
            <div className="group relative h-full overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-ink-900 p-6">
              <div
                aria-hidden
                className={cn(
                  "absolute -top-12 -right-12 h-40 w-40 rounded-full blur-2xl opacity-30 transition-opacity duration-500 group-hover:opacity-60 bg-gradient-to-br",
                  g.accent,
                )}
              />
              <div className="relative flex items-center gap-3">
                <div
                  className={cn(
                    "inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white",
                    g.accent,
                  )}
                >
                  <Icon size={18} />
                </div>
                <h3 className="font-display text-lg font-semibold tracking-tight">
                  {g.category}
                </h3>
              </div>
              <ul className="relative mt-5 space-y-2.5">
                {g.items.map((it) => (
                  <li key={it.name}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-ink-700 dark:text-ink-100">{it.name}</span>
                      <span className="font-mono text-[11px] text-ink-400">{it.level}%</span>
                    </div>
                    <div className="mt-1 h-1 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                      <motion.span
                        initial={{ width: 0 }}
                        whileInView={{ width: `${it.level}%` }}
                        viewport={{ once: true, amount: 0.6 }}
                        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                        className={cn("block h-full rounded-full bg-gradient-to-r", g.accent)}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </RevealItem>
        );
      })}
    </RevealStagger>
  );
}

"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { skillGroups, type SkillGroup } from "@/lib/data";
import { RevealStagger, RevealItem } from "@/components/ui/Reveal";

function SkillCard({ group, index }: { group: SkillGroup; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const Icon = group.icon;

  return (
    <RevealItem>
      <div
        ref={ref}
        className="group relative h-full rounded-2xl border border-ink-900/10 bg-white p-6 transition-colors hover:border-ink-900/25 dark:border-white/10 dark:bg-ink-900 dark:hover:border-white/25"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Icon size={16} strokeWidth={1.75} className="text-ink-900 dark:text-white" />
            <h3 className="font-display text-lg font-semibold tracking-tight">
              {group.category}
            </h3>
          </div>
          <span className="font-mono text-[11px] tabular-nums text-ink-300 dark:text-ink-600">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <div className="mt-5 h-px w-full bg-ink-900/10 dark:bg-white/10" />

        <ul className="mt-4 space-y-3">
          {group.items.map((it, itemIndex) => (
            <li key={it.name}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm text-ink-700 dark:text-ink-100">{it.name}</span>
                <span className="font-mono text-[11px] tabular-nums text-ink-400">
                  {it.level}
                </span>
              </div>
              <div className="mt-1.5 h-[2px] w-full overflow-hidden rounded-full bg-ink-900/[0.08] dark:bg-white/10">
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: inView ? it.level / 100 : 0 }}
                  transition={{
                    duration: 1,
                    delay: itemIndex * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{ transformOrigin: "left" }}
                  className="block h-full w-full bg-ink-900 dark:bg-white"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </RevealItem>
  );
}

export function SkillsBento() {
  return (
    <RevealStagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" amount={0.1}>
      {skillGroups.map((g, gi) => (
        <SkillCard key={g.category} group={g} index={gi} />
      ))}
    </RevealStagger>
  );
}

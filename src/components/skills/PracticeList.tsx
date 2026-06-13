"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import type { Practice } from "@/lib/data";
import { cn } from "@/lib/utils";

/**
 * Numbered, two-column list of engineering practices. Each row expands on click
 * to reveal a brief description. Editorial style: mono index + hairline rule.
 */
export function PracticeList({ items }: { items: Practice[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="grid sm:grid-cols-2 sm:gap-x-12">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.name} className="border-b border-black/10 dark:border-white/10">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="group flex w-full items-center gap-4 py-4 text-left"
            >
              <span className="font-mono text-xs tabular-nums text-ink-300 dark:text-ink-600">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1 font-display text-base font-medium tracking-tight sm:text-lg">
                {it.name}
              </span>
              <Plus
                size={16}
                className={cn(
                  "shrink-0 text-ink-400 transition-transform duration-300",
                  isOpen && "rotate-45",
                )}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="pb-4 pl-10 pr-4 text-sm leading-relaxed text-ink-500 dark:text-ink-300">
                    {it.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

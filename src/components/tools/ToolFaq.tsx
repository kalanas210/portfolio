"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Faq } from "@/lib/tools/seo";
import { cn } from "@/lib/utils";

export function ToolFaq({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-black/10 overflow-hidden rounded-2xl border border-black/10 dark:divide-white/10 dark:border-white/10">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
            >
              <span className="font-medium">{f.q}</span>
              <ChevronDown
                size={18}
                className={cn("shrink-0 text-ink-400 transition-transform", isOpen && "rotate-180")}
              />
            </button>
            {isOpen && (
              <p className="px-5 pb-4 text-sm leading-relaxed text-ink-500 dark:text-ink-300">
                {f.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

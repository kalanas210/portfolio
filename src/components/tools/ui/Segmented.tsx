"use client";

import { cn } from "@/lib/utils";

/** Small segmented control (mode switch) reused across the dev tools. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex rounded-xl border border-black/10 p-1 dark:border-white/10">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors",
            value === o.value
              ? "bg-ink-950 text-white dark:bg-white dark:text-ink-950"
              : "text-ink-500 hover:text-ink-950 dark:hover:text-white",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

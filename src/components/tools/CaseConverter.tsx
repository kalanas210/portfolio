"use client";

import { useState } from "react";
import { CopyButton } from "./ui/CopyButton";
import { toolCard, toolTextarea, toolLabel } from "./ui/styles";
import { cn } from "@/lib/utils";

function words(s: string): string[] {
  return s
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_\-./\\]+/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.toLowerCase());
}

const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1);

export function CaseConverter() {
  const [input, setInput] = useState("");
  const w = words(input);

  const cases = input.trim()
    ? [
        { label: "camelCase", value: w.map((x, i) => (i ? cap(x) : x)).join("") },
        { label: "PascalCase", value: w.map(cap).join("") },
        { label: "snake_case", value: w.join("_") },
        { label: "kebab-case", value: w.join("-") },
        { label: "CONSTANT_CASE", value: w.join("_").toUpperCase() },
        { label: "Title Case", value: w.map(cap).join(" ") },
        { label: "Sentence case", value: w.length ? cap(w.join(" ")) : "" },
        { label: "lower case", value: w.join(" ") },
        { label: "UPPER CASE", value: w.join(" ").toUpperCase() },
      ]
    : [];

  return (
    <div className={toolCard}>
      <label className={toolLabel}>Text</label>
      <textarea
        className={cn(toolTextarea, "h-28")}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Some text to re-case…"
        spellCheck={false}
      />

      <div className="mt-5 space-y-2">
        {cases.map((c) => (
          <div
            key={c.label}
            className="flex items-center gap-3 rounded-xl border border-black/10 px-4 py-2.5 dark:border-white/10"
          >
            <span className="w-32 shrink-0 text-xs font-semibold uppercase tracking-wide text-ink-400">
              {c.label}
            </span>
            <span className="flex-1 break-all font-mono text-sm">{c.value}</span>
            <CopyButton value={c.value} label="" />
          </div>
        ))}
        {!cases.length && <p className="text-sm text-ink-400">Type something to see every case.</p>}
      </div>
    </div>
  );
}

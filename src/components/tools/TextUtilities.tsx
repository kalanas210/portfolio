"use client";

import { useState } from "react";
import { CopyButton } from "./ui/CopyButton";
import { toolCard, toolTextarea, toolLabel } from "./ui/styles";
import { cn } from "@/lib/utils";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function TextUtilities() {
  const [text, setText] = useState("");

  const stats = {
    Characters: text.length,
    Words: text.trim() ? text.trim().split(/\s+/).length : 0,
    Lines: text ? text.split(/\n/).length : 0,
  };

  const transforms: { label: string; fn: (s: string) => string }[] = [
    { label: "Slugify", fn: slugify },
    { label: "Sort A→Z", fn: (s) => s.split("\n").sort((a, b) => a.localeCompare(b)).join("\n") },
    { label: "Reverse lines", fn: (s) => s.split("\n").reverse().join("\n") },
    { label: "Remove duplicates", fn: (s) => Array.from(new Set(s.split("\n"))).join("\n") },
    { label: "Trim lines", fn: (s) => s.split("\n").map((l) => l.trim()).join("\n") },
    { label: "Remove blank lines", fn: (s) => s.split("\n").filter((l) => l.trim()).join("\n") },
    { label: "UPPERCASE", fn: (s) => s.toUpperCase() },
    { label: "lowercase", fn: (s) => s.toLowerCase() },
  ];

  return (
    <div className={toolCard}>
      <div className="mb-2 flex items-center justify-between">
        <label className={toolLabel}>Text</label>
        <CopyButton value={text} />
      </div>
      <textarea
        className={cn(toolTextarea, "h-56")}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste or type text, then apply a transform…"
        spellCheck={false}
      />

      <div className="mt-4 flex flex-wrap gap-4">
        {Object.entries(stats).map(([k, v]) => (
          <div key={k} className="text-sm">
            <span className="font-semibold tabular-nums">{v.toLocaleString()}</span>{" "}
            <span className="text-ink-400">{k.toLowerCase()}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {transforms.map((t) => (
          <button
            type="button"
            key={t.label}
            onClick={() => setText((s) => t.fn(s))}
            disabled={!text}
            className="rounded-full border border-black/15 px-3.5 py-1.5 text-sm text-ink-600 transition-colors hover:border-black/30 hover:text-ink-950 disabled:opacity-40 dark:border-white/15 dark:text-ink-300 dark:hover:border-white/30 dark:hover:text-white"
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

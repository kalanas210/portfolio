"use client";

import { useState } from "react";
import { Braces, Minimize2, AlertCircle } from "lucide-react";
import { CopyButton } from "./ui/CopyButton";
import { cn } from "@/lib/utils";

const ta =
  "w-full rounded-xl border border-black/10 bg-white px-3 py-3 font-mono text-[13px] leading-relaxed focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/40 dark:border-white/10 dark:bg-ink-800";
const card =
  "rounded-3xl border border-black/10 bg-white/60 p-5 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.03] sm:p-7";

export function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  function run(minify: boolean) {
    setError(null);
    if (!input.trim()) {
      setOutput("");
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, minify ? 0 : 2));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      setOutput("");
    }
  }

  return (
    <div className={card}>
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs font-medium uppercase tracking-wide text-ink-400">Input</label>
            <button
              type="button"
              onClick={() => {
                setInput("");
                setOutput("");
                setError(null);
              }}
              className="text-xs text-ink-400 transition-colors hover:text-ink-950 dark:hover:text-white"
            >
              Clear
            </button>
          </div>
          <textarea
            className={cn(ta, "h-72")}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={'{ "hello": "world" }'}
            spellCheck={false}
          />
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs font-medium uppercase tracking-wide text-ink-400">Output</label>
            <CopyButton value={output} />
          </div>
          <textarea
            className={cn(ta, "h-72")}
            value={output}
            readOnly
            placeholder="Formatted JSON appears here"
            spellCheck={false}
          />
        </div>
      </div>

      {error && (
        <p className="mt-4 inline-flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-300">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {error}
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => run(false)}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-ink-950 px-5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-ink-950"
        >
          <Braces size={16} />
          Format
        </button>
        <button
          type="button"
          onClick={() => run(true)}
          className="inline-flex h-11 items-center gap-2 rounded-xl border border-black/10 px-5 text-sm font-medium text-ink-700 transition-colors hover:text-ink-950 dark:border-white/10 dark:text-ink-200 dark:hover:text-white"
        >
          <Minimize2 size={16} />
          Minify
        </button>
      </div>
    </div>
  );
}

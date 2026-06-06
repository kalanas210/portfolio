"use client";

import { useState } from "react";
import { CopyButton } from "./ui/CopyButton";
import { cn } from "@/lib/utils";

const ta =
  "w-full rounded-xl border border-black/10 bg-white px-3 py-3 font-mono text-[13px] leading-relaxed focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/40 dark:border-white/10 dark:bg-ink-800";
const card =
  "rounded-3xl border border-black/10 bg-white/60 p-5 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.03] sm:p-7";

// UTF-8-safe base64 (handles emoji & accents, no deprecated escape/unescape).
function encodeB64(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
}
function decodeB64(s: string): string {
  const bin = atob(s.trim());
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function Base64Tool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");

  let output = "";
  let error: string | null = null;
  if (input) {
    try {
      output = mode === "encode" ? encodeB64(input) : decodeB64(input);
    } catch {
      error = "That doesn't look like valid Base64.";
    }
  }

  return (
    <div className={card}>
      <div className="mb-4 inline-flex rounded-xl border border-black/10 p-1 dark:border-white/10">
        {(["encode", "decode"] as const).map((m) => (
          <button
            type="button"
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              "rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition-colors",
              mode === m
                ? "bg-ink-950 text-white dark:bg-white dark:text-ink-950"
                : "text-ink-500 hover:text-ink-950 dark:hover:text-white",
            )}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs font-medium uppercase tracking-wide text-ink-400">
              {mode === "encode" ? "Text" : "Base64"}
            </label>
            <button
              type="button"
              onClick={() => setInput("")}
              className="text-xs text-ink-400 transition-colors hover:text-ink-950 dark:hover:text-white"
            >
              Clear
            </button>
          </div>
          <textarea
            className={cn(ta, "h-56 break-all")}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "Type text to encode…" : "Paste Base64 to decode…"}
            spellCheck={false}
          />
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs font-medium uppercase tracking-wide text-ink-400">Result</label>
            <CopyButton value={output} />
          </div>
          <textarea className={cn(ta, "h-56 break-all")} value={error ? "" : output} readOnly spellCheck={false} />
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-300">
          {error}
        </p>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { CopyButton } from "./ui/CopyButton";
import { cn } from "@/lib/utils";

const ta =
  "w-full rounded-xl border border-black/10 bg-white px-3 py-3 font-mono text-[13px] leading-relaxed focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/40 dark:border-white/10 dark:bg-ink-800";
const card =
  "rounded-3xl border border-black/10 bg-white/60 p-5 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.03] sm:p-7";

const ALGOS = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;

async function digestHex(algo: string, text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest(algo, data);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function HashGenerator() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;
    if (!input) {
      setHashes({});
      return;
    }
    Promise.all(ALGOS.map((a) => digestHex(a, input).then((h) => [a, h] as const))).then(
      (entries) => {
        if (active) setHashes(Object.fromEntries(entries));
      },
    );
    return () => {
      active = false;
    };
  }, [input]);

  return (
    <div className={card}>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-xs font-medium uppercase tracking-wide text-ink-400">Input text</label>
        {input && (
          <button
            type="button"
            onClick={() => setInput("")}
            className="text-xs text-ink-400 transition-colors hover:text-ink-950 dark:hover:text-white"
          >
            Clear
          </button>
        )}
      </div>
      <textarea
        className={cn(ta, "h-28")}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type or paste text to hash…"
        spellCheck={false}
      />

      <div className="mt-5 space-y-3">
        {ALGOS.map((a) => (
          <div key={a}>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-500 dark:text-ink-300">
                {a}
              </span>
              <CopyButton value={hashes[a] ?? ""} />
            </div>
            <div className="break-all rounded-xl border border-black/10 bg-white px-3 py-2.5 font-mono text-[12px] text-ink-600 dark:border-white/10 dark:bg-ink-800 dark:text-ink-300">
              {hashes[a] || <span className="text-ink-400">-</span>}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-ink-400">
        Computed locally with the Web Crypto API. Nothing is sent anywhere.
      </p>
    </div>
  );
}

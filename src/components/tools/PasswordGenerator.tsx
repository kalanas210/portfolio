"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { CopyButton } from "./ui/CopyButton";
import { toolCard, toolLabel } from "./ui/styles";
import { cn } from "@/lib/utils";

const SETS = {
  lower: "abcdefghijkmnpqrstuvwxyz",
  upper: "ABCDEFGHJKLMNPQRSTUVWXYZ",
  number: "23456789",
  symbol: "!@#$%^&*()-_=+[]{};:,.?/",
  ambiguous: "il1Lo0O",
};

export function PasswordGenerator() {
  const [length, setLength] = useState(20);
  const [lower, setLower] = useState(true);
  const [upper, setUpper] = useState(true);
  const [number, setNumber] = useState(true);
  const [symbol, setSymbol] = useState(true);
  const [password, setPassword] = useState("");

  const generate = useCallback(() => {
    let pool = "";
    if (lower) pool += SETS.lower;
    if (upper) pool += SETS.upper;
    if (number) pool += SETS.number;
    if (symbol) pool += SETS.symbol;
    if (!pool) {
      setPassword("");
      return;
    }
    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    let out = "";
    for (let i = 0; i < length; i++) out += pool[arr[i] % pool.length];
    setPassword(out);
  }, [length, lower, upper, number, symbol]);

  useEffect(() => {
    generate();
  }, [generate]);

  const poolSize =
    (lower ? SETS.lower.length : 0) +
    (upper ? SETS.upper.length : 0) +
    (number ? SETS.number.length : 0) +
    (symbol ? SETS.symbol.length : 0);
  const entropy = poolSize ? Math.round(length * Math.log2(poolSize)) : 0;
  const strength =
    entropy >= 100 ? "Very strong" : entropy >= 75 ? "Strong" : entropy >= 50 ? "Fair" : "Weak";
  const strengthColor =
    entropy >= 75
      ? "text-emerald-600 dark:text-emerald-400"
      : entropy >= 50
        ? "text-amber-600 dark:text-amber-400"
        : "text-rose-600 dark:text-rose-400";

  const toggles: [string, boolean, (v: boolean) => void][] = [
    ["Lowercase", lower, setLower],
    ["Uppercase", upper, setUpper],
    ["Numbers", number, setNumber],
    ["Symbols", symbol, setSymbol],
  ];

  return (
    <div className={toolCard}>
      <div className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-4 py-3 dark:border-white/10 dark:bg-ink-800">
        <span className="flex-1 break-all font-mono text-base">{password || "—"}</span>
        <button
          type="button"
          onClick={generate}
          aria-label="Regenerate"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 text-ink-500 transition-colors hover:text-ink-950 dark:border-white/10 dark:hover:text-white"
        >
          <RefreshCw size={15} />
        </button>
        <CopyButton value={password} />
      </div>

      <p className="mt-3 text-xs text-ink-400">
        Strength: <span className={cn("font-semibold", strengthColor)}>{strength}</span> · ~{entropy} bits of entropy
      </p>

      <div className="mt-5">
        <label className={toolLabel}>Length — {length}</label>
        <input
          type="range"
          min={6}
          max={64}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full accent-accent"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {toggles.map(([label, val, set]) => (
          <button
            type="button"
            key={label}
            onClick={() => set(!val)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
              val
                ? "border-transparent bg-ink-950 text-white dark:bg-white dark:text-ink-950"
                : "border-black/15 text-ink-500 hover:text-ink-950 dark:border-white/15 dark:hover:text-white",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="mt-4 text-xs text-ink-400">
        Generated with the browser&apos;s cryptographic RNG. Look-alike characters are excluded.
      </p>
    </div>
  );
}

"use client";

import { useState } from "react";
import { CopyButton } from "./ui/CopyButton";
import { toolCard, toolInput, toolLabel, toolError } from "./ui/styles";
import { cn } from "@/lib/utils";

const BASES = [
  { base: 2, label: "Binary", re: /^[01]+$/, ph: "1010" },
  { base: 8, label: "Octal", re: /^[0-7]+$/, ph: "755" },
  { base: 10, label: "Decimal", re: /^[0-9]+$/, ph: "42" },
  { base: 16, label: "Hex", re: /^[0-9a-fA-F]+$/, ph: "2a" },
];

function toBigInt(value: string, base: number): bigint {
  let result = 0n;
  const b = BigInt(base);
  for (const ch of value.toLowerCase()) {
    result = result * b + BigInt(parseInt(ch, base));
  }
  return result;
}

export function NumberBase() {
  const [value, setValue] = useState("");
  const [base, setBase] = useState(10);

  const active = BASES.find((b) => b.base === base)!;
  const clean = value.trim();
  const valid = !clean || active.re.test(clean);
  const num = valid && clean ? toBigInt(clean, base) : null;

  return (
    <div className={toolCard}>
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1">
          <label className={toolLabel}>Value</label>
          <input
            className={cn(toolInput, "font-mono")}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={active.ph}
          />
        </div>
        <div>
          <label className={toolLabel}>From base</label>
          <select className={toolInput} value={base} onChange={(e) => setBase(Number(e.target.value))}>
            {BASES.map((b) => (
              <option key={b.base} value={b.base}>
                {b.label} (base {b.base})
              </option>
            ))}
          </select>
        </div>
      </div>

      {!valid && <p className={toolError}>Not a valid {active.label.toLowerCase()} number.</p>}

      <div className="mt-5 space-y-2">
        {BASES.map((b) => {
          const out = num == null ? "" : num.toString(b.base).toUpperCase();
          return (
            <div
              key={b.base}
              className="flex items-center gap-3 rounded-xl border border-black/10 px-4 py-3 dark:border-white/10"
            >
              <span className="w-24 shrink-0 text-xs font-semibold uppercase tracking-wide text-ink-400">
                {b.label}
              </span>
              <span className="flex-1 break-all font-mono text-sm">
                {out || <span className="text-ink-400">—</span>}
              </span>
              <CopyButton value={out} label="" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

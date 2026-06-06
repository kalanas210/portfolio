"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { toolCard, toolInput, toolLabel } from "./ui/styles";
import { cn } from "@/lib/utils";

function hexToRgb(hex: string): [number, number, number] | null {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
}

function luminance([r, g, b]: [number, number, number]): number {
  const a = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function Badge({ label, pass }: { label: string; pass: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium",
        pass
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-300",
      )}
    >
      {pass ? <Check size={13} /> : <X size={13} />}
      {label}
    </span>
  );
}

export function ContrastChecker() {
  const [fg, setFg] = useState("#0a0a0a");
  const [bg, setBg] = useState("#ffffff");

  const fgRgb = hexToRgb(fg);
  const bgRgb = hexToRgb(bg);
  let ratio = 0;
  if (fgRgb && bgRgb) {
    const l1 = luminance(fgRgb);
    const l2 = luminance(bgRgb);
    ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  }
  const r = Math.round(ratio * 100) / 100;

  function field(label: string, value: string, set: (v: string) => void) {
    return (
      <div>
        <label className={toolLabel}>{label}</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={hexToRgb(value) ? (value.length === 4 ? value : value) : "#000000"}
            onChange={(e) => set(e.target.value)}
            className="h-10 w-12 rounded-lg border border-black/10 bg-white dark:border-white/10 dark:bg-ink-800"
          />
          <input className={cn(toolInput, "font-mono")} value={value} onChange={(e) => set(e.target.value)} />
        </div>
      </div>
    );
  }

  return (
    <div className={toolCard}>
      <div className="grid gap-4 sm:grid-cols-2">
        {field("Text color", fg, setFg)}
        {field("Background", bg, setBg)}
      </div>

      {/* Preview */}
      <div
        className="mt-5 flex flex-col items-center justify-center gap-1 rounded-2xl border border-black/10 px-6 py-10 text-center dark:border-white/10"
        style={{ background: bgRgb ? bg : undefined, color: fgRgb ? fg : undefined }}
      >
        <span className="text-2xl font-semibold">Almost before we knew it,</span>
        <span className="text-sm">we had left the ground. — sample text</span>
      </div>

      {fgRgb && bgRgb ? (
        <>
          <div className="mt-5 flex items-baseline gap-2">
            <span className="font-display text-4xl font-bold tracking-tight">{r}</span>
            <span className="text-sm text-ink-400">: 1 contrast ratio</span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">Normal text</div>
              <div className="flex gap-2">
                <Badge label="AA" pass={ratio >= 4.5} />
                <Badge label="AAA" pass={ratio >= 7} />
              </div>
            </div>
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">Large text</div>
              <div className="flex gap-2">
                <Badge label="AA" pass={ratio >= 3} />
                <Badge label="AAA" pass={ratio >= 4.5} />
              </div>
            </div>
          </div>
        </>
      ) : (
        <p className="mt-4 text-sm text-ink-400">Enter two valid hex colors (e.g. #1a1a1a).</p>
      )}
    </div>
  );
}

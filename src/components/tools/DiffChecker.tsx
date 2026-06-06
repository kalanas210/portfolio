"use client";

import { useState } from "react";
import { diffLines } from "diff";
import { toolCard, toolTextarea, toolLabel } from "./ui/styles";
import { cn } from "@/lib/utils";

export function DiffChecker() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");

  const show = left.length > 0 || right.length > 0;
  const parts = show ? diffLines(left, right) : [];

  const lines: { type: "add" | "del" | "same"; text: string }[] = [];
  for (const p of parts) {
    const type = p.added ? "add" : p.removed ? "del" : "same";
    p.value.replace(/\n$/, "").split("\n").forEach((text) => lines.push({ type, text }));
  }

  return (
    <div className={toolCard}>
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className={toolLabel}>Original</label>
          <textarea
            className={cn(toolTextarea, "h-52")}
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            placeholder="Paste the original text…"
            spellCheck={false}
          />
        </div>
        <div>
          <label className={toolLabel}>Changed</label>
          <textarea
            className={cn(toolTextarea, "h-52")}
            value={right}
            onChange={(e) => setRight(e.target.value)}
            placeholder="Paste the changed text…"
            spellCheck={false}
          />
        </div>
      </div>

      {show && (
        <div className="mt-5">
          <label className={toolLabel}>Diff</label>
          <div className="overflow-auto rounded-xl border border-black/10 bg-white font-mono text-[13px] leading-relaxed dark:border-white/10 dark:bg-ink-800">
            {lines.map((l, i) => (
              <div
                key={i}
                className={cn(
                  "flex gap-2 px-3 py-0.5 whitespace-pre-wrap break-words",
                  l.type === "add" && "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
                  l.type === "del" && "bg-rose-500/10 text-rose-700 dark:text-rose-300",
                )}
              >
                <span className="select-none text-ink-400">
                  {l.type === "add" ? "+" : l.type === "del" ? "−" : " "}
                </span>
                <span>{l.text || " "}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

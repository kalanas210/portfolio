"use client";

import { useState, type ReactNode } from "react";
import { toolCard, toolInput, toolTextarea, toolLabel, toolError } from "./ui/styles";
import { cn } from "@/lib/utils";

export function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("");

  let error: string | null = null;
  let highlighted: ReactNode = text;
  let matchCount = 0;
  let groups: string[] = [];

  if (pattern) {
    try {
      const scanFlags = flags.includes("g") ? flags : flags + "g";
      const re = new RegExp(pattern, scanFlags);
      const parts: ReactNode[] = [];
      let last = 0;
      let guard = 0;
      for (const m of text.matchAll(re)) {
        if (guard++ > 10000) break;
        const start = m.index ?? 0;
        if (start > last) parts.push(text.slice(last, start));
        parts.push(
          <mark key={`${start}-${guard}`} className="rounded bg-accent/30 px-0.5 text-ink-950 dark:text-white">
            {m[0] || "∅"}
          </mark>,
        );
        last = start + m[0].length;
        if (matchCount === 0 && m.length > 1) groups = m.slice(1).map((g) => g ?? "");
        matchCount++;
        if (m[0].length === 0) {
          if (last < text.length) parts.push(text[last]);
          last++;
        }
      }
      if (last < text.length) parts.push(text.slice(last));
      highlighted = parts;
    } catch (e) {
      error = e instanceof Error ? e.message : "Invalid regular expression.";
    }
  }

  return (
    <div className={toolCard}>
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 basis-64">
          <label className={toolLabel}>Pattern</label>
          <input
            className={cn(toolInput, "font-mono")}
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="\\b\\w+@\\w+\\.\\w+\\b"
          />
        </div>
        <div className="w-32">
          <label className={toolLabel}>Flags</label>
          <input className={cn(toolInput, "font-mono")} value={flags} onChange={(e) => setFlags(e.target.value)} placeholder="gim" />
        </div>
      </div>

      {error && <p className={toolError}>{error}</p>}

      <div className="mt-4">
        <label className={toolLabel}>Test string</label>
        <textarea
          className={cn(toolTextarea, "h-40")}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste text to test against the pattern…"
          spellCheck={false}
        />
      </div>

      {pattern && !error && (
        <>
          <p className="mt-4 text-sm text-ink-400">
            <span className="font-semibold text-ink-700 dark:text-ink-200">{matchCount}</span> match
            {matchCount === 1 ? "" : "es"}
            {groups.length > 0 && (
              <span className="ml-2">· first-match groups: {groups.map((g, i) => `$${i + 1}=${JSON.stringify(g)}`).join(", ")}</span>
            )}
          </p>
          <div className="mt-2 max-h-60 overflow-auto whitespace-pre-wrap break-words rounded-xl border border-black/10 bg-white px-4 py-3 font-mono text-[13px] leading-relaxed dark:border-white/10 dark:bg-ink-800">
            {text ? highlighted : <span className="text-ink-400">Matches highlight here…</span>}
          </div>
        </>
      )}
    </div>
  );
}

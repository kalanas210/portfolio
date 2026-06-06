"use client";

import { useState } from "react";
import { CopyButton } from "./ui/CopyButton";
import { Segmented } from "./ui/Segmented";
import { toolCard, toolInput, toolTextarea, toolLabel, toolError } from "./ui/styles";
import { cn } from "@/lib/utils";

type Mode = "escape" | "unescape";
type Target = "json" | "js" | "html" | "sql";

const TARGETS: { value: Target; label: string }[] = [
  { value: "json", label: "JSON" },
  { value: "js", label: "JavaScript" },
  { value: "html", label: "HTML" },
  { value: "sql", label: "SQL" },
];

function escape(target: Target, s: string): string {
  switch (target) {
    case "json":
      return JSON.stringify(s).slice(1, -1);
    case "js":
      return s
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/\t/g, "\\t");
    case "html":
      return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    case "sql":
      return s.replace(/'/g, "''");
  }
}

function unescape(target: Target, s: string): string {
  switch (target) {
    case "json":
      return JSON.parse(`"${s}"`);
    case "js":
      return s
        .replace(/\\n/g, "\n")
        .replace(/\\r/g, "\r")
        .replace(/\\t/g, "\t")
        .replace(/\\(['"\\])/g, "$1");
    case "html":
      return s
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, "&");
    case "sql":
      return s.replace(/''/g, "'");
  }
}

export function StringEscape() {
  const [mode, setMode] = useState<Mode>("escape");
  const [target, setTarget] = useState<Target>("json");
  const [input, setInput] = useState("");

  let output = "";
  let error: string | null = null;
  if (input) {
    try {
      output = mode === "escape" ? escape(target, input) : unescape(target, input);
    } catch {
      error = `Couldn't ${mode} this as ${target.toUpperCase()}.`;
    }
  }

  return (
    <div className={toolCard}>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Segmented
          value={mode}
          onChange={setMode}
          options={[
            { value: "escape", label: "Escape" },
            { value: "unescape", label: "Unescape" },
          ]}
        />
        <select className={cn(toolInput, "w-40")} value={target} onChange={(e) => setTarget(e.target.value as Target)}>
          {TARGETS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className={toolLabel}>Input</label>
          <textarea
            className={cn(toolTextarea, "h-56")}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
          />
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className={toolLabel}>Output</label>
            <CopyButton value={error ? "" : output} />
          </div>
          <textarea className={cn(toolTextarea, "h-56")} value={error ? "" : output} readOnly spellCheck={false} />
        </div>
      </div>

      {error && <p className={toolError}>{error}</p>}
    </div>
  );
}

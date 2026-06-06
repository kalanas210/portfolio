"use client";

import { useState } from "react";
import { CopyButton } from "./ui/CopyButton";
import { toolCard, toolTextarea, toolLabel, toolError } from "./ui/styles";
import { cn } from "@/lib/utils";

function safeKey(k: string): string {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k) ? k : JSON.stringify(k);
}

// Merge an array of objects into one representative object so the inferred
// element type covers keys seen across items.
function mergeSample(arr: unknown[]): unknown {
  if (arr.length && arr.every((x) => x && typeof x === "object" && !Array.isArray(x))) {
    const merged: Record<string, unknown> = {};
    for (const o of arr as Record<string, unknown>[]) {
      for (const [k, v] of Object.entries(o)) {
        if (!(k in merged) || merged[k] == null) merged[k] = v;
      }
    }
    return merged;
  }
  return arr[0];
}

function tsType(v: unknown, indent: number): string {
  if (v === null) return "null";
  if (Array.isArray(v)) {
    if (v.length === 0) return "unknown[]";
    return `${tsType(mergeSample(v), indent)}[]`;
  }
  switch (typeof v) {
    case "string":
      return "string";
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    case "object": {
      const entries = Object.entries(v as Record<string, unknown>);
      if (!entries.length) return "Record<string, unknown>";
      const pad = "  ".repeat(indent + 1);
      const close = "  ".repeat(indent);
      const lines = entries.map(([k, val]) => `${pad}${safeKey(k)}: ${tsType(val, indent + 1)};`);
      return `{\n${lines.join("\n")}\n${close}}`;
    }
    default:
      return "unknown";
  }
}

function toTypescript(json: string): string {
  const parsed = JSON.parse(json);
  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    return `export interface Root ${tsType(parsed, 0)}`;
  }
  return `export type Root = ${tsType(parsed, 0)};`;
}

export function JsonToTypescript() {
  const [input, setInput] = useState("");

  let output = "";
  let error: string | null = null;
  if (input.trim()) {
    try {
      output = toTypescript(input);
    } catch (e) {
      error = e instanceof Error ? e.message : "Invalid JSON.";
    }
  }

  return (
    <div className={toolCard}>
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className={toolLabel}>JSON</label>
            <button
              type="button"
              onClick={() => setInput("")}
              className="text-xs text-ink-400 transition-colors hover:text-ink-950 dark:hover:text-white"
            >
              Clear
            </button>
          </div>
          <textarea
            className={cn(toolTextarea, "h-80")}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{ "id": 1, "name": "Ada", "tags": ["dev"] }'
            spellCheck={false}
          />
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className={toolLabel}>TypeScript</label>
            <CopyButton value={error ? "" : output} />
          </div>
          <textarea className={cn(toolTextarea, "h-80")} value={error ? "" : output} readOnly spellCheck={false} />
        </div>
      </div>

      {error && <p className={toolError}>{error}</p>}
    </div>
  );
}

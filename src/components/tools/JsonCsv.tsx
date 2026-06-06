"use client";

import { useState } from "react";
import { CopyButton } from "./ui/CopyButton";
import { Segmented } from "./ui/Segmented";
import { toolCard, toolTextarea, toolLabel, toolError } from "./ui/styles";
import { cn } from "@/lib/utils";

type Mode = "json2csv" | "csv2json";

function jsonToCsv(json: string): string {
  const data = JSON.parse(json);
  const rows: Record<string, unknown>[] = Array.isArray(data) ? data : [data];
  const keys = Array.from(
    rows.reduce((set, r) => {
      Object.keys(r ?? {}).forEach((k) => set.add(k));
      return set;
    }, new Set<string>()),
  );
  const esc = (v: unknown) => {
    const s = v == null ? "" : typeof v === "object" ? JSON.stringify(v) : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [keys.join(","), ...rows.map((r) => keys.map((k) => esc(r?.[k])).join(","))].join("\n");
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cur += '"';
          i++;
        } else inQuotes = false;
      } else cur += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") {
      row.push(cur);
      cur = "";
    } else if (c === "\n") {
      row.push(cur);
      rows.push(row);
      row = [];
      cur = "";
    } else if (c !== "\r") cur += c;
  }
  if (cur !== "" || row.length) {
    row.push(cur);
    rows.push(row);
  }
  return rows.filter((r) => !(r.length === 1 && r[0] === ""));
}

function csvToJson(csv: string): string {
  const rows = parseCsv(csv);
  if (rows.length < 1) return "[]";
  const [header, ...body] = rows;
  const out = body.map((cols) => Object.fromEntries(header.map((h, i) => [h, cols[i] ?? ""])));
  return JSON.stringify(out, null, 2);
}

export function JsonCsv() {
  const [mode, setMode] = useState<Mode>("json2csv");
  const [input, setInput] = useState("");

  let output = "";
  let error: string | null = null;
  if (input.trim()) {
    try {
      output = mode === "json2csv" ? jsonToCsv(input) : csvToJson(input);
    } catch (e) {
      error = e instanceof Error ? e.message : "Conversion failed.";
    }
  }

  return (
    <div className={toolCard}>
      <div className="mb-4">
        <Segmented
          value={mode}
          onChange={setMode}
          options={[
            { value: "json2csv", label: "JSON → CSV" },
            { value: "csv2json", label: "CSV → JSON" },
          ]}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className={toolLabel}>{mode === "json2csv" ? "JSON (array of objects)" : "CSV"}</label>
            <button
              type="button"
              onClick={() => setInput("")}
              className="text-xs text-ink-400 transition-colors hover:text-ink-950 dark:hover:text-white"
            >
              Clear
            </button>
          </div>
          <textarea
            className={cn(toolTextarea, "h-72")}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "json2csv" ? '[{ "name": "Ada", "age": 36 }]' : "name,age\nAda,36"}
            spellCheck={false}
          />
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className={toolLabel}>{mode === "json2csv" ? "CSV" : "JSON"}</label>
            <CopyButton value={error ? "" : output} />
          </div>
          <textarea className={cn(toolTextarea, "h-72")} value={error ? "" : output} readOnly spellCheck={false} />
        </div>
      </div>

      {error && <p className={toolError}>{error}</p>}
    </div>
  );
}

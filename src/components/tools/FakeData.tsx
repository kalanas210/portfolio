"use client";

import { useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { CopyButton } from "./ui/CopyButton";
import { Segmented } from "./ui/Segmented";
import { toolCard, toolInput, toolTextarea, toolLabel, toolBtnPrimary } from "./ui/styles";
import { cn } from "@/lib/utils";

type Fmt = "json" | "csv";
type Row = Record<string, unknown>;

const FIELDS: { key: string; label: string }[] = [
  { key: "id", label: "ID (uuid)" },
  { key: "name", label: "Full name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "address", label: "Address" },
  { key: "city", label: "City" },
  { key: "company", label: "Company" },
  { key: "jobTitle", label: "Job title" },
  { key: "date", label: "Date" },
  { key: "bool", label: "Boolean" },
];

function rowsToCsv(rows: Row[]): string {
  if (!rows.length) return "";
  const keys = Object.keys(rows[0]);
  const esc = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [keys.join(","), ...rows.map((r) => keys.map((k) => esc(r[k])).join(","))].join("\n");
}

export function FakeData() {
  const [selected, setSelected] = useState<string[]>(["id", "name", "email"]);
  const [count, setCount] = useState(10);
  const [format, setFormat] = useState<Fmt>("json");
  const [rows, setRows] = useState<Row[]>([]);
  const [busy, setBusy] = useState(false);

  function toggle(k: string) {
    setSelected((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));
  }

  async function generate() {
    if (!selected.length) return;
    setBusy(true);
    try {
      const { faker } = await import("@faker-js/faker");
      const n = Math.min(1000, Math.max(1, count || 1));
      const out: Row[] = Array.from({ length: n }, () => {
        const r: Row = {};
        for (const k of selected) {
          switch (k) {
            case "id": r.id = faker.string.uuid(); break;
            case "name": r.name = faker.person.fullName(); break;
            case "email": r.email = faker.internet.email(); break;
            case "phone": r.phone = faker.phone.number(); break;
            case "address": r.address = faker.location.streetAddress(); break;
            case "city": r.city = faker.location.city(); break;
            case "company": r.company = faker.company.name(); break;
            case "jobTitle": r.jobTitle = faker.person.jobTitle(); break;
            case "date": r.date = faker.date.past().toISOString(); break;
            case "bool": r.bool = faker.datatype.boolean(); break;
          }
        }
        return r;
      });
      setRows(out);
    } finally {
      setBusy(false);
    }
  }

  const output = rows.length ? (format === "json" ? JSON.stringify(rows, null, 2) : rowsToCsv(rows)) : "";

  return (
    <div className={toolCard}>
      <label className={toolLabel}>Fields</label>
      <div className="flex flex-wrap gap-2">
        {FIELDS.map((f) => (
          <button
            type="button"
            key={f.key}
            onClick={() => toggle(f.key)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
              selected.includes(f.key)
                ? "border-transparent bg-ink-950 text-white dark:bg-white dark:text-ink-950"
                : "border-black/15 text-ink-500 hover:text-ink-950 dark:border-white/15 dark:hover:text-white",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-end gap-3">
        <div>
          <label className={toolLabel}>Rows</label>
          <input
            type="number"
            min={1}
            max={1000}
            className={cn(toolInput, "w-28")}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          />
        </div>
        <div>
          <label className={toolLabel}>Format</label>
          <Segmented
            value={format}
            onChange={setFormat}
            options={[
              { value: "json", label: "JSON" },
              { value: "csv", label: "CSV" },
            ]}
          />
        </div>
        <button type="button" onClick={generate} disabled={busy || !selected.length} className={toolBtnPrimary}>
          {busy ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
          Generate
        </button>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <label className={toolLabel}>Output</label>
          <CopyButton value={output} />
        </div>
        <textarea className={cn(toolTextarea, "h-72")} value={output} readOnly spellCheck={false} placeholder="Pick fields and click Generate…" />
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { format, type SqlLanguage } from "sql-formatter";
import { Sparkles } from "lucide-react";
import { CopyButton } from "./ui/CopyButton";
import { toolCard, toolInput, toolTextarea, toolLabel, toolError, toolBtnPrimary } from "./ui/styles";
import { cn } from "@/lib/utils";

const DIALECTS: { value: SqlLanguage; label: string }[] = [
  { value: "sql", label: "Standard SQL" },
  { value: "mysql", label: "MySQL" },
  { value: "postgresql", label: "PostgreSQL" },
  { value: "mariadb", label: "MariaDB" },
  { value: "sqlite", label: "SQLite" },
  { value: "bigquery", label: "BigQuery" },
  { value: "transactsql", label: "SQL Server (T-SQL)" },
  { value: "spark", label: "Spark SQL" },
];

export function SqlFormatterTool() {
  const [input, setInput] = useState("");
  const [dialect, setDialect] = useState<SqlLanguage>("sql");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  function run() {
    setError(null);
    if (!input.trim()) {
      setOutput("");
      return;
    }
    try {
      setOutput(format(input, { language: dialect, keywordCase: "upper" }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not format this SQL.");
      setOutput("");
    }
  }

  return (
    <div className={toolCard}>
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div>
          <label className={toolLabel}>Dialect</label>
          <select
            className={cn(toolInput, "w-56")}
            value={dialect}
            onChange={(e) => setDialect(e.target.value as SqlLanguage)}
          >
            {DIALECTS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
        <button type="button" onClick={run} className={toolBtnPrimary}>
          <Sparkles size={16} />
          Format SQL
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className={toolLabel}>Input</label>
          <textarea
            className={cn(toolTextarea, "h-72")}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="select id,name from users where active=1 order by name"
            spellCheck={false}
          />
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className={toolLabel}>Formatted</label>
            <CopyButton value={output} />
          </div>
          <textarea className={cn(toolTextarea, "h-72")} value={output} readOnly spellCheck={false} />
        </div>
      </div>

      {error && <p className={toolError}>{error}</p>}
    </div>
  );
}

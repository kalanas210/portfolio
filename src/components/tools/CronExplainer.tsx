"use client";

import { useState } from "react";
import cronstrue from "cronstrue";
import { CronExpressionParser } from "cron-parser";
import { CalendarClock, AlertCircle } from "lucide-react";
import { toolCard, toolInput, toolLabel, toolError } from "./ui/styles";
import { cn } from "@/lib/utils";

const EXAMPLES = ["*/5 * * * *", "0 9 * * 1-5", "0 0 1 * *", "30 2 * * 0"];

export function CronExplainer() {
  const [expr, setExpr] = useState("");

  let human = "";
  let error: string | null = null;
  let nextRuns: string[] = [];

  if (expr.trim()) {
    try {
      human = cronstrue.toString(expr.trim(), { use24HourTimeFormat: false });
    } catch (e) {
      error = typeof e === "string" ? e : e instanceof Error ? e.message : "Invalid cron expression.";
    }
    if (!error) {
      try {
        const interval = CronExpressionParser.parse(expr.trim());
        nextRuns = Array.from({ length: 5 }, () => interval.next().toDate().toLocaleString());
      } catch {
        // description still shown even if next-run computation isn't possible
      }
    }
  }

  return (
    <div className={toolCard}>
      <label className={toolLabel}>Cron expression</label>
      <input
        className={cn(toolInput, "font-mono")}
        value={expr}
        onChange={(e) => setExpr(e.target.value)}
        placeholder="*/5 * * * *"
      />
      <div className="mt-2 flex flex-wrap gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => setExpr(ex)}
            className="rounded-md border border-black/10 px-2 py-1 font-mono text-[11px] text-ink-500 transition-colors hover:text-ink-950 dark:border-white/10 dark:hover:text-white"
          >
            {ex}
          </button>
        ))}
      </div>

      {error && (
        <p className={cn(toolError, "inline-flex items-start gap-2")}>
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {error}
        </p>
      )}

      {human && !error && (
        <div className="mt-5 rounded-2xl border border-black/10 bg-white px-5 py-4 dark:border-white/10 dark:bg-ink-800">
          <p className="font-display text-lg font-semibold">{human}</p>
        </div>
      )}

      {nextRuns.length > 0 && (
        <div className="mt-4">
          <label className={cn(toolLabel, "flex items-center gap-1.5")}>
            <CalendarClock size={13} /> Next 5 runs (your local time)
          </label>
          <ul className="rounded-xl border border-black/10 px-4 dark:border-white/10">
            {nextRuns.map((r, i) => (
              <li
                key={i}
                className="border-b border-black/5 py-2 font-mono text-sm last:border-0 dark:border-white/5"
              >
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

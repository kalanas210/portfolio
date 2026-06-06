"use client";

import { useState } from "react";
import { Clock } from "lucide-react";
import { CopyButton } from "./ui/CopyButton";
import { toolCard, toolInput, toolLabel } from "./ui/styles";
import { cn } from "@/lib/utils";

function relative(ms: number): string {
  const diff = ms - Date.now();
  const abs = Math.abs(diff);
  const units: [number, string][] = [
    [31536000000, "year"],
    [2592000000, "month"],
    [86400000, "day"],
    [3600000, "hour"],
    [60000, "minute"],
    [1000, "second"],
  ];
  for (const [u, name] of units) {
    if (abs >= u) {
      const n = Math.round(abs / u);
      return diff < 0 ? `${n} ${name}${n > 1 ? "s" : ""} ago` : `in ${n} ${name}${n > 1 ? "s" : ""}`;
    }
  }
  return "just now";
}

const row = "flex items-center justify-between gap-3 border-b border-black/5 py-2.5 text-sm last:border-0 dark:border-white/5";

export function UnixTimestamp() {
  const [ts, setTs] = useState("");
  const [dt, setDt] = useState("");

  // Timestamp → date (auto-detect seconds vs milliseconds)
  let date: Date | null = null;
  if (ts.trim() && /^\d+$/.test(ts.trim())) {
    const n = Number(ts.trim());
    date = new Date(n < 1e12 ? n * 1000 : n);
    if (Number.isNaN(date.getTime())) date = null;
  }

  // Date → timestamp
  let epochS = "";
  let epochMs = "";
  if (dt) {
    const d = new Date(dt);
    if (!Number.isNaN(d.getTime())) {
      epochMs = String(d.getTime());
      epochS = String(Math.floor(d.getTime() / 1000));
    }
  }

  return (
    <div className={toolCard}>
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Timestamp → date */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className={toolLabel}>Unix timestamp</label>
            <button
              type="button"
              onClick={() => setTs(String(Math.floor(Date.now() / 1000)))}
              className="inline-flex items-center gap-1 text-xs text-ink-400 transition-colors hover:text-ink-950 dark:hover:text-white"
            >
              <Clock size={12} /> Now
            </button>
          </div>
          <input
            className={cn(toolInput, "font-mono")}
            value={ts}
            onChange={(e) => setTs(e.target.value)}
            placeholder="1717689600"
            inputMode="numeric"
          />
          {date && (
            <div className="mt-3 rounded-xl border border-black/10 px-4 dark:border-white/10">
              <div className={row}>
                <span className="text-ink-400">ISO 8601</span>
                <span className="flex items-center gap-2 font-mono text-xs">
                  {date.toISOString()}
                  <CopyButton value={date.toISOString()} label="" />
                </span>
              </div>
              <div className={row}>
                <span className="text-ink-400">UTC</span>
                <span className="font-mono text-xs">{date.toUTCString()}</span>
              </div>
              <div className={row}>
                <span className="text-ink-400">Local</span>
                <span className="font-mono text-xs">{date.toString().replace(/ \(.+\)$/, "")}</span>
              </div>
              <div className={row}>
                <span className="text-ink-400">Relative</span>
                <span className="text-xs">{relative(date.getTime())}</span>
              </div>
            </div>
          )}
        </div>

        {/* Date → timestamp */}
        <div>
          <label className={toolLabel}>Date &amp; time</label>
          <input
            type="datetime-local"
            className={toolInput}
            value={dt}
            onChange={(e) => setDt(e.target.value)}
          />
          {epochS && (
            <div className="mt-3 rounded-xl border border-black/10 px-4 dark:border-white/10">
              <div className={row}>
                <span className="text-ink-400">Seconds</span>
                <span className="flex items-center gap-2 font-mono text-xs">
                  {epochS}
                  <CopyButton value={epochS} label="" />
                </span>
              </div>
              <div className={row}>
                <span className="text-ink-400">Milliseconds</span>
                <span className="flex items-center gap-2 font-mono text-xs">
                  {epochMs}
                  <CopyButton value={epochMs} label="" />
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

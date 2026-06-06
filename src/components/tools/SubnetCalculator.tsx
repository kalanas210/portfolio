"use client";

import { useState } from "react";
import { CopyButton } from "./ui/CopyButton";
import { toolCard, toolInput, toolLabel, toolError } from "./ui/styles";
import { cn } from "@/lib/utils";

function ipToInt(ip: string): number | null {
  const parts = ip.split(".");
  if (parts.length !== 4) return null;
  let n = 0;
  for (const p of parts) {
    if (!/^\d+$/.test(p)) return null;
    const o = Number(p);
    if (o < 0 || o > 255) return null;
    n = ((n << 8) | o) >>> 0;
  }
  return n >>> 0;
}

function intToIp(n: number): string {
  return [24, 16, 8, 0].map((s) => (n >>> s) & 255).join(".");
}

export function SubnetCalculator() {
  const [input, setInput] = useState("");

  const trimmed = input.trim();
  const m = trimmed.match(/^(\d{1,3}(?:\.\d{1,3}){3})\/(\d{1,2})$/);
  let error: string | null = null;
  let result: Record<string, string> | null = null;

  if (trimmed) {
    if (!m) {
      error = "Use CIDR notation, e.g. 192.168.1.0/24.";
    } else {
      const ipInt = ipToInt(m[1]);
      const prefix = Number(m[2]);
      if (ipInt == null || prefix > 32) {
        error = "Invalid IP address or prefix length.";
      } else {
        const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
        const network = (ipInt & mask) >>> 0;
        const broadcast = (network | (~mask >>> 0)) >>> 0;
        const total = 2 ** (32 - prefix);
        const usable = prefix === 32 ? 1 : prefix === 31 ? 2 : total - 2;
        const firstHost = prefix >= 31 ? network : (network + 1) >>> 0;
        const lastHost = prefix >= 31 ? broadcast : (broadcast - 1) >>> 0;
        result = {
          "Network address": intToIp(network),
          "Broadcast address": intToIp(broadcast),
          "Subnet mask": intToIp(mask),
          "Wildcard mask": intToIp(~mask >>> 0),
          "Host range": `${intToIp(firstHost)} – ${intToIp(lastHost)}`,
          "Total addresses": total.toLocaleString(),
          "Usable hosts": usable.toLocaleString(),
        };
      }
    }
  }

  return (
    <div className={toolCard}>
      <label className={toolLabel}>IPv4 address / CIDR</label>
      <input
        className={cn(toolInput, "font-mono")}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="192.168.1.0/24"
      />

      {error && <p className={toolError}>{error}</p>}

      {result && (
        <div className="mt-5 rounded-xl border border-black/10 px-4 dark:border-white/10">
          {Object.entries(result).map(([k, v]) => (
            <div
              key={k}
              className="flex items-center justify-between gap-3 border-b border-black/5 py-2.5 text-sm last:border-0 dark:border-white/5"
            >
              <span className="text-ink-400">{k}</span>
              <span className="flex items-center gap-2 font-mono text-xs sm:text-sm">
                {v}
                <CopyButton value={v} label="" />
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

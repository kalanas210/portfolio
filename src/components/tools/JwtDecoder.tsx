"use client";

import { useState } from "react";
import { AlertCircle, Clock } from "lucide-react";
import { CopyButton } from "./ui/CopyButton";
import { cn } from "@/lib/utils";

const ta =
  "w-full rounded-xl border border-black/10 bg-white px-3 py-3 font-mono text-[13px] leading-relaxed focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/40 dark:border-white/10 dark:bg-ink-800";
const card =
  "rounded-3xl border border-black/10 bg-white/60 p-5 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.03] sm:p-7";

function b64urlDecode(s: string): string {
  const pad = s.length % 4 ? "=".repeat(4 - (s.length % 4)) : "";
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const bin = atob(b64);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function JwtDecoder() {
  const [token, setToken] = useState("");

  let header = "";
  let payload = "";
  let error: string | null = null;
  let expiry: string | null = null;

  if (token.trim()) {
    try {
      const parts = token.trim().split(".");
      if (parts.length < 2) throw new Error("A JWT has three dot-separated parts.");
      const h = JSON.parse(b64urlDecode(parts[0]));
      const p = JSON.parse(b64urlDecode(parts[1]));
      header = JSON.stringify(h, null, 2);
      payload = JSON.stringify(p, null, 2);
      if (typeof p.exp === "number") {
        const d = new Date(p.exp * 1000);
        expiry = `Expires ${d.toLocaleString()} — ${d.getTime() < Date.now() ? "expired" : "still valid"}`;
      }
    } catch (e) {
      error = e instanceof Error ? e.message : "Could not decode this token.";
    }
  }

  return (
    <div className={card}>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-xs font-medium uppercase tracking-wide text-ink-400">JWT</label>
        {token && (
          <button
            type="button"
            onClick={() => setToken("")}
            className="text-xs text-ink-400 transition-colors hover:text-ink-950 dark:hover:text-white"
          >
            Clear
          </button>
        )}
      </div>
      <textarea
        className={cn(ta, "h-28 break-all")}
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.…"
        spellCheck={false}
      />

      {error && (
        <p className="mt-4 inline-flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-300">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {error}
        </p>
      )}

      {(header || payload) && (
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-medium uppercase tracking-wide text-ink-400">Header</label>
              <CopyButton value={header} />
            </div>
            <textarea className={cn(ta, "h-56")} value={header} readOnly spellCheck={false} />
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-medium uppercase tracking-wide text-ink-400">Payload</label>
              <CopyButton value={payload} />
            </div>
            <textarea className={cn(ta, "h-56")} value={payload} readOnly spellCheck={false} />
          </div>
        </div>
      )}

      {expiry && (
        <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-ink-400">
          <Clock size={13} />
          {expiry}
        </p>
      )}

      <p className="mt-4 text-xs text-ink-400">
        Decoding only — the signature is not verified. Tokens stay in your browser.
      </p>
    </div>
  );
}

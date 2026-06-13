"use client";

import { useEffect, useState } from "react";
import { CopyButton } from "./ui/CopyButton";
import { toolCard, toolInput, toolTextarea, toolLabel } from "./ui/styles";
import { cn } from "@/lib/utils";

const ALGOS = ["SHA-256", "SHA-384", "SHA-512", "SHA-1"] as const;

async function hmacHex(algo: string, key: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: algo },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function HmacGenerator() {
  const [algo, setAlgo] = useState<string>("SHA-256");
  const [key, setKey] = useState("");
  const [message, setMessage] = useState("");
  const [output, setOutput] = useState("");

  useEffect(() => {
    let active = true;
    if (!key || !message) {
      setOutput("");
      return;
    }
    hmacHex(algo, key, message)
      .then((h) => active && setOutput(h))
      .catch(() => active && setOutput(""));
    return () => {
      active = false;
    };
  }, [algo, key, message]);

  return (
    <div className={toolCard}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={toolLabel}>Secret key</label>
          <input className={toolInput} value={key} onChange={(e) => setKey(e.target.value)} placeholder="your-secret" />
        </div>
        <div>
          <label className={toolLabel}>Algorithm</label>
          <select className={toolInput} value={algo} onChange={(e) => setAlgo(e.target.value)}>
            {ALGOS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className={toolLabel}>Message</label>
        <textarea
          className={cn(toolTextarea, "h-32")}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message to sign…"
          spellCheck={false}
        />
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <label className={toolLabel}>HMAC ({algo}, hex)</label>
          <CopyButton value={output} />
        </div>
        <div className="min-h-[3rem] break-all rounded-xl border border-black/10 bg-white px-3 py-2.5 font-mono text-[12px] text-ink-600 dark:border-white/10 dark:bg-ink-800 dark:text-ink-300">
          {output || <span className="text-ink-400">-</span>}
        </div>
      </div>

      <p className="mt-4 text-xs text-ink-400">Computed locally with the Web Crypto API.</p>
    </div>
  );
}

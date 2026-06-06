"use client";

import { useState } from "react";
import bcrypt from "bcryptjs";
import { Loader2, Check, X } from "lucide-react";
import { CopyButton } from "./ui/CopyButton";
import { Segmented } from "./ui/Segmented";
import { toolCard, toolInput, toolLabel, toolError, toolBtnPrimary } from "./ui/styles";
import { cn } from "@/lib/utils";

type Mode = "hash" | "verify";

export function BcryptTool() {
  const [mode, setMode] = useState<Mode>("hash");
  const [password, setPassword] = useState("");
  const [rounds, setRounds] = useState(10);
  const [hash, setHash] = useState("");
  const [hashInput, setHashInput] = useState("");
  const [match, setMatch] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function doHash() {
    setBusy(true);
    setError(null);
    try {
      setHash(await bcrypt.hash(password, rounds));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hashing failed.");
    } finally {
      setBusy(false);
    }
  }

  async function doVerify() {
    setBusy(true);
    setError(null);
    setMatch(null);
    try {
      setMatch(await bcrypt.compare(password, hashInput));
    } catch {
      setError("That doesn't look like a valid bcrypt hash.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={toolCard}>
      <div className="mb-4">
        <Segmented
          value={mode}
          onChange={(m) => {
            setMode(m);
            setMatch(null);
            setError(null);
          }}
          options={[
            { value: "hash", label: "Hash" },
            { value: "verify", label: "Verify" },
          ]}
        />
      </div>

      <div>
        <label className={toolLabel}>Password</label>
        <input
          className={toolInput}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password to hash or check"
        />
      </div>

      {mode === "hash" ? (
        <>
          <div className="mt-4">
            <label className={toolLabel}>Cost (rounds) — {rounds}</label>
            <input
              type="range"
              min={4}
              max={14}
              value={rounds}
              onChange={(e) => setRounds(Number(e.target.value))}
              className="w-full accent-accent"
            />
          </div>
          <button type="button" onClick={doHash} disabled={busy || !password} className={cn(toolBtnPrimary, "mt-4")}>
            {busy ? <Loader2 size={16} className="animate-spin" /> : null}
            Generate hash
          </button>
          {hash && (
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between">
                <label className={toolLabel}>Hash</label>
                <CopyButton value={hash} />
              </div>
              <div className="break-all rounded-xl border border-black/10 bg-white px-3 py-2.5 font-mono text-[12px] dark:border-white/10 dark:bg-ink-800">
                {hash}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="mt-4">
            <label className={toolLabel}>Bcrypt hash</label>
            <input
              className={cn(toolInput, "font-mono text-[12px]")}
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value)}
              placeholder="$2a$10$…"
            />
          </div>
          <button type="button" onClick={doVerify} disabled={busy || !password || !hashInput} className={cn(toolBtnPrimary, "mt-4")}>
            {busy ? <Loader2 size={16} className="animate-spin" /> : null}
            Verify
          </button>
          {match !== null && (
            <p
              className={cn(
                "mt-4 inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm",
                match
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-300",
              )}
            >
              {match ? <Check size={16} /> : <X size={16} />}
              {match ? "The password matches this hash." : "No match."}
            </p>
          )}
        </>
      )}

      {error && <p className={toolError}>{error}</p>}
    </div>
  );
}

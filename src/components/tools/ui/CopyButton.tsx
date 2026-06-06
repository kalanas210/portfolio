"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

/** Small "copy to clipboard" button with transient confirmation. */
export function CopyButton({
  value,
  label = "Copy",
  className,
  disabled,
}: {
  value: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard blocked — silently ignore; user can still select the text.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      disabled={disabled || !value}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-lg border border-black/10 px-3 text-xs font-medium text-ink-600 transition-colors hover:text-ink-950 disabled:opacity-50 dark:border-white/10 dark:text-ink-300 dark:hover:text-white",
        className,
      )}
    >
      {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
      {copied ? "Copied" : label}
    </button>
  );
}

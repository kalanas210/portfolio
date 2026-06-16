"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { TwitterIcon, LinkedinIcon } from "@/components/icons/BrandIcons";
import { cn } from "@/lib/utils";

const btn =
  "inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-ink-500 transition-colors hover:bg-black/[0.05] hover:text-ink-950 dark:border-white/10 dark:text-ink-300 dark:hover:bg-white/10 dark:hover:text-white";

/** Compact share cluster: copy-link, X, and LinkedIn. URLs are read from
 *  window at click time so it works on any canonical/preview origin. */
export function ShareRow({ title, className }: { title: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const href = () => (typeof window !== "undefined" ? window.location.href : "");

  async function copy() {
    try {
      await navigator.clipboard.writeText(href());
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — no-op */
    }
  }

  function open(url: string) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button type="button" onClick={copy} aria-label={copied ? "Link copied" : "Copy link"} className={btn}>
        {copied ? <Check size={15} /> : <Link2 size={15} />}
      </button>
      <button
        type="button"
        aria-label="Share on X"
        onClick={() =>
          open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(href())}`,
          )
        }
        className={btn}
      >
        <TwitterIcon size={14} />
      </button>
      <button
        type="button"
        aria-label="Share on LinkedIn"
        onClick={() =>
          open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(href())}`)
        }
        className={btn}
      >
        <LinkedinIcon size={14} />
      </button>
    </div>
  );
}

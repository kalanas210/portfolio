"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, ImageUp, Loader2, RotateCcw, Sparkles, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "idle" | "processing" | "done" | "error";

// Transparent-checkerboard backdrop so users can see the cut-out edges clearly.
const checkerboard: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(45deg, rgba(120,120,120,0.18) 25%, transparent 25%), linear-gradient(-45deg, rgba(120,120,120,0.18) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(120,120,120,0.18) 75%), linear-gradient(-45deg, transparent 75%, rgba(120,120,120,0.18) 75%)",
  backgroundSize: "20px 20px",
  backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
};

export function BackgroundRemover() {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("image");
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Revoke object URLs on unmount to avoid leaks.
  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [originalUrl, resultUrl]);

  const reset = useCallback(() => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setOriginalUrl(null);
    setResultUrl(null);
    setStatus("idle");
    setProgress(0);
    setError(null);
  }, [originalUrl, resultUrl]);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (PNG, JPG, WEBP…).");
      return;
    }
    // Clear any previous run.
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);
    setError(null);
    setProgress(0);
    setFileName(file.name.replace(/\.[^.]+$/, "") || "image");

    const srcUrl = URL.createObjectURL(file);
    setOriginalUrl(srcUrl);
    setStatus("processing");

    try {
      // Lazy-loaded so the ~MBs of WASM/model code never hit the initial bundle.
      const { removeBackground } = await import("@imgly/background-removal");
      const blob = await removeBackground(file, {
        output: { format: "image/png" },
        progress: (_key: string, current: number, total: number) => {
          if (total > 0) setProgress(Math.min(100, Math.round((current / total) * 100)));
        },
      });
      const outUrl = URL.createObjectURL(blob);
      setResultUrl(outUrl);
      setStatus("done");
      setProgress(100);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong removing the background. Please try another image.",
      );
      setStatus("error");
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  const busy = status === "processing";

  return (
    <div className="rounded-3xl border border-black/10 bg-white/60 p-5 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.03] sm:p-7">
      {/* Empty state — drop zone */}
      {!originalUrl && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-16 text-center transition-colors",
            dragging
              ? "border-accent/70 bg-accent/5"
              : "border-black/15 hover:border-black/30 dark:border-white/15 dark:hover:border-white/30",
          )}
        >
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-cyan via-brand-violet to-brand-fuchsia text-white">
            <ImageUp size={24} />
          </span>
          <p className="mt-5 font-display text-lg font-semibold">Drop an image here</p>
          <p className="mt-1 text-sm text-ink-400">or click to browse - PNG, JPG, or WEBP</p>
          <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-ink-400">
            <ShieldCheck size={13} />
            Runs entirely in your browser. Your image never leaves your device.
          </p>
        </div>
      )}

      {/* Working / result state — before & after */}
      {originalUrl && (
        <div>
          <div className="grid gap-4 sm:grid-cols-2">
            <figure className="overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
              <div className="flex items-center justify-between px-3 py-2 text-[11px] font-medium uppercase tracking-wide text-ink-400">
                Original
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={originalUrl} alt="Original" className="aspect-square w-full object-contain bg-ink-50 dark:bg-ink-900" />
            </figure>

            <figure className="overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
              <div className="flex items-center justify-between px-3 py-2 text-[11px] font-medium uppercase tracking-wide text-ink-400">
                Background removed
              </div>
              <div className="relative aspect-square w-full" style={checkerboard}>
                {resultUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={resultUrl} alt="Background removed" className="absolute inset-0 h-full w-full object-contain" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-ink-400">
                    {busy ? (
                      <>
                        <Loader2 className="animate-spin" />
                        <span className="text-xs">
                          {progress > 0 ? `Processing… ${progress}%` : "Loading AI model…"}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs">Waiting…</span>
                    )}
                  </div>
                )}
              </div>
            </figure>
          </div>

          {/* Progress bar */}
          {busy && (
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-cyan via-brand-violet to-brand-fuchsia transition-[width] duration-300"
                style={{ width: `${Math.max(8, progress)}%` }}
              />
            </div>
          )}

          {error && (
            <p className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-300">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {resultUrl && (
              <a
                href={resultUrl}
                download={`${fileName}-no-bg.png`}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-ink-950 px-5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-ink-950"
              >
                <Download size={16} />
                Download PNG
              </a>
            )}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-black/10 px-5 text-sm font-medium text-ink-700 transition-colors hover:text-ink-950 disabled:opacity-50 dark:border-white/10 dark:text-ink-200 dark:hover:text-white"
            >
              <ImageUp size={16} />
              New image
            </button>
            {(status === "done" || status === "error") && (
              <button
                type="button"
                onClick={reset}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-black/10 px-5 text-sm font-medium text-ink-500 transition-colors hover:text-ink-950 dark:border-white/10 dark:hover:text-white"
              >
                <RotateCcw size={16} />
                Clear
              </button>
            )}
          </div>

          {status === "done" && (
            <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
              <Sparkles size={13} />
              Done - your transparent PNG is ready to download.
            </p>
          )}
        </div>
      )}

      <input ref={inputRef} type="file" accept="image/*" hidden onChange={onInputChange} />
    </div>
  );
}

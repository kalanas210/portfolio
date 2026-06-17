"use client";

import { useEffect, useState } from "react";
import { Loader2, ImageUp, Download, ShieldCheck } from "lucide-react";
import { ImageDropzone } from "./ui/ImageDropzone";
import { downloadBlob } from "./ui/image";
import { CopyButton } from "./ui/CopyButton";

const card =
  "rounded-3xl border border-black/10 bg-white/60 p-5 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.03] sm:p-7";

type Status = "idle" | "working" | "done" | "error";

export function OcrTool() {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (imgUrl) URL.revokeObjectURL(imgUrl);
    };
  }, [imgUrl]);

  async function run(file: File) {
    setImgUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setText("");
    setStatus("working");
    setProgress(0);
    setStage("Loading model…");
    setError(null);
    try {
      const Tesseract = (await import("tesseract.js")).default;
      const { data } = await Tesseract.recognize(file, "eng", {
        logger: (m: { status: string; progress: number }) => {
          setStage(m.status);
          if (typeof m.progress === "number") setProgress(Math.round(m.progress * 100));
        },
      });
      setText((data.text || "").trim());
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read text from that image.");
      setStatus("error");
    }
  }

  const busy = status === "working";

  if (!imgUrl) {
    return (
      <div className={card}>
        <ImageDropzone onFile={run} hint="A clear photo or screenshot of text works best." />
        <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-ink-400">
          <ShieldCheck size={13} />
          Runs in your browser - the image is never uploaded. First run downloads a model once.
        </p>
      </div>
    );
  }

  return (
    <div className={card}>
      <div className="grid gap-5 lg:grid-cols-2">
        <figure className="overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imgUrl} alt="Source" className="aspect-square w-full bg-ink-50 object-contain dark:bg-ink-900" />
        </figure>

        <div className="flex flex-col">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs font-medium uppercase tracking-wide text-ink-400">Extracted text</label>
            <CopyButton value={text} />
          </div>
          <textarea
            className="h-64 w-full rounded-xl border border-black/10 bg-white px-3 py-3 font-mono text-[13px] leading-relaxed focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/40 dark:border-white/10 dark:bg-ink-800"
            value={busy ? "" : text}
            onChange={(e) => setText(e.target.value)}
            placeholder={busy ? "" : "Recognized text will appear here…"}
            spellCheck={false}
          />

          {busy && (
            <div className="mt-4">
              <div className="mb-1.5 flex items-center gap-2 text-xs text-ink-400">
                <Loader2 size={13} className="animate-spin" />
                <span className="capitalize">{stage}</span>
                <span className="ml-auto tabular-nums">{progress}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-cyan via-brand-violet to-brand-fuchsia transition-[width] duration-300"
                  style={{ width: `${Math.max(6, progress)}%` }}
                />
              </div>
            </div>
          )}

          <div className="mt-auto flex flex-wrap gap-3 pt-6">
            {status === "done" && text && (
              <button
                type="button"
                onClick={() => downloadBlob(new Blob([text], { type: "text/plain" }), "extracted-text.txt")}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-ink-950 px-5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-ink-950"
              >
                <Download size={16} />
                Download .txt
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setImgUrl(null);
                setText("");
                setStatus("idle");
              }}
              disabled={busy}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-black/10 px-5 text-sm font-medium text-ink-700 transition-colors hover:text-ink-950 disabled:opacity-50 dark:border-white/10 dark:text-ink-200 dark:hover:text-white"
            >
              <ImageUp size={16} />
              New image
            </button>
          </div>
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-300">
          {error}
        </p>
      )}
    </div>
  );
}

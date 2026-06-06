"use client";

import { useEffect, useRef, useState } from "react";
import { Download, ImageUp, Loader2 } from "lucide-react";
import { ImageDropzone } from "./ui/ImageDropzone";
import { formatBytes, loadImage } from "./ui/image";
import { cn } from "@/lib/utils";

const card =
  "rounded-3xl border border-black/10 bg-white/60 p-5 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.03] sm:p-7";

const FORMATS = [
  { ext: "png", mime: "image/png", label: "PNG", lossy: false },
  { ext: "jpeg", mime: "image/jpeg", label: "JPG", lossy: true },
  { ext: "webp", mime: "image/webp", label: "WebP", lossy: true },
] as const;

type Format = (typeof FORMATS)[number];

export function ImageConverter() {
  const [srcUrl, setSrcUrl] = useState<string | null>(null);
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [outSize, setOutSize] = useState(0);
  const [name, setName] = useState("image");
  const [format, setFormat] = useState<Format>(FORMATS[0]);
  const [quality, setQuality] = useState(0.92);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!ready || !img) return;
    let active = true;
    setBusy(true);
    setError(null);
    (async () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas isn't supported here.");
        if (format.mime === "image/jpeg") {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);
        const blob: Blob = await new Promise((res, rej) =>
          canvas.toBlob(
            (b) => (b ? res(b) : rej(new Error(`This browser can't export ${format.label}.`))),
            format.mime,
            format.lossy ? quality : undefined,
          ),
        );
        if (!active) return;
        setOutUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return URL.createObjectURL(blob);
        });
        setOutSize(blob.size);
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : "Conversion failed.");
      } finally {
        if (active) setBusy(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [ready, format, quality]);

  async function onFile(file: File) {
    setError(null);
    setReady(false);
    setName(file.name.replace(/\.[^.]+$/, "") || "image");
    const url = URL.createObjectURL(file);
    setSrcUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
    try {
      imgRef.current = await loadImage(url);
      setReady(true);
    } catch {
      setError("Could not load that image.");
    }
  }

  if (!srcUrl) {
    return (
      <div className={card}>
        <ImageDropzone onFile={onFile} hint="PNG, JPG, or WebP — converts locally in your browser." />
      </div>
    );
  }

  return (
    <div className={card}>
      <div className="grid gap-5 lg:grid-cols-2">
        <figure className="overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={outUrl ?? srcUrl} alt="Preview" className="aspect-square w-full bg-ink-50 object-contain dark:bg-ink-900" />
        </figure>

        <div className="flex flex-col">
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-ink-400">Convert to</label>
          <div className="flex flex-wrap gap-2">
            {FORMATS.map((f) => (
              <button
                type="button"
                key={f.ext}
                onClick={() => setFormat(f)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm transition-colors",
                  format.ext === f.ext
                    ? "border-transparent bg-ink-950 text-white dark:bg-white dark:text-ink-950"
                    : "border-black/15 text-ink-500 hover:text-ink-950 dark:border-white/15 dark:hover:text-white",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {format.lossy && (
            <div className="mt-5">
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-ink-400">
                Quality — {Math.round(quality * 100)}%
              </label>
              <input
                type="range"
                min={0.1}
                max={1}
                step={0.01}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-accent"
              />
            </div>
          )}

          <div className="mt-5 text-sm text-ink-400">
            {busy ? (
              <span className="inline-flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Converting…</span>
            ) : outUrl ? (
              <span>Output: <span className="font-medium text-ink-700 dark:text-ink-200">{formatBytes(outSize)}</span> · {format.label}</span>
            ) : null}
          </div>

          <div className="mt-auto flex flex-wrap gap-3 pt-6">
            {outUrl && (
              <a
                href={outUrl}
                download={`${name}.${format.ext}`}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-ink-950 px-5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-ink-950"
              >
                <Download size={16} />
                Download {format.label}
              </a>
            )}
            <button
              type="button"
              onClick={() => {
                setSrcUrl(null);
                setOutUrl(null);
                setReady(false);
                imgRef.current = null;
              }}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-black/10 px-5 text-sm font-medium text-ink-700 transition-colors hover:text-ink-950 dark:border-white/10 dark:text-ink-200 dark:hover:text-white"
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

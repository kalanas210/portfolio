"use client";

import { useEffect, useRef, useState } from "react";
import { Download, ImageUp, Loader2, ShieldCheck } from "lucide-react";
import { ImageDropzone } from "./ui/ImageDropzone";
import { formatBytes } from "./ui/image";

const card =
  "rounded-3xl border border-black/10 bg-white/60 p-5 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.03] sm:p-7";

export function ImageCompressor() {
  const [srcUrl, setSrcUrl] = useState<string | null>(null);
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [origSize, setOrigSize] = useState(0);
  const [outSize, setOutSize] = useState(0);
  const [ext, setExt] = useState("png");
  const [name, setName] = useState("image");
  const [quality, setQuality] = useState(0.6);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<File | null>(null);

  useEffect(() => {
    return () => {
      if (srcUrl) URL.revokeObjectURL(srcUrl);
      if (outUrl) URL.revokeObjectURL(outUrl);
    };
  }, [srcUrl, outUrl]);

  async function compress(file: File, q: number) {
    setBusy(true);
    setError(null);
    try {
      const imageCompression = (await import("browser-image-compression")).default;
      const out = await imageCompression(file, {
        maxSizeMB: 1024, // effectively unbounded — let quality drive the result
        useWebWorker: true,
        initialQuality: q,
      });
      setOutSize(out.size);
      setOutUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(out);
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Compression failed.");
    } finally {
      setBusy(false);
    }
  }

  async function onFile(file: File) {
    fileRef.current = file;
    setName(file.name.replace(/\.[^.]+$/, "") || "image");
    setExt(file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg");
    setOrigSize(file.size);
    setSrcUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    await compress(file, quality);
  }

  const saved = origSize > 0 && outSize > 0 ? Math.max(0, Math.round((1 - outSize / origSize) * 100)) : 0;

  if (!srcUrl) {
    return (
      <div className={card}>
        <ImageDropzone onFile={onFile} hint="JPG, PNG, or WebP - compressed locally in your browser." />
        <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-ink-400">
          <ShieldCheck size={13} />
          Your image never leaves your device.
        </p>
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
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-ink-400">
            Quality - {Math.round(quality * 100)}%
          </label>
          <input
            type="range"
            min={0.1}
            max={1}
            step={0.05}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full accent-accent"
          />
          <button
            type="button"
            onClick={() => fileRef.current && compress(fileRef.current, quality)}
            disabled={busy}
            className="mt-4 inline-flex h-10 w-fit items-center gap-2 rounded-xl border border-black/10 px-4 text-sm font-medium text-ink-700 transition-colors hover:text-ink-950 disabled:opacity-50 dark:border-white/10 dark:text-ink-200 dark:hover:text-white"
          >
            {busy ? <Loader2 size={15} className="animate-spin" /> : null}
            Re-compress at this quality
          </button>

          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl border border-black/10 p-3 dark:border-white/10">
              <div className="text-[10px] uppercase tracking-wide text-ink-400">Original</div>
              <div className="mt-1 text-sm font-semibold">{formatBytes(origSize)}</div>
            </div>
            <div className="rounded-xl border border-black/10 p-3 dark:border-white/10">
              <div className="text-[10px] uppercase tracking-wide text-ink-400">Compressed</div>
              <div className="mt-1 text-sm font-semibold">{busy ? "…" : formatBytes(outSize)}</div>
            </div>
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3">
              <div className="text-[10px] uppercase tracking-wide text-ink-400">Saved</div>
              <div className="mt-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">{busy ? "…" : `${saved}%`}</div>
            </div>
          </div>

          <div className="mt-auto flex flex-wrap gap-3 pt-6">
            {outUrl && !busy && (
              <a
                href={outUrl}
                download={`${name}-compressed.${ext}`}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-ink-950 px-5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-ink-950"
              >
                <Download size={16} />
                Download
              </a>
            )}
            <button
              type="button"
              onClick={() => {
                setSrcUrl(null);
                setOutUrl(null);
                fileRef.current = null;
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

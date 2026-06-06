"use client";

import { useEffect, useRef, useState } from "react";
import { Download, ImageUp, Link2, Loader2 } from "lucide-react";
import { ImageDropzone } from "./ui/ImageDropzone";
import { formatBytes, loadImage } from "./ui/image";
import { cn } from "@/lib/utils";

const card =
  "rounded-3xl border border-black/10 bg-white/60 p-5 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.03] sm:p-7";
const input =
  "h-10 w-full rounded-xl border border-black/10 bg-white px-3 text-sm focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/40 dark:border-white/10 dark:bg-ink-800";
const labelCls = "mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-ink-400";

function extFor(mime: string): string {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/webp") return "webp";
  return "png";
}

export function ImageResizer() {
  const [srcUrl, setSrcUrl] = useState<string | null>(null);
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [outSize, setOutSize] = useState(0);
  const [name, setName] = useState("image");
  const [mime, setMime] = useState("image/png");
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [keepAspect, setKeepAspect] = useState(true);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const ratioRef = useRef(1);

  useEffect(() => {
    const img = imgRef.current;
    if (!ready || !img || width < 1 || height < 1) return;
    let active = true;
    setBusy(true);
    setError(null);
    (async () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas isn't supported here.");
        ctx.imageSmoothingQuality = "high";
        if (mime === "image/jpeg") {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, width, height);
        }
        ctx.drawImage(img, 0, 0, width, height);
        const outMime = mime === "image/jpeg" || mime === "image/webp" ? mime : "image/png";
        const blob: Blob = await new Promise((res, rej) =>
          canvas.toBlob((b) => (b ? res(b) : rej(new Error("Resize failed."))), outMime, 0.92),
        );
        if (!active) return;
        setOutUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return URL.createObjectURL(blob);
        });
        setOutSize(blob.size);
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : "Resize failed.");
      } finally {
        if (active) setBusy(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [ready, width, height, mime]);

  async function onFile(file: File) {
    setError(null);
    setReady(false);
    setName(file.name.replace(/\.[^.]+$/, "") || "image");
    setMime(file.type || "image/png");
    const url = URL.createObjectURL(file);
    setSrcUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
    try {
      const img = await loadImage(url);
      imgRef.current = img;
      ratioRef.current = img.naturalWidth / img.naturalHeight;
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
      setReady(true);
    } catch {
      setError("Could not load that image.");
    }
  }

  function onWidth(v: number) {
    setWidth(v);
    if (keepAspect && v > 0) setHeight(Math.round(v / ratioRef.current));
  }
  function onHeight(v: number) {
    setHeight(v);
    if (keepAspect && v > 0) setWidth(Math.round(v * ratioRef.current));
  }

  if (!srcUrl) {
    return (
      <div className={card}>
        <ImageDropzone onFile={onFile} hint="Set new dimensions — resized locally in your browser." />
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Width (px)</label>
              <input type="number" min={1} className={input} value={width} onChange={(e) => onWidth(Number(e.target.value))} />
            </div>
            <div>
              <label className={labelCls}>Height (px)</label>
              <input type="number" min={1} className={input} value={height} onChange={(e) => onHeight(Number(e.target.value))} />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setKeepAspect((v) => !v)}
            className={cn(
              "mt-3 inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              keepAspect
                ? "border-transparent bg-ink-950 text-white dark:bg-white dark:text-ink-950"
                : "border-black/15 text-ink-500 hover:text-ink-950 dark:border-white/15 dark:hover:text-white",
            )}
          >
            <Link2 size={13} />
            {keepAspect ? "Aspect ratio locked" : "Aspect ratio unlocked"}
          </button>

          <div className="mt-5 text-sm text-ink-400">
            {busy ? (
              <span className="inline-flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Resizing…</span>
            ) : outUrl ? (
              <span>Output: <span className="font-medium text-ink-700 dark:text-ink-200">{width}×{height}</span> · {formatBytes(outSize)}</span>
            ) : null}
          </div>

          <div className="mt-auto flex flex-wrap gap-3 pt-6">
            {outUrl && (
              <a
                href={outUrl}
                download={`${name}-${width}x${height}.${extFor(mime)}`}
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

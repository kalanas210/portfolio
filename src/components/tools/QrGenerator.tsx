"use client";

import { useEffect, useState } from "react";
import { Download, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const card =
  "rounded-3xl border border-black/10 bg-white/60 p-5 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.03] sm:p-7";
const input =
  "h-10 w-full rounded-xl border border-black/10 bg-white px-3 text-sm focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/40 dark:border-white/10 dark:bg-ink-800";
const labelCls = "mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-ink-400";

type ECL = "L" | "M" | "Q" | "H";

export function QrGenerator() {
  const [text, setText] = useState("https://kalanalk.com");
  const [size, setSize] = useState(320);
  const [margin, setMargin] = useState(2);
  const [dark, setDark] = useState("#0a0a0a");
  const [light, setLight] = useState("#ffffff");
  const [ecl, setEcl] = useState<ECL>("M");
  const [pngUrl, setPngUrl] = useState("");
  const [svg, setSvg] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (!text.trim()) {
      setPngUrl("");
      setSvg("");
      setError(null);
      return;
    }
    (async () => {
      try {
        const QRCode = (await import("qrcode")).default;
        const opts = {
          margin,
          width: size,
          color: { dark, light },
          errorCorrectionLevel: ecl,
        };
        const [url, svgStr] = await Promise.all([
          QRCode.toDataURL(text, opts),
          QRCode.toString(text, { ...opts, type: "svg" }),
        ]);
        if (active) {
          setPngUrl(url);
          setSvg(svgStr);
          setError(null);
        }
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : "Could not generate QR code.");
      }
    })();
    return () => {
      active = false;
    };
  }, [text, size, margin, dark, light, ecl]);

  function downloadSvg() {
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qr-code.svg";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className={card}>
      <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
        {/* Controls */}
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Text or URL</label>
            <textarea
              className={cn(input, "h-auto py-2.5")}
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="https://… or any text"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Size — {size}px</label>
              <input
                type="range"
                min={128}
                max={1024}
                step={16}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full accent-accent"
              />
            </div>
            <div>
              <label className={labelCls}>Margin — {margin}</label>
              <input
                type="range"
                min={0}
                max={8}
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
                className="w-full accent-accent"
              />
            </div>
            <div>
              <label className={labelCls}>Foreground</label>
              <div className="flex items-center gap-2">
                <input type="color" value={dark} onChange={(e) => setDark(e.target.value)} className="h-10 w-12 rounded-lg border border-black/10 bg-white dark:border-white/10 dark:bg-ink-800" />
                <input className={input} value={dark} onChange={(e) => setDark(e.target.value)} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Background</label>
              <div className="flex items-center gap-2">
                <input type="color" value={light} onChange={(e) => setLight(e.target.value)} className="h-10 w-12 rounded-lg border border-black/10 bg-white dark:border-white/10 dark:bg-ink-800" />
                <input className={input} value={light} onChange={(e) => setLight(e.target.value)} />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Error correction</label>
              <select className={input} value={ecl} onChange={(e) => setEcl(e.target.value as ECL)}>
                <option value="L">Low (L) — smallest</option>
                <option value="M">Medium (M)</option>
                <option value="Q">Quartile (Q)</option>
                <option value="H">High (H) — most robust</option>
              </select>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex aspect-square w-full max-w-[260px] items-center justify-center overflow-hidden rounded-2xl border border-black/10 bg-white p-3 dark:border-white/10">
            {pngUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={pngUrl} alt="QR code preview" className="h-full w-full object-contain" />
            ) : (
              <span className="text-xs text-ink-400">Enter text to generate</span>
            )}
          </div>
          {pngUrl && (
            <div className="flex w-full max-w-[260px] flex-col gap-2">
              <a
                href={pngUrl}
                download="qr-code.png"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-ink-950 px-4 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-ink-950"
              >
                <Download size={15} />
                PNG
              </a>
              <button
                type="button"
                onClick={downloadSvg}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-black/10 px-4 text-sm font-medium text-ink-700 transition-colors hover:text-ink-950 dark:border-white/10 dark:text-ink-200 dark:hover:text-white"
              >
                <Download size={15} />
                SVG
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-4 inline-flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-300">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import { ImageUp } from "lucide-react";
import { cn } from "@/lib/utils";

/** Reusable drag-and-drop / click image picker used by the image tools. */
export function ImageDropzone({
  onFile,
  hint,
}: {
  onFile: (file: File) => void;
  hint?: string;
}) {
  const [dragging, setDragging] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  function pick(file?: File | null) {
    if (file && file.type.startsWith("image/")) onFile(file);
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => ref.current?.click()}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && ref.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        pick(e.dataTransfer.files?.[0]);
      }}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-colors",
        dragging
          ? "border-accent/70 bg-accent/5"
          : "border-black/15 hover:border-black/30 dark:border-white/15 dark:hover:border-white/30",
      )}
    >
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-cyan via-brand-violet to-brand-fuchsia text-white">
        <ImageUp size={22} />
      </span>
      <p className="mt-4 font-display font-semibold">Drop an image or click to browse</p>
      {hint && <p className="mt-1 text-sm text-ink-400">{hint}</p>}
      <input
        ref={ref}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          pick(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}

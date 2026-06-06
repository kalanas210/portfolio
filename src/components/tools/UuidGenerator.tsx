"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { CopyButton } from "./ui/CopyButton";
import { Segmented } from "./ui/Segmented";
import { toolCard, toolInput, toolLabel, toolTextarea, toolBtnPrimary } from "./ui/styles";
import { cn } from "@/lib/utils";

type Version = "v4" | "v7";

function uuidv7(): string {
  const ts = BigInt(Date.now());
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < 6; i++) bytes[i] = Number((ts >> BigInt(40 - i * 8)) & 0xffn);
  bytes[6] = (bytes[6] & 0x0f) | 0x70; // version 7
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant
  const h = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

export function UuidGenerator() {
  const [version, setVersion] = useState<Version>("v4");
  const [count, setCount] = useState(5);
  const [ids, setIds] = useState<string[]>([]);

  function generate() {
    const n = Math.min(500, Math.max(1, count || 1));
    setIds(Array.from({ length: n }, () => (version === "v4" ? crypto.randomUUID() : uuidv7())));
  }

  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version]);

  return (
    <div className={toolCard}>
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className={toolLabel}>Version</label>
          <Segmented
            value={version}
            onChange={setVersion}
            options={[
              { value: "v4", label: "v4 (random)" },
              { value: "v7", label: "v7 (time-ordered)" },
            ]}
          />
        </div>
        <div>
          <label className={toolLabel}>How many</label>
          <input
            type="number"
            min={1}
            max={500}
            className={cn(toolInput, "w-28")}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          />
        </div>
        <button type="button" onClick={generate} className={toolBtnPrimary}>
          <RefreshCw size={16} />
          Generate
        </button>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <label className={toolLabel}>{ids.length} UUID{ids.length === 1 ? "" : "s"}</label>
          <CopyButton value={ids.join("\n")} label="Copy all" />
        </div>
        <textarea className={cn(toolTextarea, "h-64")} value={ids.join("\n")} readOnly spellCheck={false} />
      </div>
    </div>
  );
}

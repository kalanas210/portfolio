"use client";

import { useState } from "react";
import { CopyButton } from "./ui/CopyButton";
import { Segmented } from "./ui/Segmented";
import { toolCard, toolTextarea, toolLabel, toolError } from "./ui/styles";
import { cn } from "@/lib/utils";

type Mode = "format" | "minify";

function minify(xml: string): string {
  return xml.replace(/>\s+</g, "><").trim();
}

function prettify(xml: string): string {
  const compact = minify(xml).replace(/(>)(<)(\/*)/g, "$1\n$2$3");
  let pad = 0;
  return compact
    .split("\n")
    .map((node) => {
      let indent = 0;
      if (/^<\/\w/.test(node)) {
        pad = Math.max(0, pad - 1);
      } else if (/^<\w[^>]*[^/]>.*$/.test(node) && !/<\/\w/.test(node) && !/\/>$/.test(node)) {
        indent = 1;
      }
      const line = "  ".repeat(pad) + node;
      pad += indent;
      return line;
    })
    .join("\n");
}

export function XmlFormatter() {
  const [mode, setMode] = useState<Mode>("format");
  const [input, setInput] = useState("");

  let output = "";
  let error: string | null = null;
  if (input.trim()) {
    try {
      output = mode === "format" ? prettify(input) : minify(input);
    } catch (e) {
      error = e instanceof Error ? e.message : "Could not process this markup.";
    }
  }

  return (
    <div className={toolCard}>
      <div className="mb-4">
        <Segmented
          value={mode}
          onChange={setMode}
          options={[
            { value: "format", label: "Beautify" },
            { value: "minify", label: "Minify" },
          ]}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className={toolLabel}>XML / HTML</label>
            <button
              type="button"
              onClick={() => setInput("")}
              className="text-xs text-ink-400 transition-colors hover:text-ink-950 dark:hover:text-white"
            >
              Clear
            </button>
          </div>
          <textarea
            className={cn(toolTextarea, "h-72")}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="<root><item id='1'>Hello</item></root>"
            spellCheck={false}
          />
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className={toolLabel}>Result</label>
            <CopyButton value={error ? "" : output} />
          </div>
          <textarea className={cn(toolTextarea, "h-72")} value={error ? "" : output} readOnly spellCheck={false} />
        </div>
      </div>

      {error && <p className={toolError}>{error}</p>}
    </div>
  );
}

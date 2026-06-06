"use client";

import { useState } from "react";
import yaml from "js-yaml";
import { CopyButton } from "./ui/CopyButton";
import { Segmented } from "./ui/Segmented";
import { toolCard, toolTextarea, toolLabel, toolError } from "./ui/styles";
import { cn } from "@/lib/utils";

type Mode = "json2yaml" | "yaml2json";

export function JsonYaml() {
  const [mode, setMode] = useState<Mode>("json2yaml");
  const [input, setInput] = useState("");

  let output = "";
  let error: string | null = null;
  if (input.trim()) {
    try {
      output =
        mode === "json2yaml"
          ? yaml.dump(JSON.parse(input))
          : JSON.stringify(yaml.load(input), null, 2);
    } catch (e) {
      error = e instanceof Error ? e.message : "Conversion failed.";
    }
  }

  return (
    <div className={toolCard}>
      <div className="mb-4">
        <Segmented
          value={mode}
          onChange={setMode}
          options={[
            { value: "json2yaml", label: "JSON → YAML" },
            { value: "yaml2json", label: "YAML → JSON" },
          ]}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className={toolLabel}>{mode === "json2yaml" ? "JSON" : "YAML"}</label>
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
            placeholder={mode === "json2yaml" ? '{ "key": "value" }' : "key: value"}
            spellCheck={false}
          />
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className={toolLabel}>{mode === "json2yaml" ? "YAML" : "JSON"}</label>
            <CopyButton value={error ? "" : output} />
          </div>
          <textarea className={cn(toolTextarea, "h-72")} value={error ? "" : output} readOnly spellCheck={false} />
        </div>
      </div>

      {error && <p className={toolError}>{error}</p>}
    </div>
  );
}

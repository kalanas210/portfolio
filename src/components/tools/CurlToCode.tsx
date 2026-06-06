"use client";

import { useState } from "react";
import { CopyButton } from "./ui/CopyButton";
import { Segmented } from "./ui/Segmented";
import { toolCard, toolTextarea, toolLabel } from "./ui/styles";
import { cn } from "@/lib/utils";

type Target = "fetch" | "axios";

interface ParsedCurl {
  url: string;
  method: string;
  headers: Record<string, string>;
  data: string | null;
}

function stripQuotes(s: string): string {
  if ((s.startsWith("'") && s.endsWith("'")) || (s.startsWith('"') && s.endsWith('"'))) {
    return s.slice(1, -1);
  }
  return s;
}

function parseCurl(input: string): ParsedCurl {
  const cleaned = input.replace(/\\\r?\n/g, " ").trim();
  const tokens = cleaned.match(/'[^']*'|"[^"]*"|\S+/g) ?? [];
  let url = "";
  let method = "";
  const headers: Record<string, string> = {};
  let data: string | null = null;

  for (let i = 0; i < tokens.length; i++) {
    const t = stripQuotes(tokens[i]);
    if (t === "curl") continue;
    if (t === "-X" || t === "--request") method = stripQuotes(tokens[++i] ?? "");
    else if (t === "-H" || t === "--header") {
      const h = stripQuotes(tokens[++i] ?? "");
      const idx = h.indexOf(":");
      if (idx > 0) headers[h.slice(0, idx).trim()] = h.slice(idx + 1).trim();
    } else if (["-d", "--data", "--data-raw", "--data-binary", "--data-urlencode"].includes(t)) {
      data = stripQuotes(tokens[++i] ?? "");
    } else if (t === "-u" || t === "--user") {
      const cred = stripQuotes(tokens[++i] ?? "");
      headers["Authorization"] = "Basic " + (typeof btoa !== "undefined" ? btoa(cred) : cred);
    } else if (/^https?:\/\//.test(t)) url = t;
    else if (!t.startsWith("-") && !url) url = t;
  }

  if (!method) method = data != null ? "POST" : "GET";
  return { url, method: method.toUpperCase(), headers, data };
}

function indentObject(obj: Record<string, string>): string {
  return JSON.stringify(obj, null, 2).replace(/\n/g, "\n  ");
}

function toFetch(p: ParsedCurl): string {
  const opts = [`  method: ${JSON.stringify(p.method)}`];
  if (Object.keys(p.headers).length) opts.push(`  headers: ${indentObject(p.headers)}`);
  if (p.data != null) opts.push(`  body: ${JSON.stringify(p.data)}`);
  return `const res = await fetch(${JSON.stringify(p.url)}, {\n${opts.join(
    ",\n",
  )}\n});\nconst data = await res.json();`;
}

function toAxios(p: ParsedCurl): string {
  const cfg = [
    `  method: ${JSON.stringify(p.method.toLowerCase())}`,
    `  url: ${JSON.stringify(p.url)}`,
  ];
  if (Object.keys(p.headers).length) cfg.push(`  headers: ${indentObject(p.headers)}`);
  if (p.data != null) cfg.push(`  data: ${JSON.stringify(p.data)}`);
  return `import axios from "axios";\n\nconst { data } = await axios({\n${cfg.join(",\n")}\n});`;
}

export function CurlToCode() {
  const [target, setTarget] = useState<Target>("fetch");
  const [input, setInput] = useState("");

  const trimmed = input.trim();
  let output = "";
  if (trimmed) {
    const parsed = parseCurl(trimmed);
    output = parsed.url
      ? target === "fetch"
        ? toFetch(parsed)
        : toAxios(parsed)
      : "// Couldn't find a URL — paste a full curl command.";
  }

  return (
    <div className={toolCard}>
      <div className="mb-2 flex items-center justify-between">
        <label className={toolLabel}>curl command</label>
        <button
          type="button"
          onClick={() => setInput("")}
          className="text-xs text-ink-400 transition-colors hover:text-ink-950 dark:hover:text-white"
        >
          Clear
        </button>
      </div>
      <textarea
        className={cn(toolTextarea, "h-32")}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={`curl -X POST https://api.example.com/users \\\n  -H 'Content-Type: application/json' \\\n  -d '{"name":"Ada"}'`}
        spellCheck={false}
      />

      <div className="mt-5 flex items-center justify-between">
        <Segmented
          value={target}
          onChange={setTarget}
          options={[
            { value: "fetch", label: "fetch" },
            { value: "axios", label: "axios" },
          ]}
        />
        <CopyButton value={output} />
      </div>
      <textarea className={cn(toolTextarea, "mt-3 h-56")} value={output} readOnly spellCheck={false} />
    </div>
  );
}

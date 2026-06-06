"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { CopyButton } from "./ui/CopyButton";
import { downloadBlob } from "./ui/image";
import { toolCard, toolTextarea, toolLabel } from "./ui/styles";
import { cn } from "@/lib/utils";

const TEMPLATES: Record<string, string> = {
  Node: "node_modules/\nnpm-debug.log*\nyarn-error.log\n.pnpm-debug.log\n.env\n.env.local\ndist/\ncoverage/",
  "Next.js": ".next/\nout/\nbuild/\n.vercel\n*.tsbuildinfo\nnext-env.d.ts",
  Python: "__pycache__/\n*.py[cod]\n.venv/\nvenv/\n.env\n*.egg-info/\n.pytest_cache/\n.mypy_cache/",
  Java: "target/\n*.class\n*.jar\n*.war\n.gradle/\nbuild/\nhs_err_pid*",
  Go: "/bin/\n*.exe\n*.test\n*.out\nvendor/",
  Rust: "/target/\n**/*.rs.bk\nCargo.lock",
  macOS: ".DS_Store\n.AppleDouble\n.LSOverride\nIcon\n._*",
  Windows: "Thumbs.db\nehthumbs.db\nDesktop.ini\n$RECYCLE.BIN/\n*.lnk",
  VSCode: ".vscode/*\n!.vscode/settings.json\n!.vscode/extensions.json\n*.code-workspace",
  JetBrains: ".idea/\n*.iml\n*.ipr\n*.iws\nout/",
};

const ORDER = Object.keys(TEMPLATES);

export function GitignoreGenerator() {
  const [selected, setSelected] = useState<string[]>(["Node", "macOS"]);

  function toggle(name: string) {
    setSelected((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));
  }

  const output = ORDER.filter((n) => selected.includes(n))
    .map((n) => `# ===== ${n} =====\n${TEMPLATES[n]}`)
    .join("\n\n");

  return (
    <div className={toolCard}>
      <label className={toolLabel}>Pick your stack</label>
      <div className="flex flex-wrap gap-2">
        {ORDER.map((name) => (
          <button
            type="button"
            key={name}
            onClick={() => toggle(name)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
              selected.includes(name)
                ? "border-transparent bg-ink-950 text-white dark:bg-white dark:text-ink-950"
                : "border-black/15 text-ink-500 hover:text-ink-950 dark:border-white/15 dark:hover:text-white",
            )}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <label className={toolLabel}>.gitignore</label>
          <div className="flex items-center gap-2">
            <CopyButton value={output} />
            <button
              type="button"
              onClick={() => downloadBlob(new Blob([output], { type: "text/plain" }), ".gitignore")}
              disabled={!output}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-black/10 px-3 text-xs font-medium text-ink-600 transition-colors hover:text-ink-950 disabled:opacity-50 dark:border-white/10 dark:text-ink-300 dark:hover:text-white"
            >
              <Download size={14} />
              Download
            </button>
          </div>
        </div>
        <textarea className={cn(toolTextarea, "h-72")} value={output} readOnly spellCheck={false} />
      </div>
    </div>
  );
}

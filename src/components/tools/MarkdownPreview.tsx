"use client";

import { useState } from "react";
import { Markdown } from "@/components/ui/Markdown";
import { toolCard, toolTextarea, toolLabel } from "./ui/styles";
import { cn } from "@/lib/utils";

const SAMPLE = `# Hello, Markdown

Type on the left, see it rendered on the right.

- **Bold** and _italic_
- [Links](https://kalanalk.com)
- \`inline code\`

\`\`\`ts
const x: number = 42;
\`\`\`

> Blockquotes work too.
`;

export function MarkdownPreview() {
  const [text, setText] = useState(SAMPLE);

  return (
    <div className={toolCard}>
      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <label className={toolLabel}>Markdown</label>
          <textarea
            className={cn(toolTextarea, "h-[28rem]")}
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
          />
        </div>
        <div>
          <label className={toolLabel}>Preview</label>
          <div className="h-[28rem] overflow-auto rounded-xl border border-black/10 bg-white px-5 py-4 dark:border-white/10 dark:bg-ink-800">
            {text.trim() ? (
              <Markdown content={text} />
            ) : (
              <span className="text-sm text-ink-400">Preview appears here…</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

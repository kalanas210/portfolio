import { cn } from "@/lib/utils";

/**
 * Renders plain-text bodies (one paragraph per blank-line-separated block) as
 * editorial prose: a larger opening "lead" paragraph with a drop cap, followed
 * by comfortably-spaced body paragraphs. Typography lives in globals.css under
 * `.article-prose`. Used for project case-study long descriptions, which are
 * authored as plain text rather than Markdown.
 */
export function ArticleBody({ text, className }: { text: string; className?: string }) {
  const paras = text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paras.length === 0) return null;

  return (
    <div className={cn("article-prose", className)}>
      {paras.map((p, i) => (
        <p key={i} className={i === 0 ? "lead" : undefined}>
          {p}
        </p>
      ))}
    </div>
  );
}

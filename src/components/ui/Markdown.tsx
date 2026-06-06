import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { cn } from "@/lib/utils";

/**
 * Renders trusted (admin-authored) Markdown as styled prose. A Server
 * Component, so post/tool bodies are in the server-rendered HTML — good for SEO.
 * GitHub-flavoured Markdown + syntax-highlighted code blocks (themed in
 * globals.css). External links open in a new tab; no raw-HTML passthrough.
 */
export function Markdown({ content, className }: { content: string; className?: string }) {
  return (
    <div
      className={cn(
        "prose prose-neutral max-w-none dark:prose-invert",
        "prose-headings:font-display prose-headings:font-semibold prose-headings:tracking-tight",
        "prose-a:text-accent-600 prose-a:no-underline hover:prose-a:underline dark:prose-a:text-accent-300",
        "prose-img:rounded-2xl prose-img:border prose-img:border-black/10 dark:prose-img:border-white/10",
        "prose-pre:shadow-sm",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          a({ href, children }) {
            const external = !!href && /^https?:\/\//.test(href);
            return (
              <a href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

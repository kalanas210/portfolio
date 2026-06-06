import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Tool } from "@/lib/types";
import { ToolIcon } from "./ToolIcon";

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-black/10 bg-white transition-colors hover:border-black/20 dark:border-white/10 dark:bg-ink-900 dark:hover:border-white/20"
    >
      {/* Banner — gradient with the tool icon; cover image overlays if present */}
      <div className={`relative aspect-[16/9] overflow-hidden bg-gradient-to-br ${tool.gradient}`}>
        {tool.coverUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={tool.coverUrl}
            alt={tool.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        )}
        {!tool.coverUrl && (
          <div className="absolute inset-0 flex items-center justify-center text-white/90">
            <ToolIcon name={tool.icon} size={40} strokeWidth={1.5} />
          </div>
        )}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/35 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-white backdrop-blur-sm">
          <ToolIcon name={tool.icon} size={11} />
          {tool.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold leading-snug tracking-tight">
          {tool.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-ink-500 dark:text-ink-300">{tool.tagline}</p>
        <div className="mt-4 inline-flex items-center gap-1.5 pt-1 text-sm font-medium text-ink-700 dark:text-ink-200">
          {tool.kind === "external" ? "Visit tool" : "Open tool"}
          <ArrowUpRight
            size={15}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>
      </div>
    </Link>
  );
}

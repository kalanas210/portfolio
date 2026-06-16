import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Compact, link-only project card for "More work" rails on detail pages.
 *  (The filterable grid on /projects lives in ProjectsGrid.) */
export function ProjectMiniCard({ project: p }: { project: Project }) {
  return (
    <Link
      href={`/projects/${p.slug}`}
      data-cursor="view"
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-black/10 bg-white transition-colors hover:border-black/20 dark:border-white/10 dark:bg-ink-900 dark:hover:border-white/20"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <div className={cn("absolute inset-0 bg-gradient-to-br", p.gradient)} />
        {p.thumbnailUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.thumbnailUrl}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/40 via-transparent to-transparent" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="text-[11px] uppercase tracking-[0.16em] text-ink-400">
          {p.categories.join(" · ")}
        </div>
        <h3 className="mt-1.5 font-display text-lg font-semibold tracking-tight">{p.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-ink-500 dark:text-ink-300">{p.description}</p>
        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-xs font-medium text-ink-400">
          View project
          <ArrowUpRight
            size={13}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </div>
    </Link>
  );
}

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Post } from "@/lib/types";
import { formatDate, readingMinutes } from "@/lib/utils";

/** Large horizontal "lead story" card for the top of the blog index. */
export function FeaturedPostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group grid overflow-hidden rounded-3xl border border-black/10 bg-white transition-colors hover:border-black/20 dark:border-white/10 dark:bg-ink-900 dark:hover:border-white/20 md:grid-cols-2"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-ink-100 to-ink-200 dark:from-ink-800 dark:to-ink-900 md:aspect-auto md:min-h-[20rem]">
        {post.coverUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverUrl}
            alt={post.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}
      </div>
      <div className="flex flex-col justify-center p-7 sm:p-9">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-accent-700 dark:text-accent-300">
            Featured
          </span>
          {post.tags.slice(0, 2).map((t) => (
            <span key={t} className="text-[11px] uppercase tracking-wide text-ink-400">
              {t}
            </span>
          ))}
        </div>
        <h2 className="mt-3 font-display text-2xl font-semibold leading-snug tracking-tight sm:text-3xl">
          {post.title}
        </h2>
        <p className="mt-3 line-clamp-3 text-ink-500 dark:text-ink-300">{post.excerpt}</p>
        <div className="mt-5 flex items-center gap-2 text-xs text-ink-400">
          {post.publishedAt && (
            <>
              <span>{formatDate(post.publishedAt)}</span>
              <span aria-hidden>·</span>
            </>
          )}
          <span>{readingMinutes(post.content)} min read</span>
          <ArrowUpRight
            size={15}
            className="ml-auto transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>
      </div>
    </Link>
  );
}

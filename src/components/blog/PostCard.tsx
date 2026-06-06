import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Post } from "@/lib/types";
import { formatDate, readingMinutes } from "@/lib/utils";

export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-black/10 bg-white transition-colors hover:border-black/20 dark:border-white/10 dark:bg-ink-900 dark:hover:border-white/20"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-ink-100 to-ink-200 dark:from-ink-800 dark:to-ink-900">
        {post.coverUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverUrl}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {post.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-full border border-black/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-ink-500 dark:border-white/10 dark:text-ink-300"
              >
                {t}
              </span>
            ))}
          </div>
        )}
        <h3 className="font-display text-lg font-semibold leading-snug tracking-tight">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-ink-500 dark:text-ink-300">{post.excerpt}</p>
        <div className="mt-4 flex items-center gap-2 pt-1 text-xs text-ink-400">
          {post.publishedAt && (
            <>
              <span>{formatDate(post.publishedAt)}</span>
              <span aria-hidden>·</span>
            </>
          )}
          <span>{readingMinutes(post.content)} min read</span>
          <ArrowUpRight
            size={14}
            className="ml-auto transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>
      </div>
    </Link>
  );
}

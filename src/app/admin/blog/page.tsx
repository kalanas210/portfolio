import Link from "next/link";
import { Plus, Pencil, Star } from "lucide-react";
import { getAllPosts } from "@/lib/admin/queries";
import { PostRowActions } from "@/components/admin/PostRowActions";

export const dynamic = "force-dynamic";

export default async function AdminBlog() {
  const posts = await getAllPosts();

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Blog</h1>
          <p className="mt-1 text-sm text-ink-400">{posts.length} total</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-4 py-2 text-sm font-medium text-white transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-ink-950"
        >
          <Plus size={16} />
          New post
        </Link>
      </header>

      {posts.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-black/15 p-12 text-center text-sm text-ink-400 dark:border-white/15">
          No posts yet. Write your first one.
        </div>
      ) : (
        <ul className="mt-6 space-y-2">
          {posts.map((p) => (
            <li
              key={p.id}
              className="flex items-center gap-4 rounded-2xl border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-ink-900"
            >
              <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-ink-200 to-ink-100 dark:from-ink-700 dark:to-ink-800">
                {p.coverUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.coverUrl} alt="" className="h-full w-full object-cover" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-medium">{p.title}</span>
                  {p.featured && <Star size={13} className="shrink-0 text-amber-500" fill="currentColor" />}
                  <span
                    className={
                      p.published
                        ? "shrink-0 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400"
                        : "shrink-0 rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-400 dark:bg-white/10"
                    }
                  >
                    {p.published ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="mt-0.5 truncate text-xs text-ink-400">
                  /{p.slug}
                  {p.publishedAt ? ` · ${new Date(p.publishedAt).toLocaleDateString()}` : ""}
                  {p.tags.length ? ` · ${p.tags.join(", ")}` : ""}
                </div>
              </div>

              <Link
                href={`/admin/blog/${p.id}`}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-black/10 px-3 text-xs font-medium text-ink-600 transition-colors hover:text-ink-950 dark:border-white/10 dark:text-ink-300 dark:hover:text-white"
              >
                <Pencil size={13} />
                Edit
              </Link>
              <PostRowActions id={p.id} published={p.published} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

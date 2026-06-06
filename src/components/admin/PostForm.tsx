"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { Post } from "@/lib/types";
import type { PostInput } from "@/lib/admin/types";
import { createPost, updatePost } from "@/app/admin/actions";
import { MediaUpload } from "./MediaUpload";
import { cn } from "@/lib/utils";

const input =
  "h-10 w-full rounded-xl border border-black/10 bg-white px-3 text-sm focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/40 dark:border-white/10 dark:bg-ink-800";
const labelCls = "mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-ink-400";
const card =
  "rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-ink-900";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** ISO timestamp → "YYYY-MM-DD" for a <input type=date>; "" when null. */
function toDateInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

export function PostForm({ initial }: { initial?: Post }) {
  const router = useRouter();
  const editing = Boolean(initial);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(editing);
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [coverUrl, setCoverUrl] = useState<string | null>(initial?.coverUrl ?? null);
  const [tagsText, setTagsText] = useState((initial?.tags ?? []).join(", "));
  const [publishedDate, setPublishedDate] = useState(
    toDateInput(initial?.publishedAt ?? null) || toDateInput(new Date().toISOString()),
  );
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [published, setPublished] = useState(initial?.published ?? false);
  const [sortOrder, setSortOrder] = useState(String(initial?.sortOrder ?? 0));

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onTitleChange(v: string) {
    setTitle(v);
    if (!slugTouched) setSlug(slugify(v));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) return setError("Title is required.");
    const finalSlug = (slug || slugify(title)).trim();
    if (!finalSlug) return setError("Slug is required.");

    setSaving(true);
    const payload: PostInput = {
      slug: finalSlug,
      title: title.trim(),
      excerpt: excerpt.trim(),
      content,
      coverUrl,
      tags: tagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      featured,
      published,
      publishedAt: publishedDate ? new Date(publishedDate).toISOString() : null,
      sortOrder: Number(sortOrder) || 0,
    };

    const res = editing ? await updatePost(initial!.id, payload) : await createPost(payload);
    if (!res.ok) {
      setError(res.error ?? "Something went wrong.");
      setSaving(false);
      return;
    }
    router.push("/admin/blog");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Basics */}
      <div className={card}>
        <h2 className="font-display text-lg font-semibold">Details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelCls} htmlFor="title">Title</label>
            <input id="title" className={input} value={title} onChange={(e) => onTitleChange(e.target.value)} />
          </div>
          <div>
            <label className={labelCls} htmlFor="slug">Slug</label>
            <input
              id="slug"
              className={input}
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugTouched(true);
              }}
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="date">Publish date</label>
            <input id="date" type="date" className={input} value={publishedDate} onChange={(e) => setPublishedDate(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls} htmlFor="excerpt">Excerpt (used on cards &amp; as the meta description)</label>
            <textarea
              id="excerpt"
              rows={2}
              className={cn(input, "h-auto py-2")}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls} htmlFor="tags">Tags (comma separated)</label>
            <input id="tags" className={input} value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="Next.js, Design, Tutorial" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={card}>
        <h2 className="font-display text-lg font-semibold">Content</h2>
        <p className="mt-1 text-xs text-ink-400">
          Markdown — headings (#), **bold**, lists, [links](url), and ```code``` blocks.
        </p>
        <textarea
          className={cn(input, "mt-4 h-auto py-3 font-mono text-[13px] leading-relaxed")}
          rows={20}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={"## Section heading\n\nWrite your post in Markdown…"}
        />
      </div>

      {/* Media */}
      <div className={card}>
        <h2 className="font-display text-lg font-semibold">Cover image</h2>
        <div className="mt-4">
          <MediaUpload
            label="Cover"
            value={coverUrl}
            onChange={setCoverUrl}
            folder="posts/covers"
            accept="image/*"
            hint="Shown on the blog card, the post hero, and social previews. 1200×630 works well."
          />
        </div>
      </div>

      {/* Visibility */}
      <div className={card}>
        <h2 className="font-display text-lg font-semibold">Visibility</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelCls} htmlFor="sort">Sort order</label>
            <input id="sort" type="number" className={input} value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} />
          </div>
          <label className="flex items-center gap-3 self-end pb-2">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="h-4 w-4 rounded" />
            <span className="text-sm">Featured</span>
          </label>
          <label className="flex items-center gap-3 self-end pb-2">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="h-4 w-4 rounded" />
            <span className="text-sm">Published (visible on site)</span>
          </label>
        </div>
      </div>

      {error && (
        <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-300">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-ink-950 px-5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 disabled:opacity-60 dark:bg-white dark:text-ink-950"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          {editing ? "Save changes" : "Create post"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/blog")}
          className="inline-flex h-11 items-center rounded-xl border border-black/10 px-5 text-sm font-medium text-ink-600 hover:text-ink-950 dark:border-white/10 dark:text-ink-300 dark:hover:text-white"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

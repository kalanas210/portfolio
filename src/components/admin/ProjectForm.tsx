"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Trash2,
  ArrowUp,
  ArrowDown,
  ImagePlus,
  Video,
  Plus,
} from "lucide-react";
import { PROJECT_CATEGORIES } from "@/lib/types";
import type { Project, GalleryItem, ProjectCategory } from "@/lib/types";
import type { ProjectInput } from "@/lib/admin/types";
import { createProject, updateProject } from "@/app/admin/actions";
import { uploadFile } from "@/lib/admin/upload";
import { MediaUpload } from "./MediaUpload";
import { cn } from "@/lib/utils";

const GRADIENTS = [
  "from-brand-violet via-brand-fuchsia to-brand-rose",
  "from-brand-cyan via-brand-violet to-brand-fuchsia",
  "from-brand-emerald via-brand-cyan to-brand-violet",
  "from-brand-amber via-brand-rose to-brand-fuchsia",
  "from-brand-fuchsia via-brand-violet to-brand-cyan",
  "from-brand-rose via-brand-amber to-brand-emerald",
];

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

export function ProjectForm({ initial }: { initial?: Project }) {
  const router = useRouter();
  const editing = Boolean(initial);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(editing);
  const [description, setDescription] = useState(initial?.description ?? "");
  const [longDescription, setLongDescription] = useState(initial?.longDescription ?? "");
  const [categories, setCategories] = useState<ProjectCategory[]>(initial?.categories ?? []);
  const [techText, setTechText] = useState((initial?.tech ?? []).join(", "));
  const [year, setYear] = useState(String(initial?.year ?? new Date().getFullYear()));
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [published, setPublished] = useState(initial?.published ?? false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(initial?.thumbnailUrl ?? null);
  const [gallery, setGallery] = useState<GalleryItem[]>(initial?.gallery ?? []);
  const [liveUrl, setLiveUrl] = useState(initial?.liveUrl ?? "");
  const [githubUrl, setGithubUrl] = useState(initial?.githubUrl ?? "");
  const [linkedinUrl, setLinkedinUrl] = useState(initial?.linkedinUrl ?? "");
  const [gradient, setGradient] = useState(initial?.gradient ?? GRADIENTS[0]);
  const [sortOrder, setSortOrder] = useState(String(initial?.sortOrder ?? 0));

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [galleryBusy, setGalleryBusy] = useState(false);

  function onTitleChange(v: string) {
    setTitle(v);
    if (!slugTouched) setSlug(slugify(v));
  }

  function toggleCategory(c: ProjectCategory) {
    setCategories((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  }

  // ── Gallery helpers ──
  async function onGalleryFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setGalleryBusy(true);
    setError(null);
    try {
      const url = await uploadFile(file, "projects/gallery");
      const type: GalleryItem["type"] = file.type.startsWith("video") ? "video" : "image";
      setGallery((g) => [...g, { type, url, caption: "" }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setGalleryBusy(false);
      e.target.value = "";
    }
  }

  function addGalleryUrl(type: GalleryItem["type"]) {
    setGallery((g) => [...g, { type, url: "", caption: "" }]);
  }

  function updateGalleryItem(i: number, patch: Partial<GalleryItem>) {
    setGallery((g) => g.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));
  }

  function moveGalleryItem(i: number, dir: -1 | 1) {
    setGallery((g) => {
      const next = [...g];
      const j = i + dir;
      if (j < 0 || j >= next.length) return g;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  function removeGalleryItem(i: number) {
    setGallery((g) => g.filter((_, idx) => idx !== i));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) return setError("Title is required.");
    const finalSlug = (slug || slugify(title)).trim();
    if (!finalSlug) return setError("Slug is required.");

    setSaving(true);
    const payload: ProjectInput = {
      slug: finalSlug,
      title: title.trim(),
      description,
      longDescription,
      categories,
      tech: techText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      year: Number(year) || new Date().getFullYear(),
      featured,
      published,
      thumbnailUrl,
      gallery: gallery.filter((g) => g.url.trim()),
      liveUrl: liveUrl.trim() || null,
      githubUrl: githubUrl.trim() || null,
      linkedinUrl: linkedinUrl.trim() || null,
      gradient,
      sortOrder: Number(sortOrder) || 0,
    };

    const res = editing
      ? await updateProject(initial!.id, payload)
      : await createProject(payload);

    if (!res.ok) {
      setError(res.error ?? "Something went wrong.");
      setSaving(false);
      return;
    }
    router.push("/admin/projects");
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
            <label className={labelCls} htmlFor="year">Year</label>
            <input id="year" type="number" className={input} value={year} onChange={(e) => setYear(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls} htmlFor="description">Short description</label>
            <textarea
              id="description"
              rows={2}
              className={cn(input, "h-auto py-2")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls} htmlFor="long">Full description (one paragraph per line)</label>
            <textarea
              id="long"
              rows={5}
              className={cn(input, "h-auto py-2")}
              value={longDescription}
              onChange={(e) => setLongDescription(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Categories</label>
            <div className="flex flex-wrap gap-2">
              {PROJECT_CATEGORIES.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => toggleCategory(c)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-sm transition-colors",
                    categories.includes(c)
                      ? "border-transparent bg-ink-950 text-white dark:bg-white dark:text-ink-950"
                      : "border-black/15 text-ink-500 hover:text-ink-950 dark:border-white/15 dark:hover:text-white",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls} htmlFor="tech">Tech (comma separated)</label>
            <input id="tech" className={input} value={techText} onChange={(e) => setTechText(e.target.value)} placeholder="Next.js, TypeScript, Tailwind" />
          </div>
        </div>
      </div>

      {/* Media */}
      <div className={card}>
        <h2 className="font-display text-lg font-semibold">Media</h2>
        <div className="mt-4 space-y-5">
          <MediaUpload
            label="Thumbnail"
            value={thumbnailUrl}
            onChange={setThumbnailUrl}
            folder="projects/thumbnails"
            accept="image/*"
            hint="Shown on cards and as the post hero. Landscape works best."
          />

          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className={labelCls}>Gallery - photos &amp; videos</span>
              <div className="flex items-center gap-2">
                <label className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-black/10 px-3 text-xs font-medium hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5">
                  <input type="file" accept="image/*,video/*" hidden onChange={onGalleryFile} disabled={galleryBusy} />
                  {galleryBusy ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
                  Upload
                </label>
                <button type="button" onClick={() => addGalleryUrl("image")} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-black/10 px-3 text-xs font-medium hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5">
                  <Plus size={14} /> Image URL
                </button>
                <button type="button" onClick={() => addGalleryUrl("video")} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-black/10 px-3 text-xs font-medium hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5">
                  <Video size={14} /> Video URL
                </button>
              </div>
            </div>

            {gallery.length === 0 ? (
              <p className="mt-3 rounded-xl border border-dashed border-black/15 px-4 py-6 text-center text-xs text-ink-400 dark:border-white/15">
                No media yet. Upload a file or add a URL.
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {gallery.map((item, i) => (
                  <li
                    key={i}
                    className="flex flex-wrap items-center gap-2 rounded-xl border border-black/10 p-2 dark:border-white/10"
                  >
                    <span className="inline-flex h-6 items-center rounded-md bg-black/5 px-2 text-[10px] font-semibold uppercase tracking-wide text-ink-500 dark:bg-white/10">
                      {item.type}
                    </span>
                    <input
                      className={cn(input, "h-9 min-w-[12rem] flex-1")}
                      value={item.url}
                      onChange={(e) => updateGalleryItem(i, { url: e.target.value })}
                      placeholder="https://…"
                    />
                    <input
                      className={cn(input, "h-9 w-40")}
                      value={item.caption ?? ""}
                      onChange={(e) => updateGalleryItem(i, { caption: e.target.value })}
                      placeholder="Caption"
                    />
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => moveGalleryItem(i, -1)} className="rounded-md p-1.5 text-ink-400 hover:text-ink-950 dark:hover:text-white" aria-label="Move up">
                        <ArrowUp size={14} />
                      </button>
                      <button type="button" onClick={() => moveGalleryItem(i, 1)} className="rounded-md p-1.5 text-ink-400 hover:text-ink-950 dark:hover:text-white" aria-label="Move down">
                        <ArrowDown size={14} />
                      </button>
                      <button type="button" onClick={() => removeGalleryItem(i)} className="rounded-md p-1.5 text-ink-400 hover:text-rose-500" aria-label="Remove">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Links */}
      <div className={card}>
        <h2 className="font-display text-lg font-semibold">Links</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelCls} htmlFor="live">Live URL</label>
            <input id="live" className={input} value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} placeholder="https://…" />
          </div>
          <div>
            <label className={labelCls} htmlFor="github">GitHub URL</label>
            <input id="github" className={input} value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/…" />
          </div>
          <div>
            <label className={labelCls} htmlFor="linkedin">LinkedIn URL</label>
            <input id="linkedin" className={input} value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/…" />
          </div>
        </div>
      </div>

      {/* Appearance + visibility */}
      <div className={card}>
        <h2 className="font-display text-lg font-semibold">Appearance &amp; visibility</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className={labelCls}>Card gradient (fallback behind thumbnail)</label>
            <div className="flex flex-wrap gap-2">
              {GRADIENTS.map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => setGradient(g)}
                  aria-label={g}
                  className={cn(
                    "h-9 w-14 rounded-lg bg-gradient-to-br ring-2 ring-offset-2 ring-offset-white transition dark:ring-offset-ink-900",
                    g,
                    gradient === g ? "ring-ink-950 dark:ring-white" : "ring-transparent",
                  )}
                />
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className={labelCls} htmlFor="sort">Sort order</label>
              <input id="sort" type="number" className={input} value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} />
            </div>
            <label className="flex items-center gap-3 self-end pb-2">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="h-4 w-4 rounded" />
              <span className="text-sm">Featured (homepage)</span>
            </label>
            <label className="flex items-center gap-3 self-end pb-2">
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="h-4 w-4 rounded" />
              <span className="text-sm">Published (visible on site)</span>
            </label>
          </div>
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
          {editing ? "Save changes" : "Create project"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/projects")}
          className="inline-flex h-11 items-center rounded-xl border border-black/10 px-5 text-sm font-medium text-ink-600 hover:text-ink-950 dark:border-white/10 dark:text-ink-300 dark:hover:text-white"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

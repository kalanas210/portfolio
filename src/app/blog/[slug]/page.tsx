import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Calendar, Clock } from "lucide-react";
import { GradientMesh } from "@/components/ui/GradientMesh";
import { Markdown } from "@/components/ui/Markdown";
import { ShareRow } from "@/components/article/ShareRow";
import { PostCard } from "@/components/blog/PostCard";
import { getPostBySlug, getPosts } from "@/lib/queries";
import { breadcrumbLd } from "@/lib/seo/breadcrumbs";
import { SITE, formatDate, readingMinutes, ogImageUrl, jsonLdHtml } from "@/lib/utils";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found" };
  const og = ogImageUrl(post.coverUrl);
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `${SITE.url}/blog/${post.slug}`,
      images: og ? [{ url: og, width: 1280, height: 720 }] : undefined,
      publishedTime: post.publishedAt ?? undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: og ? [og] : undefined,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const minutes = readingMinutes(post.content);
  const more = (await getPosts()).filter((p) => p.slug !== post.slug).slice(0, 3);
  const initials = SITE.name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("");

  const blogLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: ogImageUrl(post.coverUrl) ? [ogImageUrl(post.coverUrl)] : undefined,
    datePublished: post.publishedAt ?? undefined,
    dateModified: post.updatedAt ?? post.publishedAt ?? undefined,
    author: { "@type": "Person", name: SITE.name, url: SITE.url },
    publisher: { "@type": "Person", name: SITE.name, url: SITE.url },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE.url}/blog/${post.slug}` },
    keywords: post.tags.join(", ") || undefined,
  };

  const crumbLd = breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ]);

  return (
    <article className="relative isolate overflow-hidden pb-20 pt-28 sm:pt-32">
      <GradientMesh className="opacity-60" />
      {[blogLd, crumbLd].map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdHtml(ld) }}
        />
      ))}

      <div className="container relative">
        {/* Top bar */}
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition-colors hover:text-ink-950 dark:hover:text-white"
          >
            <ArrowLeft size={15} />
            All posts
          </Link>
          <ShareRow title={post.title} />
        </div>

        {/* Header */}
        <header className="mx-auto mt-8 max-w-3xl">
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center rounded-full border border-black/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-ink-500 dark:border-white/15 dark:text-ink-200"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
          <h1 className="mt-4 font-display text-fluid-h1 font-semibold leading-[1.05] tracking-tight text-balance">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-5 text-lg leading-relaxed text-ink-500 dark:text-ink-300 sm:text-xl">
              {post.excerpt}
            </p>
          )}

          {/* Byline */}
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-violet to-brand-fuchsia text-sm font-semibold text-white"
              >
                {initials}
              </span>
              <div className="leading-tight">
                <div className="text-sm font-medium">{SITE.name}</div>
                <div className="text-xs text-ink-400">{SITE.role}</div>
              </div>
            </div>
            <span aria-hidden className="hidden h-8 w-px bg-black/10 dark:bg-white/10 sm:block" />
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-400">
              {post.publishedAt && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={13} />
                  {formatDate(post.publishedAt)}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Clock size={13} />
                {minutes} min read
              </span>
            </div>
          </div>
        </header>

        {/* Cover — constrained & refined */}
        {post.coverUrl && (
          <figure className="mx-auto mt-12 max-w-4xl">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-black/10 shadow-[0_30px_80px_-45px_rgba(0,0,0,0.55)] ring-1 ring-black/5 dark:border-white/10 dark:ring-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.coverUrl} alt={post.title} className="h-full w-full object-cover" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
            </div>
          </figure>
        )}

        {/* Body */}
        <div className="mx-auto mt-12 max-w-3xl">
          <Markdown content={post.content} className="prose-article" />
        </div>

        {/* Tags + share footer */}
        <div className="mx-auto mt-12 flex max-w-3xl flex-wrap items-center justify-between gap-4 border-t border-black/10 pt-6 dark:border-white/10">
          <span className="text-sm text-ink-400">Found this useful? Share it.</span>
          <ShareRow title={post.title} />
        </div>

        {/* Read next */}
        {more.length > 0 && (
          <section className="mx-auto mt-20 max-w-5xl">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-display text-2xl font-semibold tracking-tight">Read next</h2>
              <Link
                href="/blog"
                className="inline-flex items-center gap-1 text-sm font-medium text-ink-500 transition-colors hover:text-ink-950 dark:hover:text-white"
              >
                All posts
                <ArrowUpRight size={14} />
              </Link>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </section>
        )}

        {/* Footer CTA */}
        <div className="mx-auto mt-16 flex max-w-3xl flex-col items-start justify-between gap-4 border-t border-black/10 pt-8 dark:border-white/10 sm:flex-row sm:items-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition-colors hover:text-ink-950 dark:hover:text-white"
          >
            <ArrowLeft size={15} />
            Back to all posts
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-ink-950"
          >
            Work with me
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}

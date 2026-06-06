import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Calendar, Clock } from "lucide-react";
import { GradientMesh } from "@/components/ui/GradientMesh";
import { Markdown } from "@/components/ui/Markdown";
import { getPostBySlug, getPosts } from "@/lib/queries";
import { breadcrumbLd } from "@/lib/seo/breadcrumbs";
import { SITE, formatDate, readingMinutes } from "@/lib/utils";

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
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `${SITE.url}/blog/${post.slug}`,
      images: post.coverUrl ? [post.coverUrl] : undefined,
      publishedTime: post.publishedAt ?? undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.coverUrl ? [post.coverUrl] : undefined,
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

  const blogLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverUrl ? [post.coverUrl] : undefined,
    datePublished: post.publishedAt ?? undefined,
    dateModified: post.publishedAt ?? undefined,
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
    <article className="relative isolate overflow-hidden pb-32 pt-32 sm:pt-40">
      <GradientMesh variant="cool" className="opacity-30" />
      {[blogLd, crumbLd].map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}

      <div className="container relative">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition-colors hover:text-ink-950 dark:hover:text-white"
          >
            <ArrowLeft size={15} />
            All posts
          </Link>

          <header className="mt-8">
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center rounded-full border border-black/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-ink-500 dark:border-white/10 dark:text-ink-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
            <h1 className="mt-4 font-display text-fluid-h1 font-semibold leading-[1.06] tracking-tight text-balance">
              {post.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-ink-400">
              {post.publishedAt && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={14} />
                  {formatDate(post.publishedAt)}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Clock size={14} />
                {minutes} min read
              </span>
            </div>
          </header>

          {post.coverUrl && (
            <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-3xl border border-black/10 dark:border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.coverUrl} alt={post.title} className="h-full w-full object-cover" />
            </div>
          )}

          <div className="mt-12">
            <Markdown content={post.content} />
          </div>

          <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-black/10 pt-8 dark:border-white/10 sm:flex-row sm:items-center">
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
      </div>
    </article>
  );
}

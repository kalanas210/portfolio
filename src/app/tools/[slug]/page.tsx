import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, ChevronRight, ExternalLink, ShieldCheck, Check } from "lucide-react";
import { GradientMesh } from "@/components/ui/GradientMesh";
import { Markdown } from "@/components/ui/Markdown";
import { ToolEmbed } from "@/components/tools/ToolEmbed";
import { ToolIcon } from "@/components/tools/ToolIcon";
import { ToolCard } from "@/components/tools/ToolCard";
import { ToolFaq } from "@/components/tools/ToolFaq";
import { isToolComponentKey } from "@/lib/tools/registry";
import { getToolSeo } from "@/lib/tools/seo";
import { breadcrumbLd } from "@/lib/seo/breadcrumbs";
import { getToolBySlug, getTools } from "@/lib/queries";
import { SITE } from "@/lib/utils";

export const revalidate = 60;

export async function generateStaticParams() {
  const tools = await getTools();
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);
  if (!tool) return { title: "Tool not found" };
  const seo = getToolSeo(tool.slug, tool.name, tool.tagline);
  const title = seo.seoTitle ?? `${tool.name} - Free Online Tool`;
  const description = seo.seoDescription ?? tool.tagline;
  return {
    title,
    description,
    keywords: seo.keywords,
    alternates: { canonical: `/tools/${tool.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE.url}/tools/${tool.slug}`,
      images: tool.coverUrl ? [tool.coverUrl] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: tool.coverUrl ? [tool.coverUrl] : undefined,
    },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [tool, allTools] = await Promise.all([getToolBySlug(slug), getTools()]);
  if (!tool) notFound();

  const seo = getToolSeo(tool.slug, tool.name, tool.tagline);
  const canEmbed = tool.kind === "embedded" && isToolComponentKey(tool.componentKey);

  // Related tools: explicit list, then fall back to others in the same category.
  const bySlug = new Map(allTools.map((t) => [t.slug, t]));
  let related = seo.related.map((s) => bySlug.get(s)).filter((t): t is NonNullable<typeof t> => !!t);
  if (related.length === 0) {
    related = allTools.filter((t) => t.slug !== tool.slug && t.category === tool.category).slice(0, 3);
  }
  related = related.slice(0, 3);

  // ── Structured data ─────────────────────────────────────────────────────────
  const softwareLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: seo.seoDescription ?? tool.tagline,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    browserRequirements: "Requires a modern web browser with JavaScript",
    url: `${SITE.url}/tools/${tool.slug}`,
    image: tool.coverUrl || undefined,
    featureList: seo.features,
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: { "@type": "Person", name: SITE.name, url: SITE.url },
    publisher: { "@type": "Person", name: SITE.name, url: SITE.url },
  };

  const faqLd =
    seo.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: seo.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  const crumbLd = breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools" },
    { name: tool.name, path: `/tools/${tool.slug}` },
  ]);

  const h2 = "font-display text-2xl font-semibold tracking-tight";

  return (
    <article className="relative isolate overflow-hidden pb-32 pt-32 sm:pt-40">
      <GradientMesh variant="cool" className="opacity-30" />
      {[softwareLd, faqLd, crumbLd].filter(Boolean).map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}

      <div className="container relative">
        <div className="mx-auto max-w-3xl">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-ink-400">
            <Link href="/" className="transition-colors hover:text-ink-950 dark:hover:text-white">Home</Link>
            <ChevronRight size={14} />
            <Link href="/tools" className="transition-colors hover:text-ink-950 dark:hover:text-white">Tools</Link>
            <ChevronRight size={14} />
            <span className="truncate text-ink-600 dark:text-ink-300">{tool.name}</span>
          </nav>

          {/* Header */}
          <header className="mt-7 flex items-start gap-4">
            <span className={`inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white ${tool.gradient}`}>
              <ToolIcon name={tool.icon} size={24} strokeWidth={1.75} />
            </span>
            <div>
              <div className="text-xs font-medium uppercase tracking-[0.18em] text-ink-400">
                {tool.category}
              </div>
              <h1 className="mt-1.5 font-display text-fluid-h1 font-semibold leading-[1.05] tracking-tight text-balance">
                {tool.name}
              </h1>
            </div>
          </header>

          <p className="mt-5 text-lg leading-relaxed text-ink-500 dark:text-ink-300">{seo.intro}</p>

          {/* The tool itself */}
          <div className="mt-10">
            {canEmbed ? (
              <ToolEmbed componentKey={tool.componentKey as string} />
            ) : tool.kind === "external" && tool.externalUrl ? (
              <div className="flex flex-col items-start gap-4 rounded-3xl border border-black/10 bg-white/60 p-7 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.03]">
                <p className="text-sm text-ink-500 dark:text-ink-300">This tool opens on an external site.</p>
                <a
                  href={tool.externalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-ink-950 px-5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-ink-950"
                >
                  <ExternalLink size={16} />
                  Open {tool.name}
                </a>
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-black/15 p-10 text-center text-sm text-ink-400 dark:border-white/15">
                This tool isn&apos;t available yet.
              </div>
            )}
          </div>

          {canEmbed && (
            <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-ink-400">
              <ShieldCheck size={13} />
              100% free · runs in your browser · nothing is uploaded.
            </p>
          )}

          {/* Why use this */}
          <section className="mt-14">
            <h2 className={h2}>Why use this tool</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {seo.features.map((f) => (
                <li key={f} className="flex items-center gap-2.5 rounded-xl border border-black/10 bg-white/50 px-4 py-3 text-sm dark:border-white/10 dark:bg-white/[0.03]">
                  <Check size={16} className="shrink-0 text-emerald-500" />
                  {f}
                </li>
              ))}
            </ul>
          </section>

          {/* How to use */}
          <section className="mt-14">
            <h2 className={h2}>How to use {tool.name}</h2>
            <ol className="mt-5 space-y-4">
              {seo.howTo.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-950 text-sm font-semibold text-white dark:bg-white dark:text-ink-950">
                    {i + 1}
                  </span>
                  <p className="pt-1 text-ink-600 dark:text-ink-200">{step}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* Editable description */}
          {tool.description.trim() && (
            <section className="mt-14">
              <Markdown content={tool.description} />
            </section>
          )}

          {/* FAQ */}
          {seo.faqs.length > 0 && (
            <section className="mt-14">
              <h2 className={h2}>Frequently asked questions</h2>
              <div className="mt-5">
                <ToolFaq faqs={seo.faqs} />
              </div>
            </section>
          )}

          {/* Related tools */}
          {related.length > 0 && (
            <section className="mt-14">
              <h2 className={h2}>Related tools</h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-3">
                {related.map((t) => (
                  <ToolCard key={t.id} tool={t} />
                ))}
              </div>
            </section>
          )}

          <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-black/10 pt-8 dark:border-white/10 sm:flex-row sm:items-center">
            <Link href="/tools" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition-colors hover:text-ink-950 dark:hover:text-white">
              ← Back to all tools
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-ink-950">
              Suggest a tool
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

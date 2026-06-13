import type { Metadata } from "next";
import { GradientMesh } from "@/components/ui/GradientMesh";
import { Reveal } from "@/components/ui/Reveal";
import { ToolsExplorer } from "@/components/tools/ToolsExplorer";
import { getTools } from "@/lib/queries";
import { SITE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Free Online Tools - Background Remover, QR, JSON & More",
  description:
    "A growing collection of free, privacy-first online tools that run entirely in your browser - background remover, image compressor, QR code generator, JSON & developer utilities, and more. No sign-up, no uploads, no watermarks.",
  alternates: { canonical: "/tools" },
  openGraph: {
    title: "Free Online Tools by Kalana Sandakelum",
    description:
      "Fast, free, privacy-first browser tools - background remover, image compressor, QR generator, JSON & dev utilities, and more.",
    url: `${SITE.url}/tools`,
  },
};

export const revalidate = 60;

export default async function ToolsPage() {
  const tools = await getTools();

  // ItemList structured data — helps Google understand the tools collection.
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Free Online Tools",
    description: "Free, privacy-first browser tools by Kalana Sandakelum.",
    numberOfItems: tools.length,
    itemListElement: tools.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE.url}/tools/${t.slug}`,
      name: t.name,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />

      <section className="relative isolate overflow-hidden pt-36 pb-10 sm:pt-44 sm:pb-12">
        <GradientMesh variant="cool" className="opacity-40" />
        <div className="container relative max-w-3xl">
          <Reveal>
            <div className="mb-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-400">
              <span className="tabular-nums text-ink-900 dark:text-white">01</span>
              <span className="h-px w-7 bg-ink-300 dark:bg-ink-700" />
              Free Tools
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="font-display text-fluid-h1 font-semibold leading-[1.05] tracking-tight text-balance">
              Free online tools that respect your privacy
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-lg leading-relaxed text-ink-500 dark:text-ink-300">
              {tools.length > 0 ? `${tools.length} ` : ""}fast, free utilities that run entirely in
              your browser - remove image backgrounds, compress images, generate QR codes, format
              JSON, and more. No sign-up, no watermarks, and your files never leave your device.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container pb-32">
        {tools.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-black/15 p-16 text-center text-ink-400 dark:border-white/15">
            No tools yet - check back soon.
          </p>
        ) : (
          <ToolsExplorer tools={tools} />
        )}
      </section>
    </>
  );
}

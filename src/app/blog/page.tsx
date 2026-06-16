import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GradientMesh } from "@/components/ui/GradientMesh";
import { Reveal, RevealStagger, RevealItem } from "@/components/ui/Reveal";
import { PostCard } from "@/components/blog/PostCard";
import { FeaturedPostCard } from "@/components/blog/FeaturedPostCard";
import { getPosts } from "@/lib/queries";
import { SITE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog - Web Development, Design & Engineering Notes",
  description:
    "Tutorials and deep-dives on web development, design, and software engineering by Kalana Sandakelum - Next.js, React, Java, and more.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog by Kalana Sandakelum",
    description: "Tutorials and deep-dives on web development, design, and software engineering.",
    url: `${SITE.url}/blog`,
  },
};

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getPosts();
  const lead = posts.find((p) => p.featured) ?? posts[0];
  const rest = lead ? posts.filter((p) => p.id !== lead.id) : posts;

  return (
    <>
      <section className="relative isolate overflow-hidden pt-36 pb-12 sm:pt-44 sm:pb-16">
        <GradientMesh variant="cool" className="opacity-40" />
        <div className="container relative">
          <SectionHeading
            index="01"
            eyebrow="Blog"
            title="Notes on building for the web."
            description="Tutorials, deep-dives, and the occasional design rabbit hole."
          />
        </div>
      </section>

      <section className="container pb-32">
        {posts.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-black/15 p-16 text-center text-ink-400 dark:border-white/15">
            No posts yet - check back soon.
          </p>
        ) : (
          <>
            {lead && (
              <Reveal className="mb-8">
                <FeaturedPostCard post={lead} />
              </Reveal>
            )}
            {rest.length > 0 && (
              <RevealStagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((p) => (
                  <RevealItem key={p.id} className="h-full">
                    <PostCard post={p} />
                  </RevealItem>
                ))}
              </RevealStagger>
            )}
          </>
        )}
      </section>
    </>
  );
}

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealStagger, RevealItem } from "@/components/ui/Reveal";
import { PostCard } from "@/components/blog/PostCard";
import type { Post } from "@/lib/types";
import { cn } from "@/lib/utils";

export function FeaturedPosts({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="container relative py-16 sm:py-20">
      <div className="flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          index="06"
          eyebrow="Writing"
          title="From the blog"
          description="Notes on web development, design, and engineering."
        />
        <Link
          href="/blog"
          className="group inline-flex items-center gap-2 self-start text-sm font-medium text-ink-700 sm:self-end dark:text-ink-200"
        >
          Read the blog
          <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      {/* One row: 3 on desktop, 1 on mobile (2nd & 3rd hidden below lg). */}
      <RevealStagger className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {posts.slice(0, 3).map((p, i) => (
          <RevealItem key={p.id} className={cn("h-full", i >= 1 && "hidden lg:block")}>
            <PostCard post={p} />
          </RevealItem>
        ))}
      </RevealStagger>
    </section>
  );
}

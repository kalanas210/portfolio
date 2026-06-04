"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealStagger, RevealItem } from "@/components/ui/Reveal";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

export function FeaturedWork({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  return (
    <section className="container relative py-24 sm:py-32">
      <div className="flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="Selected work"
          title="Recent things I've built"
          description="A small slice of what I've been making at the University of Moratuwa and on the side."
        />
        <Link
          href="/projects"
          className="group inline-flex items-center gap-2 self-start sm:self-end text-sm font-medium text-ink-700 dark:text-ink-200"
        >
          See all projects
          <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      <RevealStagger className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <RevealItem key={p.slug}>
            <Link
              href={`/projects/${p.slug}`}
              data-cursor="view"
              className="group relative block h-full overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-ink-900"
            >
              <div className={cn("relative h-56 overflow-hidden bg-gradient-to-br", p.gradient)}>
                <motion.div
                  initial={false}
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  {p.thumbnailUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.thumbnailUrl}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 opacity-60 mix-blend-overlay grid-bg" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/40 via-transparent to-transparent" />
                  <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-white backdrop-blur-md">
                    Featured
                  </div>
                  <div className="absolute left-6 bottom-6 text-white">
                    <p className="text-xs uppercase tracking-[0.18em] opacity-80">
                      {p.year} · {p.categories.join(" · ")}
                    </p>
                  </div>
                </motion.div>
              </div>
              <div className="p-6">
                <h3 className="font-display text-2xl font-semibold tracking-tight">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500 dark:text-ink-300">
                  {p.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.tech.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center rounded-full border border-black/10 dark:border-white/10 px-2.5 py-0.5 text-[11px] font-medium text-ink-500 dark:text-ink-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-transparent transition-all group-hover:ring-black/20 dark:group-hover:ring-white/20" />
            </Link>
          </RevealItem>
        ))}
      </RevealStagger>
    </section>
  );
}

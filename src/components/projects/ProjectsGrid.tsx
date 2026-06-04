"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { AnimatePresence, motion, LayoutGroup } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/icons/BrandIcons";
import { type Project, type ProjectCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const FILTERS: ("All" | ProjectCategory)[] = ["All", "Web", "Mobile", "AI", "Open Source"];

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<(typeof FILTERS)[number]>("All");

  const filtered = useMemo(() => {
    if (active === "All") return projects;
    return projects.filter((p) => p.categories.includes(active));
  }, [active]);

  return (
    <div>
      {/* Filter pill row */}
      <div className="relative mx-auto inline-flex max-w-full overflow-x-auto rounded-full border border-black/10 dark:border-white/10 bg-white/70 dark:bg-ink-900/70 p-1 backdrop-blur-xl">
        <LayoutGroup id="projects-filter">
          {FILTERS.map((f) => {
            const isActive = f === active;
            return (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={cn(
                  "relative z-10 inline-flex h-9 items-center rounded-full px-4 text-sm font-medium whitespace-nowrap transition-colors",
                  isActive
                    ? "text-white"
                    : "text-ink-500 hover:text-ink-950 dark:text-ink-300 dark:hover:text-white",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="filter-active"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 -z-10 rounded-full bg-ink-950 dark:bg-white/20"
                  />
                )}
                {f}
              </button>
            );
          })}
        </LayoutGroup>
      </div>

      <motion.div
        layout
        className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((p) => (
            <motion.article
              layout
              key={p.slug}
              id={p.slug}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-ink-900"
              data-cursor="view"
            >
              <Link
                href={`/projects/${p.slug}`}
                data-cursor="view"
                className="relative block h-52 overflow-hidden"
              >
                <div className={cn("absolute inset-0 bg-gradient-to-br", p.gradient)} />
                <motion.div
                  whileHover={{ scale: 1.08 }}
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
                  <div className="absolute inset-0 opacity-50 mix-blend-overlay grid-bg" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/50 via-transparent to-transparent" />
                  <div className="absolute inset-x-4 top-4 flex items-center justify-between">
                    {p.featured && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-white backdrop-blur-md">
                        ★ Featured
                      </span>
                    )}
                    <span className="ml-auto inline-flex items-center rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-md">
                      {p.year}
                    </span>
                  </div>
                  <div className="absolute inset-x-6 bottom-5 text-white">
                    <div className="text-xs uppercase tracking-[0.18em] opacity-80">
                      {p.categories.join(" · ")}
                    </div>
                  </div>
                </motion.div>
              </Link>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-xl font-semibold tracking-tight">
                  <Link
                    href={`/projects/${p.slug}`}
                    className="transition-colors hover:text-accent"
                  >
                    {p.title}
                  </Link>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500 dark:text-ink-300">
                  {p.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center rounded-full border border-black/10 dark:border-white/10 px-2.5 py-0.5 text-[11px] font-medium text-ink-500 dark:text-ink-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex items-center gap-2 pt-6">
                  {p.liveUrl && (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="open"
                      className="group/btn inline-flex items-center gap-1.5 rounded-full bg-ink-950 dark:bg-white px-3.5 py-1.5 text-xs font-medium text-white dark:text-ink-950 transition-transform hover:-translate-y-0.5"
                    >
                      Live demo
                      <ExternalLink size={12} />
                    </a>
                  )}
                  {p.githubUrl && (
                    <a
                      href={p.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="open"
                      className="inline-flex items-center gap-1.5 rounded-full border border-black/15 dark:border-white/20 px-3.5 py-1.5 text-xs font-medium text-ink-700 dark:text-ink-100 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                    >
                      <GithubIcon size={12} />
                      Code
                    </a>
                  )}
                  <ArrowUpRight
                    size={16}
                    className="ml-auto text-ink-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </div>
              </div>

              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-transparent transition-all group-hover:ring-black/15 dark:group-hover:ring-white/20" />
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="mt-16 rounded-3xl border border-dashed border-black/15 dark:border-white/15 p-12 text-center text-sm text-ink-400">
          Nothing in this category yet — but watch this space.
        </div>
      )}
    </div>
  );
}

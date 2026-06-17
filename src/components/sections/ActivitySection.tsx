"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Hammer } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { GithubIcon } from "@/components/icons/BrandIcons";
import { cn } from "@/lib/utils";

const WEEKS = 53;
const DAYS = 7;

const MONTH_LABELS = [
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
];
const DAY_LABELS = ["Mon", "Wed", "Fri"];

function generateGrid(): number[][] {
  // Deterministic seeded grid — no SSR mismatch
  const grid: number[][] = [];
  for (let w = 0; w < WEEKS; w++) {
    const week: number[] = [];
    for (let d = 0; d < DAYS; d++) {
      const seed = w * 7 + d;
      // Pseudo-random but reproducible
      const r = Math.abs(Math.sin(seed * 9.81 + 0.37) * 10000) % 1;
      // Bias toward more activity in last ~10 weeks
      const recencyBoost = w > WEEKS - 12 ? 0.18 : 0;
      const v = r + recencyBoost;
      const level = v < 0.35 ? 0 : v < 0.58 ? 1 : v < 0.78 ? 2 : v < 0.92 ? 3 : 4;
      week.push(level);
    }
    grid.push(week);
  }
  return grid;
}

const LEVEL_CLASSES: Record<number, string> = {
  0: "bg-ink-900/[0.06] dark:bg-white/[0.06]",
  1: "bg-emerald-500/25",
  2: "bg-emerald-500/45",
  3: "bg-emerald-500/70",
  4: "bg-emerald-500 dark:bg-emerald-400",
};

export function ActivitySection() {
  const grid = generateGrid();
  const total = grid.flat().reduce((sum, v) => sum + (v > 0 ? 1 : 0), 0);
  const streak = (() => {
    let s = 0;
    for (let w = WEEKS - 1; w >= 0; w--) {
      let weekHasContrib = false;
      for (let d = 0; d < DAYS; d++) if (grid[w][d] > 0) weekHasContrib = true;
      if (weekHasContrib) s++;
      else break;
    }
    return s;
  })();

  return (
    <section className="container relative py-16 sm:py-20">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          index="03"
          eyebrow="Pulse"
          title="A year of commits - and what I'm shipping now."
          description="A snapshot of the public side: contributions, current builds, and what's queued up next."
        />
        <Reveal>
          <a
            href="https://github.com/kalanas210"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 text-sm font-medium text-ink-700 dark:text-ink-200"
          >
            <GithubIcon size={14} />
            View full profile
            <ArrowUpRight
              size={14}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </Reveal>
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        {/* Heatmap card */}
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-ink-900 p-6 sm:p-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-ink-400">
                  Contributions · last 12 months
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-display text-3xl font-bold tracking-tight">{total}</span>
                  <span className="text-sm text-ink-400">days active</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="inline-flex items-center gap-2">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-emerald-400" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-ink-500 dark:text-ink-200">{streak}-week streak</span>
                </span>
              </div>
            </div>

            {/* Grid */}
            <div className="mt-6 overflow-x-auto">
              <div className="inline-flex flex-col gap-1.5 min-w-full">
                {/* Month labels */}
                <div className="flex gap-1.5 pl-7">
                  {MONTH_LABELS.map((m, i) => (
                    <span
                      key={`${m}-${i}`}
                      className="w-[calc((100%-11*0.375rem)/12)] text-[10px] text-ink-400"
                    >
                      {m}
                    </span>
                  ))}
                </div>

                {/* Grid + day labels */}
                <div className="flex gap-2">
                  <div className="flex flex-col justify-between py-[2px] text-[10px] text-ink-400">
                    {DAY_LABELS.map((d) => (
                      <span key={d}>{d}</span>
                    ))}
                  </div>
                  <div className="flex gap-[3px]">
                    {grid.map((week, wi) => (
                      <div key={wi} className="flex flex-col gap-[3px]">
                        {week.map((level, di) => (
                          <motion.div
                            key={`${wi}-${di}`}
                            initial={{ opacity: 0, scale: 0.4 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{
                              duration: 0.4,
                              delay: 0.0008 * (wi * 7 + di),
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            title={`${level} commits`}
                            className={cn(
                              "h-[11px] w-[11px] rounded-[3px] transition-transform hover:scale-125 hover:ring-1 hover:ring-ink-950/30 dark:hover:ring-white/30",
                              LEVEL_CLASSES[level],
                            )}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Legend */}
                <div className="mt-4 flex items-center gap-2 text-[10px] text-ink-400">
                  <span>Less</span>
                  {[0, 1, 2, 3, 4].map((l) => (
                    <span
                      key={l}
                      className={cn("h-2.5 w-2.5 rounded-[3px]", LEVEL_CLASSES[l])}
                    />
                  ))}
                  <span>More</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Now building + Up next */}
        <Reveal delay={0.1}>
          <div className="flex h-full flex-col gap-5">
            <div className="relative flex-1 overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-ink-900 p-6">
              <div className="relative flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-400">
                <Hammer size={12} />
                Currently building
              </div>
              <h3 className="relative mt-3 font-display text-2xl font-semibold tracking-tight">
                Durdans LIMS
              </h3>
              <p className="relative mt-2 text-sm leading-relaxed text-ink-500 dark:text-ink-300">
                An enterprise Laboratory Information Management System for Durdans Hospital,
                built with a University of Moratuwa team in partnership with IFS - digitising the
                clinical-lab pipeline from registration to signed report across a multi-branch network.
              </p>
              <div className="relative mt-4 flex flex-wrap gap-1.5">
                {["Spring Boot", "Next.js", "PostgreSQL", "Microservices"].map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center rounded-full border border-black/10 dark:border-white/10 px-2.5 py-0.5 text-[11px] font-medium text-ink-500 dark:text-ink-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <Link
                href="/projects/durdans-lims"
                className="relative mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-ink-950 dark:text-white"
              >
                Read more
                <ArrowUpRight size={12} />
              </Link>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-ink-950 text-white p-6">
              <div className="text-xs uppercase tracking-[0.18em] text-white/50">Up next</div>
              <ul className="mt-4 space-y-3">
                {[
                  { label: "Open-source motion-design starter", state: "Sketching" },
                  { label: "Shader-driven blog cover system", state: "Researching" },
                  { label: "Tiny CLI for Tailwind preset packing", state: "Backlog" },
                ].map((u) => (
                  <li key={u.label} className="flex items-center justify-between gap-3">
                    <span className="text-sm">{u.label}</span>
                    <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-white/70">
                      {u.state}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

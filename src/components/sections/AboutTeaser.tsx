"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Counter } from "@/components/ui/Counter";
import { GradientText } from "@/components/ui/GradientText";
import { Reveal } from "@/components/ui/Reveal";
import { GradientMesh } from "@/components/ui/GradientMesh";
import { defaultStats } from "@/lib/data";
import type { Stat } from "@/lib/types";

export function AboutTeaser({ stats = defaultStats }: { stats?: Stat[] }) {
  const STATS = stats.length > 0 ? stats : defaultStats;
  return (
    <section className="container relative py-16 sm:py-20">
      <div className="relative overflow-hidden rounded-[2rem] border border-black/10 dark:border-white/10 bg-white dark:bg-ink-900">
        <GradientMesh variant="default" className="opacity-60" />
        <div className="relative grid gap-12 p-8 sm:p-12 lg:grid-cols-2">
          <div>
            <Reveal>
              <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-400">
                <span className="tabular-nums text-ink-900 dark:text-white">02</span>
                <span className="h-px w-7 bg-ink-300 dark:bg-ink-700" />
                About
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-4 font-display text-fluid-h2 font-semibold tracking-tight leading-[1.05] text-balance">
                I&apos;m an undergraduate building <GradientText>thoughtful</GradientText> software with{" "}
                <GradientText variant="cool">care</GradientText> and{" "}
                <GradientText variant="fire">craft</GradientText>.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-xl text-base sm:text-lg text-ink-500 dark:text-ink-300">
                Studying Information Technology at the University of Moratuwa. I obsess over
                motion, micro-interactions, and making the boring stuff fast. When I&apos;m not
                coding, I&apos;m reading about typography or shipping side projects.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-8">
                <Link
                  href="/about"
                  className="group inline-flex items-center gap-2 rounded-full border border-black/15 dark:border-white/20 bg-white/60 dark:bg-white/5 px-5 py-2.5 text-sm font-medium backdrop-blur-md hover:bg-white dark:hover:bg-white/10 transition-colors"
                >
                  Read my story
                  <ArrowUpRight
                    size={15}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="grid grid-cols-2 gap-3">
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.6, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  className="relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/[0.03] p-5 backdrop-blur-md"
                >
                  <div className="font-display text-4xl font-bold tracking-tight">
                    <Counter value={s.value} suffix={s.suffix} />
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-[0.14em] text-ink-400">
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

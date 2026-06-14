"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { useSettings } from "@/components/providers/SettingsProvider";

const STACK_HIGHLIGHTS = [
  "Java · Spring Boot",
  "Next.js · React",
  "Kafka · RabbitMQ",
  "Kubernetes · Docker",
  "NestJS · MongoDB",
] as const;

const FLOAT_TRANSITION = {
  duration: 7.5,
  repeat: Infinity,
  repeatType: "mirror" as const,
  ease: [0.45, 0.05, 0.55, 0.95] as [number, number, number, number],
};

function StackBadge() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % STACK_HIGHLIGHTS.length);
    }, 3400);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.88, y: 18, x: 14 }}
      animate={
        inView
          ? { opacity: 1, scale: 1, y: 0, x: 0 }
          : { opacity: 0, scale: 0.88, y: 18, x: 14 }
      }
      transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="absolute -right-3 bottom-12"
    >
      <motion.div
        animate={
          reduce
            ? undefined
            : {
                y: [0, -9, -4, -11, 0],
                x: [0, 2, -2, 1, 0],
                rotate: [0, 0.6, -0.4, 0.3, 0],
              }
        }
        transition={reduce ? undefined : FLOAT_TRANSITION}
        className="relative overflow-hidden rounded-xl border border-ink-900/10 bg-white/95 px-3.5 py-2.5 shadow-[0_16px_40px_-18px_rgba(0,0,0,0.45)] backdrop-blur-md dark:border-white/15 dark:bg-ink-950/95"
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-violet/10 via-transparent to-brand-cyan/10"
          animate={reduce ? undefined : { opacity: [0.35, 0.7, 0.35] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative flex items-center gap-2">
          <motion.span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-brand-emerald"
            animate={reduce ? undefined : { scale: [1, 1.35, 1], opacity: [0.65, 1, 0.65] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-400">Stack</div>
        </div>

        <div className="relative mt-1 min-h-[1.125rem] min-w-[9.5rem] overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={STACK_HIGHLIGHTS[reduce ? 0 : index]}
              initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs font-semibold tracking-tight text-ink-900 dark:text-white"
            >
              {STACK_HIGHLIGHTS[reduce ? 0 : index]}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Portrait() {
  const { name, aboutImageUrl, heroMobileUrl } = useSettings();
  const src = aboutImageUrl ?? heroMobileUrl ?? "/images/back_image.png";

  return (
    <div className="relative w-full max-w-sm">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-ink-900/10 bg-ink-100 dark:border-white/10 dark:bg-ink-900"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={name}
          className="h-full w-full object-cover object-[45%_10%] grayscale-[0.18] contrast-[1.04]"
        />

        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10"
        />

        <div className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/75">
          UoM · &rsquo;23-
        </div>

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 font-mono text-[10px] uppercase tracking-[0.18em] text-white">
          <span>{name}</span>
          <span className="text-white/60">Full-stack</span>
        </div>

        <span aria-hidden className="absolute left-3 top-3 h-3 w-3 border-l border-t border-white/40" />
        <span aria-hidden className="absolute right-3 bottom-3 h-3 w-3 border-b border-r border-white/40" />
      </motion.div>

      <StackBadge />
    </div>
  );
}

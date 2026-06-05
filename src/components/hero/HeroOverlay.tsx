"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowDown, ArrowUpRight, Download } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useSettings } from "@/components/providers/SettingsProvider";

const ROLES = ["Software Engineer", "UI / UX Designer", "Problem Solver", "OSS Contributor"];

export function HeroOverlay() {
  const prefersReducedMotion = useReducedMotion();
  const settings = useSettings();

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col">
      {/* For a11y / SEO — the marquee renders the name visually */}
      <h1 className="sr-only">{settings.name} — {settings.role}</h1>

      {/* ── TOP HALF: intentionally empty — let the artwork breathe ─── */}
      <div className="flex-1" />

      {/* Editorial vertical SCROLL label, anchored to the right edge */}
      <motion.div
        initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute right-3 sm:right-5 bottom-32 sm:bottom-40 flex items-center gap-2 origin-center [writing-mode:vertical-rl] rotate-180 text-[10px] uppercase tracking-[0.32em] text-ink-700/70"
      >
        <motion.span
          animate={prefersReducedMotion ? undefined : { y: [0, -5, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="inline-block"
        >
          <ArrowDown size={11} className="rotate-180" />
        </motion.span>
        <span>Scroll to explore</span>
      </motion.div>

      {/* ── CENTER MOUSE SCROLL INDICATOR (Desktop Only) ────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-28 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 pointer-events-none"
      >
        <div className="w-[22px] h-[34px] rounded-full border-[1.5px] border-ink-900/30 dark:border-white/30 flex justify-center p-[3px]">
          <motion.div
            animate={prefersReducedMotion ? undefined : { y: [0, 12, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-2 rounded-full bg-ink-900/50 dark:bg-white/50"
          />
        </div>
        <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-ink-900/40 dark:text-white/40">
          Scroll down
        </span>
      </motion.div>

      {/* ── BOTTOM RAIL ─────────────────────────────────────────────── */}
      <div className="container relative pb-6 sm:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto relative grid items-center gap-4 rounded-2xl border border-black/10 bg-white/65 px-4 py-3 backdrop-blur-2xl shadow-[0_18px_40px_-22px_rgba(0,0,0,0.35)] sm:grid-cols-[1fr_auto] sm:gap-6 sm:px-5 sm:py-3.5 dark:bg-white"
        >
          {/* Greeting + animated role */}
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-[0.22em] text-ink-500">
              Hello — I&apos;m {settings.shortName.toLowerCase()}, a
            </div>
            <div className="mt-1 flex items-baseline gap-2 truncate">
              <RoleTypewriter />
              <span aria-hidden className="hidden sm:inline-block text-ink-400">·</span>
              <span className="hidden sm:inline-block truncate text-sm text-ink-500">
                {settings.university}
              </span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-2">
            <Link href="/projects" className="flex-1 sm:flex-initial">
              <MagneticButton variant="primary" size="sm" data-cursor="view" className="w-full sm:w-auto dark:border dark:border-black/10 dark:hover:bg-black/5">
                View work
                <ArrowUpRight size={15} />
              </MagneticButton>
            </Link>
            <a href={settings.cvUrl ?? "/cv.pdf"} download className="flex-1 sm:flex-initial">
              <MagneticButton
                variant="ghost"
                size="sm"
                className="w-full sm:w-auto dark:text-ink-950 dark:border-black/10 dark:hover:bg-black/5"
              >
                <Download size={14} />
                CV
              </MagneticButton>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function RoleTypewriter() {
  return (
    <span
      className="relative inline-flex h-6 overflow-hidden align-baseline"
      aria-label={ROLES.join(", ")}
    >
      {/* CSS-driven roll (see .role-roll in globals.css) — loops reliably on the
          compositor. The trailing duplicate of ROLES[0] makes the wrap seamless. */}
      <span
        aria-hidden
        className="role-roll flex flex-col"
        style={{ "--role-rh": "1.5rem", "--role-dur": "10s" } as CSSProperties}
      >
        {ROLES.map((role) => (
          <span
            key={role}
            className="block h-6 leading-6 text-sm sm:text-base font-semibold text-gradient"
          >
            {role}
          </span>
        ))}
        <span className="block h-6 leading-6 text-sm sm:text-base font-semibold text-gradient">
          {ROLES[0]}
        </span>
      </span>
    </span>
  );
}

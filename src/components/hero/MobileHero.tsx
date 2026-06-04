"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronDown, Download } from "lucide-react";
import type { CSSProperties } from "react";
import {
  GithubIcon,
  LinkedinIcon,
  FacebookIcon,
  InstagramIcon,
} from "@/components/icons/BrandIcons";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useSettings } from "@/components/providers/SettingsProvider";
import { cn } from "@/lib/utils";

const ROLES = ["Software Engineer", "UI / UX Designer", "Problem Solver", "OSS Contributor"];

const STAGE_BG =
  "radial-gradient(ellipse 120% 80% at 50% 22%, #fcfbf6 0%, #f6f4ed 42%, #ece7d8 78%, #e2dbc7 100%)";

const ease = [0.16, 1, 0.3, 1] as const;

export function MobileHero({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const settings = useSettings();

  const SOCIALS = [
    { href: settings.social.github, label: "GitHub", Icon: GithubIcon },
    { href: settings.social.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
    { href: settings.social.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: settings.social.instagram, label: "Instagram", Icon: InstagramIcon },
  ];

  return (
    <section
      className={cn("relative flex min-h-[100svh] flex-col overflow-hidden", className)}
      style={{ background: STAGE_BG }}
    >
      {/* calm top band so the floating nav has air */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-24 bg-gradient-to-b from-[#fcfbf6] to-transparent"
      />

      {/* cinematic key light — soft spotlight behind the head */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-[44%] top-[14%] z-[1] h-[70vw] w-[70vw] max-h-[26rem] max-w-[26rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-brand-violet/30 via-brand-fuchsia/22 to-brand-rose/16 blur-[80px]"
        animate={reduce ? undefined : { scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* faint oversized monogram — depth behind the figure */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[15%] z-[3] flex justify-center"
      >
        <span
          className="font-display font-black uppercase leading-none tracking-[-0.06em] text-ink-950/[0.05]"
          style={{ fontSize: "clamp(5rem, 30vw, 11rem)" }}
        >
          KS
        </span>
      </div>

      {/* ── FULL-BLEED FIGURE — explicit height frame, cover-cropped ───── */}
      <motion.div
        initial={{ opacity: 0, y: 22, scale: 1.03 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.1, ease }}
        className="pointer-events-none absolute inset-x-0 top-[3.5rem] bottom-[34%] z-10"
      >
        <Image
          src={settings.heroMobileUrl ?? "/images/back_image.png"}
          alt={`${settings.name} — ${settings.role}`}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[40%_8%] [filter:contrast(1.05)_saturate(1.04)] drop-shadow-[0_30px_44px_rgba(40,24,8,0.28)]"
        />
      </motion.div>

      {/* edge vignette — frames the figure so the light shirt separates
          cleanly from the cream stage instead of blending into it */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[11]"
        style={{
          background:
            "radial-gradient(115% 78% at 50% 30%, transparent 54%, rgba(58,38,16,0.13) 100%)",
        }}
      />

      {/* cream floor — figure dissolves in, type gets a clean base */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[12] h-[52%] bg-gradient-to-t from-[#f3efe4] via-[#f3efe4]/85 via-40% to-transparent"
      />

      {/* film grain over everything */}
      <div className="noise pointer-events-none absolute inset-0 z-[14]" aria-hidden />

      {/* scroll cue — sits in the cream gap above the name cluster */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.1, ease }}
        className="pointer-events-none absolute left-1/2 top-[55%] z-[13] flex -translate-x-1/2 flex-col items-center gap-1 text-ink-400"
      >
        <span className="text-[9px] font-semibold uppercase tracking-[0.32em]">Scroll</span>
        <ChevronDown size={16} className={reduce ? undefined : "animate-bounce"} />
      </motion.div>

      {/* ── STATUS CHIP · compact, top-left (clears the centered nav) ──── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25, ease }}
        className="absolute left-5 top-[5.25rem] z-30 flex items-center gap-2.5 text-[11px] font-medium"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.06] bg-white/65 px-2.5 py-1 backdrop-blur-md">
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.13)]"
          />
          <span className="text-ink-700">Available for work</span>
        </span>
        <span className="text-ink-400">Moratuwa, LK</span>
      </motion.div>

      {/* ── NAME + GLASS RAIL · bottom cluster ─────────────────────────── */}
      <div className="relative z-20 mt-auto px-5 pb-5">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease }}
          className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.34em] text-ink-400"
        >
          Hello, I&apos;m
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.46, ease }}
          className="font-display font-black leading-[0.84] tracking-[-0.035em] text-ink-950 [text-shadow:0_1px_0_rgba(255,255,255,0.7)]"
          style={{ fontSize: "clamp(3.25rem, 16vw, 4.75rem)" }}
        >
          Kalana
          <br />
          <span>Sandakelum</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.58, ease }}
          className="mt-5 rounded-[20px] border border-black/10 bg-white/65 px-4 py-3.5 shadow-[0_18px_44px_-22px_rgba(0,0,0,0.4)] backdrop-blur-2xl"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-brand-violet to-brand-fuchsia" />
              <RoleTypewriter />
            </div>
            <div className="flex shrink-0 items-center gap-3.5 text-ink-400">
              {SOCIALS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="transition-colors hover:text-ink-900"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <Link href="/projects" className="flex-1">
              <MagneticButton variant="primary" size="sm" className="w-full">
                View work
                <ArrowUpRight size={15} />
              </MagneticButton>
            </Link>
            <a href={settings.cvUrl ?? "/cv.pdf"} download className="flex-1">
              <MagneticButton
                variant="ghost"
                size="sm"
                className="w-full dark:text-ink-950 dark:border-black/10"
              >
                <Download size={14} />
                CV
              </MagneticButton>
            </a>
          </div>
        </motion.div>
      </div>

      {/* bottom fade into the next section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-20 bg-gradient-to-b from-transparent to-[rgb(var(--bg))]" />
    </section>
  );
}

function RoleTypewriter() {
  return (
    <span
      className="relative inline-flex h-7 overflow-hidden align-baseline"
      aria-label={ROLES.join(", ")}
    >
      <span
        aria-hidden
        className="role-roll flex flex-col"
        style={{ "--role-rh": "1.75rem", "--role-dur": "10s" } as CSSProperties}
      >
        {ROLES.map((role) => (
          <span
            key={role}
            className="block h-7 whitespace-nowrap text-[15px] font-semibold leading-7 text-gradient-strong"
          >
            {role}
          </span>
        ))}
        <span className="block h-7 whitespace-nowrap text-[15px] font-semibold leading-7 text-gradient-strong">
          {ROLES[0]}
        </span>
      </span>
    </span>
  );
}

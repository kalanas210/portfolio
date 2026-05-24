"use client";

import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { GradientMesh } from "@/components/ui/GradientMesh";
import { Reveal } from "@/components/ui/Reveal";
import { GradientText } from "@/components/ui/GradientText";
import { SITE } from "@/lib/utils";

export function ContactCTA() {
  return (
    <section className="container relative py-24 sm:py-32">
      <div className="relative isolate overflow-hidden rounded-[2.5rem] border border-black/10 dark:border-white/10 bg-ink-900 dark:bg-ink-900 text-white">
        <GradientMesh variant="cool" className="opacity-80" />
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative px-8 py-20 sm:px-14 sm:py-28 text-center">
          <Reveal>
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] backdrop-blur-md">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Open to work · {new Date().getFullYear()}
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-6 font-display text-fluid-h1 font-semibold leading-[1.02] tracking-tight text-balance">
              Have a project, role, or idea?{" "}
              <GradientText variant="cool">Let&apos;s talk.</GradientText>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-5 max-w-xl text-base sm:text-lg text-white/70">
              I reply within a day. Internships, freelance gigs, or just a friendly hello — all welcome.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link href="/contact">
                <MagneticButton variant="primary" size="lg">
                  Start a conversation
                  <ArrowUpRight size={18} />
                </MagneticButton>
              </Link>
              <a href={`mailto:${SITE.email}`}>
                <MagneticButton variant="ghost" size="lg">
                  <Mail size={16} />
                  {SITE.email}
                </MagneticButton>
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Mail } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Reveal } from "@/components/ui/Reveal";
import { useSettings } from "@/components/providers/SettingsProvider";

export function ContactCTA() {
  const settings = useSettings();

  return (
    <section className="container relative py-16 sm:py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative isolate overflow-hidden rounded-[1.75rem] border border-white/10 text-white"
        style={{
          background:
            "radial-gradient(130% 120% at 50% -10%, #1e2128 0%, #131418 48%, #0a0b0d 100%)",
        }}
      >
        {/* soft green ambient rising from the base — the single accent, adds life */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[78%] h-[26rem] w-[44rem] -translate-x-1/2 rounded-full bg-emerald-500/20 blur-[120px]"
          animate={{ opacity: [0.45, 0.8, 0.45] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* fine grid */}
        <div aria-hidden className="absolute inset-0 grid-bg opacity-[0.08]" />
        {/* animated top hairline sweep */}
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-white/10" />
        <div aria-hidden className="absolute inset-x-0 top-0 h-px overflow-hidden">
          <motion.div
            className="h-px w-1/4 bg-gradient-to-r from-transparent via-white/70 to-transparent"
            animate={{ x: ["-130%", "520%"] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="relative px-8 py-16 text-center sm:px-14 sm:py-20">
          <Reveal>
            <div className="mx-auto inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">
              <span aria-hidden className="relative inline-flex h-1.5 w-1.5">
                <span className="absolute inset-0 rounded-full bg-emerald-400/60 blur-[3px]" />
                <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Available for work
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <h2 className="mx-auto mt-6 max-w-xl font-display text-fluid-h2 font-semibold leading-[1.08] tracking-tight text-balance text-white/65">
              Have a project, role, or idea?{" "}
              <span className="text-white">Let&apos;s talk.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mx-auto mt-5 max-w-xl text-base text-white/50 sm:text-lg">
              I reply within a day — internships, freelance work, or just a
              friendly hello.
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
              <a href={`mailto:${settings.email}`} aria-label={`Email ${settings.name}`}>
                <MagneticButton
                  variant="ghost"
                  size="lg"
                  className="border-white/15 text-white hover:bg-white/[0.06]"
                >
                  <Mail size={16} />
                  Email me
                </MagneticButton>
              </a>
            </div>
          </Reveal>
        </div>
      </motion.div>
    </section>
  );
}

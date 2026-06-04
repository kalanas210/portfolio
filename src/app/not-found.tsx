"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Home, FolderGit2, Mail, Command } from "lucide-react";
import { GradientMesh } from "@/components/ui/GradientMesh";
import { MagneticButton } from "@/components/ui/MagneticButton";

const SUGGEST = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/projects", label: "Projects", Icon: FolderGit2 },
  { href: "/contact", label: "Contact", Icon: Mail },
];

export default function NotFound() {
  return (
    <section className="relative isolate min-h-screen overflow-hidden flex items-center">
      <GradientMesh variant="cool" className="opacity-50" />
      <div className="container relative pt-32 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 rounded-full border border-ink-900/10 dark:border-white/15 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-500"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-ink-400" />
          Page not found
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 font-display font-extrabold leading-none tracking-[-0.04em] text-balance"
          style={{ fontSize: "clamp(6rem, 22vw, 18rem)" }}
        >
          <span className="text-ink-900 dark:text-white">404</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-6 max-w-md text-base sm:text-lg text-ink-500 dark:text-ink-300"
        >
          The page you&apos;re looking for slipped through a wormhole. Try one of these instead, or summon{" "}
          <kbd className="inline-flex items-center gap-1 rounded-md border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/5 px-1.5 py-0.5 text-[11px] font-mono text-ink-700 dark:text-ink-100">
            <Command size={11} />K
          </kbd>{" "}
          to navigate.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Link href="/">
            <MagneticButton variant="primary" size="md">
              <ArrowLeft size={15} />
              Take me home
            </MagneticButton>
          </Link>
          <Link href="/projects">
            <MagneticButton variant="ghost" size="md">
              See my projects
              <ArrowUpRight size={14} />
            </MagneticButton>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 grid gap-3 sm:grid-cols-3 max-w-xl mx-auto"
        >
          {SUGGEST.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className="group inline-flex items-center justify-between rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] px-4 py-3 text-sm font-medium backdrop-blur-md transition-colors hover:bg-white dark:hover:bg-white/[0.06]"
            >
              <span className="flex items-center gap-2">
                <Icon size={14} className="text-ink-400 group-hover:text-ink-700 dark:group-hover:text-ink-100 transition-colors" />
                {label}
              </span>
              <ArrowUpRight
                size={13}
                className="text-ink-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

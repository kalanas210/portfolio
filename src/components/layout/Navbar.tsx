"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/skills", label: "Skills" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const { scrollY, scrollYProgress } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 8);
    if (latest > 80 && latest > previous) setHidden(true);
    else setHidden(false);
  });

  return (
    <motion.header
        initial={{ y: 0 }}
        animate={{ y: hidden ? -120 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
      >
        <nav
          aria-label="Primary"
          className={cn(
            "relative flex items-center gap-1 rounded-full border border-black/10 dark:border-white/10",
            "bg-white/65 dark:bg-ink-900/65 backdrop-blur-2xl",
            "shadow-[0_10px_40px_-18px_rgba(0,0,0,0.35)]",
            "h-13 px-1.5 sm:pl-2 sm:pr-1.5",
            "transition-all duration-300",
            scrolled && "shadow-[0_14px_50px_-22px_rgba(0,0,0,0.55)] bg-white/80 dark:bg-ink-900/80",
          )}
          style={{ height: 52 }}
        >
          {/* Links */}
          <div
            className="hidden md:flex items-center relative"
            onMouseLeave={() => setHoveredHref(null)}
          >
            {NAV.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              const isHovered = hoveredHref === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onMouseEnter={() => setHoveredHref(item.href)}
                  className={cn(
                    "relative inline-flex h-9 items-center rounded-full px-3.5 text-sm font-medium",
                    "transition-colors duration-200",
                    active
                      ? "text-ink-950 dark:text-white"
                      : "text-ink-500 hover:text-ink-950 dark:text-ink-300 dark:hover:text-white",
                  )}
                >
                  {/* Hover pill — sits behind links, follows cursor */}
                  {isHovered && !active && (
                    <motion.span
                      layoutId="nav-hover"
                      transition={{ type: "spring", stiffness: 380, damping: 32, mass: 0.6 }}
                      className="absolute inset-0 rounded-full bg-black/[0.04] dark:bg-white/[0.06]"
                    />
                  )}
                  {/* Active pill */}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      className="absolute inset-0 rounded-full bg-ink-950 dark:bg-white"
                    />
                  )}
                  <span className={cn("relative", active && "text-white dark:text-ink-950")}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Right cluster */}
          <div className="ml-auto flex items-center gap-1 pl-1">
            {/* ⌘K hint — opens the command palette */}
            <button
              type="button"
              onClick={() =>
                window.dispatchEvent(
                  new KeyboardEvent("keydown", { key: "k", metaKey: true, ctrlKey: true }),
                )
              }
              aria-label="Open command palette"
              title="Open command palette (⌘K / Ctrl+K)"
              className="hidden lg:inline-flex h-9 items-center gap-1.5 rounded-full border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/[0.04] px-2 text-[10px] font-medium text-ink-500 dark:text-ink-300 hover:text-ink-950 dark:hover:text-white transition-colors"
            >
              <span className="font-mono">⌘</span>K
            </button>

            <ThemeToggle />

            {/* Vertical divider */}
            <div
              aria-hidden
              className="hidden sm:block h-6 w-px bg-black/10 dark:bg-white/10 mx-1"
            />

            {/* Inline CTA */}
            <Link
              href="/contact"
              className={cn(
                "inline-flex group items-center gap-1.5 h-9 rounded-full pl-3.5 pr-2 text-xs font-semibold",
                "bg-black text-white dark:bg-white dark:text-ink-950",
                "shadow-[0_8px_20px_-10px_rgba(0,0,0,0.55)]",
                "transition-transform duration-200 hover:-translate-y-0.5",
              )}
            >
              Let&apos;s talk
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20 dark:bg-black/15 transition-transform duration-200 group-hover:rotate-45">
                <ArrowUpRight size={12} />
              </span>
            </Link>
          </div>

          {/* Scroll-progress thread along the bottom edge of the pill */}
          <motion.span
            aria-hidden
            style={{ scaleX: scrollYProgress }}
            className="pointer-events-none absolute inset-x-3 -bottom-px h-[1.5px] origin-left rounded-full bg-gradient-to-r from-brand-violet via-brand-fuchsia to-brand-rose opacity-70"
          />
        </nav>
      </motion.header>
  );
}

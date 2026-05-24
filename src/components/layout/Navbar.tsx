"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/skills", label: "Skills" },
  { href: "/uses", label: "Uses" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const { scrollY, scrollYProgress } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 8);
    if (latest > 80 && latest > previous) setHidden(true);
    else setHidden(false);
  });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
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
          {/* Brand mark */}
          <Link
            href="/"
            aria-label="Home"
            className="group relative inline-flex h-10 items-center gap-2 rounded-full pl-2 pr-3 sm:pr-4"
          >
            <span aria-hidden className="relative flex h-7 w-7 items-center justify-center">
              <span className="absolute inset-0 rounded-[8px] bg-gradient-to-br from-brand-violet via-brand-fuchsia to-brand-rose" />
              <span className="absolute inset-0 rounded-[8px] bg-gradient-to-br from-brand-violet via-brand-fuchsia to-brand-rose blur-md opacity-0 group-hover:opacity-70 transition-opacity duration-300" />
              <motion.span
                aria-hidden
                animate={{ rotate: [0, 0, 8, -4, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative text-xs font-extrabold text-white"
              >
                K
              </motion.span>
            </span>
            <span className="hidden sm:block text-sm font-semibold tracking-tight">Kalana</span>
            <span
              aria-hidden
              className="hidden sm:block h-1 w-1 rounded-full bg-emerald-500 shadow-[0_0_10px_2px_rgba(16,185,129,0.55)]"
              title="Available"
            />
          </Link>

          {/* Vertical divider */}
          <div aria-hidden className="hidden md:block h-6 w-px bg-black/10 dark:bg-white/10 mx-1" />

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
                "hidden sm:inline-flex group items-center gap-1.5 h-9 rounded-full pl-3.5 pr-2 text-xs font-semibold",
                "bg-gradient-to-r from-brand-violet via-brand-fuchsia to-brand-rose text-white",
                "shadow-[0_8px_20px_-10px_rgba(217,70,239,0.55)]",
                "transition-transform duration-200 hover:-translate-y-0.5",
              )}
            >
              Let&apos;s talk
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20 transition-transform duration-200 group-hover:rotate-45">
                <ArrowUpRight size={12} />
              </span>
            </Link>

            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={open}
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={open ? "close" : "open"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {open ? <X size={18} /> : <Menu size={18} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>

          {/* Scroll-progress thread along the bottom edge of the pill */}
          <motion.span
            aria-hidden
            style={{ scaleX: scrollYProgress }}
            className="pointer-events-none absolute inset-x-3 -bottom-px h-[1.5px] origin-left rounded-full bg-gradient-to-r from-brand-violet via-brand-fuchsia to-brand-rose opacity-70"
          />
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 md:hidden bg-white/95 dark:bg-ink-950/95 backdrop-blur-2xl"
          >
            <motion.ul
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
              }}
              className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center"
            >
              {NAV.map((item) => {
                const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <motion.li
                    key={item.href}
                    variants={{
                      hidden: { opacity: 0, y: 18 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                      },
                    }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "font-display text-5xl font-semibold tracking-tight",
                        active ? "text-gradient" : "text-ink-900 dark:text-white",
                      )}
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                );
              })}

              <motion.li
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
                className="mt-6"
              >
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-violet via-brand-fuchsia to-brand-rose px-6 py-3 text-base font-semibold text-white"
                >
                  Let&apos;s talk
                  <ArrowUpRight size={16} />
                </Link>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

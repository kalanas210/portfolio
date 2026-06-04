import Link from "next/link";
import { Mail, ArrowUpRight } from "lucide-react";
import { GithubIcon, LinkedinIcon, FacebookIcon, InstagramIcon } from "@/components/icons/BrandIcons";
import type { SiteSettings } from "@/lib/types";

export function Footer({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-black/10 dark:border-white/10 mt-24">
      <div className="container py-14">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="relative flex h-8 w-8 items-center justify-center">
                <span className="absolute inset-0 rounded-lg bg-ink-900 dark:bg-white" />
                <span className="relative text-sm font-bold text-white dark:text-ink-950">K</span>
              </span>
              <span className="font-display text-xl font-semibold">{settings.name}</span>
            </Link>
            <p className="mt-4 max-w-md text-sm text-ink-400">
              {settings.description}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">Navigate</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About" },
                { href: "/projects", label: "Projects" },
                { href: "/skills", label: "Skills" },
                { href: "/contact", label: "Contact" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="inline-flex items-center gap-1.5 text-ink-700 dark:text-ink-200 hover:text-ink-950 dark:hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">Elsewhere</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                { href: settings.social.github, label: "GitHub", Icon: GithubIcon },
                { href: settings.social.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
                { href: settings.social.facebook, label: "Facebook", Icon: FacebookIcon },
                { href: settings.social.instagram, label: "Instagram", Icon: InstagramIcon },
                { href: `mailto:${settings.email}`, label: "Email", Icon: Mail },
              ].map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2 text-ink-700 dark:text-ink-200 hover:text-ink-950 dark:hover:text-white transition-colors"
                  >
                    <Icon size={14} />
                    {label}
                    <ArrowUpRight
                      size={12}
                      className="opacity-0 -translate-x-1 translate-y-1 transition-all group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-black/10 dark:border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-ink-400">
            © {year} {settings.name}. All rights reserved.
          </p>
          <p className="text-xs text-ink-400">
            Designed &amp; built by{" "}
            <span className="text-ink-700 dark:text-ink-200">{settings.shortName}</span>{" "}
            with care &amp; coffee.
          </p>
        </div>
      </div>
    </footer>
  );
}

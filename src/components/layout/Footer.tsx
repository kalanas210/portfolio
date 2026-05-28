import Link from "next/link";
import { Mail, ArrowUpRight } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon, InstagramIcon } from "@/components/icons/BrandIcons";
import { SITE } from "@/lib/utils";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-black/10 dark:border-white/10 mt-32">
      <div className="container py-14">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="relative flex h-8 w-8 items-center justify-center">
                <span className="absolute inset-0 rounded-lg bg-gradient-to-br from-brand-violet via-brand-fuchsia to-brand-rose" />
                <span className="relative text-sm font-bold text-white">K</span>
              </span>
              <span className="font-display text-xl font-semibold">{SITE.name}</span>
            </Link>
            <p className="mt-4 max-w-md text-sm text-ink-400">
              {SITE.description}
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
                { href: SITE.social.github, label: "GitHub", Icon: GithubIcon },
                { href: SITE.social.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
                { href: SITE.social.twitter, label: "Twitter / X", Icon: TwitterIcon },
                { href: SITE.social.instagram, label: "Instagram", Icon: InstagramIcon },
                { href: `mailto:${SITE.email}`, label: "Email", Icon: Mail },
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
            © {year} {SITE.name}. Crafted in {SITE.location}.
          </p>
          <p className="text-xs text-ink-400">
            Built with{" "}
            <span className="text-ink-700 dark:text-ink-200">Next.js</span>,{" "}
            <span className="text-ink-700 dark:text-ink-200">Framer Motion</span>, and{" "}
            <span className="text-ink-700 dark:text-ink-200">Tailwind CSS</span>.
          </p>
        </div>
      </div>
    </footer>
  );
}

import type { Metadata } from "next";
import { Mail, MapPin, ArrowUpRight } from "lucide-react";
import {
  GithubIcon,
  LinkedinIcon,
  FacebookIcon,
  InstagramIcon,
} from "@/components/icons/BrandIcons";
import { ContactForm } from "@/components/contact/ContactForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { GradientMesh } from "@/components/ui/GradientMesh";
import { getSettings } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Kalana Sandakelum.",
};

export const revalidate = 60;

export default async function ContactPage() {
  const settings = await getSettings();

  const SOCIAL = [
    { Icon: GithubIcon, label: "GitHub", value: "@kalanas210", href: settings.social.github },
    { Icon: LinkedinIcon, label: "LinkedIn", value: "kalanasandakelum", href: settings.social.linkedin },
    { Icon: FacebookIcon, label: "Facebook", value: "Kalana Sandakelum", href: settings.social.facebook },
    { Icon: InstagramIcon, label: "Instagram", value: "@kalana_s5", href: settings.social.instagram },
  ];

  return (
    <>
      <section className="relative isolate overflow-hidden pt-36 pb-12 sm:pt-44 sm:pb-16">
        <GradientMesh variant="cool" className="opacity-40" />
        <div className="container relative">
          <SectionHeading
            index="01"
            eyebrow="Contact"
            title="Let's make something good together."
            description="Internships, freelance work, or just a hello — I read every message and reply within a day."
          />
        </div>
      </section>

      <section className="container pb-32">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr]">
          {/* Info column */}
          <Reveal>
            <div className="space-y-5">
              <a
                href={`mailto:${settings.email}`}
                className="group flex items-center justify-between rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-ink-900 p-5 transition-colors hover:bg-ink-50 dark:hover:bg-ink-800"
              >
                <div className="flex items-center gap-4">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-ink-900/10 text-ink-700 dark:border-white/10 dark:text-ink-200">
                    <Mail size={18} />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.14em] text-ink-400">Email</div>
                    <div className="mt-0.5 font-medium">{settings.email}</div>
                  </div>
                </div>
                <ArrowUpRight
                  size={16}
                  className="text-ink-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>

              {/* Location card */}
              <div className="relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-ink-900 p-5">
                <div className="relative flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-ink-900/10 text-ink-700 dark:border-white/10 dark:text-ink-200">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-[0.14em] text-ink-400">Based in</div>
                      <div className="mt-0.5 font-medium">
                        {settings.location} <span>🇱🇰</span>
                      </div>
                    </div>
                  </div>
                  <Badge>UTC+5:30</Badge>
                </div>
                {/* Decorative dots map */}
                <div
                  aria-hidden
                  className="relative mt-6 h-28 w-full overflow-hidden rounded-xl border border-black/10 dark:border-white/10"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 1px 1px, rgba(120,120,120,0.45) 1px, transparent 0)",
                    backgroundSize: "10px 10px",
                  }}
                >
                  <div className="absolute left-[34%] top-[58%]">
                    <span className="relative flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-emerald-400" />
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-ink-900" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Social grid */}
              <div className="grid grid-cols-2 gap-3">
                {SOCIAL.map(({ Icon, label, value, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-ink-900 p-4 transition-colors hover:bg-ink-50 dark:hover:bg-ink-800"
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={16} className="text-ink-500 dark:text-ink-300" />
                      <div className="min-w-0">
                        <div className="text-[10px] uppercase tracking-[0.14em] text-ink-400">
                          {label}
                        </div>
                        <div className="truncate text-sm font-medium">{value}</div>
                      </div>
                    </div>
                    <ArrowUpRight
                      size={14}
                      className="text-ink-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.05}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}

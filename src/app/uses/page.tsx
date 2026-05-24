import type { Metadata } from "next";
import { ArrowUpRight, Laptop, Terminal, Headphones, Coffee, Keyboard, Smartphone, Code2, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GradientMesh } from "@/components/ui/GradientMesh";
import { RevealStagger, RevealItem, Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Uses",
  description: "The gear, software, and rituals that power my work — inspired by uses.tech.",
};

interface Item {
  name: string;
  detail?: string;
  href?: string;
}

interface Group {
  title: string;
  blurb: string;
  Icon: LucideIcon;
  accent: string;
  items: Item[];
}

const GROUPS: Group[] = [
  {
    title: "Hardware",
    blurb: "The machines I write on.",
    Icon: Laptop,
    accent: "from-brand-violet to-brand-fuchsia",
    items: [
      { name: "MacBook Air (M2, 16GB)", detail: "Daily driver. Fast, silent, lasts a full lecture." },
      { name: "27\" QHD monitor", detail: "Vertical when I'm reading, horizontal otherwise." },
      { name: "Logitech MX Master 3S", detail: "The forever mouse." },
      { name: "Keychron K3 Pro", detail: "Low-profile, brown switches, USB-C." },
      { name: "iPhone 13", detail: "For testing and tethering when wifi acts up." },
    ],
  },
  {
    title: "Editor & Terminal",
    blurb: "Where most of the work happens.",
    Icon: Terminal,
    accent: "from-brand-cyan to-brand-violet",
    items: [
      { name: "VS Code", detail: "Vesper theme, Geist Mono, Inlay hints on." },
      { name: "Warp", detail: "Modern terminal with command blocks." },
      { name: "Zed", detail: "When I want raw speed and quiet." },
      { name: "Cursor", detail: "For AI-assisted refactors." },
      { name: "GitHub Copilot", detail: "Tab tab tab." },
    ],
  },
  {
    title: "Design & Productivity",
    blurb: "From sketch to shipped.",
    Icon: Keyboard,
    accent: "from-brand-emerald to-brand-cyan",
    items: [
      { name: "Figma", detail: "Auto-layout everything." },
      { name: "Linear", detail: "Issues, sprints, side projects." },
      { name: "Notion", detail: "Notes, reading log, second brain." },
      { name: "Raycast", detail: "Quicker than Spotlight, scripts, snippets." },
      { name: "Arc", detail: "Spaces per project. Easels for moodboards." },
    ],
  },
  {
    title: "Code & Dev",
    blurb: "Things I reach for week-in week-out.",
    Icon: Code2,
    accent: "from-brand-amber to-brand-rose",
    items: [
      { name: "Next.js 16 + TypeScript", detail: "Default stack." },
      { name: "Tailwind CSS", detail: "Design tokens via CSS variables." },
      { name: "Framer Motion", detail: "Every micro-interaction." },
      { name: "Spring Boot + PostgreSQL", detail: "For everything backend-y." },
      { name: "Docker + GitHub Actions", detail: "Reproducible builds." },
    ],
  },
  {
    title: "Sound",
    blurb: "What's in my ears.",
    Icon: Headphones,
    accent: "from-brand-rose to-brand-fuchsia",
    items: [
      { name: "Sony WH-1000XM4", detail: "ANC for noisy lecture halls." },
      { name: "Endel", detail: "Focus soundscapes." },
      { name: "Spotify · Lofi Beats", detail: "Daily companion." },
      { name: "Tycho · Awake", detail: "Deep focus album of choice." },
    ],
  },
  {
    title: "Other rituals",
    blurb: "Small things that make work feel good.",
    Icon: Coffee,
    accent: "from-brand-violet to-brand-cyan",
    items: [
      { name: "Ceylon black tea, no sugar", detail: "Morning fuel." },
      { name: "Pomodoro, but loose", detail: "45/15, not 25/5." },
      { name: "Daily walk", detail: "Best ideas arrive somewhere around km 2." },
      { name: "Weekly review", detail: "Sundays, a coffee, a plan." },
    ],
  },
];

export default function UsesPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden pt-36 pb-12 sm:pt-44 sm:pb-16">
        <GradientMesh variant="warm" className="opacity-40" />
        <div className="container relative">
          <SectionHeading
            eyebrow="Uses"
            title="The kit behind the work."
            description="Hardware, editors, design tools, and small rituals. Inspired by uses.tech — this is what I'm actually using right now."
          />
          <Reveal delay={0.15}>
            <a
              href="https://uses.tech"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-1.5 text-xs text-ink-400 hover:text-ink-700 dark:hover:text-ink-100 transition-colors"
            >
              uses.tech directory
              <ArrowUpRight size={12} />
            </a>
          </Reveal>
        </div>
      </section>

      <section className="container pb-32">
        <RevealStagger className="grid gap-5 md:grid-cols-2" amount={0.1}>
          {GROUPS.map((g) => (
            <RevealItem key={g.title}>
              <div className="group relative h-full overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-ink-900 p-6">
                <div
                  aria-hidden
                  className={`absolute -top-16 -right-16 h-48 w-48 rounded-full blur-3xl opacity-25 transition-opacity duration-500 group-hover:opacity-50 bg-gradient-to-br ${g.accent}`}
                />
                <div className="relative flex items-start justify-between">
                  <div>
                    <h3 className="font-display text-xl font-semibold tracking-tight">
                      {g.title}
                    </h3>
                    <p className="mt-1 text-sm text-ink-400">{g.blurb}</p>
                  </div>
                  <div
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white shrink-0 ${g.accent}`}
                  >
                    <g.Icon size={18} />
                  </div>
                </div>

                <ul className="relative mt-5 space-y-2.5">
                  {g.items.map((it) => (
                    <li
                      key={it.name}
                      className="flex flex-col gap-0.5 border-l border-black/10 dark:border-white/10 pl-3"
                    >
                      <span className="text-sm font-medium text-ink-800 dark:text-ink-100">
                        {it.name}
                      </span>
                      {it.detail && (
                        <span className="text-xs text-ink-400 leading-relaxed">{it.detail}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>
      </section>
    </>
  );
}

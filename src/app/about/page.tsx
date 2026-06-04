import type { Metadata } from "next";
import Link from "next/link";
import { Download, MapPin } from "lucide-react";
import { Portrait } from "@/components/about/Portrait";
import { Timeline } from "@/components/about/Timeline";
import { SkillsBento } from "@/components/about/SkillsBento";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealStagger, RevealItem } from "@/components/ui/Reveal";
import { GradientText } from "@/components/ui/GradientText";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Parallax } from "@/components/ui/Parallax";
import { hobbies } from "@/lib/data";
import { SITE as SITE_INFO } from "@/lib/utils";
import { getSettings } from "@/lib/queries";

export const metadata: Metadata = {
  title: "About",
  description: `About ${SITE_INFO.name} — undergraduate software engineer at the University of Moratuwa.`,
};

export const revalidate = 60;

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <>
      {/* Hero / intro */}
      <section className="relative isolate pt-36 pb-20 sm:pt-44 sm:pb-28">
        <div className="noise pointer-events-none absolute inset-0" aria-hidden />
        <div className="container relative grid items-center gap-14 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <div className="flex justify-center lg:justify-start">
              <Parallax offset={28}>
                <Portrait />
              </Parallax>
            </div>
          </Reveal>
          <div>
            <Reveal>
              <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-400">
                <span className="tabular-nums text-ink-900 dark:text-white">(01)</span>
                <span>About</span>
                <span className="h-px w-8 bg-ink-300 dark:bg-ink-700" />
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={11} />
                  {settings.location}
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-5 font-display text-fluid-h1 font-semibold leading-[1.04] tracking-tight text-balance">
                Curious by default. <GradientText>Craft-obsessed</GradientText> by choice.
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-7 space-y-4 text-base sm:text-lg leading-relaxed text-ink-500 dark:text-ink-300">
                <p>
                  I&apos;m Kalana — a third-year IT undergraduate at the{" "}
                  <span className="font-medium text-ink-700 dark:text-ink-100">
                    University of Moratuwa
                  </span>
                  , and I build software that feels considered down to the last pixel.
                </p>
                <p>
                  My favourite work lives at the seam of{" "}
                  <GradientText className="font-medium">engineering</GradientText>,{" "}
                  <GradientText variant="cool" className="font-medium">
                    motion
                  </GradientText>
                  , and{" "}
                  <GradientText variant="fire" className="font-medium">
                    interaction design
                  </GradientText>
                  . I care about render budgets and rounded corners in equal measure.
                </p>
                <p>
                  Outside of class I maintain a few open-source libraries, write short technical
                  essays, and prototype anything that looks like it would feel good in the hand.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a href={settings.cvUrl ?? "/cv.pdf"} download>
                  <MagneticButton variant="primary" size="md">
                    <Download size={16} />
                    Download CV
                  </MagneticButton>
                </a>
                <Link href="/contact">
                  <MagneticButton variant="ghost" size="md">
                    Get in touch
                  </MagneticButton>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="container py-20 sm:py-28">
        <SectionHeading
          index="02"
          eyebrow="Path so far"
          title="Education & experience"
          description="A condensed version. The longer story over a coffee."
        />
        <div className="mt-12">
          <Timeline />
        </div>
      </section>

      {/* Skills */}
      <section className="container py-20 sm:py-28">
        <SectionHeading
          index="03"
          eyebrow="Toolkit"
          title="What I'm fluent in"
          description="Tools I reach for, grouped by where they live in the stack."
        />
        <div className="mt-12">
          <SkillsBento />
        </div>
      </section>

      {/* Hobbies */}
      <section className="container py-20 sm:py-28">
        <SectionHeading
          index="04"
          eyebrow="Outside the editor"
          title="Things I make time for"
        />
        <RevealStagger className="mt-10 grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {hobbies.map((h) => {
            const Icon = h.icon;
            return (
              <RevealItem key={h.name}>
                <div className="group flex h-full flex-col items-start gap-3 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-ink-900 p-5 transition-colors hover:bg-ink-50 dark:hover:bg-ink-800">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-ink-900/10 text-ink-700 transition-colors group-hover:border-ink-900/25 dark:border-white/10 dark:text-ink-200 dark:group-hover:border-white/25">
                    <Icon size={18} strokeWidth={1.75} />
                  </div>
                  <div className="text-sm font-medium">{h.name}</div>
                </div>
              </RevealItem>
            );
          })}
        </RevealStagger>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Download, MapPin, ArrowUpRight, Trophy, Award } from "lucide-react";
import { Portrait } from "@/components/about/Portrait";
import { Timeline } from "@/components/about/Timeline";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealStagger, RevealItem } from "@/components/ui/Reveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { TiltCard } from "@/components/ui/TiltCard";
import { GradientText } from "@/components/ui/GradientText";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Parallax } from "@/components/ui/Parallax";
import { topSkills } from "@/lib/data";
import { SITE as SITE_INFO } from "@/lib/utils";
import { getSettings } from "@/lib/queries";

export const metadata: Metadata = {
  title: "About - Full-Stack & Java Developer",
  description:
    "Meet Kalana Sandakelum - a full-stack & Java (Spring Boot) developer and University of Moratuwa undergraduate in Sri Lanka. Background, skills, and the work I love.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Kalana Sandakelum",
    description:
      "Full-stack & Java (Spring Boot) developer and University of Moratuwa undergraduate in Sri Lanka.",
    url: `${SITE_INFO.url}/about`,
  },
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
                  I&apos;m Kalana - an Information Technology &amp; Management undergraduate at the{" "}
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
                <a href={settings.cvUrl ?? "/cv.pdf"} download data-track="cv">
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

      {/* Skills summary — full, levelled breakdown lives on /skills */}
      <section className="container py-20 sm:py-28">
        <SectionHeading
          index="03"
          eyebrow="Toolkit"
          title="What I'm fluent in"
          description="My day-to-day stack at a glance. The full, levelled breakdown lives on the skills page."
        />
        <Reveal>
          <div className="mt-10 flex flex-wrap gap-2.5">
            {topSkills.map((s) => (
              <span
                key={s}
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-ink-700 dark:border-white/10 dark:bg-ink-900 dark:text-ink-100"
              >
                {s}
              </span>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-8">
            <Link href="/skills">
              <MagneticButton variant="ghost" size="md">
                Explore the full toolkit
                <ArrowUpRight size={16} />
              </MagneticButton>
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Beyond code — leadership, achievements, and life off-screen */}
      <section className="container py-20 sm:py-28">
        <SectionHeading
          index="04"
          eyebrow="Beyond code"
          title="The person behind the commits"
          description="Leadership, a little competition, and the things that keep me curious off-screen."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {/* Achievements */}
          <RevealStagger className="sm:col-span-2 lg:col-span-6 grid gap-4 lg:grid-cols-2" amount={0.2}>
            {/* Achievement 1 */}
            <RevealItem>
              <TiltCard tilt={2} radiusClassName="rounded-[2rem]">
                <SpotlightCard className="relative h-full overflow-hidden rounded-[2rem] border border-black/10 bg-white p-8 dark:border-white/10 dark:bg-ink-900">
                  <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-cyan/10 blur-3xl" />
                  <div className="relative flex flex-col gap-6">
                    <div className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-brand-cyan/30 bg-brand-cyan/5 text-brand-cyan shadow-inner">
                      <Award size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="font-display text-lg sm:text-xl font-semibold tracking-tight text-ink-900 dark:text-white">
                        Idealize 2025 - Web Development{" "}
                        <span className="text-ink-400 font-medium block sm:inline mt-1 sm:mt-0">· 2025</span>
                      </h3>
                      <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-ink-500 dark:text-ink-300">
                        Selected to idealize the 2025 web development competition organized by the AIESEC club at the University of Moratuwa.
                      </p>
                    </div>
                  </div>
                </SpotlightCard>
              </TiltCard>
            </RevealItem>

            {/* Achievement 2 */}
            <RevealItem>
              <TiltCard tilt={2} radiusClassName="rounded-[2rem]">
                <SpotlightCard className="relative h-full overflow-hidden rounded-[2rem] border border-black/10 bg-white p-8 dark:border-white/10 dark:bg-ink-900">
                  <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-amber/10 blur-3xl" />
                  <div className="relative flex flex-col gap-6">
                    <div className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-brand-amber/30 bg-brand-amber/5 text-brand-amber shadow-inner">
                      <Trophy size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="font-display text-lg sm:text-xl font-semibold tracking-tight text-ink-900 dark:text-white">
                        1st place - Business Studies{" "}
                        <span className="text-ink-400 font-medium block sm:inline mt-1 sm:mt-0">· 2018</span>
                      </h3>
                      <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-ink-500 dark:text-ink-300">
                        Took first place in the Southern Province business module — an early lesson in pitching
                        ideas, leading a team, and seeing a project through from concept to execution.
                      </p>
                    </div>
                  </div>
                </SpotlightCard>
              </TiltCard>
            </RevealItem>
          </RevealStagger>
        </div>
      </section>
    </>
  );
}

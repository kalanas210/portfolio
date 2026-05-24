import type { Metadata } from "next";
import Link from "next/link";
import { Download, MapPin } from "lucide-react";
import { Portrait } from "@/components/about/Portrait";
import { Timeline } from "@/components/about/Timeline";
import { SkillsBento } from "@/components/about/SkillsBento";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealStagger, RevealItem } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { GradientText } from "@/components/ui/GradientText";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { GradientMesh } from "@/components/ui/GradientMesh";
import { hobbies } from "@/lib/data";
import { SITE as SITE_INFO } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description: `About ${SITE_INFO.name} — undergraduate software engineer at the University of Moratuwa.`,
};

export default function AboutPage() {
  return (
    <>
      {/* Hero / intro */}
      <section className="relative isolate overflow-hidden pt-36 pb-20 sm:pt-44 sm:pb-28">
        <GradientMesh className="opacity-50" />
        <div className="container relative grid items-center gap-14 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <div className="flex justify-center lg:justify-start">
              <Portrait />
            </div>
          </Reveal>
          <div>
            <Reveal>
              <div className="flex items-center gap-3">
                <Badge>About me</Badge>
                <Badge>
                  <MapPin size={11} />
                  {SITE_INFO.location}
                </Badge>
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
                <a href="/cv.pdf" download>
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
          eyebrow="Outside the editor"
          title="Things I make time for"
        />
        <RevealStagger className="mt-10 grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {hobbies.map((h) => {
            const Icon = h.icon;
            return (
              <RevealItem key={h.name}>
                <div className="group flex h-full flex-col items-start gap-3 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-ink-900 p-5 transition-colors hover:bg-ink-50 dark:hover:bg-ink-800">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-violet/20 to-brand-fuchsia/20 text-brand-violet dark:text-brand-fuchsia">
                    <Icon size={18} />
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

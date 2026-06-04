import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SkillsBento } from "@/components/about/SkillsBento";
import { GradientMesh } from "@/components/ui/GradientMesh";
import { CircularSkill } from "@/components/skills/CircularSkill";
import { RevealStagger, RevealItem } from "@/components/ui/Reveal";

const CORE = [
  { name: "TypeScript", level: 92, from: "#8b5cf6", to: "#d946ef" },
  { name: "React / Next.js", level: 94, from: "#22d3ee", to: "#8b5cf6" },
  { name: "Node.js", level: 90, from: "#34d399", to: "#22d3ee" },
  { name: "Python", level: 88, from: "#fbbf24", to: "#fb7185" },
  { name: "Spring Boot", level: 82, from: "#34d399", to: "#22d3ee" },
  { name: "PostgreSQL", level: 88, from: "#fbbf24", to: "#fb7185" },
  { name: "Docker", level: 82, from: "#22d3ee", to: "#8b5cf6" },
  { name: "Framer Motion", level: 86, from: "#d946ef", to: "#fb7185" },
];

export const metadata: Metadata = {
  title: "Skills",
  description: "Skills, tooling, and tech stack across the full software lifecycle.",
};

export default function SkillsPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden pt-36 pb-12 sm:pt-44 sm:pb-16">
        <GradientMesh variant="warm" className="opacity-50" />
        <div className="container relative">
          <SectionHeading
            index="01"
            eyebrow="Skills"
            title="A toolkit shaped by every project I've built."
            description="From low-level systems work to motion-rich frontends — what I use and how confidently I use it."
          />
        </div>
      </section>

      {/* Circular core skills */}
      <section className="container py-12 sm:py-16">
        <RevealStagger className="grid grid-cols-2 gap-8 sm:grid-cols-4 md:gap-10">
          {CORE.map((s, i) => (
            <RevealItem key={s.name}>
              <CircularSkill
                name={s.name}
                level={s.level}
                gradientId={`grad-${i}`}
                gradient={{ from: s.from, to: s.to }}
              />
            </RevealItem>
          ))}
        </RevealStagger>
      </section>

      {/* Detailed bento */}
      <section className="container py-16 sm:py-24">
        <SectionHeading
          index="02"
          eyebrow="By category"
          title="The whole stack, organised."
        />
        <div className="mt-12">
          <SkillsBento />
        </div>
      </section>
    </>
  );
}

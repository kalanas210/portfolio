import type { Metadata } from "next";
import { ProjectsGrid } from "@/components/projects/ProjectsGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GradientMesh } from "@/components/ui/GradientMesh";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "A curated selection of web, mobile, AI, and open-source projects by Kalana Sandakelum.",
};

export default function ProjectsPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden pt-36 pb-12 sm:pt-44 sm:pb-16">
        <GradientMesh variant="cool" className="opacity-40" />
        <div className="container relative">
          <SectionHeading
            eyebrow="Projects"
            title="Things I've built — shipped, scrapped, and in progress."
            description="Filter by category. Each card links to a live demo or the source on GitHub."
          />
        </div>
      </section>
      <section className="container pb-32">
        <ProjectsGrid />
      </section>
    </>
  );
}

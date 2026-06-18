import type { Metadata } from "next";
import { ProjectsGrid } from "@/components/projects/ProjectsGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GradientMesh } from "@/components/ui/GradientMesh";
import { getProjects } from "@/lib/queries";
import { SITE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Web, Java & Full-Stack Projects",
  description:
    "Explore web, mobile, AI, and open-source projects by Kalana Sandakelum - a full-stack & Java (Spring Boot) developer in Sri Lanka. Live demos and source on GitHub.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects by Kalana Sandakelum",
    description:
      "Web, mobile, AI, and open-source projects - with live demos and source on GitHub.",
    url: `${SITE.url}/projects`,
  },
};

export const revalidate = 60;

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <>
      <section className="relative isolate overflow-hidden pt-36 pb-12 sm:pt-44 sm:pb-16">
        <GradientMesh variant="cool" className="opacity-40" />
        <div className="container relative">
          <SectionHeading
            as="h1"
            index="01"
            eyebrow="Projects"
            title="Things I've built - shipped, scrapped, and in progress."
            description="Filter by category. Each card links to a live demo or the source on GitHub."
          />
        </div>
      </section>
      <section className="container pb-32">
        <ProjectsGrid projects={projects} />
      </section>
    </>
  );
}

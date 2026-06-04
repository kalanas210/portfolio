import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ExternalLink, Calendar } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";
import { GradientMesh } from "@/components/ui/GradientMesh";
import { getProjectBySlug, getProjects } from "@/lib/queries";

export const revalidate = 60;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.thumbnailUrl ? [project.thumbnailUrl] : undefined,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const images = project.gallery.filter((g) => g.type === "image");
  const videos = project.gallery.filter((g) => g.type === "video");

  const links = [
    project.liveUrl && { href: project.liveUrl, label: "Live demo", Icon: ExternalLink },
    project.githubUrl && { href: project.githubUrl, label: "Source", Icon: GithubIcon },
    project.linkedinUrl && { href: project.linkedinUrl, label: "LinkedIn", Icon: LinkedinIcon },
  ].filter(Boolean) as { href: string; label: string; Icon: typeof ExternalLink }[];

  return (
    <article className="relative isolate overflow-hidden pb-32 pt-32 sm:pt-40">
      <GradientMesh variant="cool" className="opacity-30" />

      <div className="container relative">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition-colors hover:text-ink-950 dark:hover:text-white"
        >
          <ArrowLeft size={15} />
          All projects
        </Link>

        {/* Header */}
        <header className="mt-8 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-ink-400">
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={12} />
              {project.year}
            </span>
            <span aria-hidden>·</span>
            <span>{project.categories.join(" · ")}</span>
            {project.featured && (
              <span className="rounded-full bg-gradient-to-r from-brand-violet to-brand-fuchsia px-2 py-0.5 text-[10px] text-white">
                Featured
              </span>
            )}
          </div>

          <h1 className="mt-4 font-display text-fluid-h1 font-semibold leading-[1.04] tracking-tight text-balance">
            {project.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-500 dark:text-ink-300">
            {project.description}
          </p>

          {links.length > 0 && (
            <div className="mt-7 flex flex-wrap items-center gap-3">
              {links.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="open"
                  className="group inline-flex items-center gap-2 rounded-full border border-black/15 bg-white/70 px-4 py-2 text-sm font-medium backdrop-blur-md transition-colors hover:bg-white dark:border-white/20 dark:bg-white/5 dark:hover:bg-white/10"
                >
                  <Icon size={15} />
                  {label}
                  <ArrowUpRight
                    size={13}
                    className="text-ink-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              ))}
            </div>
          )}
        </header>

        {/* Hero image */}
        {project.thumbnailUrl && (
          <div className="relative mt-12 aspect-[16/9] w-full overflow-hidden rounded-3xl border border-black/10 dark:border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.thumbnailUrl}
              alt={project.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {/* Body + tech */}
        <div className="mt-12 grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-5 text-base leading-relaxed text-ink-600 dark:text-ink-200">
            {project.longDescription.split("\n").map((para, i) =>
              para.trim() ? <p key={i}>{para}</p> : null,
            )}
          </div>

          <aside className="h-fit rounded-3xl border border-black/10 bg-white/60 p-6 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.03]">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">
              Built with
            </h2>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center rounded-full border border-black/10 px-2.5 py-0.5 text-[11px] font-medium text-ink-600 dark:border-white/10 dark:text-ink-300"
                >
                  {t}
                </span>
              ))}
            </div>
          </aside>
        </div>

        {/* Gallery — images */}
        {images.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl font-semibold tracking-tight">Gallery</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {images.map((item, i) => (
                <figure
                  key={i}
                  className="overflow-hidden rounded-2xl border border-black/10 dark:border-white/10"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt={item.caption ?? `${project.title} screenshot ${i + 1}`}
                    className="aspect-[16/10] w-full object-cover"
                    loading="lazy"
                  />
                  {item.caption && (
                    <figcaption className="px-4 py-3 text-xs text-ink-400">
                      {item.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* Gallery — videos */}
        {videos.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl font-semibold tracking-tight">Video</h2>
            <div className="mt-6 grid gap-5">
              {videos.map((item, i) => (
                <figure
                  key={i}
                  className="overflow-hidden rounded-2xl border border-black/10 dark:border-white/10"
                >
                  <video
                    src={item.url}
                    controls
                    playsInline
                    preload="metadata"
                    className="aspect-video w-full bg-black"
                  />
                  {item.caption && (
                    <figcaption className="px-4 py-3 text-xs text-ink-400">
                      {item.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* Footer CTA */}
        <div className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-black/10 pt-8 dark:border-white/10 sm:flex-row sm:items-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition-colors hover:text-ink-950 dark:hover:text-white"
          >
            <ArrowLeft size={15} />
            Back to all projects
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-ink-950"
          >
            Start a project together
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}

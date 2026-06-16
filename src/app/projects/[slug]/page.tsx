import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ExternalLink, Calendar, Sparkles } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";
import { GradientMesh } from "@/components/ui/GradientMesh";
import { ArticleBody } from "@/components/article/ArticleBody";
import { ShareRow } from "@/components/article/ShareRow";
import { ProjectMiniCard } from "@/components/projects/ProjectMiniCard";
import { getProjectBySlug, getProjects } from "@/lib/queries";
import { breadcrumbLd } from "@/lib/seo/breadcrumbs";

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

  const more = (await getProjects()).filter((p) => p.slug !== project.slug).slice(0, 3);

  const crumbLd = breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: project.title, path: `/projects/${project.slug}` },
  ]);

  return (
    <article className="relative isolate overflow-hidden pb-20 pt-28 sm:pt-32">
      <GradientMesh className="opacity-60" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }}
      />

      <div className="container relative">
        {/* Top bar */}
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition-colors hover:text-ink-950 dark:hover:text-white"
          >
            <ArrowLeft size={15} />
            All projects
          </Link>
          <ShareRow title={project.title} />
        </div>

        {/* Header */}
        <header className="mx-auto mt-8 max-w-3xl">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-400">
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={12} />
              {project.year}
            </span>
            <span aria-hidden className="h-px w-6 bg-ink-300 dark:bg-ink-700" />
            <span>{project.categories.join(" · ")}</span>
            {project.featured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] tracking-widest text-accent-700 dark:text-accent-300">
                <Sparkles size={10} />
                Featured
              </span>
            )}
          </div>

          <h1 className="mt-5 font-display text-fluid-h1 font-semibold leading-[1.05] tracking-tight text-balance">
            {project.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-500 dark:text-ink-300 sm:text-xl">
            {project.description}
          </p>

          {links.length > 0 && (
            <div className="mt-7 flex flex-wrap items-center gap-3">
              {links.map(({ href, label, Icon }, i) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="open"
                  className={
                    i === 0
                      ? "group inline-flex items-center gap-2 rounded-full bg-ink-950 px-4 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-ink-950"
                      : "group inline-flex items-center gap-2 rounded-full border border-black/15 bg-white/70 px-4 py-2 text-sm font-medium backdrop-blur-md transition-colors hover:bg-white dark:border-white/20 dark:bg-white/5 dark:hover:bg-white/10"
                  }
                >
                  <Icon size={15} />
                  {label}
                  <ArrowUpRight
                    size={13}
                    className="opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              ))}
            </div>
          )}
        </header>

        {/* Cover — constrained & refined (no longer full-bleed) */}
        {project.thumbnailUrl && (
          <figure className="mx-auto mt-12 max-w-4xl">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-black/10 shadow-[0_30px_80px_-45px_rgba(0,0,0,0.55)] ring-1 ring-black/5 dark:border-white/10 dark:ring-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.thumbnailUrl}
                alt={project.title}
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
            </div>
          </figure>
        )}

        {/* Body */}
        <div className="mx-auto mt-14 max-w-3xl">
          <ArticleBody text={project.longDescription} />

          {project.tech.length > 0 && (
            <div className="mt-12 rounded-2xl border border-black/10 bg-white/60 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.03]">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-400">
                Built with
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-ink-600 dark:border-white/10 dark:text-ink-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Gallery — images */}
        {images.length > 0 && (
          <section className="mx-auto mt-16 max-w-4xl">
            <h2 className="font-display text-xl font-semibold tracking-tight">Gallery</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {images.map((item, i) => (
                <figure key={i} className="group">
                  <div className="overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.url}
                      alt={item.caption ?? `${project.title} screenshot ${i + 1}`}
                      className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      loading="lazy"
                    />
                  </div>
                  {item.caption && <figcaption className="fig-caption">{item.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* Gallery — videos */}
        {videos.length > 0 && (
          <section className="mx-auto mt-12 max-w-4xl">
            <h2 className="font-display text-xl font-semibold tracking-tight">Video</h2>
            <div className="mt-6 grid gap-5">
              {videos.map((item, i) => (
                <figure key={i} className="overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
                  <video
                    src={item.url}
                    controls
                    playsInline
                    preload="metadata"
                    className="aspect-video w-full bg-black"
                  />
                  {item.caption && <figcaption className="fig-caption">{item.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* More work */}
        {more.length > 0 && (
          <section className="mx-auto mt-24 max-w-5xl">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-display text-2xl font-semibold tracking-tight">More work</h2>
              <Link
                href="/projects"
                className="inline-flex items-center gap-1 text-sm font-medium text-ink-500 transition-colors hover:text-ink-950 dark:hover:text-white"
              >
                All projects
                <ArrowUpRight size={14} />
              </Link>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((p) => (
                <ProjectMiniCard key={p.id} project={p} />
              ))}
            </div>
          </section>
        )}

        {/* Footer CTA */}
        <div className="mx-auto mt-20 flex max-w-3xl flex-col items-start justify-between gap-4 border-t border-black/10 pt-8 dark:border-white/10 sm:flex-row sm:items-center">
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

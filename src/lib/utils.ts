import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Estimated read time for a Markdown body (≈200 wpm, min 1 minute). */
export function readingMinutes(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Format an ISO timestamp as "June 6, 2026" (fixed locale to avoid hydration drift). */
export function formatDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

/**
 * Social crawlers (WhatsApp, X, LinkedIn, Facebook) do not render SVG og:images.
 * Our generated blog/tool covers are SVG, so for link previews we point at the
 * JPG twin sitting next to them (/images/.../slug.svg -> /images/.../slug.jpg).
 * Returns an absolute URL (JSON-LD and some crawlers require it). Covers that are
 * not local SVGs (external storage URLs, etc.) are returned unchanged.
 */
export function ogImageUrl(coverUrl: string | null | undefined): string | undefined {
  if (!coverUrl) return undefined;
  let url = coverUrl;
  if (url.startsWith("/images/") && url.endsWith(".svg")) url = url.replace(/\.svg$/, ".jpg");
  return url.startsWith("/") ? `${SITE.url}${url}` : url;
}

/**
 * Serialize structured data for an inline <script type="application/ld+json">.
 * Escapes `<` to its unicode form so any content containing "</script>" (e.g.
 * an admin-authored title/description) can't break out of the script element.
 * Always use this instead of bare JSON.stringify with dangerouslySetInnerHTML.
 */
export function jsonLdHtml(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export const SITE = {
  name: "Kalana Sandakelum",
  shortName: "Kalana",
  role: "Full Stack Developer",
  university: "University of Moratuwa",
  location: "Moratuwa, Sri Lanka",
  email: "kalanasandakelum210@gmail.com",
  // Canonical/OG/sitemap base. Override per-deploy (e.g. previews) with
  // NEXT_PUBLIC_SITE_URL; falls back to the production domain.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.kalanalk.com",
  description:
    "Kalana Sandakelum - full-stack & Java (Spring Boot) developer and University of Moratuwa undergraduate in Sri Lanka, building fast, modern web applications.",
  social: {
    github: "https://github.com/kalanas210",
    linkedin: "https://www.linkedin.com/in/kalanasandakelum",
    facebook: "https://www.facebook.com/profile.php?id=61559175435939",
    instagram: "https://www.instagram.com/kalana_s5",
  },
} as const;

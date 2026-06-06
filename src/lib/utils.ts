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

export const SITE = {
  name: "Kalana Sandakelum",
  shortName: "Kalana",
  role: "Full Stack Developer",
  university: "University of Moratuwa",
  location: "Moratuwa, Sri Lanka",
  email: "kalanasandakelum210@gmail.com",
  url: "https://kalanalk.com",
  description:
    "Kalana Sandakelum — full-stack & Java (Spring Boot) developer and University of Moratuwa undergraduate in Sri Lanka, building fast, modern web applications.",
  social: {
    github: "https://github.com/kalanas210",
    linkedin: "https://www.linkedin.com/in/kalanasandakelum",
    facebook: "https://www.facebook.com/profile.php?id=61559175435939",
    instagram: "https://www.instagram.com/kalana_s5",
  },
} as const;

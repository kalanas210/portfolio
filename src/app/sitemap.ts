import type { MetadataRoute } from "next";
import { SITE } from "@/lib/utils";
import { getProjects } from "@/lib/queries";

// Generated at /sitemap.xml — lists every public URL so Google can discover
// and index them. Submit this URL in Google Search Console.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;
  const now = new Date();

  const routes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/projects`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/skills`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  try {
    const projects = await getProjects();
    for (const p of projects) {
      routes.push({
        url: `${base}/projects/${p.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  } catch {
    // Supabase unreachable — the static routes above still ship.
  }

  return routes;
}

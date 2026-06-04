import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from "@/lib/supabase/config";
import { SITE } from "@/lib/utils";
import { seedProjects, seedTestimonials } from "@/lib/data";
import type {
  Project,
  Testimonial,
  SiteSettings,
  GalleryItem,
  ProjectCategory,
} from "@/lib/types";

/* eslint-disable @typescript-eslint/no-explicit-any */

/** Settings shown before Supabase is configured (or if a fetch fails). */
export const defaultSettings: SiteSettings = {
  name: SITE.name,
  shortName: SITE.shortName,
  role: SITE.role,
  university: SITE.university,
  location: SITE.location,
  email: SITE.email,
  url: SITE.url,
  description: SITE.description,
  social: {
    github: SITE.social.github,
    linkedin: SITE.social.linkedin,
    facebook: SITE.social.facebook,
    instagram: SITE.social.instagram,
  },
  heroBackUrl: null,
  heroFrontUrl: null,
  heroMobileUrl: null,
  cvUrl: null,
};

// ── Row → app-type mappers (shared with the admin) ──────────────────────────
export function mapProjectRow(r: any): Project {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    description: r.description ?? "",
    longDescription: r.long_description ?? "",
    categories: (r.categories ?? []) as ProjectCategory[],
    tech: r.tech ?? [],
    year: r.year ?? new Date().getFullYear(),
    featured: Boolean(r.featured),
    published: Boolean(r.published),
    thumbnailUrl: r.thumbnail_url ?? null,
    gallery: Array.isArray(r.gallery) ? (r.gallery as GalleryItem[]) : [],
    liveUrl: r.live_url ?? null,
    githubUrl: r.github_url ?? null,
    linkedinUrl: r.linkedin_url ?? null,
    gradient: r.gradient ?? "from-brand-violet via-brand-fuchsia to-brand-rose",
    sortOrder: r.sort_order ?? 0,
  };
}

export function mapTestimonialRow(r: any): Testimonial {
  return {
    id: r.id,
    quote: r.quote,
    name: r.name,
    role: r.role ?? "",
    avatarUrl: r.avatar_url ?? null,
    published: Boolean(r.published),
    sortOrder: r.sort_order ?? 0,
  };
}

export function mapSettingsRow(r: any): SiteSettings {
  return {
    name: r.name ?? defaultSettings.name,
    shortName: r.short_name ?? defaultSettings.shortName,
    role: r.role ?? defaultSettings.role,
    university: r.university ?? defaultSettings.university,
    location: r.location ?? defaultSettings.location,
    email: r.email ?? defaultSettings.email,
    url: defaultSettings.url,
    description: r.description ?? defaultSettings.description,
    social: {
      github: r.social_github ?? defaultSettings.social.github,
      linkedin: r.social_linkedin ?? defaultSettings.social.linkedin,
      facebook: r.social_facebook ?? defaultSettings.social.facebook,
      instagram: r.social_instagram ?? defaultSettings.social.instagram,
    },
    heroBackUrl: r.hero_back_url ?? null,
    heroFrontUrl: r.hero_front_url ?? null,
    heroMobileUrl: r.hero_mobile_url ?? null,
    cvUrl: r.cv_url ?? null,
  };
}

/** Lightweight anon client for public reads (no cookies → pages stay cacheable). */
function anon() {
  return createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// ── Public reads (RLS returns published rows only for anon) ──────────────────
export async function getSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured) return defaultSettings;
  try {
    const { data, error } = await anon()
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (error || !data) return defaultSettings;
    return mapSettingsRow(data);
  } catch {
    return defaultSettings;
  }
}

export async function getProjects(): Promise<Project[]> {
  const fallback = seedProjects.filter((p) => p.published);
  if (!isSupabaseConfigured) return fallback;
  try {
    const { data, error } = await anon()
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("year", { ascending: false });
    if (error || !data) return fallback;
    return data.map(mapProjectRow);
  } catch {
    return fallback;
  }
}

export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  const all = await getProjects();
  return all.filter((p) => p.featured).slice(0, limit);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const fallback = seedProjects.find((p) => p.slug === slug && p.published) ?? null;
  if (!isSupabaseConfigured) return fallback;
  try {
    const { data, error } = await anon()
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (error || !data) return fallback;
    return mapProjectRow(data);
  } catch {
    return fallback;
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const fallback = seedTestimonials.filter((t) => t.published);
  if (!isSupabaseConfigured) return fallback;
  try {
    const { data, error } = await anon()
      .from("testimonials")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });
    if (error || !data) return fallback;
    return data.map(mapTestimonialRow);
  } catch {
    return fallback;
  }
}

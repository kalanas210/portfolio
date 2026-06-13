import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from "@/lib/supabase/config";
import { SITE } from "@/lib/utils";
import { seedProjects, seedTestimonials, defaultStats } from "@/lib/data";
import type {
  Project,
  Testimonial,
  SiteSettings,
  GalleryItem,
  ProjectCategory,
  Post,
  Tool,
  ToolKind,
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
  aboutImageUrl: null,
  cvUrl: null,
  homeShowTools: true,
  homeShowBlog: true,
  stats: defaultStats,
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
    aboutImageUrl: r.about_image_url ?? null,
    cvUrl: r.cv_url ?? null,
    homeShowTools: r.home_show_tools ?? true,
    homeShowBlog: r.home_show_blog ?? true,
    // `stats` column may not exist yet (pre-migration 0004) → fall back. Also
    // guard against an empty array so the section never renders blank.
    stats: Array.isArray(r.stats) && r.stats.length > 0 ? (r.stats as SiteSettings["stats"]) : defaultStats,
  };
}

export function mapPostRow(r: any): Post {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt ?? "",
    content: r.content ?? "",
    coverUrl: r.cover_url ?? null,
    tags: r.tags ?? [],
    featured: Boolean(r.featured),
    published: Boolean(r.published),
    publishedAt: r.published_at ?? null,
    sortOrder: r.sort_order ?? 0,
  };
}

export function mapToolRow(r: any): Tool {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    tagline: r.tagline ?? "",
    description: r.description ?? "",
    category: r.category ?? "Utility",
    icon: r.icon ?? null,
    coverUrl: r.cover_url ?? null,
    gradient: r.gradient ?? "from-brand-violet via-brand-fuchsia to-brand-rose",
    kind: (r.kind === "external" ? "external" : "embedded") as ToolKind,
    componentKey: r.component_key ?? null,
    externalUrl: r.external_url ?? null,
    featured: Boolean(r.featured),
    published: Boolean(r.published),
    sortOrder: r.sort_order ?? 0,
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

// ── Blog posts ───────────────────────────────────────────────────────────────
export async function getPosts(): Promise<Post[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await anon()
      .from("posts")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data.map(mapPostRow);
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await anon()
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (error || !data) return null;
    return mapPostRow(data);
  } catch {
    return null;
  }
}

// ── Tools ────────────────────────────────────────────────────────────────────
export async function getTools(): Promise<Tool[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await anon()
      .from("tools")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data.map(mapToolRow);
  } catch {
    return [];
  }
}

export async function getToolBySlug(slug: string): Promise<Tool | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await anon()
      .from("tools")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (error || !data) return null;
    return mapToolRow(data);
  } catch {
    return null;
  }
}

// ── Featured (home page) ─────────────────────────────────────────────────────
export async function getFeaturedTools(limit = 6): Promise<Tool[]> {
  const all = await getTools();
  return all.filter((t) => t.featured).slice(0, limit);
}

export async function getFeaturedPosts(limit = 3): Promise<Post[]> {
  const all = await getPosts();
  return all.filter((p) => p.featured).slice(0, limit);
}

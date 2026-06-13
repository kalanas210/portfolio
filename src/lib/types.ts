// Shared, app-facing types (camelCase). DB rows (snake_case) are mapped to
// these in src/lib/queries.ts so components never see raw Supabase shapes.

export type ProjectCategory = "Web" | "Mobile" | "AI" | "Open Source";

export const PROJECT_CATEGORIES: ProjectCategory[] = ["Web", "Mobile", "AI", "Open Source"];

export interface GalleryItem {
  type: "image" | "video";
  url: string;
  caption?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  categories: ProjectCategory[];
  tech: string[];
  year: number;
  featured: boolean;
  published: boolean;
  thumbnailUrl: string | null;
  gallery: GalleryItem[];
  liveUrl: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  gradient: string;
  sortOrder: number;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatarUrl: string | null;
  published: boolean;
  sortOrder: number;
}

/** A single headline metric shown in the home "About" stats grid. */
export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export interface SiteSettings {
  name: string;
  shortName: string;
  role: string;
  university: string;
  location: string;
  email: string;
  url: string;
  description: string;
  social: {
    github: string;
    linkedin: string;
    facebook: string;
    instagram: string;
  };
  heroBackUrl: string | null;
  heroFrontUrl: string | null;
  heroMobileUrl: string | null;
  aboutImageUrl: string | null;
  cvUrl: string | null;
  homeShowTools: boolean;
  homeShowBlog: boolean;
  /** Editable headline stats (GPA, projects shipped, …) for the About section. */
  stats: Stat[];
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown
  coverUrl: string | null;
  tags: string[];
  featured: boolean;
  published: boolean;
  publishedAt: string | null;
  sortOrder: number;
}

export type ToolKind = "embedded" | "external";

export interface Tool {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string; // Markdown
  category: string;
  icon: string | null; // lucide icon name
  coverUrl: string | null;
  gradient: string;
  kind: ToolKind;
  componentKey: string | null; // registry key when kind === "embedded"
  externalUrl: string | null; // link target when kind === "external"
  featured: boolean;
  published: boolean;
  sortOrder: number;
}

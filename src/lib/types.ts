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
  cvUrl: string | null;
}

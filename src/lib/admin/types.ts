import type { GalleryItem, ProjectCategory, ToolKind } from "@/lib/types";

export interface ProjectInput {
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

export interface TestimonialInput {
  quote: string;
  name: string;
  role: string;
  published: boolean;
  sortOrder: number;
}

export interface SettingsInput {
  name: string;
  shortName: string;
  role: string;
  university: string;
  location: string;
  email: string;
  description: string;
  social: { github: string; linkedin: string; facebook: string; instagram: string };
  heroBackUrl: string | null;
  heroFrontUrl: string | null;
  heroMobileUrl: string | null;
  aboutImageUrl: string | null;
  cvUrl: string | null;
  homeShowTools: boolean;
  homeShowBlog: boolean;
}

export interface PostInput {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverUrl: string | null;
  tags: string[];
  featured: boolean;
  published: boolean;
  publishedAt: string | null;
  sortOrder: number;
}

export interface ToolInput {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  icon: string | null;
  coverUrl: string | null;
  gradient: string;
  kind: ToolKind;
  componentKey: string | null;
  externalUrl: string | null;
  featured: boolean;
  published: boolean;
  sortOrder: number;
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type {
  ProjectInput,
  TestimonialInput,
  SettingsInput,
  PostInput,
  ToolInput,
} from "@/lib/admin/types";

type ActionResult = { ok: boolean; error?: string };

function revalidatePublic() {
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
}

// ── Projects ────────────────────────────────────────────────────────────────
function projectToRow(input: ProjectInput) {
  return {
    slug: input.slug.trim(),
    title: input.title.trim(),
    description: input.description,
    long_description: input.longDescription,
    categories: input.categories,
    tech: input.tech,
    year: input.year,
    featured: input.featured,
    published: input.published,
    thumbnail_url: input.thumbnailUrl,
    gallery: input.gallery,
    live_url: input.liveUrl,
    github_url: input.githubUrl,
    linkedin_url: input.linkedinUrl,
    gradient: input.gradient,
    sort_order: input.sortOrder,
  };
}

export async function createProject(input: ProjectInput): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").insert(projectToRow(input));
  if (error) return { ok: false, error: error.message };
  revalidatePublic();
  return { ok: true };
}

export async function updateProject(id: string, input: ProjectInput): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").update(projectToRow(input)).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePublic();
  revalidatePath(`/projects/${input.slug}`);
  return { ok: true };
}

export async function deleteProject(id: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("projects").delete().eq("id", id);
  revalidatePublic();
}

export async function setProjectPublished(id: string, published: boolean): Promise<void> {
  const supabase = await createClient();
  await supabase.from("projects").update({ published }).eq("id", id);
  revalidatePublic();
}

// ── Testimonials ──────────────────────────────────────────────────────────────
function revalidateTestimonials() {
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}

export async function createTestimonial(input: TestimonialInput): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").insert({
    quote: input.quote,
    name: input.name,
    role: input.role,
    published: input.published,
    sort_order: input.sortOrder,
  });
  if (error) return { ok: false, error: error.message };
  revalidateTestimonials();
  return { ok: true };
}

export async function updateTestimonial(
  id: string,
  input: TestimonialInput,
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("testimonials")
    .update({
      quote: input.quote,
      name: input.name,
      role: input.role,
      published: input.published,
      sort_order: input.sortOrder,
    })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateTestimonials();
  return { ok: true };
}

export async function deleteTestimonial(id: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("testimonials").delete().eq("id", id);
  revalidateTestimonials();
}

export async function setTestimonialPublished(id: string, published: boolean): Promise<void> {
  const supabase = await createClient();
  await supabase.from("testimonials").update({ published }).eq("id", id);
  revalidateTestimonials();
}

// ── Settings ──────────────────────────────────────────────────────────────────
export async function updateSettings(input: SettingsInput): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .upsert({
      id: 1,
      name: input.name,
      short_name: input.shortName,
      role: input.role,
      university: input.university,
      location: input.location,
      email: input.email,
      description: input.description,
      social_github: input.social.github,
      social_linkedin: input.social.linkedin,
      social_facebook: input.social.facebook,
      social_instagram: input.social.instagram,
      hero_back_url: input.heroBackUrl,
      hero_front_url: input.heroFrontUrl,
      hero_mobile_url: input.heroMobileUrl,
      about_image_url: input.aboutImageUrl,
      cv_url: input.cvUrl,
      home_show_tools: input.homeShowTools,
      home_show_blog: input.homeShowBlog,
    });
  if (error) return { ok: false, error: error.message };
  // Settings affect the whole site (layout, heroes, footer).
  revalidatePath("/", "layout");
  return { ok: true };
}

// ── Blog posts ────────────────────────────────────────────────────────────────
function revalidatePosts() {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
}

function postToRow(input: PostInput) {
  return {
    slug: input.slug.trim(),
    title: input.title.trim(),
    excerpt: input.excerpt,
    content: input.content,
    cover_url: input.coverUrl,
    tags: input.tags,
    featured: input.featured,
    published: input.published,
    published_at: input.publishedAt,
    sort_order: input.sortOrder,
  };
}

export async function createPost(input: PostInput): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("posts").insert(postToRow(input));
  if (error) return { ok: false, error: error.message };
  revalidatePosts();
  return { ok: true };
}

export async function updatePost(id: string, input: PostInput): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("posts").update(postToRow(input)).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePosts();
  revalidatePath(`/blog/${input.slug}`);
  return { ok: true };
}

export async function deletePost(id: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("posts").delete().eq("id", id);
  revalidatePosts();
}

export async function setPostPublished(id: string, published: boolean): Promise<void> {
  const supabase = await createClient();
  await supabase.from("posts").update({ published }).eq("id", id);
  revalidatePosts();
}

// ── Tools ───────────────────────────────────────────────────────────────────────
function revalidateTools() {
  revalidatePath("/");
  revalidatePath("/tools");
  revalidatePath("/admin/tools");
}

function toolToRow(input: ToolInput) {
  return {
    slug: input.slug.trim(),
    name: input.name.trim(),
    tagline: input.tagline,
    description: input.description,
    category: input.category.trim() || "Utility",
    icon: input.icon,
    cover_url: input.coverUrl,
    gradient: input.gradient,
    kind: input.kind,
    component_key: input.kind === "embedded" ? input.componentKey : null,
    external_url: input.kind === "external" ? input.externalUrl : null,
    featured: input.featured,
    published: input.published,
    sort_order: input.sortOrder,
  };
}

export async function createTool(input: ToolInput): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("tools").insert(toolToRow(input));
  if (error) return { ok: false, error: error.message };
  revalidateTools();
  return { ok: true };
}

export async function updateTool(id: string, input: ToolInput): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("tools").update(toolToRow(input)).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateTools();
  revalidatePath(`/tools/${input.slug}`);
  return { ok: true };
}

export async function deleteTool(id: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("tools").delete().eq("id", id);
  revalidateTools();
}

export async function setToolPublished(id: string, published: boolean): Promise<void> {
  const supabase = await createClient();
  await supabase.from("tools").update({ published }).eq("id", id);
  revalidateTools();
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

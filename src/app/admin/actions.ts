"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ProjectInput, TestimonialInput, SettingsInput } from "@/lib/admin/types";

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
      cv_url: input.cvUrl,
    });
  if (error) return { ok: false, error: error.message };
  // Settings affect the whole site (layout, heroes, footer).
  revalidatePath("/", "layout");
  return { ok: true };
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

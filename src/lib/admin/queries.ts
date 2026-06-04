import { createClient } from "@/lib/supabase/server";
import {
  mapProjectRow,
  mapTestimonialRow,
  mapSettingsRow,
  defaultSettings,
} from "@/lib/queries";
import type { Project, Testimonial, SiteSettings } from "@/lib/types";

// Authenticated admin reads — RLS returns ALL rows (incl. unpublished).

export async function getAllProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("year", { ascending: false });
  return (data ?? []).map(mapProjectRow);
}

export async function getProjectById(id: string): Promise<Project | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
  return data ? mapProjectRow(data) : null;
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true });
  return (data ?? []).map(mapTestimonialRow);
}

export async function getSettingsForAdmin(): Promise<SiteSettings> {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  return data ? mapSettingsRow(data) : defaultSettings;
}

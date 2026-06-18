import type { Metadata } from "next";
import { HeroSection } from "@/components/hero/HeroSection";
import { TechMarquee } from "@/components/sections/TechMarquee";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { ActivitySection } from "@/components/sections/ActivitySection";
import { Testimonials } from "@/components/sections/Testimonials";
import { FeaturedTools } from "@/components/sections/FeaturedTools";
import { FeaturedPosts } from "@/components/sections/FeaturedPosts";
import { ContactCTA } from "@/components/sections/ContactCTA";
import {
  getFeaturedProjects,
  getTestimonials,
  getSettings,
  getFeaturedTools,
  getFeaturedPosts,
} from "@/lib/queries";
import { SITE, jsonLdHtml } from "@/lib/utils";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export const revalidate = 60;

export default async function Home() {
  const [featured, testimonials, settings, tools, posts] = await Promise.all([
    getFeaturedProjects(3),
    getTestimonials(),
    getSettings(),
    getFeaturedTools(3),
    getFeaturedPosts(3),
  ]);

  const profilePageLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE.url}/#profilepage`,
    url: SITE.url,
    mainEntity: { "@id": `${SITE.url}/#person` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(profilePageLd) }}
      />
      <HeroSection />
      <TechMarquee />
      <FeaturedWork projects={featured} />
      <AboutTeaser stats={settings.stats} />
      <ActivitySection />
      <Testimonials testimonials={testimonials} />
      {settings.homeShowTools && <FeaturedTools tools={tools} />}
      {settings.homeShowBlog && <FeaturedPosts posts={posts} />}
      <ContactCTA />
    </>
  );
}

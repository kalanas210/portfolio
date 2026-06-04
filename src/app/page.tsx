import { HeroSection } from "@/components/hero/HeroSection";
import { TechMarquee } from "@/components/sections/TechMarquee";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { ActivitySection } from "@/components/sections/ActivitySection";
import { Testimonials } from "@/components/sections/Testimonials";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { getFeaturedProjects, getTestimonials } from "@/lib/queries";

export const revalidate = 60;

export default async function Home() {
  const [featured, testimonials] = await Promise.all([
    getFeaturedProjects(3),
    getTestimonials(),
  ]);

  return (
    <>
      <HeroSection />
      <TechMarquee />
      <FeaturedWork projects={featured} />
      <AboutTeaser />
      <ActivitySection />
      <Testimonials testimonials={testimonials} />
      <ContactCTA />
    </>
  );
}

import { HeroSection } from "@/components/hero/HeroSection";
import { TechMarquee } from "@/components/sections/TechMarquee";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { ActivitySection } from "@/components/sections/ActivitySection";
import { Testimonials } from "@/components/sections/Testimonials";
import { ContactCTA } from "@/components/sections/ContactCTA";

export default function Home() {
  return (
    <>
      <HeroSection />
      <TechMarquee />
      <FeaturedWork />
      <AboutTeaser />
      <ActivitySection />
      <Testimonials />
      <ContactCTA />
    </>
  );
}

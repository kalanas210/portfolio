import MaskRevealHero from "@/components/MaskRevealHero";
import { HeroOverlay } from "./HeroOverlay";
import { NoiseTexture } from "@/components/ui/NoiseTexture";

export function HeroSection() {
  return (
    <section className="relative isolate">
      <div className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
        <MaskRevealHero />
        <HeroOverlay />
        <NoiseTexture className="z-30" opacity={0.04} />
        {/* Bottom fade into next section — sits BEHIND the overlay rail (z-15 < overlay z-20) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[15] h-40 bg-gradient-to-b from-transparent via-[rgb(var(--bg)/0.5)] to-[rgb(var(--bg))]" />
      </div>
    </section>
  );
}

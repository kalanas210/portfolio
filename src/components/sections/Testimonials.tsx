"use client";

import { Quote } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealStagger, RevealItem } from "@/components/ui/Reveal";
import type { Testimonial } from "@/lib/types";

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="container relative py-24 sm:py-32">
      <SectionHeading
        eyebrow="Kind words"
        title="What people I've worked with say"
        description="Notes from collaborators, mentors, and clients."
      />

      <RevealStagger className="mt-12 grid gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <RevealItem key={t.name}>
            <figure className="relative h-full overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-ink-900 p-8">
              <Quote
                aria-hidden
                size={28}
                className="text-ink-300 dark:text-ink-600"
              />
              <blockquote className="mt-4 text-base leading-relaxed text-ink-700 dark:text-ink-100 text-balance">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 border-t border-black/10 dark:border-white/10 pt-4">
                <div className="text-sm font-semibold">{t.name}</div>
                <div className="mt-0.5 text-xs text-ink-400">{t.role}</div>
              </figcaption>
            </figure>
          </RevealItem>
        ))}
      </RevealStagger>
    </section>
  );
}

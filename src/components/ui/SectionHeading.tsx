import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { type PropsWithChildren } from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: PropsWithChildren<SectionHeadingProps>) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <Reveal>
          <div className="mb-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-ink-400">
            <span className="h-px w-6 bg-ink-400/60" />
            {eyebrow}
          </div>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2 className="font-display text-fluid-h2 font-semibold tracking-tight text-balance">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-2xl text-base sm:text-lg text-ink-400 text-balance">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}

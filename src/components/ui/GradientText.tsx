import { cn } from "@/lib/utils";
import { type PropsWithChildren } from "react";

interface GradientTextProps {
  className?: string;
  variant?: "warm" | "cool" | "fire";
  as?: "span" | "h1" | "h2" | "h3" | "h4";
}

const variants = {
  warm: "from-brand-violet via-brand-fuchsia to-brand-rose",
  cool: "from-brand-cyan via-brand-violet to-brand-fuchsia",
  fire: "from-brand-amber via-brand-rose to-brand-fuchsia",
};

export function GradientText({
  children,
  className,
  variant = "warm",
  as: Tag = "span",
}: PropsWithChildren<GradientTextProps>) {
  return (
    <Tag
      className={cn(
        "bg-clip-text text-transparent bg-gradient-to-r",
        variants[variant],
        className,
      )}
    >
      {children}
    </Tag>
  );
}

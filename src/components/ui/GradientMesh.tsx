"use client";

import { cn } from "@/lib/utils";

interface GradientMeshProps {
  className?: string;
  variant?: "default" | "warm" | "cool";
}

export function GradientMesh({ className, variant = "default" }: GradientMeshProps) {
  const orbs =
    variant === "warm"
      ? ["bg-brand-fuchsia/30", "bg-brand-rose/30", "bg-brand-amber/20"]
      : variant === "cool"
        ? ["bg-brand-cyan/30", "bg-brand-violet/30", "bg-brand-fuchsia/20"]
        : ["bg-brand-violet/30", "bg-brand-fuchsia/25", "bg-brand-cyan/20"];

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div
        className={cn(
          "absolute -top-32 -left-24 h-[40rem] w-[40rem] rounded-full blur-[120px] animate-blob",
          orbs[0],
        )}
      />
      <div
        className={cn(
          "absolute -top-10 right-0 h-[36rem] w-[36rem] rounded-full blur-[110px] animate-blob",
          orbs[1],
        )}
        style={{ animationDelay: "-4s" }}
      />
      <div
        className={cn(
          "absolute bottom-0 left-1/3 h-[34rem] w-[34rem] rounded-full blur-[120px] animate-blob",
          orbs[2],
        )}
        style={{ animationDelay: "-8s" }}
      />
    </div>
  );
}

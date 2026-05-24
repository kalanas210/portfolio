import { cn } from "@/lib/utils";
import { type PropsWithChildren } from "react";

interface BadgeProps {
  className?: string;
  pulse?: boolean;
}

export function Badge({ children, className, pulse }: PropsWithChildren<BadgeProps>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/15",
        "bg-white/70 dark:bg-white/[0.04] backdrop-blur-md",
        "px-3 py-1 text-xs font-medium text-ink-700 dark:text-ink-200",
        className,
      )}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-emerald-400" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
      )}
      {children}
    </span>
  );
}

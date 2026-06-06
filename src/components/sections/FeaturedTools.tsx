import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealStagger, RevealItem } from "@/components/ui/Reveal";
import { ToolCard } from "@/components/tools/ToolCard";
import type { Tool } from "@/lib/types";

export function FeaturedTools({ tools }: { tools: Tool[] }) {
  if (tools.length === 0) return null;

  return (
    <section className="container relative py-16 sm:py-20">
      <div className="flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          index="05"
          eyebrow="Free tools"
          title="Free tools, right in your browser"
          description="Background remover, QR codes, image compressor, JSON & more — no sign-up, nothing uploaded."
        />
        <Link
          href="/tools"
          className="group inline-flex items-center gap-2 self-start text-sm font-medium text-ink-700 sm:self-end dark:text-ink-200"
        >
          Browse all tools
          <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      <RevealStagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <RevealItem key={t.id} className="h-full">
            <ToolCard tool={t} />
          </RevealItem>
        ))}
      </RevealStagger>
    </section>
  );
}

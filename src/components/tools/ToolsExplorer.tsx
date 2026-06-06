"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, LayoutGroup } from "framer-motion";
import { Search } from "lucide-react";
import { ToolCard } from "./ToolCard";
import type { Tool } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ToolsExplorer({ tools }: { tools: Tool[] }) {
  const categories = useMemo(() => {
    const set = new Set<string>();
    tools.forEach((t) => set.add(t.category));
    return ["All", ...Array.from(set).sort()];
  }, [tools]);

  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools
      .filter((t) => active === "All" || t.category === active)
      .filter(
        (t) => !q || t.name.toLowerCase().includes(q) || t.tagline.toLowerCase().includes(q),
      )
      .sort((a, b) => Number(b.featured) - Number(a.featured));
  }, [tools, active, query]);

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative inline-flex max-w-full overflow-x-auto rounded-full border border-black/10 bg-white/70 p-1 backdrop-blur-xl dark:border-white/10 dark:bg-ink-900/70">
          <LayoutGroup id="tools-filter">
            {categories.map((c) => {
              const isActive = c === active;
              return (
                <button
                  key={c}
                  onClick={() => setActive(c)}
                  className={cn(
                    "relative z-10 inline-flex h-9 items-center whitespace-nowrap rounded-full px-4 text-sm font-medium transition-colors",
                    isActive
                      ? "text-white dark:text-ink-950"
                      : "text-ink-500 hover:text-ink-950 dark:text-ink-300 dark:hover:text-white",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="tools-filter-active"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      className="absolute inset-0 -z-10 rounded-full bg-ink-950 dark:bg-white"
                    />
                  )}
                  {c}
                </button>
              );
            })}
          </LayoutGroup>
        </div>

        <div className="relative w-full lg:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools…"
            aria-label="Search tools"
            className="h-11 w-full rounded-full border border-black/10 bg-white/70 pl-10 pr-4 text-sm backdrop-blur-xl focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/40 dark:border-white/10 dark:bg-ink-900/70"
          />
        </div>
      </div>

      <p className="mt-4 text-sm text-ink-400">
        {filtered.length} tool{filtered.length === 1 ? "" : "s"}
        {active !== "All" ? ` in ${active}` : ""}
      </p>

      <motion.div layout className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((t) => (
            <motion.div
              layout
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              <ToolCard tool={t} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="mt-12 rounded-3xl border border-dashed border-black/15 p-12 text-center text-sm text-ink-400 dark:border-white/15">
          No tools match — try another search or category.
        </div>
      )}
    </div>
  );
}

// Shared Tailwind class strings for the tool UIs — keeps the many small tools
// visually consistent without repeating long class lists in every file.

export const toolCard =
  "rounded-3xl border border-black/10 bg-white/60 p-5 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.03] sm:p-7";

export const toolInput =
  "h-10 w-full rounded-xl border border-black/10 bg-white px-3 text-sm focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/40 dark:border-white/10 dark:bg-ink-800";

export const toolTextarea =
  "w-full rounded-xl border border-black/10 bg-white px-3 py-3 font-mono text-[13px] leading-relaxed focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/40 dark:border-white/10 dark:bg-ink-800";

export const toolLabel =
  "mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-ink-400";

export const toolBtnPrimary =
  "inline-flex h-11 items-center gap-2 rounded-xl bg-ink-950 px-5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60 dark:bg-white dark:text-ink-950";

export const toolBtnGhost =
  "inline-flex h-11 items-center gap-2 rounded-xl border border-black/10 px-5 text-sm font-medium text-ink-700 transition-colors hover:text-ink-950 disabled:opacity-50 dark:border-white/10 dark:text-ink-200 dark:hover:text-white";

export const toolError =
  "mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-300";

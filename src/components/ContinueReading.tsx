import { Link } from "@/i18n/navigation";
import { readingNeighbors, type TrailEntry } from "@/constants/readingPaths";
import { menuLabelFor } from "@/lib/menuLabel";

type Props = {
  folder: string;
  slug: string;
  roots: string[];
  titles?: Record<string, string>;
  enTitles?: Record<string, string>;
  strings?: { heading?: string; previous?: string; next?: string };
};

// "Continue reading" cards at the end of a page that belongs to an ordered group of the side menu
// (see src/constants/readingPaths.ts). Renders nothing for every other page.
export default function ContinueReading({ folder, slug, roots, titles, enTitles, strings }: Props) {
  const items = roots.filter((r) => typeof r === "string" && r.endsWith(".md")).map((r) => r.slice(0, -3));
  const { prev, next } = readingNeighbors(folder, items, slug);
  if (!prev && !next) return null;

  const label = (e: TrailEntry) => menuLabelFor(e.item, titles, enTitles);
  const card = (e: TrailEntry, caption: string, align: "start" | "end") => (
    <Link
      href={`${e.href}#content`}
      className={`group block rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm transition-colors hover:border-brand/60 hover:bg-brand/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand dark:border-slate-700 dark:bg-white/5 dark:hover:border-brand/60 dark:hover:bg-white/10 ${
        align === "end" ? "text-end" : ""
      }`}
    >
      <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
        {align === "start" ? "← " : ""}
        {caption}
        {align === "end" ? " →" : ""}
      </span>
      <span className="mt-1 block text-base font-medium text-brand group-hover:underline dark:text-brand-soft">
        {label(e)}
      </span>
    </Link>
  );

  return (
    <nav aria-label={strings?.heading ?? "Continue reading"} className="mt-12 border-t border-slate-200 pt-6 dark:border-white/10">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
        {strings?.heading ?? "Continue reading"}
      </h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {prev ? <div>{card(prev, strings?.previous ?? "Previous", "start")}</div> : <div className="hidden md:block" />}
        {next ? <div>{card(next, strings?.next ?? "Next", "end")}</div> : null}
      </div>
    </nav>
  );
}

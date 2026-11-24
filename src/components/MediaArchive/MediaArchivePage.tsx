"use client";

import { useMemo, useState } from "react";
import { ExternalLink, FileText, Play, Search, Video } from "lucide-react";
import VideoCarousel from "@/components/MdxComponents/VideoCarousel";
import LiteYouTube from "@/components/LiteYouTube";
import type { MediaArchiveEntry } from "./types";

const formatDate = (iso: string | null) =>
  iso
    ? new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
        timeZone: "UTC",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

const pill =
  "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors";
const pillBrand = `${pill} border-brand/50 text-brand hover:border-brand hover:bg-brand/10 dark:text-brand-soft`;
const pillQuiet = `${pill} border-slate-200 text-slate-700 hover:border-brand/50 hover:text-brand dark:border-white/10 dark:text-slate-300 dark:hover:text-brand-soft`;

export type MediaArchiveLink = { label: string; href: string };

export type MediaArchivePageProps = {
  /** Small uppercase line above the title. */
  eyebrow: string;
  title: string;
  description: string;
  /** Pill buttons under the description (official sources, notes repo...). */
  links?: MediaArchiveLink[];
  /** YouTube playlist id shown in the carousel. */
  playlistId: string;
  carouselLabel: string;
  /** Entries already merged and sorted newest first. */
  entries: MediaArchiveEntry[];
  dedicatedTitle?: string;
  dedicatedDescription?: string;
  archiveTitle?: string;
  archiveDescription?: string;
  searchPlaceholder?: string;
};

/**
 * Template for pages that publish a recurring video series: header with source links,
 * YouTube playlist carousel, highlighted dedicated editions and a searchable archive.
 * See Arborist Calls (src/app/[locale]/aborist-calls) for a complete example.
 */
export default function MediaArchivePage({
  eyebrow,
  title,
  description,
  links = [],
  playlistId,
  carouselLabel,
  entries: archive,
  dedicatedTitle = "Dedicated editions",
  dedicatedDescription = "Editions dedicated to a single topic.",
  archiveTitle = "Archive",
  archiveDescription = "Every recording, together with the notes, agendas and discussion threads linked for each one.",
  searchPlaceholder = "Number, date or title",
}: MediaArchivePageProps) {
  const dedicated = useMemo(() => archive.filter((e) => e.dedicated), [archive]);
  // The newest regular recording that can be played gets its own spot above the tabs.
  const featured = useMemo(() => archive.find((e) => e.videoId && !e.dedicated), [archive]);
  const [tab, setTab] = useState<"previous" | "archive" | "dedicated">("previous");
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("all");

  const years = useMemo(
    () =>
      Array.from(new Set(archive.map((e) => e.date?.slice(0, 4)).filter(Boolean) as string[]))
        .sort()
        .reverse(),
    [archive],
  );

  const rows = archive.filter((e) => {
    const q = query.trim().toLowerCase();
    const haystack = `${e.label} ${formatDate(e.date)} ${e.date ?? ""} ${e.title ?? ""}`.toLowerCase();
    return (!q || haystack.includes(q)) && (year === "all" || e.date?.startsWith(year));
  });

  const tabs = [
    { id: "previous" as const, label: "Previous calls" },
    { id: "archive" as const, label: "Archive" },
    ...(dedicated.length > 0 ? [{ id: "dedicated" as const, label: "Dedicated editions" }] : []),
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <header className="mb-8">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-brand dark:text-brand-soft">
          {eyebrow}
        </p>
        <h1 className="mb-3 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
          {title}
        </h1>
        <p className="max-w-3xl text-base text-slate-600 dark:text-slate-300">
          {description}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className={pillBrand}
            >
              {l.label}
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          ))}
        </div>
      </header>

      {featured && (
        <section aria-label="Latest call" className="mb-12">
          <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">Latest call</h2>
          <div className="max-w-4xl rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03] md:p-5">
            <div>
              <LiteYouTube
                videoId={featured.videoId as string}
                title={featured.title ?? `${title} ${featured.label}`}
                className="aspect-video w-full overflow-hidden rounded-xl border-0"
              />
            </div>
            <div className="mt-4 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                {featured.label && (
                  <span className="text-lg font-semibold text-slate-900 dark:text-white">{featured.label}</span>
                )}
                <span className="text-sm text-slate-600 dark:text-slate-300">{formatDate(featured.date)}</span>
                {featured.duration && (
                  <span className="text-xs text-slate-500 dark:text-slate-400">{featured.duration}</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {featured.video && (
                  <a href={featured.video} target="_blank" rel="noopener noreferrer" className={pillQuiet}>
                    <Video className="h-3.5 w-3.5" aria-hidden="true" />
                    Video
                  </a>
                )}
                {featured.notes && (
                  <a href={featured.notes} target="_blank" rel="noopener noreferrer" className={pillQuiet}>
                    <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                    Notes
                  </a>
                )}
                {featured.agenda && (
                  <a href={featured.agenda} target="_blank" rel="noopener noreferrer" className={pillQuiet}>
                    <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                    Agenda
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <div role="tablist" aria-label="Browse calls" className="mb-6 flex flex-wrap gap-1 border-b border-slate-200 dark:border-white/10">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            onClick={() => setTab(t.id)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === t.id
                ? "border-brand text-brand dark:text-brand-soft"
                : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "previous" && (
        <section id="panel-previous" role="tabpanel" aria-labelledby="tab-previous" aria-label="Previous calls">
          <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
            Browse earlier recordings from the playlist. Use the arrows or scroll sideways.
          </p>
          <VideoCarousel list={playlistId} compact="true" label={carouselLabel} />
        </section>
      )}

      {tab === "dedicated" && dedicated.length > 0 && (
        <section id="panel-dedicated" role="tabpanel" aria-labelledby="tab-dedicated" aria-label="Dedicated editions">
          <h2 className="mb-1 text-xl font-bold text-slate-900 dark:text-white">
            {dedicatedTitle}
          </h2>
          <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
            {dedicatedDescription}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dedicated.map((e) => (
              <a
                key={e.key}
                href={e.video}
                target="_blank"
                rel="noopener noreferrer"
                className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition-colors hover:border-brand/50 dark:border-white/10 dark:bg-white/[0.03]"
              >
                {e.videoId && (
                  <span className="relative block aspect-video bg-slate-200 dark:bg-slate-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://i.ytimg.com/vi/${e.videoId}/mqdefault.jpg`}
                      alt=""
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white">
                        <Play aria-hidden="true" className="h-4 w-4 fill-current" />
                      </span>
                    </span>
                  </span>
                )}
                <span className="block p-4">
                  <span className="block text-sm font-semibold text-slate-900 dark:text-white">
                    {e.title ?? e.label}
                  </span>
                  <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                    {[formatDate(e.date), e.duration].filter(Boolean).join(" · ")}
                  </span>
                </span>
              </a>
            ))}
          </div>
        </section>
      )}

      {tab === "archive" && (
      <section id="panel-archive" role="tabpanel" aria-labelledby="tab-archive" aria-label="Archive">
        <h2 className="mb-1 text-xl font-bold text-slate-900 dark:text-white">
          {archiveTitle}
        </h2>
        <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
          {archiveDescription}
        </p>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <label className="relative block flex-1">
            <span className="sr-only">{searchPlaceholder}</span>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </label>
          <label className="block sm:w-48">
            <span className="sr-only">Filter by year</span>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none dark:border-white/10 dark:bg-[#0b2037] dark:text-white"
            >
              <option value="all">All years</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
          Showing {rows.length} of {archive.length}
        </p>

        <ul className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white dark:divide-white/10 dark:border-white/10 dark:bg-white/[0.03]">
          {rows.map((e) => (
            <li
              key={e.key}
              className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  {e.label && (
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {e.label}
                    </span>
                  )}
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    {formatDate(e.date)}
                  </span>
                  {e.duration && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {e.duration}
                    </span>
                  )}
                  {e.dedicated && (
                    <span className="rounded-md border border-brand/50 px-2 py-0.5 text-xs font-medium text-brand dark:text-brand-soft">
                      Dedicated
                    </span>
                  )}
                </div>
                {e.dedicated && e.title && (
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{e.title}</p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {e.video && (
                  <a href={e.video} target="_blank" rel="noopener noreferrer" className={pillQuiet}>
                    <Video className="h-3.5 w-3.5" aria-hidden="true" />
                    Video
                  </a>
                )}
                {e.notes && (
                  <a href={e.notes} target="_blank" rel="noopener noreferrer" className={pillQuiet}>
                    <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                    Notes
                  </a>
                )}
                {e.agenda && (
                  <a href={e.agenda} target="_blank" rel="noopener noreferrer" className={pillQuiet}>
                    <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                    Agenda
                  </a>
                )}
                {e.twitter && (
                  <a href={e.twitter} target="_blank" rel="noopener noreferrer" className={pillQuiet}>
                    Thread on X
                  </a>
                )}
              </div>
            </li>
          ))}
          {rows.length === 0 && (
            <li className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
              Nothing matches this search.
            </li>
          )}
        </ul>
      </section>
      )}
    </div>
  );
}

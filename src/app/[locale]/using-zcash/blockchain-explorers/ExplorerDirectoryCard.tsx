"use client";

import { formatString } from "@/lib/helpers";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

type ExplorerDirectoryCardProps = {
  title: string;
  description: string;
  url: string;
  thumbnailImage: string;
  ctaLabel: string;
  features?: string[];
  /** "light": larger logo tile on a neutral light background (for mixed-format logos). */
  logoTile?: "default" | "light";
};

const sectionLabel =
  "text-[11px] font-medium uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400";
const chip =
  "rounded-full bg-slate-200 px-2.5 py-0.5 text-[13px] text-slate-700 dark:bg-white/10 dark:text-slate-200";

function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export default function ExplorerDirectoryCard({
  title,
  description,
  url,
  thumbnailImage,
  ctaLabel,
  features = [],
  logoTile = "default",
}: ExplorerDirectoryCardProps) {
  const host = hostOf(url);
  const light = logoTile === "light";
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-50/60 transition-colors hover:border-brand/40 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-brand/40">
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={
                light
                  ? "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white p-2 shadow-sm ring-1 ring-slate-200 dark:ring-white/15"
                  : "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 p-1.5 ring-1 ring-slate-200 dark:bg-white/[0.06] dark:ring-white/10"
              }
            >
              {thumbnailImage ? (
                <Image
                  src={thumbnailImage}
                  alt={`${title} logo`}
                  width={56}
                  height={56}
                  className={`h-full w-full object-contain ${thumbnailImage.includes("messari") ? "dark:invert" : ""}`}
                />
              ) : (
                <span
                  aria-hidden="true"
                  className={
                    light
                      ? "flex h-full w-full items-center justify-center rounded-lg bg-brand/10 text-xl font-semibold text-brand"
                      : "text-lg font-semibold text-brand"
                  }
                >
                  {title.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="m-0 wrap-break-word text-lg font-semibold leading-tight text-slate-900 dark:text-white">
                {title}
              </h3>
              {host && (
                <p className="m-0 mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">{host}</p>
              )}
            </div>
          </div>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${ctaLabel}: ${title} (opens in a new tab)`}
            className="inline-flex shrink-0 items-center gap-1 self-start whitespace-nowrap rounded-lg border border-brand/50 px-3.5 py-1.5 text-sm font-semibold text-brand no-underline transition-colors hover:border-brand hover:bg-brand/10 dark:text-brand-soft dark:hover:text-white"
          >
            {ctaLabel}
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>

        <p className="mb-0 mt-4 min-w-0 wrap-break-word text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {description.trim()}
        </p>
      </div>

      {features.length > 0 && (
        <div className="border-t border-slate-200 px-4 py-3 dark:border-white/10">
          <p className={`${sectionLabel} mb-2`}>Features</p>
          <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
            {features.map((feature, index) => (
              <li key={`${title}-${feature}-${index}`} className={`${chip} m-0`}>
                {formatString.titleCase(feature)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

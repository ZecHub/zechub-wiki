"use client";

import Image from "next/image";

type ExplorerDirectoryCardProps = {
  title: string;
  description: string;
  url: string;
  thumbnailImage: string;
  thumbnailImageLight?: string;
  thumbnailImageDark?: string;
  badge?: string;
  badgeTone?: "neutral" | "warning";
  credit?: string;
  ctaLabel: string;
  features?: string[];
};

function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function ExplorerDirectoryCard({
  title,
  description,
  url,
  thumbnailImage,
  thumbnailImageLight,
  thumbnailImageDark,
  badge,
  badgeTone = "neutral",
  credit,
  ctaLabel,
  features = [],
}: ExplorerDirectoryCardProps) {
  const badgeClass =
    badgeTone === "warning"
      ? "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300"
      : "bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-200";
  const chip =
    "rounded-full bg-slate-200 px-2.5 py-0.5 text-[13px] text-slate-700 dark:bg-white/10 dark:text-slate-200";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-50/60 transition-colors hover:border-brand/40 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-brand/40">
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {/* The logo carries the name, so the title is for screen readers only.
                Each theme gets a transparent version when one exists; without one,
                the project's own dark tile is shown. */}
            <h3 className="sr-only">{title}</h3>
            <div className="flex h-12 items-center">
              <Image
                src={thumbnailImageDark ?? thumbnailImage}
                alt={`${title} logo`}
                width={0}
                height={0}
                unoptimized
                className={`h-12 w-auto max-w-full object-contain object-left ${
                  thumbnailImageDark ? "" : "rounded-lg"
                } ${thumbnailImageLight ? "hidden dark:block" : ""}`}
              />
              {thumbnailImageLight && (
                <Image
                  src={thumbnailImageLight}
                  alt={`${title} logo`}
                  width={0}
                  height={0}
                  unoptimized
                  className="h-12 w-auto max-w-full object-contain object-left dark:hidden"
                />
              )}
            </div>
            <p className="m-0 mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="truncate">{hostOf(url)}</span>
              {badge && <span className={`rounded-full px-2 py-0.5 font-medium ${badgeClass}`}>{badge}</span>}
            </p>
          </div>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${ctaLabel}: ${title} (opens in a new tab)`}
            className="inline-flex shrink-0 items-center gap-1 self-start whitespace-nowrap rounded-lg border border-brand/50 px-3.5 py-1.5 text-sm font-semibold text-brand no-underline transition-colors hover:border-brand hover:bg-brand/10 dark:text-brand-soft dark:hover:text-white"
          >
            {ctaLabel}
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        <p className="mb-0 mt-4 min-w-0 wrap-break-word text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {description.trim()}
        </p>

        {credit && (
          <p className="m-0 mt-4 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900 dark:bg-amber-400/10 dark:text-amber-200">
            <span aria-hidden="true">♥</span>
            <span>{credit}</span>
          </p>
        )}
      </div>

      {features.length > 0 && (
        <div className="border-t border-slate-200 px-4 py-3 dark:border-white/10">
          <p className="mb-2 mt-0 text-[11px] font-medium uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
            Features
          </p>
          <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0" aria-label="Features">
            {features.map((feature, index) => (
              <li key={`${title}-${feature}-${index}`} className={`${chip} m-0`}>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

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
  ctaLabel,
  features = [],
}: ExplorerDirectoryCardProps) {
  const badgeClass =
    badgeTone === "warning"
      ? "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300"
      : "bg-zinc-100 text-zinc-600 dark:bg-white/10 dark:text-zinc-300";

  return (
    <article className="group h-full rounded-2xl border border-zinc-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-zinc-700 dark:bg-slate-800">
      <div className="flex h-full min-w-0 flex-col">
        {/* The logo carries the name, so the title is for screen readers
            only. Logo files are prepared at 2x for a 52px row with the same
            letter height. Each theme gets a transparent version (light text
            on dark, dark text on light); without one, the project's own
            dark tile is shown. */}
        <h3 className="sr-only">{title}</h3>
        <div className="flex h-[52px] items-center">
          <Image
            src={thumbnailImageDark ?? thumbnailImage}
            alt={`${title} logo`}
            width={0}
            height={0}
            unoptimized
            className={`h-[52px] w-auto max-w-full object-contain object-left ${
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
              className="h-[52px] w-auto max-w-full object-contain object-left dark:hidden"
            />
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-zinc-500 underline-offset-2 transition-colors hover:text-sky-600 hover:underline dark:text-zinc-400 dark:hover:text-sky-400"
          >
            {hostOf(url)}
            <span aria-hidden="true">↗</span>
          </a>
          {badge && (
            <span className={`rounded-full px-2 py-0.5 font-medium ${badgeClass}`}>{badge}</span>
          )}
        </div>

        <p className="mt-4 min-w-0 flex-1 wrap-break-word text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          {description}
        </p>

        {features.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Features">
            {features.map((feature, index) => (
              <li
                key={`${title}-${feature}-${index}`}
                className="rounded-md border border-zinc-200 px-2 py-0.5 text-xs text-zinc-600 dark:border-zinc-600 dark:text-zinc-300"
              >
                {feature}
              </li>
            ))}
          </ul>
        )}

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${ctaLabel}: ${title}`}
          className="btn-brand mt-6 inline-flex w-fit items-center rounded-xl px-5 py-2.5 text-sm font-medium transition-transform duration-200 group-hover:scale-[1.01]"
        >
          {ctaLabel}
        </a>
      </div>
    </article>
  );
}

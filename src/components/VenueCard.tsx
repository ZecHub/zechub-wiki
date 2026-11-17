// Directory entry: small logo tile and name on one row, a four-line description
// and a fixed "Visit website" button pinned to the bottom so every card aligns.
// Entries without a clean logo get an initial instead of a screenshot.
import { ArrowUpRight } from "lucide-react";

export default function VenueCard({
  name,
  url,
  icon,
  iconDark,
  description,
  ctaLabel,
}: {
  name: string;
  url: string;
  icon?: string;
  iconDark?: string;
  description: string;
  ctaLabel: string;
}) {
  return (
    <article className="flex flex-col rounded-xl border border-slate-200 bg-slate-50/60 p-4 transition-colors hover:border-brand/40 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-brand/40">
      <div className="flex items-center gap-3">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-xl font-semibold text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
          {icon ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={icon}
                alt=""
                loading="lazy"
                className={`!my-0 h-full w-full object-contain p-2 ${iconDark ? "dark:hidden" : ""}`}
              />
              {iconDark ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={iconDark}
                  alt=""
                  loading="lazy"
                  className="!my-0 hidden h-full w-full object-contain p-2 dark:block"
                />
              ) : null}
            </>
          ) : (
            name.charAt(0).toUpperCase()
          )}
        </span>
        <h2 className="m-0 min-w-0 text-lg font-semibold leading-tight text-slate-900 dark:text-white">{name}</h2>
      </div>
      <p className="mb-0 mt-3 line-clamp-4 flex-1 text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
        {description}
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${ctaLabel}: ${name} (opens in a new tab)`}
        className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-lg border border-brand/50 px-4 py-2 text-sm font-semibold text-brand no-underline transition-colors hover:border-brand hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:text-brand-soft dark:hover:text-white dark:focus-visible:ring-offset-slate-900"
      >
        {ctaLabel}
        <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
      </a>
    </article>
  );
}

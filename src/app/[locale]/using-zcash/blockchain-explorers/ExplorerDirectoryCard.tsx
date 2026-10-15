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
};

export default function ExplorerDirectoryCard({
  title,
  description,
  url,
  thumbnailImage,
  ctaLabel,
  features = [],
}: ExplorerDirectoryCardProps) {
  return (
    <article className="h-full rounded-xl border border-slate-200 bg-slate-50/60 p-5 transition-colors hover:border-brand/40 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="flex h-full min-w-0 flex-col">
        <div className="mb-4 flex items-center justify-start gap-3 text-left">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white ring-1 ring-slate-200 dark:ring-white/10">
            {thumbnailImage ? (
              <Image
                src={thumbnailImage}
                alt={`${title} logo`}
                width={48}
                height={48}
                className="h-full w-full object-contain p-1.5"
              />
            ) : (
              <span aria-hidden="true" className="text-lg font-semibold text-brand">
                {title.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="wrap-break-word text-lg font-semibold text-slate-900 dark:text-white">
              {title}
            </h3>
          </div>
        </div>

        <p className="mb-5 min-w-0 flex-1 wrap-break-word text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {description}
        </p>

        {features.length > 0 && (
          <div className="mb-5">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Features</h4>
            <ul
              className={
                title === "Bitquery"
                  ? "grid grid-cols-2 gap-x-6 gap-y-1 list-disc pl-5 text-sm text-slate-600 dark:text-slate-400"
                  : "list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-400"
              }
            >
            {features.map((feature, index) => (
              <li key={`${title}-${feature}-${index}`}>
                {formatString.titleCase(feature)}
              </li>
            ))}
            </ul>
          </div>
         )}

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-brand/50 px-4 py-2 text-sm font-semibold text-brand no-underline transition-colors hover:border-brand hover:bg-brand/10 dark:text-brand-soft dark:hover:text-white"
        >
          {ctaLabel}
          <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
}

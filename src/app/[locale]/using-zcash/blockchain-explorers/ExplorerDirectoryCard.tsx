"use client";

import { formatString } from "@/lib/helpers";
import Image from "next/image";

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
    <article className="group h-full rounded-2xl border border-zinc-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-zinc-700 dark:bg-slate-800">
      <div className="flex h-full min-w-0 flex-col">
        {/* Logo files are prepared at 2x for a 52px row with the same
            letter height (about 14px), so they are served as-is. */}
        <div className="mb-4 flex h-[52px] items-center">
          <Image
            src={thumbnailImage}
            alt={`${title} logo`}
            width={0}
            height={0}
            unoptimized
            className="h-[52px] w-auto max-w-full rounded-lg object-contain object-left"
          />
        </div>
        <h3 className="mb-3 wrap-break-word text-xl font-bold text-zinc-900 dark:text-white">
          {title}
        </h3>

        <p className="mb-5 min-w-0 flex-1 wrap-break-word text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {description}
        </p>

        {features.length > 0 && (
          <div className="mb-5">
            <h4 className="mb-2 font-semibold text-zinc-500">Features:</h4>
            <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
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
          className="btn-brand mt-auto inline-flex w-fit items-center rounded-xl px-5 py-2.5 text-sm font-medium transition-transform duration-200 group-hover:scale-[1.01]"
        >
          {ctaLabel}
        </a>
      </div>
    </article>
  );
}

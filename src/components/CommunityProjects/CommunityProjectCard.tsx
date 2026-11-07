"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  title: string;
  description: string;
  url: string;
  thumbnailImage?: string;
  ctaLabel?: string;
  compact?: boolean;
};

function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function initials(title: string) {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export default function CommunityProjectCard({
  title,
  description,
  url,
  thumbnailImage,
  ctaLabel = "Visit Site",
  compact = false,
}: Props) {
  const [imgError, setImgError] = useState(false);
  const hasImage = Boolean(thumbnailImage) && !imgError;
  const host = hostOf(url);

  const Logo = (
    <div
      className={
        compact
          ? "flex h-10 w-10 shrink-0 items-center justify-center"
          : "flex h-14 items-center"
      }
    >
      {hasImage ? (
        <Image
          src={thumbnailImage!}
          alt=""
          width={0}
          height={0}
          unoptimized
          onError={() => setImgError(true)}
          className={
            compact
              ? "h-10 w-10 rounded-lg object-contain"
              : "h-14 w-auto max-w-full object-contain object-left rounded-lg"
          }
        />
      ) : (
        <div
          className={
            compact
              ? "flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-xs font-semibold text-zinc-600 dark:bg-zinc-700 dark:text-zinc-200"
              : "flex h-14 w-14 items-center justify-center rounded-lg bg-zinc-100 text-sm font-semibold text-zinc-600 dark:bg-zinc-700 dark:text-zinc-200"
          }
          aria-hidden="true"
        >
          {initials(title)}
        </div>
      )}
    </div>
  );

  if (compact) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-slate-800 dark:hover:bg-slate-700/60"
      >
        {Logo}
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-slate-900 dark:text-white">
            {title}
          </div>
          <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">
            {host}
          </div>
        </div>
        <span className="shrink-0 text-xs text-zinc-400" aria-hidden="true">
          ↗
        </span>
      </a>
    );
  }

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg dark:border-zinc-700 dark:bg-slate-800 md:p-6">
      {Logo}
      <h3 className="mt-3 text-base font-semibold leading-tight text-slate-900 dark:text-white md:text-lg">
        {title}
      </h3>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 inline-flex items-center gap-1 text-xs text-zinc-500 underline-offset-2 hover:underline dark:text-zinc-400"
      >
        {host}
        <span aria-hidden="true">↗</span>
      </a>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 line-clamp-4">
        {description}
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${ctaLabel}: ${title}`}
        className="btn-brand mt-4 inline-flex w-fit items-center rounded-xl px-4 py-2 text-sm font-medium transition group-hover:scale-[1.01]"
      >
        {ctaLabel}
      </a>
    </article>
  );
}

"use client";

import { ArrowUpRight } from "lucide-react";
import VideoCarousel from "./VideoCarousel";

// One Zcon: edition chip, title, description, link to the playlist and a rail with its sessions.
export function ZconEdition(props: Record<string, unknown>) {
  const label = String(props.label ?? "");
  const title = String(props.title ?? "");
  const desc = String(props.desc ?? "");
  const list = String(props.list ?? "");
  return (
    <section id={String(props.anchor ?? "")} className="not-prose my-10 scroll-mt-24">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-lg border border-brand/30 bg-brand/10 px-3 py-1 text-sm font-semibold tracking-wide text-brand dark:text-brand-soft">
          {label}
        </span>
        <h2 className="m-0 min-w-0 flex-1 border-0 p-0 text-xl font-semibold leading-tight text-slate-900 dark:text-white">{title}</h2>
        {list && (
          <a
            href={`https://www.youtube.com/playlist?list=${list}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-brand/50 px-3 py-1.5 text-sm font-semibold text-brand no-underline transition-colors hover:border-brand hover:bg-brand/10 dark:text-brand-soft dark:hover:text-white"
          >
            Playlist
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </a>
        )}
      </div>
      {desc && <p className="mb-0 mt-3 max-w-3xl text-[0.95rem] leading-6 text-slate-700 dark:text-slate-300">{desc}</p>}
      {list && <VideoCarousel list={list} label="Sessions" compact="true" max="30" />}
    </section>
  );
}

// Grid of edition cards ("ZconVI / 2025 / Virtual") that jump to each edition below.
export function ChipNav(props: Record<string, unknown>) {
  let items: { label: string; href: string; sub?: string }[] = [];
  try {
    items = JSON.parse(String(props.items ?? "[]"));
  } catch {
    items = [];
  }
  return (
    <nav aria-label="Editions" className="not-prose my-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((i) => (
        <a
          key={i.href}
          href={i.href}
          className="flex flex-col gap-0.5 rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 no-underline transition-colors hover:border-brand/40 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-brand/40"
        >
          <span className="text-base font-semibold tracking-wide text-brand dark:text-brand-soft">{i.label}</span>
          {i.sub ? <span className="text-xs text-slate-600 dark:text-slate-400">{i.sub}</span> : null}
        </a>
      ))}
    </nav>
  );
}

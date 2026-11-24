"use client";

import { ArrowUpRight, Mic } from "lucide-react";
import VideoCarousel from "./VideoCarousel";

// One podcast: logo + name + link to the full playlist, with a rail of its latest episodes.
export default function PodcastShow(props: Record<string, unknown>) {
  const title = String(props.title ?? "");
  const logo = String(props.logo ?? "");
  const list = String(props.list ?? "");
  const href = `https://www.youtube.com/playlist?list=${list}`;
  return (
    <section className="not-prose my-10">
      <div className="flex items-center gap-3">
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt="" width={44} height={44} loading="lazy" className="m-0 h-11 w-11 shrink-0 rounded-xl bg-white object-cover ring-1 ring-slate-200 dark:ring-white/20" />
        ) : (
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand/30 bg-brand/10 text-brand dark:text-brand-soft">
            <Mic aria-hidden="true" className="h-6 w-6" />
          </span>
        )}
        <h2 className="m-0 min-w-0 flex-1 border-0 p-0 text-xl font-semibold leading-tight text-slate-900 dark:text-white">{title}</h2>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-brand/50 px-3 py-1.5 text-sm font-semibold text-brand no-underline transition-colors hover:border-brand hover:bg-brand/10 dark:text-brand-soft dark:hover:text-white"
        >
          Playlist
          <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
        </a>
      </div>
      <VideoCarousel list={list} label="Latest episodes" compact="true" max="20" />
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import LiteYouTube from "@/components/LiteYouTube";

type Video = { id: string; title: string };

// A featured player plus a scrollable strip with every video of a YouTube playlist.
export default function VideoCarousel(props: Record<string, unknown>) {
  const list = String(props.list ?? "");
  const label = String(props.label ?? "All sessions");
  const [videos, setVideos] = useState<Video[] | null>(null);
  const [active, setActive] = useState(0);
  const rail = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/youtube-playlist?list=${encodeURIComponent(list)}`)
      .then((r) => (r.ok ? r.json() : { videos: [] }))
      .then((j) => !cancelled && setVideos(Array.isArray(j.videos) ? j.videos : []))
      .catch(() => !cancelled && setVideos([]));
    return () => {
      cancelled = true;
    };
  }, [list]);

  const scrollBy = (dir: 1 | -1) => {
    const el = rail.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  if (videos === null) {
    return <div className="not-prose my-6 aspect-video max-w-3xl animate-pulse rounded-xl border border-slate-200 bg-slate-50/60 dark:border-white/10 dark:bg-white/[0.03]" aria-busy="true" />;
  }
  if (!videos.length) return null;
  const current = videos[active] ?? videos[0];

  return (
    <div className="not-prose my-6">
      <div className="max-w-3xl rounded-xl border border-slate-200 bg-slate-50/60 p-3 dark:border-white/10 dark:bg-white/[0.03]">
        <LiteYouTube
          key={current.id}
          videoId={current.id}
          title={current.title}
          className="aspect-video w-full overflow-hidden rounded-lg"
        />
        <p className="mb-0 mt-3 px-1 text-sm font-semibold text-slate-900 dark:text-white">{current.title}</p>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <h3 className="m-0 text-sm font-medium uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
          {label} ({videos.length})
        </h3>
        <div className="flex gap-2">
          {([-1, 1] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => scrollBy(d)}
              aria-label={d === -1 ? "Scroll left" : "Scroll right"}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand/50 text-brand transition-colors hover:border-brand hover:bg-brand/10 dark:text-brand-soft"
            >
              {d === -1 ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={rail}
        className="mt-3 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:thin]"
        role="list"
      >
        {videos.map((v, i) => (
          <button
            key={v.id}
            type="button"
            role="listitem"
            onClick={() => setActive(i)}
            aria-current={i === active}
            className={`group w-60 shrink-0 snap-start overflow-hidden rounded-xl border bg-slate-50/60 text-left transition-colors dark:bg-white/[0.03] ${
              i === active ? "border-brand" : "border-slate-200 hover:border-brand/40 dark:border-white/10 dark:hover:border-brand/40"
            }`}
          >
            <span className="relative block aspect-video bg-slate-200 dark:bg-slate-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`}
                alt=""
                loading="lazy"
                referrerPolicy="no-referrer"
                className="m-0 h-full w-full object-cover"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white opacity-90">
                  <Play aria-hidden="true" className="h-4 w-4 fill-current" />
                </span>
              </span>
            </span>
            <span className="block p-3 text-sm font-semibold leading-snug text-slate-900 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] overflow-hidden dark:text-white">
              {v.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

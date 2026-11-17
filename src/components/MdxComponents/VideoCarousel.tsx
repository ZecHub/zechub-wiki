"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import LiteYouTube from "@/components/LiteYouTube";

type Video = { id: string; title: string; length?: string; when?: string };

// A featured player plus a scrollable strip with every video of a YouTube playlist.
export default function VideoCarousel(props: Record<string, unknown>) {
  const list = String(props.list ?? "");
  const label = String(props.label ?? "All sessions");
  // compact: no featured player until a card is clicked, and at most `max` cards (one rail per show).
  const compact = String(props.compact ?? "") === "true";
  const max = Number(props.max ?? 0) || 0;
  const [videos, setVideos] = useState<Video[] | null>(null);
  const [active, setActive] = useState(compact ? -1 : 0);
  const rail = useRef<HTMLDivElement>(null);

  // Several carousels can sit on one page; each loads its playlist only when it comes near the viewport.
  const host = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = host.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!near) return;
    let cancelled = false;
    fetch(`/api/youtube-playlist?list=${encodeURIComponent(list)}`)
      .then((r) => (r.ok ? r.json() : { videos: [] }))
      .then((j) => !cancelled && setVideos(Array.isArray(j.videos) ? (max ? j.videos.slice(0, max) : j.videos) : []))
      .catch(() => !cancelled && setVideos([]));
    return () => {
      cancelled = true;
    };
  }, [list, max, near]);

  const scrollBy = (dir: 1 | -1) => {
    const el = rail.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  if (videos === null) {
    return (
      <div
        ref={host}
        aria-busy="true"
        className={`not-prose my-6 animate-pulse rounded-xl border border-slate-200 bg-slate-50/60 dark:border-white/10 dark:bg-white/[0.03] ${
          compact ? "h-52" : "aspect-video max-w-3xl"
        }`}
      />
    );
  }
  if (!videos.length) return null;
  const current = active >= 0 ? videos[active] : null;

  return (
    <div className="not-prose my-6">
      {current && (
        <div className="max-w-3xl rounded-xl border border-slate-200 bg-slate-50/60 p-3 dark:border-white/10 dark:bg-white/[0.03]">
          <LiteYouTube
            key={current.id}
            videoId={current.id}
            title={current.title}
            startActive={compact}
            className="aspect-video w-full overflow-hidden rounded-lg"
          />
          <p className="mb-0 mt-3 px-1 text-sm font-semibold text-slate-900 dark:text-white">{current.title}</p>
        </div>
      )}

      <div className={`${current ? "mt-6" : "mt-0"} flex items-center justify-between`}>
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
            onClick={() => setActive(compact && i === active ? -1 : i)}
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
            {(v.when || v.length) && (
              <span className="block px-3 pb-3 text-xs text-slate-500 dark:text-slate-400">
                {[v.when, v.length].filter(Boolean).join(" \u00b7 ")}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

type Video = { id: string; title: string };

function parseVideos(raw: unknown): Video[] {
  try {
    const list = JSON.parse(String(raw ?? "[]"));
    return Array.isArray(list) ? list.filter((v) => v && typeof v.id === "string") : [];
  } catch {
    return [];
  }
}

// Scroll-snap carousel of YouTube videos. Each slide shows the video's thumbnail with a play button;
// the player (youtube-nocookie) is only created when the slide is played. Arrows, swipe and keyboard scrolling work.
export default function VideoSlider(props: Record<string, unknown>) {
  const videos = parseVideos(props.videos);
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState<string | null>(null);

  const goTo = useCallback(
    (i: number) => {
      const el = track.current;
      if (!el) return;
      const next = Math.max(0, Math.min(videos.length - 1, i));
      el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
    },
    [videos.length],
  );

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => setIndex(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)));
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  if (!videos.length) return null;
  const btn =
    "inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:border-brand/50 hover:text-brand disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:text-brand-soft";
  const current = videos[Math.min(index, videos.length - 1)];

  return (
    <section aria-roledescription="carousel" aria-label="Video tutorials" className="not-prose my-8 w-full max-w-3xl">
      <div
        ref={track}
        tabIndex={0}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth rounded-2xl border border-slate-200 bg-slate-900 shadow-lg [scrollbar-width:none] dark:border-white/10 [&::-webkit-scrollbar]:hidden"
      >
        {videos.map((v, i) => (
          <div key={v.id} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${videos.length}: ${v.title}`} className="relative aspect-video w-full shrink-0 snap-center">
            {playing === v.id ? (
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1`}
                title={v.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <button type="button" onClick={() => setPlaying(v.id)} aria-label={`Play video: ${v.title}`} className="group absolute inset-0 block h-full w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://i.ytimg.com/vi/${v.id}/maxresdefault.jpg`}
                  alt=""
                  loading="lazy"
                  onError={(e) => {
                    const img = e.currentTarget;
                    const fallback = `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`;
                    if (img.src !== fallback) img.src = fallback;
                  }}
                  className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-black/60 text-white ring-1 ring-white/30 transition-transform group-hover:scale-105">
                    <Play aria-hidden="true" className="ml-1 h-7 w-7" fill="currentColor" />
                  </span>
                </span>
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="m-0 min-w-0 truncate text-sm text-slate-600 dark:text-slate-300">
          <span className="font-semibold text-slate-900 dark:text-white">{index + 1} / {videos.length}</span>
          <span className="mx-2 text-slate-400">·</span>
          {current?.title}
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" aria-label="Previous video" className={btn} disabled={index <= 0} onClick={() => goTo(index - 1)}>
            <ChevronLeft aria-hidden="true" className="h-5 w-5" />
          </button>
          <button type="button" aria-label="Next video" className={btn} disabled={index >= videos.length - 1} onClick={() => goTo(index + 1)}>
            <ChevronRight aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

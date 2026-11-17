"use client";

import { useState } from "react";
import { Play } from "lucide-react";

type Video = { id: string; title: string };

function parseVideos(raw: unknown): Video[] {
  try {
    const list = JSON.parse(String(raw ?? "[]"));
    return Array.isArray(list) ? list.filter((v) => v && typeof v.id === "string") : [];
  } catch {
    return [];
  }
}

// Thumbnails are served from this site (public/video-thumbs); nothing is requested from YouTube
// until a video is played, and then only through youtube-nocookie.com.
function Thumb({ id, className = "" }: { id: string; className?: string }) {
  const [ok, setOk] = useState(true);
  if (!ok) return <span aria-hidden="true" className={`block bg-slate-800 ${className}`} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/video-thumbs/${id}.webp`}
      alt=""
      loading="lazy"
      onError={() => setOk(false)}
      className={`m-0 block object-cover ${className}`}
    />
  );
}

// Featured player with a playlist beside it (below it on small screens).
export default function VideoShowcase(props: Record<string, unknown>) {
  const videos = parseVideos(props.videos);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  if (!videos.length) return null;
  const current = videos[Math.min(active, videos.length - 1)];

  const select = (i: number) => {
    setActive(i);
    setPlaying(false);
  };

  return (
    <section
      aria-label="Featured videos"
      className="not-prose my-8 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.03]"
    >
      <div className="grid grid-cols-[minmax(0,1fr)] md:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0">
          <div className="relative aspect-video w-full bg-slate-900">
            {playing ? (
              <iframe
                key={current.id}
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${current.id}?autoplay=1`}
                title={current.title}
                referrerPolicy="strict-origin-when-cross-origin"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                aria-label={`Play video: ${current.title}`}
                className="group absolute inset-0 block h-full w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <Thumb id={current.id} className="h-full w-full" />
                <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg transition-transform group-hover:scale-105">
                    <Play aria-hidden="true" className="ml-1 h-7 w-7" fill="currentColor" />
                  </span>
                </span>
                <span className="absolute inset-x-0 bottom-0 p-4 text-base font-semibold leading-snug text-white">{current.title}</span>
              </button>
            )}
          </div>
        </div>

        <div className="relative min-h-0 min-w-0 border-t border-slate-200 dark:border-white/10 md:border-l md:border-t-0">
          <ul
            className="m-0 flex list-none gap-2 overflow-x-auto p-3 md:absolute md:inset-0 md:flex-col md:overflow-y-auto md:overflow-x-hidden"
            aria-label="Playlist"
          >
            {videos.map((v, i) => (
              <li key={v.id} className="m-0 shrink-0 p-0 max-md:w-56 md:shrink">
                <button
                  type="button"
                  onClick={() => select(i)}
                  aria-current={i === active}
                  className={`flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand max-md:flex-col max-md:items-stretch ${
                    i === active ? "bg-brand/10 ring-1 ring-brand/40" : "hover:bg-slate-100 dark:hover:bg-white/5"
                  }`}
                >
                  <span className="relative block aspect-video w-24 shrink-0 overflow-hidden rounded-md bg-slate-800 max-md:w-full">
                    <Thumb id={v.id} className="h-full w-full" />
                  </span>
                  <span className="min-w-0 text-sm font-medium leading-snug text-slate-900 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] overflow-hidden dark:text-slate-100">
                    {v.title}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

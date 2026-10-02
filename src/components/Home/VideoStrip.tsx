"use client";
import { useEffect, useState } from "react";
import { ArrowUpRight, Play } from "lucide-react";

type Video = { id: string; title: string; published?: string };

// Want specific videos instead of the newest ones? List them here, e.g.
//   { id: "REUbkLzK7J4", title: "Buy ZEC in Gemini Exchange" }
// Leave empty to show the latest uploads from the ZecHub channel.
const PINNED: Video[] = [];

const CHANNEL = "https://youtube.com/@zechub";
const SHOWN = 3;

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1984c7] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900";

const fmtDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

function VideoCard({ video }: { video: Video }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700/60 dark:bg-slate-800/50">
      <div className="relative aspect-video bg-slate-900">
        {playing ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
            title={video.title}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play ${video.title}`}
            className={`group absolute inset-0 ${focusRing}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1984c7] text-white shadow-lg transition-transform group-hover:scale-110">
                <Play className="h-5 w-5 translate-x-0.5" aria-hidden="true" />
              </span>
            </span>
          </button>
        )}
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 text-base font-semibold text-slate-900 dark:text-slate-100">
          {video.title}
        </h3>
        {video.published ? (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {fmtDate(video.published)}
          </p>
        ) : null}
      </div>
    </div>
  );
}

// "From the ZecHub channel": newest uploads (or the PINNED list). Hidden if the
// feed can't be loaded, so the home never shows an empty box.
export default function VideoStrip() {
  const [videos, setVideos] = useState<Video[]>(PINNED);

  useEffect(() => {
    if (PINNED.length > 0) return;
    let cancelled = false;
    fetch("/api/latest-videos")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled && Array.isArray(d?.videos)) {
          setVideos(d.videos.slice(0, SHOWN));
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (videos.length === 0) return null;

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 md:text-3xl">
            Watch
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            {PINNED.length > 0 ? "Start with these videos." : "The latest from the ZecHub channel."}
          </p>
        </div>
        <a
          href={CHANNEL}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex shrink-0 items-center gap-1 rounded text-sm font-medium text-[#1984c7] hover:underline ${focusRing}`}
        >
          All videos <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
      <div className="grid grid-cols-1 gap-4 imd:grid-cols-2 lg:grid-cols-3">
        {videos.map((v) => (
          <VideoCard key={v.id} video={v} />
        ))}
      </div>
    </div>
  );
}

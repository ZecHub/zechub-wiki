"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

type Video = { id: string; title: string; published?: string };

// A beginner path, in order, picked from the ZecHub Learning Library
// (zechub.wiki/zechub-tutorial): what Zcash is, a wallet, getting ZEC, using it.
// Add or remove entries to change the carousel. If this list is empty the
// component falls back to the newest uploads from the ZecHub channel.
const PINNED: Video[] = [
  { id: "J1Nr1VL5dGU", title: "What is Zcash?" },
  { id: "6IIRRZ17Q74", title: "Reviewing All Zcash Shielded Wallets" },
  { id: "Lb5Bvl1GkRQ", title: "ZecBounties Explained - Earn ZEC by Contributing" },
  { id: "3xyKKer1Qvk", title: "How to Buy and Use Zcash Orchard" },
  { id: "mKVvXY4yjjA", title: "Crosschain Swaps with Zcash x NEAR Intents" },
  { id: "tEfQaYPV0UE", title: "Useful Tips When Using Zcash" },
  { id: "pMNk2A3NcKw", title: "How to Spend Your Zcash on Everyday Items" },
  { id: "gSeECj4ddYA", title: "How to Buy NymVPN with Zcash (ZEC)" },
];

const CHANNEL = "https://youtube.com/@zechub";
const SHOWN = 8;

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900";

const horizontalDirection = (track: HTMLElement) =>
  window.getComputedStyle(track).direction === "rtl" ? -1 : 1;

const fmtDate = (iso: string | undefined, locale: string) =>
  iso
    ? new Date(iso).toLocaleDateString(locale, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

function VideoCard({
  video,
  index,
  className = "",
}: {
  video: Video;
  index: number;
  className?: string;
}) {
  const { t, locale } = useLanguage();
  const copy = t?.homeLanding?.videos;
  const [playing, setPlaying] = useState(false);
  return (
    <div className={`overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800/60 ${className}`}>
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
            aria-label={(copy?.play ?? "Play {title}").replace("{title}", video.title)}
            className={`group absolute inset-0 ${focusRing}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/video-thumbs/${video.id}.webp`}
              alt=""
              loading="lazy"
              // Thumbnails are stored locally (no request to YouTube until play).
              // Fall back to YouTube only if a file is missing.
              onError={(e) => {
                const img = e.currentTarget;
                const fallback = `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;
                if (!img.src.endsWith(fallback)) img.src = fallback;
              }}
              className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-md transition-all group-hover:scale-105 group-hover:bg-brand group-hover:text-on-brand">
                <Play className="h-4 w-4 translate-x-0.5 fill-current" aria-hidden="true" />
              </span>
            </span>
          </button>
        )}
      </div>
      <div className="p-4">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-brand">
          {(copy?.step ?? "Step {number}").replace("{number}", (index + 1).toLocaleString(locale))}
        </p>
        <h4 className="line-clamp-2 text-base font-semibold text-slate-900 dark:text-slate-100">
          {video.title}
        </h4>
        {video.published ? (
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
            {fmtDate(video.published, locale)}
          </p>
        ) : null}
      </div>
    </div>
  );
}

// "Watch": a swipeable row of tutorials (the PINNED list, or the newest uploads
// if it is empty). Hidden when there is nothing to show.
export default function VideoStrip() {
  const { t, locale } = useLanguage();
  const copy = t?.homeLanding?.videos;
  const [videos, setVideos] = useState<Video[]>(PINNED);
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

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

  const update = () => {
    const el = trackRef.current;
    if (!el) return;
    const distanceFromStart = Math.max(0, horizontalDirection(el) * el.scrollLeft);
    setCanPrev(distanceFromStart > 4);
    setCanNext(distanceFromStart + el.clientWidth < el.scrollWidth - 4);
  };
  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [videos.length, locale]);

  const scrollBy = (step: 1 | -1) => {
    const el = trackRef.current;
    if (el) {
      el.scrollBy({ left: step * horizontalDirection(el) * el.clientWidth * 0.9, behavior: "smooth" });
    }
  };

  if (videos.length === 0) return null;

  const arrow = `flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition-colors hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-300 disabled:hover:text-slate-600 dark:border-slate-700 dark:text-slate-200 ${focusRing}`;

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 md:text-3xl">
            {copy?.title ?? "Watch"}
          </h2>
          <p className="mt-2 text-slate-700 dark:text-slate-200">
            {PINNED.length > 0
              ? copy?.pinnedDescription ?? "A short path for newcomers, in order."
              : copy?.latestDescription ?? "The latest from the ZecHub channel."}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <a
            href={CHANNEL}
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden items-center gap-1 rounded text-sm font-medium text-brand hover:underline imd:inline-flex ${focusRing}`}
          >
            {copy?.allVideos ?? "All videos"} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            disabled={!canPrev}
            aria-label={copy?.previous ?? "Previous videos"}
            className={arrow}
          >
            <ChevronLeft className="h-5 w-5 rtl:rotate-180" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            disabled={!canNext}
            aria-label={copy?.next ?? "Next videos"}
            className={arrow}
          >
            <ChevronRight className="h-5 w-5 rtl:rotate-180" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div
        ref={trackRef}
        onScroll={update}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {videos.map((v, i) => (
          <VideoCard
            key={v.id}
            video={v}
            index={i}
            className="w-[85%] shrink-0 snap-start imd:w-[calc(50%-0.5rem)] lg:w-[calc((100%-2rem)/3)]"
          />
        ))}
      </div>
      <a
        href={CHANNEL}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-4 inline-flex items-center gap-1 rounded text-sm font-medium text-brand hover:underline imd:hidden ${focusRing}`}
      >
        {copy?.allVideos ?? "All videos"} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
      </a>
    </div>
  );
}

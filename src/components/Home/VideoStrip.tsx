"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Play } from "lucide-react";

type Video = { id: string; title: string; published?: string };

// Tutorials picked from the ZecHub Learning Library (zechub.wiki/zechub-tutorial).
// Add or remove entries to change the carousel. If this list is empty the
// component falls back to the newest uploads from the ZecHub channel.
const PINNED: Video[] = [
  { id: "5bx4GhQTi_8", title: "How to Try Zcash Shielded Transactions" },
  { id: "G92zBIr-Wms", title: "Meet Zashi: A Brand New Wallet for Zcash" },
  { id: "6IIRRZ17Q74", title: "Reviewing All Zcash Shielded Wallets" },
  { id: "EMPiXi2zxok", title: "Shielding Your Zcash" },
  { id: "3xyKKer1Qvk", title: "How to Buy and Use Zcash Orchard" },
  { id: "tEfQaYPV0UE", title: "Useful Tips When Using Zcash" },
  { id: "pMNk2A3NcKw", title: "How to Spend Your Zcash on Everyday Items" },
  { id: "xeiaRc_QLKk", title: "Visualizing Zcash Addresses" },
  { id: "Avweu5V9QRc", title: "Coinbase + Zashi: Buy Zcash and Shield Instantly" },
  { id: "zu8nvr4FlXE", title: "Zenith Full Node Wallet Installation and Demo" },
  { id: "qM0JWciwnNE", title: "How to Install Zebrad on Windows" },
];

const CHANNEL = "https://youtube.com/@zechub";
const SHOWN = 8;

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

function VideoCard({ video, className = "" }: { video: Video; className?: string }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className={`overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700/60 dark:bg-slate-800/50 ${className}`}>
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

// "Watch": a swipeable row of tutorials (the PINNED list, or the newest uploads
// if it is empty). Hidden when there is nothing to show.
export default function VideoStrip() {
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
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };
  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [videos.length]);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };

  if (videos.length === 0) return null;

  const arrow = `flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition-colors hover:border-[#1984c7] hover:text-[#1984c7] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-300 disabled:hover:text-slate-600 dark:border-slate-700 dark:text-slate-300 ${focusRing}`;

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 md:text-3xl">
            Watch
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            {PINNED.length > 0
              ? "Step-by-step video tutorials."
              : "The latest from the ZecHub channel."}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <a
            href={CHANNEL}
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden items-center gap-1 rounded text-sm font-medium text-[#1984c7] hover:underline imd:inline-flex ${focusRing}`}
          >
            All videos <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            disabled={!canPrev}
            aria-label="Previous videos"
            className={arrow}
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            disabled={!canNext}
            aria-label="Next videos"
            className={arrow}
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div
        ref={trackRef}
        onScroll={update}
        className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {videos.map((v) => (
          <VideoCard
            key={v.id}
            video={v}
            className="w-[85%] shrink-0 snap-start imd:w-[calc(50%-0.5rem)] lg:w-[calc((100%-2rem)/3)]"
          />
        ))}
      </div>
      <a
        href={CHANNEL}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-4 inline-flex items-center gap-1 rounded text-sm font-medium text-[#1984c7] hover:underline imd:hidden ${focusRing}`}
      >
        All videos <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
      </a>
    </div>
  );
}

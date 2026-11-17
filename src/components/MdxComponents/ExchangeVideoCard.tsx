import { ArrowUpRight } from "lucide-react";
import LiteYouTube from "@/components/LiteYouTube";

// Known exchange marks (small icon, transparent). Others fall back to an initial.
const LOGOS: Record<string, string> = {
  coinbase: "/dex-logos/coinbase-icon.png",
};

const BUTTON =
  "mt-4 inline-flex w-fit items-center gap-1.5 rounded-lg border border-brand/50 px-4 py-2 text-sm font-semibold text-brand no-underline transition-colors hover:border-brand hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:text-brand-soft dark:hover:text-white dark:focus-visible:ring-offset-slate-900";

// An exchange link followed by its tutorial video, shown as one card: exchange
// info on the left, video on the right (stacked on small screens).
// Produced by rehypeWikiPatterns when a bold link is directly followed by a video.
export default function ExchangeVideoCard(props: Record<string, unknown>) {
  const name = String(props.exname ?? "");
  const url = String(props.exurl ?? "#");
  const videoId = String(props.exvideo ?? "");
  const title = String(props.extitle ?? "") || `${name} tutorial`;
  const logo = LOGOS[name.trim().toLowerCase()];

  return (
    <div className="my-6 grid max-w-3xl gap-5 rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-white/10 dark:bg-white/[0.03] md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
      <div className="flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-xl font-semibold text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-white">
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logo} alt="" loading="lazy" className="!my-0 h-full w-full object-contain p-3" />
              ) : (
                name.charAt(0).toUpperCase()
              )}
            </span>
            <span className="block min-w-0">
              <span className="block text-lg font-semibold leading-tight text-slate-900 dark:text-white">{name}</span>
              <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">Centralized exchange</span>
            </span>
          </div>
          <p className="mb-0 mt-4 px-0.5 text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
            Watch the video guide to buy ZEC and shield it in your wallet.
          </p>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit ${name} (opens in a new tab)`}
          className={BUTTON}
        >
          Visit website
          <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
        </a>
      </div>
      <div className="min-w-0">
        <LiteYouTube
          videoId={videoId}
          title={title}
          className="w-full aspect-video overflow-hidden rounded-lg border border-slate-200 dark:border-white/10"
        />
        <p className="mb-0 mt-2 px-0.5 text-xs text-slate-500 dark:text-slate-400">Video guide: {title}</p>
      </div>
    </div>
  );
}

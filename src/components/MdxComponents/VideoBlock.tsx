import LiteYouTube from "@/components/LiteYouTube";

// A standalone tutorial video: same card frame as the exchange and wallet
// cards, aligned to the text column, with a caption underneath.
// Produced by rehypeWikiPatterns on the "Using Zcash" pages.
export default function VideoBlock(props: Record<string, unknown>) {
  const videoId = String(props.exvideo ?? "");
  const title = String(props.extitle ?? "") || "Video guide";
  return (
    <div className="my-6 max-w-3xl rounded-xl border border-slate-200 bg-slate-50/60 p-3 dark:border-white/10 dark:bg-white/[0.03]">
      <LiteYouTube
        videoId={videoId}
        title={title}
        className="w-full aspect-video overflow-hidden rounded-lg"
      />
      <p className="mb-0 mt-3 px-1 text-sm text-slate-600 dark:text-slate-300">
        <span className="font-semibold text-slate-900 dark:text-white">Video guide</span>
        <span className="mx-2 text-slate-400">·</span>
        {title}
      </p>
    </div>
  );
}

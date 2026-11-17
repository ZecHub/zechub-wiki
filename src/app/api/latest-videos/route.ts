import { NextResponse } from "next/server";

// Latest uploads of the ZecHub YouTube channel, read from YouTube's public RSS
// feed (no API key). The browser only talks to this origin; the result is cached
// for an hour so the feed is hit a handful of times a day at most.
const CHANNEL_ID = "UC3-KM00kjCUheRzO5cq3PAA";
const FEED = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const LIMIT = 6;

type Video = { id: string; title: string; published: string };

const decode = (s: string) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'");

function parse(xml: string): Video[] {
  const out: Video[] = [];
  for (const m of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
    const e = m[1];
    const id = e.match(/<yt:videoId>([\w-]{11})<\/yt:videoId>/)?.[1];
    const title = e.match(/<title>([\s\S]*?)<\/title>/)?.[1];
    const published = e.match(/<published>([^<]+)<\/published>/)?.[1];
    if (id && title && published) {
      out.push({ id, title: decode(title.trim()), published });
    }
    if (out.length >= LIMIT) break;
  }
  return out;
}

export async function GET() {
  try {
    const res = await fetch(FEED, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`feed ${res.status}`);
    const videos = parse(await res.text());
    if (videos.length === 0) throw new Error("empty feed");
    return NextResponse.json(
      { videos },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } },
    );
  } catch {
    // The home hides the strip when this is empty.
    return NextResponse.json({ videos: [] }, { status: 200, headers: { "Cache-Control": "no-store" } });
  }
}

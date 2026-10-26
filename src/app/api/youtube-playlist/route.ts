import { NextRequest, NextResponse } from "next/server";

// All videos of a public YouTube playlist, read server-side from the playlist page
// (first batch, up to 100 videos) with the playlist RSS feed (latest 15) as fallback.
// No API key; cached for an hour. Only playlist ids are accepted.
const LIST_RE = /^PL[A-Za-z0-9_-]{10,40}$/;
const CACHE = "public, s-maxage=3600, stale-while-revalidate=86400";

type Video = { id: string; title: string; length?: string; published?: string };

const decode = (s: string) =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'");

function fromPage(html: string): Video[] {
  const start = html.indexOf("ytInitialData");
  if (start < 0) return [];
  const open = html.indexOf("{", start);
  const end = html.indexOf("</script>", open);
  if (open < 0 || end < 0) return [];
  let data: any;
  try {
    data = JSON.parse(html.slice(open, end).trim().replace(/;$/, ""));
  } catch {
    return [];
  }
  const out: Video[] = [];
  const seen = new Set<string>();
  const walk = (n: any) => {
    if (!n || typeof n !== "object") return;
    if (n.playlistVideoRenderer?.videoId) {
      const r = n.playlistVideoRenderer;
      const title = r.title?.runs?.map((x: any) => x.text).join("") || r.title?.simpleText || "";
      if (!seen.has(r.videoId) && title) {
        seen.add(r.videoId);
        out.push({ id: r.videoId, title, length: r.lengthText?.simpleText });
      }
      return;
    }
    // Current YouTube layout: playlist rows are lockupViewModel entries.
    if (n.lockupViewModel?.contentId && /^[\w-]{11}$/.test(n.lockupViewModel.contentId)) {
      const l = n.lockupViewModel;
      const title = l.metadata?.lockupMetadataViewModel?.title?.content || "";
      if (!seen.has(l.contentId) && title) {
        seen.add(l.contentId);
        out.push({ id: l.contentId, title });
      }
      return;
    }
    for (const v of Object.values(n)) walk(v);
  };
  walk(data);
  return out;
}

function fromFeed(xml: string): Video[] {
  const out: Video[] = [];
  for (const m of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
    const e = m[1];
    const id = e.match(/<yt:videoId>([\w-]{11})<\/yt:videoId>/)?.[1];
    const title = e.match(/<title>([\s\S]*?)<\/title>/)?.[1];
    const published = e.match(/<published>([^<]+)<\/published>/)?.[1];
    if (id && title) out.push({ id, title: decode(title.trim()), published });
  }
  return out;
}

export async function GET(req: NextRequest) {
  const list = req.nextUrl.searchParams.get("list") || "";
  if (!LIST_RE.test(list)) return NextResponse.json({ error: "invalid list" }, { status: 400 });
  let videos: Video[] = [];
  try {
    const r = await fetch(`https://www.youtube.com/playlist?list=${list}&hl=en`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        "Accept-Language": "en",
        Cookie: "CONSENT=YES+1; SOCS=CAI",
      },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000),
    });
    if (r.ok) {
      videos = fromPage(await r.text());
    }
  } catch {}
  if (!videos.length) {
    try {
      const r = await fetch(`https://www.youtube.com/feeds/videos.xml?playlist_id=${list}`, {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(8000),
      });
      if (r.ok) videos = fromFeed(await r.text());
    } catch {}
  }
  return NextResponse.json({ videos }, { headers: { "Cache-Control": videos.length ? CACHE : "no-store" } });
}

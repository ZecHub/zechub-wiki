import { ARBORIST_PLAYLIST_ID, type ArboristRecording } from "@/constants/arboristRecordings";

const decode = (s: string) =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'");

/** "Arborist Call 10-15-2026" -> "2026-10-15" (null when the title carries no date). */
export function dateFromTitle(title: string): string | null {
  const m = title.match(/(\d{1,2})-(\d{1,2})-(\d{4})/);
  if (!m) return null;
  return `${m[3]}-${m[1].padStart(2, "0")}-${m[2].padStart(2, "0")}`;
}

/**
 * The newest videos of the Zcash Foundation Arborist playlist, read from its public RSS feed
 * (latest 15, no API key). Server-side only, cached for an hour; returns [] when YouTube cannot
 * be reached so the page falls back to the checked-in list.
 */
export async function fetchLiveArboristRecordings(): Promise<ArboristRecording[]> {
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?playlist_id=${ARBORIST_PLAYLIST_ID}`,
      { next: { revalidate: 3600 }, signal: AbortSignal.timeout(8000) },
    );
    if (!res.ok) return [];
    const xml = await res.text();
    const out: ArboristRecording[] = [];
    for (const m of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
      const id = m[1].match(/<yt:videoId>([\w-]{11})<\/yt:videoId>/)?.[1];
      const rawTitle = m[1].match(/<title>([\s\S]*?)<\/title>/)?.[1];
      if (!id || !rawTitle) continue;
      const title = decode(rawTitle.trim());
      out.push({ id, date: dateFromTitle(title), title, duration: "" });
    }
    return out;
  } catch {
    return [];
  }
}

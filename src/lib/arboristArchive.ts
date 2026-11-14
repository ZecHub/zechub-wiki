import { arboristCalls } from "@/constants/arboristCalls";
import { arboristRecordings, type ArboristRecording } from "@/constants/arboristRecordings";
import summariesJson from "@/constants/arboristSummaries.json";

import type { MediaArchiveEntry } from "@/components/MediaArchive/types";

export type ArchiveEntry = MediaArchiveEntry;

const watchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;
const youtubeId = (url: string) => url.match(/[?&]v=([\w-]{11})/)?.[1] ?? null;

const toIso = (label: string): string | null => {
  const t = Date.parse(`${label} UTC`);
  return Number.isNaN(t) ? null : new Date(t).toISOString().slice(0, 10);
};

// Video-only entries without a date in the title are ordered by where YouTube lists them,
// i.e. next to the dated videos that follow them in the playlist.
const sortDateFor = (recordings: ArboristRecording[], position: number): string => {
  const next = recordings.slice(position + 1).find((r) => r.date);
  return next?.date ?? "0000-00-00";
};

/**
 * Notes archive merged with the Zcash Foundation playlist. A recording is attached to the
 * archive entry that already links the same YouTube video (or, failing that, has the same
 * date); recordings the archive does not know become entries of their own.
 */
export type ArboristSummaries = Record<string, { summary: string; topics?: string[] }>;

export function buildArboristArchive(
  /** Newer recordings found on YouTube that the checked-in list does not have yet. */
  liveRecordings: ArboristRecording[] = [],
  summaries: ArboristSummaries = summariesJson as ArboristSummaries,
): ArchiveEntry[] {
  const known = new Set(arboristRecordings.map((r) => r.id));
  const recordings = [...liveRecordings.filter((r) => !known.has(r.id)), ...arboristRecordings];

  const entries: ArchiveEntry[] = arboristCalls.map((c) => ({
    key: `call-${c.id}`,
    label: typeof c.id === "number" ? `#${c.id}` : String(c.id),
    date: toIso(c.date),
    title: null,
    duration: null,
    dedicated: false,
    video: c.video ?? "",
    videoId: youtubeId(c.video ?? ""),
    notes: c.notes ?? "",
    agenda: c.agenda ?? "",
    twitter: c.twitter ?? "",
  }));

  const byVideo = new Map<string, ArchiveEntry>();
  const byDate = new Map<string, ArchiveEntry>();
  for (const e of entries) {
    if (e.videoId && !byVideo.has(e.videoId)) byVideo.set(e.videoId, e);
    // Only numbered calls take part in the date match.
    if (e.date && e.label.startsWith("#") && !byDate.has(e.date)) byDate.set(e.date, e);
  }

  const sortDate = new Map<string, string>();
  recordings.forEach((r, i) => {
    const match = byVideo.get(r.id) ?? (r.date && !r.dedicated ? byDate.get(r.date) : undefined);
    if (match) {
      match.title = r.title;
      match.duration = r.duration;
      match.dedicated = Boolean(r.dedicated);
      if (!match.video) {
        match.video = watchUrl(r.id);
        match.videoId = r.id;
      }
      return;
    }
    const e: ArchiveEntry = {
      key: `video-${r.id}`,
      label: "",
      date: r.date,
      title: r.title,
      duration: r.duration,
      dedicated: Boolean(r.dedicated),
      video: watchUrl(r.id),
      videoId: r.id,
      notes: "",
      agenda: "",
      twitter: "",
    };
    if (!r.date) sortDate.set(e.key, sortDateFor(recordings, i));
    entries.push(e);
  });

  for (const e of entries) {
    const s = e.videoId ? summaries[e.videoId] : undefined;
    if (s?.summary) {
      e.summary = s.summary;
      e.topics = s.topics ?? [];
    }
  }

  const key = (e: ArchiveEntry) => sortDate.get(e.key) ?? e.date ?? "0000-00-00";
  return entries.sort((a, b) => key(b).localeCompare(key(a)));
}

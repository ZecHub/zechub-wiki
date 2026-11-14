/** One row of a MediaArchivePage: a recording plus the material linked to it. */
export type MediaArchiveEntry = {
  key: string;
  /** "#75" for numbered calls, the call's own name for special entries, "" for video-only entries. */
  label: string;
  /** ISO date (YYYY-MM-DD) or null when neither the notes archive nor the video title has one. */
  date: string | null;
  title: string | null;
  duration: string | null;
  dedicated: boolean;
  video: string;
  /** YouTube video id when the video is on YouTube. */
  videoId: string | null;
  notes: string;
  agenda: string;
  twitter: string;
};

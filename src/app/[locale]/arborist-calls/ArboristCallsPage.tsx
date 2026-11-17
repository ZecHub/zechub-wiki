"use client";

import { useMemo } from "react";
import MediaArchivePage from "@/components/MediaArchive/MediaArchivePage";
import type { MediaArchiveEntry } from "@/components/MediaArchive/types";
import { ARBORIST_PLAYLIST_ID } from "@/constants/arboristRecordings";
import { buildArboristArchive } from "@/lib/arboristArchive";

// Official sources (see zfnd.org/arborist-calls).
const LINKS = [
  {
    label: "Recordings playlist",
    href: `https://www.youtube.com/playlist?list=${ARBORIST_PLAYLIST_ID}`,
  },
  {
    label: "Older calls (ECC channel)",
    href: "https://www.youtube.com/playlist?list=PLVm6KZ09QEQyN0hbk_zbH7MUqbA0fNGI4",
  },
  {
    label: "Meeting notes",
    href: "https://github.com/ZcashCommunityGrants/arboretum-notes",
  },
  { label: "Foundation page", href: "https://zfnd.org/arborist-calls/" },
];

export default function ArboristCallsPage({ entries: provided }: { entries?: MediaArchiveEntry[] }) {
  // The route passes entries that include videos YouTube published after the last sync;
  // without them (tests, previews) the checked-in archive is used.
  const entries = useMemo(() => provided ?? buildArboristArchive(), [provided]);
  return (
    <MediaArchivePage
      eyebrow="Zcash protocol development"
      title="Arborist Calls"
      description="Bi-weekly protocol development meetings focused on tracking upcoming protocol deployment logistics, consensus node implementation issues, and protocol research. Watch the recordings from the Zcash Foundation channel and browse the notes from each call."
      links={LINKS}
      playlistId={ARBORIST_PLAYLIST_ID}
      carouselLabel="Recordings from the Zcash Foundation channel"
      entries={entries}
      dedicatedDescription="Calls dedicated to a single topic, such as a network upgrade."
      archiveDescription="Every recording from the Foundation channel, together with the notes, agendas and discussion threads linked for each call."
      searchPlaceholder="Call number, date or title"
    />
  );
}

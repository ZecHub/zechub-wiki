# MediaArchive

Template for a page that publishes a recurring video series (calls, workshops, community meetings).

It renders: header with source links, a YouTube playlist carousel, highlighted "dedicated" editions and a searchable archive with year filter.

## Adding a new series

1. Put the playlist videos in a constants file as `{ id, date, title, duration, dedicated? }`.
2. Write a small builder that returns `MediaArchiveEntry[]` newest first
   (see `src/lib/arboristArchive.ts`, which also merges the notes archive).
3. Render `<MediaArchivePage />` from a client component
   (see `src/app/[locale]/aborist-calls/ArboristCallsPage.tsx`).

Colors come from the theme tokens (`brand`, `brand-soft`), so light and dark themes work without extra code.

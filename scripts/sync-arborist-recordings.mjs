#!/usr/bin/env node
/**
 * Add new videos of the Zcash Foundation Arborist playlist to
 * src/constants/arboristRecordings.ts (newest first). The page already shows new
 * videos live; this keeps the checked-in list complete once they age out of the
 * playlist's RSS feed (latest 15).
 *
 *   node scripts/sync-arborist-recordings.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const FILE = join(root, "src/constants/arboristRecordings.ts");
const src = await readFile(FILE, "utf8");

const playlist = src.match(/ARBORIST_PLAYLIST_ID\s*=\s*"([^"]+)"/)?.[1];
if (!playlist) throw new Error("ARBORIST_PLAYLIST_ID not found");

const res = await fetch(`https://www.youtube.com/feeds/videos.xml?playlist_id=${playlist}`);
if (!res.ok) throw new Error(`RSS feed answered ${res.status}`);
const xml = await res.text();

const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'");
const dateFromTitle = (t) => {
  const m = t.match(/(\d{1,2})-(\d{1,2})-(\d{4})/);
  return m ? `${m[3]}-${m[1].padStart(2, "0")}-${m[2].padStart(2, "0")}` : null;
};

const fresh = [];
for (const m of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
  const id = m[1].match(/<yt:videoId>([\w-]{11})<\/yt:videoId>/)?.[1];
  const raw = m[1].match(/<title>([\s\S]*?)<\/title>/)?.[1];
  if (!id || !raw || src.includes(`id: "${id}"`)) continue;
  const title = decode(raw.trim());
  fresh.push({ id, title, date: dateFromTitle(title) });
}

if (!fresh.length) {
  console.log("No new recordings.");
  process.exit(0);
}

fresh.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
const rows = fresh
  .map(
    (r) =>
      `  { id: ${JSON.stringify(r.id)}, date: ${r.date ? JSON.stringify(r.date) : "null"}, title: ${JSON.stringify(r.title)}, duration: "" },`,
  )
  .join("\n");
const marker = "export const arboristRecordings: ArboristRecording[] = [\n";
if (!src.includes(marker)) throw new Error("arboristRecordings array not found");
await writeFile(FILE, src.replace(marker, marker + rows + "\n"));
console.log(`Added ${fresh.length} recording(s): ${fresh.map((r) => r.title).join("; ")}`);

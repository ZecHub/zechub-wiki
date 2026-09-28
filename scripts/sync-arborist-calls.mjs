#!/usr/bin/env node
/**
 * Rebuild src/constants/arboristCalls.ts from
 * ZcashCommunityGrants/arboretum-notes, keeping video / twitter / agenda
 * already stored in the local file.
 *
 *   node scripts/sync-arborist-calls.mjs
 *
 * Optional:
 *   ARBORETUM_TOKEN=ghp_...  GitHub token if you hit API rate limits
 */
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const NOTES_API =
  "https://api.github.com/repos/ZcashCommunityGrants/arboretum-notes/contents/AllArboristCallNotes?ref=main";
const NOTES_BLOB =
  "https://github.com/ZcashCommunityGrants/arboretum-notes/blob/main/AllArboristCallNotes/";
const NOTES_RAW =
  "https://raw.githubusercontent.com/ZcashCommunityGrants/arboretum-notes/main/AllArboristCallNotes/";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, "src/constants/arboristCalls.ts");

const MONTHS = {
  jan: "Jan",
  january: "Jan",
  feb: "Feb",
  february: "Feb",
  mar: "Mar",
  march: "Mar",
  apr: "Apr",
  april: "Apr",
  may: "May",
  jun: "Jun",
  june: "Jun",
  jul: "Jul",
  july: "Jul",
  aug: "Aug",
  august: "Aug",
  sep: "Sep",
  sept: "Sep",
  september: "Sep",
  oct: "Oct",
  october: "Oct",
  nov: "Nov",
  november: "Nov",
  dec: "Dec",
  december: "Dec",
};

function headers() {
  const h = { "User-Agent": "zechub-wiki-arborist-sync", Accept: "application/vnd.github+json" };
  if (process.env.ARBORETUM_TOKEN) {
    h.Authorization = `Bearer ${process.env.ARBORETUM_TOKEN}`;
  }
  return h;
}

async function ghJson(url) {
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) {
    throw new Error(`${url} -> ${res.status} ${await res.text()}`);
  }
  return res.json();
}

function parseExisting(src) {
  const byId = new Map();
  const specials = [];
  const re =
    /\{\s*id:\s*([^,]+),\s*date:\s*"([^"]*)",\s*agenda:\s*"([^"]*)",\s*notes:\s*"([^"]*)",\s*twitter:\s*"([^"]*)",\s*video:\s*"([^"]*)",\s*status:\s*"([^"]*)",\s*\}/gs;
  let m;
  while ((m = re.exec(src))) {
    const rawId = m[1].trim();
    const row = {
      id: rawId.startsWith('"') ? rawId.slice(1, -1) : Number(rawId),
      date: m[2],
      agenda: m[3],
      notes: m[4],
      twitter: m[5],
      video: m[6],
      status: m[7],
    };
    if (typeof row.id === "number") byId.set(row.id, row);
    else specials.push(row);
  }
  return { byId, specials };
}

function callIdFromName(name) {
  const m = name.match(/call[^\d]*(\d+)/i);
  return m ? Number(m[1]) : null;
}

function parseDate(markdown) {
  const line = markdown.match(/Meeting Date\/Time:\s*(.+)/i);
  if (!line) return "";
  const raw = line[1].replace(/,?\s*\d{1,2}:\d{2}\s*UTC.*$/i, "").trim();
  const m = raw.match(/(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+),?\s+(\d{4})/i);
  if (!m) return raw.replace(/,$/, "");
  const mon = MONTHS[m[2].toLowerCase()] || m[2];
  return `${m[1]} ${mon} ${m[3]}`;
}

function parseVideo(markdown) {
  const m = markdown.match(
    /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/i,
  );
  return m ? `https://www.youtube.com/watch?v=${m[1]}` : "";
}

function encodeNotesPath(name) {
  return NOTES_BLOB + encodeURIComponent(name);
}

function emit(row) {
  const id =
    typeof row.id === "number" ? String(row.id) : JSON.stringify(row.id);
  return `  {
    id: ${id},
    date: ${JSON.stringify(row.date)},
    agenda: ${JSON.stringify(row.agenda || "")},
    notes: ${JSON.stringify(row.notes || "")},
    twitter: ${JSON.stringify(row.twitter || "")},
    video: ${JSON.stringify(row.video || "")},
    status: ${JSON.stringify(row.status || "Completed")},
  }`;
}

async function main() {
  const existingSrc = await readFile(OUT, "utf8");
  const { byId, specials } = parseExisting(existingSrc);

  const listing = await ghJson(NOTES_API);
  const files = listing.filter(
    (f) =>
      f.type === "file" &&
      /\.md$/i.test(f.name) &&
      !/^TEMPLATE/i.test(f.name) &&
      !/sandblast/i.test(f.name),
  );

  let added = 0;
  let dated = 0;
  for (const file of files) {
    const id = callIdFromName(file.name);
    if (id == null) continue;
    const prev = byId.get(id) || {
      id,
      date: "",
      agenda: "",
      notes: "",
      twitter: "",
      video: "",
      status: "Completed",
    };
    if (!byId.has(id)) added += 1;
    prev.notes = encodeNotesPath(file.name);
    if (!prev.date || !prev.video) {
      const md = await fetch(NOTES_RAW + encodeURIComponent(file.name)).then(
        (r) => r.text(),
      );
      if (!prev.date) {
        prev.date = parseDate(md);
        if (prev.date) dated += 1;
      }
      if (!prev.video) prev.video = parseVideo(md);
    }
    byId.set(id, prev);
  }

  const numeric = [...byId.values()].sort((a, b) => b.id - a.id);
  const body = [...numeric, ...specials].map(emit).join(",\n");
  const out = `export const arboristCalls = [\n${body},\n];\n`;
  await writeFile(OUT, out);
  console.log(
    `Wrote ${numeric.length} numbered calls + ${specials.length} special rows (${added} new). ${OUT}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

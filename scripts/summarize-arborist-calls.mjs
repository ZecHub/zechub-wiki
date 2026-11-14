#!/usr/bin/env node
/**
 * Write a short AI summary and topic tags for every Arborist call that has notes but no summary yet.
 * The text is generated only from the published meeting notes and saved to
 * src/constants/arboristSummaries.json (keyed by YouTube video id), so nothing is generated at
 * page-view time and every summary can be reviewed in a pull request.
 *
 *   ANTHROPIC_API_KEY=sk-ant-... node scripts/summarize-arborist-calls.mjs
 *
 * Options:  --limit 20   only the newest N missing calls (default: all)
 *           --force      regenerate summaries that already exist
 * Env:      ANTHROPIC_MODEL (default claude-sonnet-5-5)
 */
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const CALLS = join(root, "src/constants/arboristCalls.ts");
const OUT = join(root, "src/constants/arboristSummaries.json");
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";

const key = process.env.ANTHROPIC_API_KEY;
if (!key) {
  console.log("ANTHROPIC_API_KEY is not set: skipping summaries.");
  process.exit(0);
}

const args = process.argv.slice(2);
const force = args.includes("--force");
const limit = Number(args[args.indexOf("--limit") + 1]) || Infinity;

// Fixed vocabulary so the archive filter stays short and consistent.
const TOPICS = [
  "Network upgrades",
  "Zebra",
  "Zcashd",
  "Zallet",
  "Wallets",
  "Shielded assets (ZSAs)",
  "Orchard and Ironwood",
  "Zcash Improvement Proposals",
  "Governance and funding",
  "Research and privacy",
  "Consensus and mining",
  "Light clients and indexers",
  "Post-quantum",
  "Tachyon",
  "Ecosystem and community",
];

const callsSrc = await readFile(CALLS, "utf8");
const recSrc = await readFile(join(root, "src/constants/arboristRecordings.ts"), "utf8");

// Same matching the page uses: a call takes the video it links, or else the recording from its date.
const toIso = (label) => {
  const t = Date.parse(`${label} UTC`);
  return Number.isNaN(t) ? null : new Date(t).toISOString().slice(0, 10);
};
const byDate = new Map();
for (const m of recSrc.matchAll(/\{\s*id:\s*"([\w-]{11})",\s*date:\s*(null|"[^"]*")[^}]*?(dedicated:\s*true)?\s*\}/g)) {
  const date = m[2] === "null" ? null : m[2].slice(1, -1);
  if (date && !m[3] && !byDate.has(date)) byDate.set(date, m[1]);
}

const calls = [...callsSrc.matchAll(/id:\s*(\d+),\s*date:\s*"([^"]*)"[\s\S]*?notes:\s*"([^"]*)",[\s\S]*?video:\s*"([^"]*)"/g)].map((m) => ({
  id: Number(m[1]),
  notes: m[3],
  videoId: m[4].match(/[?&]v=([\w-]{11})/)?.[1] ?? byDate.get(toIso(m[2])) ?? null,
}));

let summaries = {};
try {
  summaries = JSON.parse(await readFile(OUT, "utf8"));
} catch {}

const todo = calls
  .filter((c) => c.notes && c.videoId && (force || !summaries[c.videoId]))
  .sort((a, b) => b.id - a.id)
  .slice(0, limit);

if (!todo.length) {
  console.log("Every call with notes already has a summary.");
  process.exit(0);
}

const toRaw = (url) =>
  url
    .replace("https://github.com/", "https://raw.githubusercontent.com/")
    .replace("/blob/", "/");

const PROMPT = (notes) => `You summarize meeting notes of the Zcash Arborist call for a public wiki.

Rules:
- Use ONLY what the notes below say. Do not add background, opinions, dates, numbers or names that are not in them.
- Write 2 or 3 plain sentences (at most 60 words) saying what was discussed or decided. No bullet points, no hype.
- Choose 1 to 4 topics, only from this list: ${TOPICS.join("; ")}.
- If the notes hold no substantive content, answer {"summary":"","topics":[]}.
- Answer with a single JSON object {"summary": string, "topics": string[]} and nothing else.

NOTES:
${notes}`;

async function summarize(notes) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 400,
      messages: [{ role: "user", content: PROMPT(notes.slice(0, 30000)) }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic API ${res.status}: ${await res.text()}`);
  const text = (await res.json()).content?.map((b) => b.text ?? "").join("") ?? "";
  const json = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
  const summary = String(json.summary ?? "").replace(/\s+/g, " ").trim();
  const topics = (Array.isArray(json.topics) ? json.topics : []).filter((t) => TOPICS.includes(t)).slice(0, 4);
  return { summary, topics };
}

let done = 0;
for (const c of todo) {
  try {
    const notesRes = await fetch(toRaw(c.notes));
    if (!notesRes.ok) throw new Error(`notes ${notesRes.status}`);
    const { summary, topics } = await summarize(await notesRes.text());
    if (!summary) {
      console.log(`#${c.id}: notes have no substantive content, skipped`);
      continue;
    }
    summaries[c.videoId] = { summary, topics };
    done++;
    console.log(`#${c.id}: ${topics.join(", ")}`);
    // Save as we go so an interrupted run keeps its work.
    await writeFile(OUT, JSON.stringify(summaries, null, 2) + "\n");
  } catch (err) {
    console.error(`#${c.id}: ${err.message}`);
  }
}
console.log(`${done} summar${done === 1 ? "y" : "ies"} written to ${OUT}`);

// Downloads a cover image for every YouTube video the wiki embeds and stores it under
// public/video-thumbs/<id>.webp, so the click-to-load cards can show a cover without the
// visitor's browser ever contacting YouTube. Run it once on a machine with internet access:
//
//   node scripts/video-thumbnails.mjs
//
// IDs come from scripts/video-ids.txt (one per line, collected from the ZecHub content repo)
// plus every YouTube link found under src/. Existing files are skipped, so it is safe to re-run.
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public", "video-thumbs");
const ID_RE = /(?:youtube(?:-nocookie)?\.com\/(?:embed\/|watch\?v=|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/g;

async function walk(dir, out = []) {
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await walk(p, out);
    else if (/\.(tsx?|mdx?|json)$/.test(e.name)) out.push(p);
  }
  return out;
}

const ids = new Set();
try {
  for (const l of (await fs.readFile(path.join(root, "scripts", "video-ids.txt"), "utf8")).split("\n")) {
    if (/^[A-Za-z0-9_-]{11}$/.test(l.trim())) ids.add(l.trim());
  }
} catch {}
for (const f of await walk(path.join(root, "src"))) {
  for (const m of (await fs.readFile(f, "utf8")).matchAll(ID_RE)) ids.add(m[1]);
}

await fs.mkdir(outDir, { recursive: true });
const sources = ["maxresdefault", "sddefault", "mqdefault"];
let done = 0, skipped = 0, failed = [];

async function fetchOne(id) {
  const dest = path.join(outDir, `${id}.webp`);
  try { await fs.access(dest); skipped++; return; } catch {}
  for (const name of sources) {
    const res = await fetch(`https://i.ytimg.com/vi/${id}/${name}.jpg`);
    if (!res.ok) continue;
    const buf = Buffer.from(await res.arrayBuffer());
    const meta = await sharp(buf).metadata();
    // 4:3 variants carry black bars; crop them to 16:9.
    let img = sharp(buf);
    if (meta.width && meta.height && meta.width / meta.height < 1.7) {
      const h = Math.round((meta.width * 9) / 16);
      img = img.extract({ left: 0, top: Math.round((meta.height - h) / 2), width: meta.width, height: h });
    }
    await img.resize({ width: 640, withoutEnlargement: true }).webp({ quality: 78 }).toFile(dest);
    done++;
    return;
  }
  failed.push(id);
}

const list = [...ids];
const queue = list.slice();
await Promise.all(Array.from({ length: 6 }, async () => {
  while (queue.length) await fetchOne(queue.shift());
}));
console.log(`${list.length} videos: ${done} downloaded, ${skipped} already there, ${failed.length} unavailable`);
if (failed.length) console.log("Unavailable (private or removed):", failed.join(", "));

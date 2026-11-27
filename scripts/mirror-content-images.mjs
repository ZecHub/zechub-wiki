// Mirrors the images used by the ZecHub content repo into public/content-images/.
//
// The site's Content-Security-Policy only lets pages load images from the site itself and a short list of hosts,
// so an image that a page links straight from raw.githubusercontent.com is blocked in the browser. MdxComponent's
// `img` renderer swaps such an image for a local copy when one exists. This script creates those copies.
//
//   node scripts/mirror-content-images.mjs            # check only: list images that still need a copy (exit 1 if any)
//   node scripts/mirror-content-images.mjs --write    # download, convert to webp and save the missing ones
//   node scripts/mirror-content-images.mjs --write --force   # also redo copies that already exist
//
// Run it on a machine with internet access. Optional: set GITHUB_TOKEN to avoid the anonymous GitHub API rate limit
// (the token is only ever sent to api.github.com).
//
// Safety: only https://raw.githubusercontent.com/ZecHub/zechub/main/site/**.{png,jpg,jpeg} is fetched (no redirects,
// no other hosts), every download is size-capped and checked by its file signature, images are re-encoded by sharp
// (so the original bytes are never served), and output names are restricted to [a-z0-9-].webp inside the output folder.
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const OWNER = "ZecHub";
const REPO = "zechub";
const BRANCH = "main";
const RAW_PREFIX = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/site/`;
const MAX_MD_BYTES = 2 * 1024 * 1024;
const MAX_IMG_BYTES = 8 * 1024 * 1024;
const MAX_WIDTH = 1600;
const CONCURRENCY = 4;
const TIMEOUT_MS = 30_000;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public", "content-images");

// Must stay identical to mirroredContentImage() in src/lib/mirroredContentImage.ts.
export function mirrorName(url) {
  const m = /^https:\/\/raw\.githubusercontent\.com\/ZecHub\/zechub\/main\/site\/(.+)\.(png|jpe?g)$/i.exec(url);
  if (!m) return "";
  let p = m[1];
  try {
    p = decodeURIComponent(p);
  } catch {
    /* keep the raw path */
  }
  const name = `${p.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.webp`;
  return /^[a-z0-9-]+\.webp$/.test(name) ? name : "";
}

// Image URLs written in a markdown file: ![alt](src "title") and <img src="...">, resolved against the file's folder.
export function imageUrlsIn(markdown, mdPath) {
  const found = new Set();
  const base = new URL(`https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${mdPath}`);
  const add = (raw) => {
    const src = String(raw || "").trim().replace(/^<|>$/g, "");
    if (!src || src.startsWith("data:") || src.startsWith("#")) return;
    try {
      const url = new URL(src, base).toString();
      if (url.startsWith(RAW_PREFIX)) found.add(url);
    } catch {
      /* not a URL */
    }
  };
  for (const m of markdown.matchAll(/!\[[^\]]*\]\(\s*(<[^>]+>|[^\s)]+)/g)) add(m[1]);
  for (const m of markdown.matchAll(/<img\b[^>]*?\bsrc\s*=\s*["']([^"']+)["']/gi)) add(m[1]);
  return found;
}

const hasSignature = (buf) =>
  (buf.length > 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) ||
  (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff);

async function fetchLimited(url, maxBytes, headers = {}) {
  const res = await fetch(url, { redirect: "error", signal: AbortSignal.timeout(TIMEOUT_MS), headers });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const declared = Number(res.headers.get("content-length") || 0);
  if (declared > maxBytes) throw new Error(`too large (${declared} bytes)`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length > maxBytes) throw new Error(`too large (${buf.length} bytes)`);
  return buf;
}

async function pool(items, worker) {
  const queue = [...items];
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (queue.length) await worker(queue.shift());
    }),
  );
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const write = args.has("--write");
  const force = args.has("--force");

  // 1. Every markdown file of the content repo.
  const headers = { Accept: "application/vnd.github+json", "User-Agent": "zechub-wiki-mirror-script" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const treeUrl = `https://api.github.com/repos/${OWNER}/${REPO}/git/trees/${BRANCH}?recursive=1`;
  const tree = JSON.parse((await fetchLimited(treeUrl, 40 * 1024 * 1024, headers)).toString("utf8"));
  if (tree.truncated) console.warn("Warning: the repository tree was truncated; some pages may be missing from this run.");
  const mdFiles = (tree.tree || []).filter((n) => n.type === "blob" && /^site\/.+\.md$/i.test(n.path)).map((n) => n.path);
  console.log(`Scanning ${mdFiles.length} markdown files...`);

  // 2. Every image they use that the CSP would block.
  const wanted = new Map(); // mirror name -> source url
  await pool(mdFiles, async (mdPath) => {
    try {
      const url = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${mdPath.split("/").map(encodeURIComponent).join("/")}`;
      const md = (await fetchLimited(url, MAX_MD_BYTES)).toString("utf8");
      for (const src of imageUrlsIn(md, mdPath)) {
        const name = mirrorName(src);
        if (name && !wanted.has(name)) wanted.set(name, src);
      }
    } catch (e) {
      console.warn(`  skipped ${mdPath}: ${e.message}`);
    }
  });

  // 3. Which copies are missing.
  await fs.mkdir(outDir, { recursive: true });
  const todo = [];
  for (const [name, src] of wanted) {
    const exists = await fs.stat(path.join(outDir, name)).then(() => true, () => false);
    if (!exists || force) todo.push([name, src]);
  }
  console.log(`${wanted.size} images are linked from GitHub; ${todo.length} ${force ? "to (re)create" : "have no local copy yet"}.`);
  if (!write) {
    for (const [name, src] of todo) console.log(`  missing: ${name}\n           ${src}`);
    if (todo.length) console.log("\nRun again with --write to create them.");
    process.exit(todo.length ? 1 : 0);
  }

  // 4. Download, re-encode, save. (sharp is loaded only here, so the check mode needs nothing but Node.)
  const { default: sharp } = await import("sharp");
  let ok = 0;
  let failed = 0;
  await pool(todo, async ([name, src]) => {
    try {
      const buf = await fetchLimited(src, MAX_IMG_BYTES);
      if (!hasSignature(buf)) throw new Error("not a PNG/JPEG file");
      const webp = await sharp(buf, { limitInputPixels: 40_000_000 })
        .rotate()
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: 86 })
        .toBuffer();
      const target = path.join(outDir, name);
      if (path.dirname(target) !== outDir) throw new Error("bad output path");
      await fs.writeFile(target, webp);
      ok++;
      console.log(`  saved ${name} (${Math.round(webp.length / 1024)} KB)`);
    } catch (e) {
      failed++;
      console.warn(`  FAILED ${name}: ${e.message}`);
    }
  });
  console.log(`Done: ${ok} saved, ${failed} failed.`);
  process.exit(failed ? 1 : 0);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();

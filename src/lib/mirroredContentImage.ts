import { existsSync } from "node:fs";
import path from "node:path";

const GITHUB_SITE_IMAGE = /^https:\/\/raw\.githubusercontent\.com\/ZecHub\/zechub\/main\/site\/(.+)\.(png|jpe?g)$/i;

// "…/site/Zcash_Tech/assets/x.png" -> "/content-images/zcash-tech-assets-x.webp", only when that mirrored file exists.
// scripts/mirror-content-images.mjs creates these copies and must use the same naming rule.
export function mirroredContentImage(src?: string): string {
  const m = GITHUB_SITE_IMAGE.exec(String(src || ""));
  if (!m) return "";
  let p = m[1];
  try {
    p = decodeURIComponent(p);
  } catch {
    /* keep the raw path */
  }
  const name = `${p.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.webp`;
  return existsSync(path.join(process.cwd(), "public", "content-images", name)) ? `/content-images/${name}` : "";
}

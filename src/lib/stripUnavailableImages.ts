// The upstream markdown still points at /content-images/_unavailable.svg, a placeholder for images that
// were never recovered. It renders as a broken box, so it is removed everywhere: a link that only wraps
// the placeholder goes away with it, and a bare image or <img> tag is dropped from its line.
const PLACEHOLDER = "_unavailable.svg";

export function stripUnavailableImages(markdown: string): string {
  if (!markdown.includes(PLACEHOLDER)) return markdown;
  return markdown
    .replace(/<a\b[^>]*>\s*<img\b[^>]*_unavailable\.svg[^>]*>\s*<\/a>[ \t]*/gi, "")
    .replace(/<img\b[^>]*_unavailable\.svg[^>]*>[ \t]*/gi, "")
    .replace(/!\[[^\]]*\]\([^)\s]*_unavailable\.svg[^)]*\)[ \t]*/gi, "");
}

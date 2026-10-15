// Removes a leading YAML front-matter block before the page is rendered, so
// "published: 2024-01-12" does not show up as an <hr> plus an <h2>. Content
// files use CRLF as often as LF. Only a block whose top-level keys are all known
// metadata keys counts as front matter: a page that opens with a rule, a line
// like "Note: text" and another rule is prose, and keeps it.
// extractArticleMeta still reads the block from the unstripped markdown.
const METADATA_KEYS = new Set([
  "published", "date", "updated", "lastmod", "title", "description", "summary",
  "author", "authors", "image", "cover", "tags", "categories", "keywords",
  "lang", "language", "slug", "draft", "layout", "menutitle", "sidebar_label",
  "sidebar_position", "toc",
]);

export const stripFrontmatter = (markdown: string): string => {
  const m = /^(\uFEFF)?---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/.exec(markdown);
  if (!m) return markdown;
  const lines = m[2].split(/\r?\n/).filter((l) => l.trim() !== "" && !/^\s*#/.test(l));
  if (lines.length === 0) return markdown;
  const isMetadata = lines.every((l) => {
    if (/^\s/.test(l)) return true; // indented continuation or list item under a key
    const key = /^([A-Za-z0-9_-]+)\s*:(\s|$)/.exec(l);
    return !!key && METADATA_KEYS.has(key[1].toLowerCase());
  });
  // The first line must be a key, not an indented line.
  return isMetadata && !/^\s/.test(lines[0]) ? markdown.slice(m[0].length) : markdown;
};

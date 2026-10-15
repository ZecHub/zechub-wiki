// Removes a leading YAML front-matter block before the page is rendered, so
// "published: 2024-01-12" does not show up as an <hr> plus an <h2>. Content
// files use CRLF as often as LF. Only a block of `key: value` lines counts as
// front matter: a page that merely opens with a horizontal rule keeps it.
// extractArticleMeta still reads the block from the unstripped markdown.
export const stripFrontmatter = (markdown: string): string => {
  const m = /^(\uFEFF)?---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/.exec(markdown);
  if (!m) return markdown;
  const lines = m[2].split(/\r?\n/).filter((l) => l.trim() !== "");
  if (lines.length === 0) return markdown;
  const isYaml = lines.every((l) => /^[A-Za-z0-9_-]+\s*:(\s|$)/.test(l) || /^\s+\S/.test(l) || /^\s*-\s/.test(l) || /^\s*#/.test(l));
  return isYaml ? markdown.slice(m[0].length) : markdown;
};

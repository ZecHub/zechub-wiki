export function normalizeMdx(markdown: string): string {
  return markdown.replace(/\sclass=/g, " className=");
}

/**
 * Keep collapsible research answers valid MDX regardless of the language used
 * inside their summary. A summary such as "Antwort" used to bypass the
 * English-only formatter in the route and caused the whole article to fail to
 * compile.
 */
export function normalizeResearchMdx(markdown: string): string {
  return markdown
    .replace(
      /(^|[^\n])\n*<details(\s[^>]*)?>\s*<summary(\s[^>]*)?>\s*([\s\S]*?)\s*<\/summary>\s*/gim,
      (
        _match,
        prefix = "",
        detailsAttributes = "",
        summaryAttributes = "",
        summary = "",
      ) =>
        `${prefix}${prefix ? "\n\n" : ""}<details${detailsAttributes}>\n<summary${summaryAttributes}>${summary.trim()}</summary>\n\n`,
    )
    .replace(/([^\n])\n*<\/details>/gi, "$1\n\n</details>")
    .replace(/<\/details>([^\n])/gi, "</details>\n\n$1");
}

const LINK_ONLY = /^\[[^\]\n]+\]\([^)\s]+(?:\s+"[^"]*")?\)$/;

/**
 * Many pages list their resources as one link per paragraph, which renders as loose, widely spaced
 * lines. Two or more such link-only paragraphs in a row become a bullet list. A single link on its own,
 * indented markup, tables, lists and fenced code are left alone.
 */
export function bulletizeLinkParagraphs(markdown: string): string {
  const lines = markdown.split("\n");
  const out: string[] = [];
  let fence: string | null = null;
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const fenceMatch = line.match(/^(\s*)(```|~~~)/);
    if (fenceMatch) {
      if (fence === null) fence = fenceMatch[2];
      else if (fenceMatch[2] === fence) fence = null;
      out.push(line);
      i += 1;
      continue;
    }
    const startsParagraph = fence === null && LINK_ONLY.test(line.trimEnd()) && (i === 0 || lines[i - 1].trim() === "");
    if (!startsParagraph) {
      out.push(line);
      i += 1;
      continue;
    }
    // Collect "link, blank, link, blank, ..." runs.
    const run: string[] = [line.trimEnd()];
    let j = i + 1;
    while (j + 1 < lines.length + 1 && lines[j] !== undefined && lines[j].trim() === "" && lines[j + 1] !== undefined && LINK_ONLY.test(lines[j + 1].trimEnd()) && (lines[j + 2] === undefined || lines[j + 2].trim() === "")) {
      run.push(lines[j + 1].trimEnd());
      j += 2;
    }
    if (run.length >= 2) {
      out.push(...run.map((l) => `- ${l}`));
      i = j;
    } else {
      out.push(line);
      i += 1;
    }
  }
  return out.join("\n");
}

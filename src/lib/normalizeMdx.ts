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

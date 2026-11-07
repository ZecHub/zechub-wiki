// Edits to the Lightwallet Nodes page (checked 5 Nov 2026):
// - Ywallet: the section now says it no longer receives updates and points to Zkool, its successor (the Zkool
//   documentation calls it "the successor to Ywallet"; the forum thread confirms it is a complete rewrite).
//   The oversized Ywallet screenshot is removed because the app no longer changes; the Zingo and eZcash
//   screenshots are limited to 260px so they stop filling the column.
// - Zaino version: "0.8.0 released in August 2026" became 0.10.1 (September 29, 2026, still the latest on 5 Nov).
// - The TL;DR repeated the first sentence of the next section and the closing Summary repeated the TL;DR, so
//   the duplicate sentence and the Summary are gone; template headings ("Core Explanation", "Visual / Analogy",
//   "Deep Dive") got descriptive names.
// - The server list was not re-checked, so the page now says it dates from August 2026.
// Every replacement must match exactly, otherwise the original markdown is returned untouched.
const ZINGO = "![Zingo server settings](/content-images/ea8f7672-e644-41a5-a422-db131740404a-2626f5fa79.webp)";
const EZCASH = "![eZcash server settings](/content-images/655c0172-61a0-4322-b8cf-4eee4bb53b51-0b93df2e71.webp)";
const small = (alt: string, md: string) => md.replace(/\(([^)]+)\)/, (_m, src) => `(${src})`) && `<img src="${md.match(/\(([^)]+)\)/)![1]}" alt="${alt}" width="260" />`;

const EDITS: [string, string][] = [
  ["## TL;DR", "## TL;DR"],
  ["## Core Explanation", "## How light wallet servers work"],
  ["Most people use Zcash through a light wallet, which does not download the whole blockchain. Instead, it talks to a server that has already done that work. This page explains what those servers are,",
   "This page explains what those servers are,"],
  ["## Visual / Analogy", "## An analogy"],
  ["## Deep Dive", "## Details"],
  ["## Practical Implications", "## Choosing and changing your server"],
  ["## Common Mistakes", "## Common mistakes"],
  ["## Related Pages", "## Related pages"],
  ["It is under active development, with version 0.8.0 released in August 2026.",
   "It is under active development. Version 0.10.1, released on September 29, 2026, was the latest release as of November 5, 2026. For measured performance against another indexer, see [Indexer Benchmark: Zaino vs Ztreamer](/zcash-tech/indexer-benchmark-zaino-vs-ztreamer)."],
  ["Servers listed on that dashboard at the time of writing:", "Servers listed on that dashboard in August 2026 (not re-checked since):"],
  ["#### Ywallet\n\nThe cog in the top right corner, then the Zcash tab.\n\n![Ywallet server settings](/content-images/b0a2910b-dbdf-4292-8e69-af5a386aa183-f51f098d19.webp)",
   "#### Zkool (successor to Ywallet)\n\n> **Ywallet no longer receives updates.** Its successor is Zkool, a complete rewrite from the same developer, so it is a separate app to install, not an update. Zkool connects to lightwalletd-compatible servers (lightwalletd or Zaino) and can send its traffic over Tor, the Nym mixnet or an external proxy. Its server and network settings are explained in the [Zkool documentation](https://hhanh00.github.io/zkool2)."],
  [ZINGO, small("Zingo server settings", ZINGO)],
  [EZCASH, small("eZcash server settings", EZCASH)],
  ["**Last updated:** August 2026", "**Last updated:** November 2026 (wallet notes and Zaino version). Server list: August 2026."],
];

export function rewriteLightwalletNodes(original: string): string {
  if (!/^# Zcash Lightwallet Nodes\s*$/im.test(original)) return original;
  let text = original;
  const summary = text.match(/## Summary\n[\s\S]*?(?=## Related Pages)/);
  if (!summary) return original;
  text = text.replace(summary[0], "");
  for (const [from, to] of EDITS) {
    if (!text.includes(from)) return original;
    text = text.replace(from, to);
  }
  return text;
}

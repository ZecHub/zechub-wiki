// Editorial restructure of "Zcash Payment Processors". The data and wording come from the
// ZecHub/zechub repo; this only reorders the page: the recommendation moves to the top, the wide
// comparison table becomes one card per provider (readable on a phone), and the metadata bullets
// at the top of every provider section are dropped because the cards already show them.
// If the source no longer has the expected shape, the original markdown is returned untouched.
export const PROCESSORS_MARKER = "[[processors:";

const NUMBER_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];

export type ProcessorCardData = {
  name: string;
  href: string;
  anchor: string;
  status: "shielded" | "transparent" | "unclear";
  statusLabel: string;
  rows: [string, string][];
  verified: string;
  /** Square mark for the logo tile; empty when only a wordmark exists (the tile then shows the initial). */
  logo: string;
  initial: string;
};

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function parseCards(md: string): ProcessorCardData[] {
  const lines = md.split("\n").filter((l) => /^\|/.test(l.trim()));
  if (lines.length < 4 || !/^\|\s*Processor\s*\|\s*Custody/i.test(lines[0])) return [];
  const cards: ProcessorCardData[] = [];
  for (const line of lines.slice(2)) {
    const cells = line.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
    if (cells.length < 7) return [];
    const m = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(cells[0]);
    if (!m) return [];
    const shielded = cells[2];
    const status = /^yes/i.test(shielded) ? "shielded" : /^no\b/i.test(shielded) ? "transparent" : "unclear";
    cards.push({
      name: m[1],
      href: m[2],
      anchor: slug(m[1]),
      status,
      statusLabel: status === "shielded" ? "Shielded ZEC" : status === "transparent" ? "Transparent only" : "Shielded unclear",
      rows: [
        ["Custody", cells[1]],
        ["Shielded ZEC", shielded],
        ["Self-host", cells[3]],
        ["Merchant fee", cells[4]],
        ["Regions / KYC", cells[5]],
      ],
      verified: cells[6],
      logo: "",
      initial: m[1].trim().charAt(0).toUpperCase(),
    });
  }
  return cards;
}

export function rewritePaymentProcessorsGuide(original: string): string {
  if (!/^# Zcash Payment Processors/im.test(original)) return original;
  const cards = parseCards(original);
  if (cards.length < 3) return original;

  const between = (from: RegExp, to: RegExp): string | null => {
    const a = from.exec(original);
    if (!a) return null;
    const rest = original.slice(a.index + a[0].length);
    const b = to.exec(rest);
    return (b ? rest.slice(0, b.index) : rest).trim();
  };

  const pick = between(/^### Which one to pick\s*$/im, /^---\s*$/m);
  const columns = between(/^### What the columns mean\s*$/im, /^### Which one to pick\s*$/im);
  const tail = /^### No longer accepting ZEC[\s\S]*$/im.exec(original)?.[0];
  if (!pick || !columns || !tail) return original;

  // Recommendation: unwrap the warning div and keep it as its own bold paragraph.
  const pickMd = pick.replace(/<\/?div[^>]*>/g, "").replace(/\n{3,}/g, "\n\n").trim();

  // Column definitions become a short list.
  const colParas = columns.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const defs = colParas.filter((p) => p.startsWith("**")).map((p) => `- ${p}`);
  const notes = colParas.filter((p) => !p.startsWith("**"));

  // Provider sections: drop the "- **Support Type** / Description / URL" bullets and the hidden logo copy,
  // keep the description as the opening sentence, and drop the horizontal rules between sections.
  const parts = original.split(/^---\s*$/m);
  const sections: string[] = [];
  for (const part of parts) {
    const h = /^\s*## \[([^\]]+)\]\(([^)]+)\)(.*)$/m.exec(part);
    if (!h) continue;
    const desc = /^- \*\*Description\*\*:\s*(.+)$/m.exec(part)?.[1]?.trim();
    let body = part.slice(part.indexOf(h[0]) + h[0].length);
    body = body
      .replace(/^- \*\*(?:Support Type|Description|URL)\*\*:.*$/gm, "")
      .replace(/^<img[^>]*hidden[^>]*\/>\s*$/gm, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
    // Remember the heading logo for the card and the heading tile; wordmarks are not used (no square mark yet).
    const src = /src="([^"]+)"/.exec(h[3])?.[1] ?? "";
    const card = cards.find((c) => c.name === h[1]);
    if (card && src && !/wordmark/i.test(src)) card.logo = src;
    sections.push(`## [${h[1]}](${h[2]})\n\n${desc ? `*${desc}*\n\n` : ""}${body}`);
  }
  if (sections.length !== cards.length) return original;

  const count = NUMBER_WORDS[cards.length] ?? String(cards.length);
  const encoded = Buffer.from(JSON.stringify(cards), "utf8").toString("base64");

  // Keep whatever precedes the title (the "Edit" badge), as the other guides do.
  const head = original.slice(0, original.search(/^# Zcash Payment Processors/im));

  return `${head}# Zcash Payment Processors

${count} ways to accept ZEC as a merchant, compared side by side. Each was checked against the provider's own site and API on **29 July 2026**. Support for privacy coins changes often, so confirm on the provider's site before you integrate.

## Which one to pick

${pickMd}

## Compare the options

${PROCESSORS_MARKER}${encoded}]]

### How to read the cards

${defs.join("\n")}

${notes.join("\n\n")}

${sections.join("\n\n")}

${tail.replace(/^### /gm, "## ").trim()}
`;
}

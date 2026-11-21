// Removes review-date labels from page text and fixes the statements that depended on them.
//
// A line such as "Last updated: October 2026" or "Checked 11 November 2026" promises that someone keeps the page
// current. Nobody does, so the label goes stale within days and makes the rest of the page look unchecked (see the
// style guide). Dates that belong to a fact (an activation block, a release date, a deadline) stay; only review
// stamps are removed. Git history already records when a page changed.
//
// Applied to every default-locale page after the page-specific rewrites. Every edit is optional: if the text it
// targets has changed upstream, that edit is skipped and the page still renders.

// A standalone label line: "**Last updated:** August 2026", "*Last updated: March 2026*", "> Last verified: 2026-07-29".
// The label may be followed by at most 60 characters, so a sentence that merely starts with these words is kept.
const LABEL_LINE = /^[ \t]*>?[ \t]*[*_]{0,2}Last (?:updated|verified|checked)[*_]{0,2}:?[*_]{0,2}[^\n]{0,60}$/i;

export function removeDateLabelLines(markdown: string): string {
  const lines = markdown.split("\n");
  const out: string[] = [];
  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    if (!inFence && LABEL_LINE.test(line)) {
      // Do not leave two blank lines where the label stood between blank lines.
      const prevBlank = out.length > 0 && out[out.length - 1].trim() === "";
      const nextBlank = i + 1 >= lines.length || lines[i + 1].trim() === "";
      if (prevBlank && nextBlank) i++;
      continue;
    }
    out.push(line);
  }
  return out.join("\n");
}

const MARGINAL_FEE_INTRO =
  "ZIP 317 sets the fee. Revision 2, specified in [ZIP 2009](https://zips.z.cash/zip-2009), lowers the marginal fee from 5,000 to 1,000 zatoshis, which makes the minimum fee 2,000 zatoshis instead of 10,000. It takes effect at a block height, not on a calendar date.";

const MARGINAL_FEE_HEIGHTS =
  "The fee change starts at Mainnet height **3,590,000** and Testnet height **4,465,026**. For wallets, the relevant height is the block in which the transaction is expected to be mined; nodes use the next block's height. See [ZIP 317](https://zips.z.cash/zip-0317) and ZIP 2009 for their status, and your wallet's release notes for when it adopts the lower fee.";

const PLISIO_NOTE =
  "> **Payments suspended.** Plisio's [homepage](https://plisio.net/) says incoming and outgoing payments are temporarily suspended while restoration work is underway. Check with the provider before sending funds. Its Zcash-specific page was unavailable when reviewed; this does not establish that ZEC has been delisted. The fee, custody and address-support details below come from the provider's documentation and have not been reverified.";

const EDITS: Array<[RegExp, string]> = [
  // Transactions: the fee section described a proposal and a calendar estimate that have since passed.
  [/^\*\*Checked 11 November 2026:\*\*[^\n]*$/m, MARGINAL_FEE_INTRO],
  [/^The proposal specifies Mainnet height \*\*3,590,000\*\*[^\n]*$/m, MARGINAL_FEE_HEIGHTS],
  // Payment processors.
  [/^> \*\*Payments suspended — checked 12 November 2026\.\*\*[^\n]*$/m, PLISIO_NOTE],
  // Mining pools and the Ledger guide: trailing "(checked 13 November 2026)" and "Checked on 15 October 2026."
  [/ \(checked \d{1,2} [A-Z][a-z]+ 20\d{2}\)/g, ""],
  [/ Checked on \d{1,2} [A-Z][a-z]+ 20\d{2}\./g, ""],
  // Is Zcash Post-Quantum?
  [
    /^Last checked 13 September 2026, except the Sprout row, which was updated on 13 November 2026 after NU7 activated\. /m,
    "",
  ],
  // Dash / FROST research brief and the Grayscale ETF page.
  [/^\*Sources checked 27 September 2026\. (Dash Platform[^\n]*)$/m, "*$1"],
  [/ Checked 30 September 2026\./g, ""],
  // Shielded Newsletter.
  [
    /not safe to run as-is against the current release\. This page is the updated procedure\. Checked against Zallet `v0\.1\.0-beta\.3` and the Zallet book as of 7 October 2026\./,
    "not safe to run as-is against later releases. This page is the updated procedure, written against Zallet `v0.1.0-beta.3`; check the Zallet book for newer changes.",
  ],
  // zecd: a version number and date in the intro go stale with every release.
  [
    /^\*\*Current version:\*\* 0\.5\.0-rc3 \(July 13, 2026\) — with Ironwood \(NU6\.3\) support\. Install via/m,
    "zecd supports Ironwood (NU6.3). Released versions are listed on [crates.io](https://crates.io/crates/zecd). Install via",
  ],
  // Where to donate, payment processors and the zecd comparison table: review dates and a pinned version.
  [/^> Last checked: October 27, 2026, on each organization's own donate page\. (Addresses change)/m, "> $1"],
  [/Each provider's own live currency list was checked on 29 July 2026 and Zcash is gone from both\./, "Each provider's own live currency list did not include Zcash when it was reviewed."],
  [/\| Active \(v0\.5\.0-rc3, Jul 2026\) \|/, "| Active |"],
  // Mining guide: do not name a "latest" version.
  [
    /Download lolMiner from GitHub \(latest version, e\.g\., 1\.88\)\./,
    "Download lolMiner from its [GitHub releases page](https://github.com/Lolliedieb/lolMiner-releases/releases).",
  ],
];

export function removeDateLabels(markdown: string): string {
  let text = markdown;
  for (const [pattern, replacement] of EDITS) text = text.replace(pattern, replacement);
  return removeDateLabelLines(text);
}

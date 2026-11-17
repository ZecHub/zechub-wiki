// "Zcash Library": swaps the plain "A | B | C" line for a filter box with a letter index. The glossary
// text and tables are left exactly as written in the ZecHub/zechub repo. If the source no longer has
// that line, the original markdown is returned untouched.
// Targeted fixes for entries that are out of date upstream. Each one only applies when the exact old
// text is still present, so it becomes a no-op once ZecHub/zechub corrects the entry.
const FIXES: Array<[string, string]> = [
  [
    "The Founder reward represents 20 percent of the total block reward and it is deducted from every block's value and transparently distributed to drive protocol development and growth.",
    "The original 20 percent share of every block reward that went to the founders, ECC and the Zcash Foundation. It ended at the first halving in November 2020 and was replaced by the Dev Fund, which today is the Zcash Community Grants share and the Deferred Dev Fund Lockbox (see NU6).",
  ],
  [
    "Transactions expire after approximately 25 minutes (20 blocks) if unconfirmed; funds return automatically.",
    "Unmined transactions expire after a set number of blocks (the default is 40 blocks, about 50 minutes at 75-second blocks, per ZIP 203); the funds were never spent, so they are available again. Block time drops to 25 seconds with NU7, so wallets may choose a different block count.",
  ],
  [
    "A sequence of 12 or 24 letters and numbers used to back up",
    "A sequence of 12 or 24 words used to back up",
  ],
  [
    "Currently, multisig functionality is only supported by transparent addresses.",
    "Native multisig scripts work only with transparent addresses. Shielded threshold signing is being built with FROST.",
  ],
  [
    "[Twitter](https://x.com/zcash)",
    "[X](https://x.com/zcash)",
  ],
  [
    "| XZC | An older ticker symbol for Zcash used on some legacy exchanges. The official ticker is ZEC. |\n",
    "",
  ],
  [
    "The official currency code for Zcash (some exchanges still show XZC).",
    "The official currency code for Zcash.",
  ],
];

export function rewriteZcashLibrary(original: string): string {
  for (const [from, to] of FIXES) original = original.split(from).join(to);
  const m = original.match(/^### Quick Navigation[ \t]*\n((?:\[[A-Z]\]\(#[a-z]\)(?:[ \t]*\|[ \t]*)?)+)[ \t]*\n+---[ \t]*\n/m);
  if (!m) return original;
  const letters = [...m[1].matchAll(/\[([A-Z])\]/g)].map((x) => x[1]).join(",");
  return original.replace(m[0], `<LibraryTools letters="${letters}" />\n\n`);
}

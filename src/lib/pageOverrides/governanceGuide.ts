// Zcash Governance (zcash-community/zcash-governance). The source describes the NU6-era model (12% in a protocol lockbox, ZIP 1016
// "Proposed") and stamps it "As of April 2026". ZIP 214 shows what is in consensus: NU6 (rev 1, block 2,726,400) created the 8% ZCG
// stream and the 12% deferred stream; NU6.1 (rev 2, block 3,146,400) made the 12% stream the Coinholder-Controlled Fund; NU7
// (rev 3, block 3,543,405) moved both end heights to 6,132,390 for 25-second blocks, and ZIP 2008 updated the ZCG address list.
// Removed: the date stamp, the "currently" ZIP editor names, and the ZIP 1016 quorum figure that no source here confirms.
// If an anchor is missing, the original markdown is returned untouched.
const MODEL = [
  "- **Since November 2024:** each block's new ZEC is split as follows (ZIP 214, as revised by NU6, NU6.1 and NU7).",
  "",
  "| Recipient | Share | What it funds |",
  "|--|--|--|",
  "| Miners | 80% | Direct block reward to miners |",
  "| Zcash Community Grants (ZCG) | 8% | Community grants. The stream runs until the third halving. |",
  "| Coinholder-Controlled Fund | 12% | Ecosystem grants under the rules of ZIP 1016. From NU6 until NU6.1 the same 12% accumulated in a protocol lockbox, which seeded this fund. |",
  "",
  "- **Before NU6 (2020 to November 2024):** 20% of every block subsidy went to development organizations.",
  "",
  "  - 7% -> Electric Coin Company (ECC) / Bootstrap Project",
  "  - 5% -> Zcash Foundation (ZF)",
  "  - 8% -> Major Grants (now Zcash Community Grants)",
  "",
  "### How the funding model evolved",
  "",
  "- **NU6 (November 2024, [ZIP 1015](https://zips.z.cash/zip-1015)):** ended the original fund and created the 8% ZCG stream and the 12% deferred lockbox stream.",
  "- **NU6.1 (November 2025, [ZIP 1016](https://zips.z.cash/zip-1016)):** turned the 12% stream into the Coinholder-Controlled Fund, seeded with the lockbox contents. Both streams run until the third halving.",
  "- **NU7 (November 2026):** moved both end heights to block 6,132,390 to account for 25-second blocks, and updated the ZCG address list with a new funding recipient ([ZIP 214](https://zips.z.cash/zip-0214) revision 3, [ZIP 2008](https://zips.z.cash/zip-2008)).",
  "",
  "How the fund pays out is defined in ZIP 1016 and the lockbox disbursement proposal, ZIP 271. Their statuses change, so read them on [zips.z.cash](https://zips.z.cash) before relying on a description of the process.",
  "",
].join("\n");

const FUTURE = [
  "5. **The Coinholder-Controlled Fund (ZIP 1016)**  ",
  "   - 12% of each block's new ZEC goes to this fund, which was seeded with the lockbox contents.  ",
  "   - ZIP 1016 describes quarterly coin-holder votes on grants, with Key-Holder Organizations administering payouts by multisig.  ",
  "   - The ZIP text on zips.z.cash is the authority on how disbursement works.",
  "",
].join("\n");

const TABLE = [
  "## 4. Quick Reference Table - Funding Evolution",
  "",
  "| Period | Miners | ECC/Bootstrap | ZF | ZCG | Lockbox / Coinholder fund | Notes |",
  "|--|--|--|--|--|--|--|",
  "| 2020 - Nov 2024 | 80% | 7% | 5% | 8% (Major Grants) | - | Original development fund (ZIP 1014) |",
  "| Nov 2024 - Nov 2025 | 80% | 0% | 0% | 8% | 12% (deferred lockbox) | NU6, ZIP 1015 |",
  "| Nov 2025 - third halving | 80% | 0% | 0% | 8% | 12% (Coinholder-Controlled Fund) | NU6.1, ZIP 1016. NU7 moves the end height to block 6,132,390. |",
  "",
].join("\n");

function swap(text: string, from: string, to: string, end: string): string | null {
  const i = text.indexOf(from);
  const j = text.indexOf(end, i + 1);
  if (i < 0 || j < 0) return null;
  return text.slice(0, i) + to + text.slice(j);
}

export function rewriteGovernanceGuide(original: string): string {
  if (!original.includes("# Zcash Funding & Governance Overview")) return original;
  let text = swap(original, "- **Current model (post-NU6 / November 2024 onward)**", MODEL, "## 2. The Core Organizations");
  if (!text) return original;
  const t2 = swap(text, "5. **Future Direction - The Lockbox & ZIP 1016**", FUTURE, "## 4. Quick Reference Table");
  if (!t2) return original;
  const t3 = swap(t2, "## 4. Quick Reference Table - Funding Evolution", TABLE, "## 5. Related Resources");
  if (!t3) return original;
  text = t3
    .replace(/ZIP Editors \(currently[^)]*\)/, "ZIP Editors (the current list is published on [zips.z.cash](https://zips.z.cash))")
    .split("under proposed ZIP 1016").join("under ZIP 1016")
    .replace("ZIP 1016 (proposed coinholder model)", "ZIP 1016 (Coinholder-Controlled Fund)");
  return text;
}

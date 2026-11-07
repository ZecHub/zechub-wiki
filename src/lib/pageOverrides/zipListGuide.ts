// Zcash Improvement Proposals (guides/zcash-improvement-proposals). Changes: removed the "checked ... on 18 August 2026" stamp;
// replaced the ZIP editor list (names and affiliations change and the page said ECC, which has wound down) with a pointer to the
// ZIP site; ZIP 258 is Final (read on the ZIP site), not Draft; added the ZIPs that NU7 deploys per ZIP 259.
// Statuses of the other ZIPs on this page were not re-checked: the ZIP index is the source of truth.
// If an anchor is missing, the original markdown is returned untouched.
const NU7 = [
  "",
  "## NU7 ZIPs",
  "",
  "NU7 is deployed by [ZIP 259](https://zips.z.cash/zip-0259). It lists these ZIPs:",
  "",
  "- [ZIP 207](https://zips.z.cash/zip-0207) revision 2: funding streams",
  "- [ZIP 214](https://zips.z.cash/zip-0214) revision 3: consensus rules for a Zcash Development Fund",
  "- [ZIP 218](https://zips.z.cash/zip-0218): 25-second block target spacing",
  "- [ZIP 235](https://zips.z.cash/zip-0235): removes 60% of transaction fees from circulation",
  "- [ZIP 237](https://zips.z.cash/zip-0237): Network Sustainability Mechanism",
  "- [ZIP 2003](https://zips.z.cash/zip-2003): disallows version 4 transactions",
  "- [ZIP 2008](https://zips.z.cash/zip-2008): updates the address list of the Zcash Community Grants funding stream",
  "",
  "ZIP 259 states that NU7 does not deploy ZIP 233 or ZIP 234, and it does not list ZIP 226 or ZIP 227, so [Zcash Shielded Assets](/zcash-tech/zcash-shielded-assets) are not part of it. See [Network Upgrades](/start-here/network-upgrades) for the activation block.",
  "",
].join("\n");

export function rewriteZipListGuide(original: string): string {
  if (!/^# What is ZIP\s*$/im.test(original)) return original;
  let text = original;
  const stamp = /Statuses and titles below were checked against the ZIP index at \[zips\.z\.cash\]\([^)]*\) on [^.]*\. /;
  if (stamp.test(text)) text = text.replace(stamp, "");
  text = text.replace(/```markdown[\s\S]*?```/, "The current list of ZIP editors is published on [zips.z.cash](https://zips.z.cash).");
  text = text.replace("> Draft: [Deployment of the NU6.3 Network Upgrade]", "> Final: [Deployment of the NU6.3 Network Upgrade]");
  if (!text.includes("## NU6.3 (Ironwood) ZIPs")) return original;
  return text.trimEnd() + "\n" + NU7;
}

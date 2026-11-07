// Network Upgrades (start-here/network-upgrades). The source still lists NU7 as "upcoming, targeted 5 Nov 2026". NU7
// activated on Mainnet at block 3,543,405 on 6 November 2026. The NU7 scope below follows ZIP 259 (ZIPs 207 rev 2, 214 rev 3,
// 218, 235, 237, 2003, 2008; ZIP 233, 234, 226 and 227 are not part of it). The unverified source claims "remaining Sprout
// funds become unspendable" and "reissued ... starting ~February 2031" were replaced by the rules the ZIPs state (ZIP 218:
// no Sprout JoinSplits in blocks; ZIP 2003: version 4 transactions disallowed; ZIP 237: reissuance starts at block 8,939,664).
// If the page does not have the expected anchors, the original markdown is returned untouched.
const ROW_OLD =
  "| **NU7** (upcoming) | Testnet: 4 Oct 2026; Mainnet: targeted 5 Nov 2026 | Testnet: 4,465,026; Mainnet: 3,543,405 | 77190ad9 | 25-second blocks (ZIP 218), NSM fee recycling (ZIP 235+237), Sprout retirement (ZIP 2003) |";
const ROW_NEW =
  "| **NU7** | November 6, 2026 | 3,543,405 | 77190ad9 | 25-second blocks (ZIP 218), fee removal and the Network Sustainability Mechanism (ZIP 235, ZIP 237), and no more version 4 transactions (ZIP 2003) |";

const NU7 = [
  "### NU7",
  "",
  "NU7 activated on Mainnet at block **3,543,405** on 6 November 2026 ([ZIP 259](https://zips.z.cash/zip-0259)). Its consensus branch ID is `0x77190ad9`. To follow the chain after activation, a node needs Zebra 7.0.0 or later, or Zakura 1.7.0 or later.",
  "",
  "What NU7 deploys (ZIP 259):",
  "",
  "- **25-second blocks** ([ZIP 218](https://zips.z.cash/zip-0218)): a block every 25 seconds instead of 75, with a third of the reward per block. Daily issuance stays about the same.",
  "- **Fee removal and the Network Sustainability Mechanism** ([ZIP 235](https://zips.z.cash/zip-0235), [ZIP 237](https://zips.z.cash/zip-0237)): 60% of each block's transaction fees leave circulation and are tracked in a balance that is reissued through block rewards from block 8,939,664 onward.",
  "- **No more version 4 transactions** ([ZIP 2003](https://zips.z.cash/zip-2003)). Blocks also stop accepting Sprout JoinSplits (ZIP 218).",
  "- **Funding streams** ([ZIP 214](https://zips.z.cash/zip-0214) revision 3, [ZIP 2008](https://zips.z.cash/zip-2008)): the two development funding streams are extended to the post-NU7 third halving, and a new recipient is added to the Zcash Community Grants stream.",
  "- Shielded action limits per block and a wider difficulty averaging window (17 to 102 blocks).",
  "",
  "NU7 does not include [Zcash Shielded Assets](/zcash-tech/zcash-shielded-assets): ZIP 259 does not list ZIP 226 or ZIP 227. For the numbers behind the new block schedule, see [Zcash Monetary Policy](/start-here/zcash-monetary-policy).",
  "",
].join("\n");

export function rewriteNetworkUpgradesGuide(original: string): string {
  if (!/^# Zcash Network Upgrades\s*$/im.test(original)) return original;
  const a = original.indexOf("### NU7 status");
  const b = original.indexOf("See the [Evolution of Privacy]");
  if (a < 0 || b < a || !original.includes(ROW_OLD)) return original;
  let text = original.replace(ROW_OLD, ROW_NEW);
  const i = text.indexOf("### NU7 status");
  const j = text.indexOf("See the [Evolution of Privacy]");
  text = text.slice(0, i) + NU7 + text.slice(j);
  text = text.replace("from Sprout to Ironwood.", "from Sprout to NU7.");
  text = text.replace("Every upgrade below has its own page", "Most upgrades below have their own page");
  return text;
}

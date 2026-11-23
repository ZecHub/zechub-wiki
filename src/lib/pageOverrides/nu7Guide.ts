import { rewriteUpgradePage } from "./upgradePage";

// NU7 page: same template as the other upgrade pages (At a glance table, historical-record note, FAQ, quiz and lists).
// The table only repeats what the page itself states; nothing is added. Every figure comes from the page text.
// If the page no longer has the template's shape, the original markdown is returned untouched.
const GLANCE = `| | |
|---|---|
| **Activated** | Mainnet block 3,543,405, November 6, 2026, 02:34 UTC. Testnet: block 4,465,026, October 4, 2026 |
| **Deployed by** | [ZIP 259](https://zips.z.cash/zip-0259) |
| **Consensus branch id** | 77190ad9 |
| **Main changes** | 25-second blocks ([ZIP 218](https://zips.z.cash/zip-0218)), shielded action limits, the Network Sustainability Mechanism ([ZIP 235](https://zips.z.cash/zip-0235), [ZIP 237](https://zips.z.cash/zip-0237)), version 4 transactions disallowed ([ZIP 2003](https://zips.z.cash/zip-2003)) |
| **Block subsidy** | 0.52083333 ZEC per block, down from 1.5625. About 1,800 ZEC are still issued per day |
| **Fees** | 60% of each block's fees leave circulation and are reissued to miners from block 8,939,664 (projected around February 2031) |
| **Sprout** | Unspendable, because only version 4 transactions can spend it |
| **Software** | Zebra 7.0.0 or later. There is no zcashd release with NU7 support |`;

export function rewriteNu7Guide(original: string): string {
  return rewriteUpgradePage(original, "NU7", GLANCE, "November 6, 2026");
}

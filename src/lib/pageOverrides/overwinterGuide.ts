import { rewriteUpgradePage } from "./upgradePage";

// Overwinter page: same template as the other upgrade pages (At a glance table, historical-record note, FAQ, quiz and
// lists). The table only repeats what the page and the wiki's upgrade table state. If the page no longer has the
// template's shape, the original markdown is returned untouched.
const GLANCE = `| | |
|---|---|
| **Activated** | Mainnet block 347,500, June 26, 2018, 01:37 UTC |
| **Also called** | The first network upgrade after the October 2016 launch |
| **Defined by** | [ZIP 200](https://zips.z.cash/zip-0200), [ZIP 201](https://zips.z.cash/zip-0201), [ZIP 202](https://zips.z.cash/zip-0202), [ZIP 203](https://zips.z.cash/zip-0203) and [ZIP 143](https://zips.z.cash/zip-0143) |
| **Consensus branch id** | 5ba81b19 |
| **Main changes** | The Network Upgrade Mechanism, replay protection, version 3 transaction format, transaction expiry |
| **Shielded features** | None. It prepared the ground for Sapling |`;

export function rewriteOverwinterGuide(original: string): string {
  return rewriteUpgradePage(original, "Overwinter", GLANCE, "June 26, 2018");
}

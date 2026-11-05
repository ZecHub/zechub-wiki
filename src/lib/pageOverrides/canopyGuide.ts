import { rewriteUpgradePage } from "./upgradePage";

const GLANCE = `| | |
|---|---|
| **Activated** | Mainnet block 1,046,400, November 18, 2020 (UTC) |
| **Also called** | Network Upgrade 4 (NU4), Zcash's fifth network upgrade |
| **Deployed by** | [ZIP 251](https://zips.z.cash/zip-0251) |
| **Main change** | Founders reward replaced by the Development Fund |
| **Fund share** | 20% of each block reward; miners keep 80% |
| **Fund split** | 35% Bootstrap (ECC), 25% Zcash Foundation, 40% Major Grants |
| **Sprout pool** | No new value can be added from this block on |`;

export function rewriteCanopyGuide(original: string): string {
  return rewriteUpgradePage(original, "Canopy", GLANCE, "November 18, 2020");
}

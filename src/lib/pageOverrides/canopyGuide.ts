import { rewriteUpgradePage } from "./upgradePage";

// Canopy page. Updated Nov 6, 2026: the Sprout FAQ said funds in the pool could still be withdrawn. NU7 (activated
// Nov 6, 2026, block 3,543,405) rejects version 4 transactions, the only format that can spend Sprout, so ZEC left in
// the pool is now unspendable (CoinDesk, CoinCentral; see the Sprout page). Everything else is history and unchanged.
// Every replacement must match exactly, otherwise the original markdown is returned untouched.
const GLANCE = `| | |
|---|---|
| **Activated** | Mainnet block 1,046,400, November 18, 2020 (UTC) |
| **Also called** | Network Upgrade 4 (NU4), Zcash's fifth network upgrade |
| **Deployed by** | [ZIP 251](https://zips.z.cash/zip-0251) |
| **Main change** | Founders reward replaced by the Development Fund |
| **Fund share** | 20% of each block reward; miners keep 80% |
| **Fund split** | 35% Bootstrap (ECC), 25% Zcash Foundation, 40% Major Grants |
| **Sprout pool** | No new value can be added from this block on. Since NU7 (November 6, 2026), ZEC still in it is unspendable |`;

const EDITS: [string, string][] = [
  ["This is a first step toward eventually deprecating the legacy Sprout pool in favor of newer shielded pools.",
   "This was a first step toward deprecating the legacy Sprout pool in favor of newer shielded pools. NU7 later made ZEC still in Sprout unspendable; see [Sprout](/zcash-tech/sprout)."],
  ["Yes. You can still withdraw funds that are already in Sprout. You just cannot add new value into it after Canopy.",
   "Not any more. After Canopy you could still withdraw funds already in Sprout, but not add new value. NU7 activated on November 6, 2026 and rejects version 4 transactions, the only format that can spend Sprout, so ZEC left in the pool is now unspendable. See [Sprout](/zcash-tech/sprout)."],
];

export function rewriteCanopyGuide(original: string): string {
  let text = original.replace(/\]\(\.\.\/([a-z0-9-]+\/[a-z0-9-]+)\)/g, "](/$1)");
  for (const [from, to] of EDITS) {
    if (!text.includes(from)) return original;
    text = text.replace(from, to);
  }
  return rewriteUpgradePage(text, "Canopy", GLANCE, "November 18, 2020");
}

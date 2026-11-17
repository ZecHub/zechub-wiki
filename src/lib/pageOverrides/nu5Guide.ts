import { rewriteUpgradePage } from "./upgradePage";

// NU5 page: same template as Canopy and Heartwood, plus corrections checked on 5 Nov 2026.
// The page described Orchard as it was in 2022. It now says what has happened since: the 2026 soundness bug
// (CVE-2026-54496), the NU6.2 fix, Ironwood making Orchard spend-only, zcashd's retirement and NU7's plan to
// invalidate version 4 transactions. "Moving funds into Orchard gives you a pool..." was wrong today because
// Orchard accepts no new value, and "could ever be misused" was an absolute the 2026 bug disproves.
// Branch id and dates come from this wiki's Network Upgrades table. Every replacement must match exactly,
// otherwise the original markdown is returned untouched.
const GLANCE = `| | |
|---|---|
| **Activated** | Mainnet block 1,687,104, May 31, 2022 (UTC) |
| **Also called** | Network Upgrade 5, Zcash's sixth network upgrade |
| **Deployed by** | [ZIP 252](https://zips.z.cash/zip-0252), shipped in zcashd 5.0.0 |
| **Consensus branch id** | c2d6d0b4 |
| **Main changes** | Orchard pool on Halo 2 ([ZIP 224](https://zips.z.cash/zip-0224)), Unified Addresses ([ZIP 316](https://zips.z.cash/zip-0316)), version 5 transactions ([ZIP 225](https://zips.z.cash/zip-0225)) |
| **Trusted setup** | None for Orchard |
| **Today** | Orchard has been spend-only since Ironwood (NU6.3, July 28, 2026) |`;

const LATER = `## What happened to Orchard later

Orchard ran for four years before a flaw surfaced. In late May 2026, researcher Taylor Hornby found a soundness bug in the Orchard circuit: a missing constraint in one gadget (CVE-2026-54496) that had been there since NU5. There is no evidence it was ever exploited.

1. **June 2, 2026:** an emergency soft fork paused Orchard transactions.
2. **June 3, 2026:** [NU6.2](/zcash-tech/nu6-2) corrected the circuit and re-enabled Orchard.
3. **July 28, 2026:** [Ironwood (NU6.3)](/zcash-tech/ironwood) added a new shielded pool. Orchard became spend-only: value can leave it, and no new value can enter.

Unified Addresses keep working, because Ironwood uses the same receiver structure as Orchard. The [Halo](/zcash-tech/halo) page covers the bug in more detail.

## Glossary
`;

const EDITS: [string, string][] = [
  ["NU5 shipped in the Electric Coin Company's zcashd v5.0.0 release.",
   "NU5 shipped in the Electric Coin Company's zcashd v5.0.0 release. zcashd has since been retired; see [Full Nodes](/zcash-tech/full-nodes)."],
  ["so there is no secret parameter that could ever be misused.", "so there is no secret parameter to misuse."],
  ["## Glossary\n", LATER],
  ["Moving funds into Orchard gives you a pool that needs no trusted setup.",
   "At the time, moving funds into Orchard gave you a pool that needs no trusted setup. Orchard no longer accepts new value since Ironwood (NU6.3), so new shielded funds go to the Ironwood pool."],
  ["No. NU5 added the version 5 format, and the older version 4 format stayed valid after activation.",
   "Not at the time. NU5 added the version 5 format, and the older version 4 format stayed valid after activation. NU7 made version 4 transactions invalid when it activated on November 6, 2026 ([ZIP 259](https://zips.z.cash/zip-0259), which deploys ZIP 2003)."],
];

export function rewriteNu5Guide(original: string): string {
  let text = original;
  for (const [from, to] of EDITS) {
    if (!text.includes(from)) return original;
    text = text.replace(from, to);
  }
  return rewriteUpgradePage(text, "NU5", GLANCE, "May 31, 2022");
}

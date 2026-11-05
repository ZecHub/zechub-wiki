import { rewriteUpgradePage } from "./upgradePage";

// NU6.2 page: same template as the other upgrade pages, with corrections checked on 5 Nov 2026 against the CVE
// advisory (PT-2026-56057), the orchard 0.14.0 release notes and press reports (Let's Data Science, KuCoin news,
// Live Bitcoin News).
// - "Zcash's turnstile accounting confirmed the total supply stayed intact" was stronger than the sources: Shielded
//   Labs says exploitation before the fix appears unlikely but cannot be ruled out cryptographically, because
//   Orchard hides amounts. The page now says no known exploitation and explains why Ironwood adds a public audit.
// - Added the discovery date (May 29, 2026), the CVE and the soft-fork block (3,363,426).
// - Added "What came after" with Ironwood. Branch id comes from the wiki's upgrade table.
// Every replacement must match exactly, otherwise the original markdown is returned untouched.
const GLANCE = `| | |
|---|---|
| **Activated** | Mainnet block 3,364,600, June 3, 2026 (UTC) |
| **Deployed by** | [ZIP 257](https://zips.z.cash/zip-0257) |
| **Consensus branch id** | 5437f330 |
| **Trigger** | A soundness bug in the Orchard circuit, found May 29, 2026 (CVE-2026-54496) |
| **Emergency pause** | Soft fork at block 3,363,426 on June 2 disabled Orchard transactions for about a day |
| **Fix** | Missing constraint added to the variable-base scalar multiplication gadget, new verifying key, exact proof length enforced |
| **Fixed in** | zcashd 6.20.0, Zebra 5.0.0, orchard 0.14.0, halo2_gadgets 0.5.0 |
| **Exploitation** | None known. It cannot be ruled out cryptographically, because Orchard hides amounts |`;

const AFTER = `## What came after

Orchard worked again after June 3, but value created under the old rules could still sit inside it. [Ironwood (NU6.3)](/zcash-tech/ironwood) activated on July 28, 2026 with a new shielded pool and a public turnstile. Orchard has been spend-only since then: value can leave it, and no new value can enter. The [Halo](/zcash-tech/halo) page covers the proving system behind the circuit.

## Glossary
`;

const EDITS: [string, string][] = [
  ["disclosed it responsibly in late May 2026.", "disclosed it responsibly after finding it on May 29, 2026 (CVE-2026-54496)."],
  ["On June 2, 2026, an emergency soft fork temporarily disabled all Orchard transactions.",
   "On June 2, 2026, at block 3,363,426, an emergency soft fork temporarily disabled all Orchard transactions."],
  ["No. There is no evidence the bug was ever exploited, no unauthorized value creation, and no impact to user funds. Zcash's turnstile accounting confirmed the total supply stayed intact through the whole event.",
   "No known funds were lost. There is no evidence the bug was ever exploited and no known impact to user funds. Because Orchard hides amounts, exploitation before the fix cannot be ruled out cryptographically, according to Shielded Labs, who consider it unlikely. That is why Ironwood adds a public audit at the pool boundary. The turnstile still capped how much value could ever leave Orchard."],
  ["There is no evidence it was. It was caught by security research and fixed before any known harm.",
   "There is no evidence it was. It was caught by security research and fixed before any known harm. Because Orchard hides amounts, Shielded Labs has said exploitation before the fix cannot be ruled out cryptographically, which is why Ironwood adds a public audit."],
  ["## Glossary\n", AFTER],
];

export function rewriteNu62Guide(original: string): string {
  let text = original;
  for (const [from, to] of EDITS) {
    if (!text.includes(from)) return original;
    text = text.replace(from, to);
  }
  return rewriteUpgradePage(text, "NU6.2", GLANCE, "June 3, 2026");
}

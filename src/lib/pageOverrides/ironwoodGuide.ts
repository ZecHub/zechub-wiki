import { rewriteUpgradePage } from "./upgradePage";

// Ironwood page: upgrade template plus corrections checked on 5 Nov 2026 against the Zodl and Cake Wallet
// documentation, The Block, the CVE advisory and the Ironwood documentation (zcash.github.io/ironwood).
// - ZIP 318 and its "standard amounts" claim could not be found in any source, so the claim and the
//   link are removed; wallets that split balances (Cake Wallet) are described without naming a ZIP.
// - The quantum-recoverability line overstated ZIP 2005: it is a forward-compatibility measure, it does
//   not make spending post-quantum secure and the recovery process is not defined yet.
// - The "pool balances can never go negative" sentence was generalised; the documentation only says
//   Orchard's value balance must not go negative.
// - Added dates for the June 2 and June 3 steps and an FAQ about not migrating.
// Every replacement must match exactly, otherwise the original markdown is returned untouched.
const GLANCE = `| | |
|---|---|
| **Activated** | Mainnet block 3,428,143, July 28, 2026 (UTC) |
| **Formal name** | NU6.3, specified in [ZIP 258](https://zips.z.cash/zip-0258) |
| **New pool** | Ironwood, with the same receiver structure as Orchard, so existing addresses can direct funds into it |
| **Orchard** | Spend-only: value can leave it, no new value can enter |
| **Notes** | Ironwood notes use a quantum-recoverable format ([ZIP 2005](https://zips.z.cash/zip-2005)) |
| **Why** | A soundness bug in the Orchard circuit, found in late May 2026 (CVE-2026-54496) and fixed in NU6.2 |
| **Exploitation** | No evidence it was ever exploited, and no change to the total supply |
| **Moving value** | Gradual. The amount that crosses from Orchard to Ironwood is public |`;

const NOTE = "> **Current upgrade.** Last verified November 5, 2026. Wallet migration tools are still changing, so follow your wallet's own guidance.";

const EDITS: [string, string][] = [
  ["1. In early June 2026, a temporary measure disabled the Orchard pool while a full fix was prepared.",
   "1. On June 2, 2026, an emergency soft fork temporarily disabled Orchard transactions while a full fix was prepared."],
  ["2. The NU6.2 upgrade corrected the Orchard circuit itself, closing the underlying soundness vulnerability.",
   "2. On June 3, the NU6.2 hard fork corrected the Orchard circuit itself, closing the underlying soundness vulnerability."],
  ["(a design that lets funds be recovered if [quantum computers](../zcash-tech/post-quantum-security) ever break today's cryptography)",
   "(a forward-compatibility measure: if [quantum computers](../zcash-tech/post-quantum-security) ever broke today's elliptic-curve cryptography, it would let the network check that a recovered note matches a real one rather than a forged one. It does not make spending post-quantum secure, and the recovery process itself is not defined yet)"],
  ["Consensus rules keep every value pool, including Ironwood, within the network's maximum money limit, so pool balances can never go negative.",
   "Consensus rules also require that Orchard's value balance can never go negative, which is what stops new value from entering it."],
  ["Each move shows its amount on the blockchain, so wallets that follow [ZIP 318](https://zips.z.cash/zip-0318) split it into standard amounts and send them over time.",
   "Each move shows its amount on the blockchain. Some wallets, such as Cake Wallet, split the balance into round amounts and spread the moves over time so they are harder to link."],
  ["| Quantum-recoverable note | A note format designed so funds could be recovered if quantum computers ever break today's cryptography |",
   "| Quantum-recoverable note | A note format that lets the network later check recovered notes against real ones if quantum computers break today's cryptography. The recovery process is not defined yet |"],
  ["\n\nIs Zcash still private?",
   "\n\nCan I leave my ZEC in Orchard? Funds in Orchard stay yours and can leave it by spending, but no new value can enter it. The sources checked for this page give no migration deadline, so check your wallet's guidance.\n\nIs Zcash still private?"],
  ["[ZIP 318: Orchard to Ironwood Migration](https://zips.z.cash/zip-0318)\n\n", ""],
  ["[ZIP 2005: Ironwood Quantum Recoverability](https://zips.z.cash/zip-2005)",
   "[ZIP 2005: Ironwood Quantum Recoverability](https://zips.z.cash/zip-2005)\n\n[Ironwood documentation](https://zcash.github.io/ironwood/)"],
];

export function rewriteIronwoodGuide(original: string): string {
  let text = original;
  for (const [from, to] of EDITS) {
    if (!text.includes(from)) return original;
    text = text.replace(from, to);
  }
  return rewriteUpgradePage(text, "Ironwood", GLANCE, "July 28, 2026", NOTE);
}

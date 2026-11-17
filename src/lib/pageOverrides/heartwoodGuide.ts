import { rewriteUpgradePage } from "./upgradePage";

// Heartwood page: same template as Canopy, plus corrections checked against ZIP 213 and ZIP 221 (5 Nov 2026).
// - "A miner's pay can stay private" was wrong: ZIP 213 requires shielded coinbase outputs to be recoverable
//   with a fixed outgoing viewing key, so their addresses and values are public. What stays private is
//   when the reward is spent.
// - The MMR covers blocks since the previous network upgrade activated (not all prior blocks), and ZIP 221
//   states the proof-size and cross-chain claims as possibilities; NU5 renamed the header field again.
// - "Sprout was too resource-intensive" and "Sapling's proving system and note format" were not in the ZIPs;
//   they now follow the wording of ZIP 213.
// Every replacement must match exactly, otherwise the original markdown is returned untouched.
const GLANCE = `| | |
|---|---|
| **Activated** | Mainnet block 903,000, July 16, 2020 (UTC) |
| **Deployed by** | [ZIP 250](https://zips.z.cash/zip-0250) |
| **Consensus branch id** | f5b9230b |
| **Shielded coinbase** | [ZIP 213](https://zips.z.cash/zip-0213): miners may be paid into Sapling outputs. The address and value are public. |
| **FlyClient** | [ZIP 221](https://zips.z.cash/zip-0221): block headers commit to a Merkle Mountain Range for smaller light-client proofs |
| **Backed by** | Electric Coin Company and Zcash Foundation |
| **Transparent coinbase** | Still allowed, so shielded payment is optional |`;

const EDITS: [string, string][] = [
  ["Heartwood activates at a set block height (903,000), not at a fixed clock time, so the exact minute you see on a dashboard can differ slightly from one place to another. The block, and the moment, are the same.",
   "Heartwood activated at a set block height (903,000), not at a fixed clock time."],
  ["Heartwood let that reward go straight into a shielded address instead, so a miner's pay can stay private. It also made it possible for lightweight wallets and other chains to check Zcash's proof-of-work without downloading the whole chain.",
   "Heartwood let that reward go into a shielded Sapling address instead. The reward itself is not hidden: ZIP 213 requires its address and value to be public. What shielding changes is that spending it later does not reveal when it moves. Heartwood also changed block headers to support FlyClient, which gives light clients a way to verify proof-of-work with much smaller proofs."],
  ["Transparent coinbase outputs are still supported, so this is a new option, not a forced change.",
   "Transparent coinbase outputs are still supported, so this is a new option, not a forced change. The new outputs are not hidden, though: ZIP 213 requires them to be recoverable with a fixed outgoing viewing key, so their target addresses and values are public, and miners can put identifying text in the memo field. Only the later spending of the reward stays unlinked. After NU5, Orchard addresses became usable for coinbase too."],
  ["The original Sprout shielded pool was too resource-intensive to shield right in the coinbase. Sapling's more efficient proving system and note format made it practical.",
   "Shielding coinbase had been blocked partly to keep implementations simple and because shielded transactions were resource-intensive. Sapling's performance improvements made it feasible."],
  ["of prior blocks, such as timestamps", "of the blocks since the previous network upgrade activated, such as timestamps"],
  ["That commitment lets a light client, or an outside chain, verify Zcash's proof-of-work using a small proof whose size grows only logarithmically with the length of the chain. The payoff is better light-client wallets and easier third-party and cross-chain integration, because a client no longer has to download every block to trust the work behind the chain.",
   "ZIP 221 says this reduces the number of headers a light client needs from linear to logarithmic in the length of the chain, with verification correct with high probability. It also notes that smaller proofs could enable Zcash SPV proofs on other chains. NU5 later renamed the field again, to hashBlockCommitments (ZIP 244)."],
  ["its efficient shielded-transaction machinery was the technical precondition that made shielded coinbase possible.",
   "its performance improvements are what ZIP 213 cites as making shielded coinbase feasible."],
  ["instead of a transparent one, so miner income can stay private.", "instead of a transparent one. The output's address and value are public."],
  ["Because Sapling's more efficient design made shielding directly in the coinbase practical. The earlier Sprout pool was too resource-intensive to do it.",
   "Because Sapling's performance improvements made it feasible. The earlier ban on shielded coinbase had also been extended to Sapling outputs, to keep the previous upgrade simple, and Heartwood lifted it."],
  ["with small, logarithmic-size proofs instead of the whole chain.", "with logarithmic-size proofs instead of every header."],
];

export function rewriteHeartwoodGuide(original: string): string {
  let text = original;
  for (const [from, to] of EDITS) {
    if (!text.includes(from)) return original;
    text = text.replace(from, to);
  }
  return rewriteUpgradePage(text, "Heartwood", GLANCE, "July 16, 2020");
}

// Light edit of "Is Zcash Post-Quantum?" (checked 5 Nov 2026). The page is carefully sourced, so only this changes:
// - The 11 <br/> spacers are removed (the headings already separate sections) and the "Who is this for"
//   list, which repeated the intro, is folded into one sentence that keeps the link.
// - NU7 is now active (Nov 6, 2026, block 3,543,405; CoinDesk). The page said activation was "targeted for 5 November 2026"
//   and the Sprout row said "Not activated"; both now state that NU7 activated and that ZEC left in Sprout is unspendable.
// - "ZIP 318 has wallets split balances" is kept as the source has it: ZIP 318 (draft, "Orchard to Ironwood Migration")
//   specifies that wallets split a migration into canonical denominations (zips.z.cash, checked Nov 6, 2026).
// - "same Orchard circuit" now says "plus one new constraint", as the Ironwood documentation does.
// Every replacement must match exactly, otherwise the original markdown is returned untouched.
const EDITS: [string, string][] = [
  ["so version 4 transactions become invalid once NU7 activates and any ZEC left in the Sprout pool becomes unspendable.",
   "so version 4 transactions became invalid when NU7 activated, and any ZEC left in the Sprout pool is now unspendable."],
  ["Mainnet activation is set for block 3,543,405, targeted for 5 November 2026 ([ZIP 259](https://zips.z.cash/zip-0259), [forum announcement](https://forum.zcashcommunity.com/t/nu7-timeline/57655)).",
   "NU7 activated on mainnet at block 3,543,405 on November 6, 2026 ([CoinDesk](https://www.coindesk.com/tech/2026/11/06/zcash-s-landmark-nu7-upgrade-goes-live-speeding-up-private-payments), [ZIP 259](https://zips.z.cash/zip-0259))."],
  ["| **Not activated** | Mainnet height 3,543,405, targeted 5 Nov 2026 |",
   "| **Active** | Mainnet height 3,543,405, activated 6 Nov 2026 (UTC) |"],
  ["except the Sprout row, which was updated on 9 October 2026.", "except the Sprout row, which was updated on 6 November 2026."],
  ["because Ironwood uses the same Orchard circuit, Halo 2 proofs and RedPallas signatures as Orchard.",
   "because Ironwood reuses the Orchard Action circuit (plus one new constraint), Halo 2 proofs and RedPallas signatures."],
  ["This page separates what Zcash protects today,", "For background on quantum computing itself, see [Post-Quantum Security in Zcash](/zcash-tech/post-quantum-security). This page separates what Zcash protects today,"],
];

export function rewritePostQuantumAnswer(original: string): string {
  if (!/^# Is Zcash Post-Quantum\?\s*$/im.test(original)) return original;
  let text = original.replace(/\n<br\/>\n/g, "");
  const who = text.match(/## Who is this for\n[\s\S]*?(?=## Why the question is confusing)/);
  if (!who) return original;
  text = text.replace(who[0], "");
  for (const [from, to] of EDITS) {
    if (!text.includes(from)) return original;
    text = text.replace(from, to);
  }
  return text;
}

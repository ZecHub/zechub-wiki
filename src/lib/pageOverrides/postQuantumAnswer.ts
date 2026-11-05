// Light edit of "Is Zcash Post-Quantum?" (checked 5 Nov 2026). The page is carefully sourced, so only this changes:
// - The 11 <br/> spacers are removed (the headings already separate sections) and the "Who is this for"
//   list, which repeated the intro, is folded into one sentence that keeps the link.
// - NU7 timing: the page said activation was "targeted for 5 November 2026". Block 3,543,405 at the 75-second
//   target falls in the night of November 5 to 6 (UTC), so the page now says that and points to an explorer.
//   The Sprout row of the table changes from "Not activated" to "Scheduled" and its check date is updated.
// - "ZIP 318 has wallets split balances" is softened: the ZIP could not be confirmed here, and Cake Wallet
//   documents the splitting without citing a ZIP.
// - "same Orchard circuit" now says "plus one new constraint", as the Ironwood documentation does.
// Every replacement must match exactly, otherwise the original markdown is returned untouched.
const EDITS: [string, string][] = [
  ["Mainnet activation is set for block 3,543,405, targeted for 5 November 2026 ([ZIP 259](https://zips.z.cash/zip-0259), [forum announcement](https://forum.zcashcommunity.com/t/nu7-timeline/57655)).",
   "Mainnet activation is set for block 3,543,405. At the 75-second block time that falls in the night of November 5 to 6, 2026 (UTC), so check a block explorer for the current state ([ZIP 259](https://zips.z.cash/zip-0259), [forum announcement](https://forum.zcashcommunity.com/t/nu7-timeline/57655))."],
  ["| **Not activated** | Mainnet height 3,543,405, targeted 5 Nov 2026 |",
   "| **Scheduled** | Mainnet height 3,543,405, expected night of 5 to 6 Nov 2026 (UTC) |"],
  ["except the Sprout row, which was updated on 9 October 2026.", "except the Sprout row, which was updated on 5 November 2026."],
  ["so ZIP 318 has wallets split balances into fixed amounts and send them across over time.", "so some wallets split balances into fixed amounts and send them across over time."],
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

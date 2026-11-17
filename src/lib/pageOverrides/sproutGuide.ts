import { rewriteUpgradePage } from "./upgradePage";

// Sprout page (checked 6 Nov 2026). The source still carried a pre-activation warning ("targeted for 5 November 2026")
// and an FAQ saying Sprout needs nothing from the reader. NU7 activated on November 6, 2026 at block 3,543,405
// (02:34 UTC) and rejects version 4 transactions, the only format that can spend Sprout (ZIP 2003), so ZEC left in the
// pool is unspendable. Figures: about 12,224 ZEC remained after activation (ZecStats, via CoinCentral), down from about
// 22,263 a week earlier (CoinDesk, Nov 5). ZIP 2003 leaves open restoring access in a future upgrade but warns it may
// never happen; Sean Bowe has proposed a recovery system and no mechanism is approved (CoinDesk, Nov 5; CoinCentral).
// Coinholders supported disabling Sprout in the NU7 poll (CoinDesk, Sept 16). Ceremony, launch and design facts are
// unchanged from the source. Every replacement must match exactly, otherwise the original markdown is returned untouched.
const NOTE = `> **Current status.** Since NU7 activated on November 6, 2026 (block 3,543,405), ZEC still in the Sprout pool cannot be spent. If you hold funds there, see [What happened to Sprout in 2026](#what-happened-to-sprout-in-2026) and [Recovering funds](/using-zcash/recovering-funds).`;

const GLANCE = `| | |
|---|---|
| **Launched** | Genesis block, October 28, 2016 (07:56 UTC) |
| **Also called** | Zcash's original shielded pool, consensus branch id 0 |
| **Defined by** | The original Zcash Protocol Specification and the Zerocash construction (no ZIP number) |
| **Built by** | Electric Coin Company, led by Zooko Wilcox |
| **Trusted setup** | The Ceremony: six participants, public parameters kept, toxic waste destroyed |
| **New deposits** | Stopped at Canopy (November 18, 2020) |
| **Today** | Unspendable since NU7 (November 6, 2026). About 12,224 ZEC remained, according to ZecStats |`;

const SPROUT_2026 = `## What happened to Sprout in 2026

Sprout stopped taking new value when [Canopy](/zcash-tech/canopy) activated in 2020. NU7 then closed the last way to spend what remained.

1. **September 2026:** in the NU7 coinholder poll, voters supported disabling Sprout transactions. See [Shielded Coinholder Voting](/zcash-tech/shielded-coinholder-voting).
2. **November 6, 2026:** NU7 activated at block 3,543,405. It rejects version 4 transactions, the only transaction format that can spend Sprout funds ([ZIP 2003](https://zips.z.cash/zip-2003)).
3. **Afterwards:** about 12,224 ZEC remained in the pool, according to ZecStats cited by [CoinCentral](https://coincentral.com/zcash-nu7-mainnet-activation-sprout-freeze). A week earlier it was about 22,263 ZEC, per [CoinDesk](https://www.coindesk.com/tech/2026/11/05/zcash-is-about-to-freeze-usd16-million-in-its-oldest-privacy-pool).

Those coins are unspendable under the current rules, even for someone with the right keys. They are not burned and stay in the issued supply. ZIP 2003 leaves open the possibility of restoring access in a future upgrade, but warns that spending may never be re-enabled. Sean Bowe has proposed a recovery system in which owners prove ownership and move funds into a supported pool, and no recovery mechanism has been approved. Sprout addresses start with "zc", which helps when checking old wallet records.

## Glossary
`;

const EDITS: [string, string][] = [
  ["No. Sprout is history, the launch that started the chain your ZEC lives on. Your coins and your privacy today depend on the wallet and shielded pool you use now, not on anything you need to do about Sprout.",
   "Only if you still hold ZEC in the Sprout pool. NU7 made that ZEC unspendable on November 6, 2026. ZEC in newer pools is not affected, and your privacy there depends on the wallet and pool you use now."],
  ["Why is there no ZIP number for Sprout?",
   "Can I still recover ZEC left in Sprout? Not today. No recovery mechanism has been approved. ZIP 2003 leaves open restoring access in a future upgrade but warns it may never happen, and Sean Bowe has proposed a recovery system. The coins are not burned.\n\nWhy is there no ZIP number for Sprout?"],
  ["## Glossary\n", SPROUT_2026],
  ["[Electric Coin Company: The Design of the Ceremony](https://electriccoin.co/blog/the-design-of-the-ceremony/)",
   "[Electric Coin Company: The Design of the Ceremony](https://electriccoin.co/blog/the-design-of-the-ceremony/)\n\n[ZIP 2003](https://zips.z.cash/zip-2003)\n\n[CoinDesk: Zcash is about to freeze $16 million in its oldest privacy pool](https://www.coindesk.com/tech/2026/11/05/zcash-is-about-to-freeze-usd16-million-in-its-oldest-privacy-pool)"],
];

export function rewriteSproutGuide(original: string): string {
  let text = original.replace(/\]\(\.\.\/([a-z0-9-]+\/[a-z0-9-]+)\)/g, "](/$1)");
  for (const [from, to] of EDITS) {
    if (!text.includes(from)) return original;
    text = text.replace(from, to);
  }
  return rewriteUpgradePage(text, "Sprout", GLANCE, "October 28, 2016", NOTE);
}

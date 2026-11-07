import { rewriteUpgradePage } from "./upgradePage";

// NU6.1 page: same template as the other upgrade pages, plus facts from ZIP 271 and ZIP 1016 that the page lacked
// (read on 5 Nov 2026 from a mirror of the ZIP repository): the one-time lockbox disbursement (78,750 ZEC to a
// 2-of-3 multisig of the Zcash Foundation, Electric Coin Company and Shielded Labs, paid in the activation block's
// coinbase), how the coin-holder vote works (quarterly, 420,000 ZEC minimum, simple majority, limited key-holder
// veto) and the third-halving end height (4,406,400 on current block spacing, shifted by NU7 per ZIP 214 Rev 3).
// The October 2026 draft ZIP on the 8% stream is reported as in the NU6 page (Unchained, Oct 27: no decision).
// Branch id and dates come from the wiki's upgrade table. Every replacement must match exactly, otherwise the
// original markdown is returned untouched.
const GLANCE = `| | |
|---|---|
| **Activated** | Mainnet block 3,146,400, November 24, 2025 (UTC) |
| **Deployed by** | [ZIP 255](https://zips.z.cash/zip-0255) |
| **Consensus branch id** | 4dec4df0 |
| **Funding model** | [ZIP 1016](https://zips.z.cash/zip-1016): 8% of the block reward to Zcash Community Grants, 12% to a fund that coin holders control |
| **Lockbox** | One-time disbursement of its balance, 78,750 ZEC, in the activation block ([ZIP 271](https://zips.z.cash/zip-0271)) |
| **Duration** | Until the third halving, block 4,406,400 on current block spacing |
| **Smaller fixes** | Orchard unshielding in RPC methods; zcashd wallet builds version 5 transactions by default |
| **Endorsed by** | Electric Coin Company and Zcash Foundation |`;

const DISBURSEMENT = `## The one-time disbursement

[ZIP 271](https://zips.z.cash/zip-0271) added a single payment from the lockbox. In the coinbase transaction of the NU6.1 activation block, the whole lockbox balance, 78,750 ZEC, was paid to a 2-of-3 multisig held by the Zcash Foundation, the Electric Coin Company and Shielded Labs. The key-holders then distribute it as grants under the ZIP 1016 rules. ZIP 271 says the payment supports the funding model while a future lockbox disbursement mechanism is developed.

## The smaller fixes
`;

const TODAY = `## Where funding stands today

The model is still being debated. In October 2026 a draft ZIP proposed redirecting the 8% Zcash Community Grants stream to the Network Sustainability Mechanism (ZIP 237). As of October 27, 2026 it was under discussion and no decision had been made ([Unchained](https://unchainedcrypto.com/zcash-developers-split-over-where-grants-programs-8-block-share-should-go/)).

## Glossary
`;

const EDITS: [string, string][] = [
  ["2. Coin holders collectively decide whether to distribute the money for ecosystem work or keep it locked.",
   "2. Under ZIP 1016, grant applications go to community review and then a quarterly coin-holder vote. A grant needs at least 420,000 ZEC voting (2% of the eventual supply) and a simple majority. Coin holders are never required to fund a grant, so the money can also stay unspent."],
  ["they stay in place until the third Zcash halving, which gives the community time to see how it works before making it permanent or changing it.",
   "they stay in place until the third Zcash halving, which gives the community time to see how it works before making it permanent or changing it. That halving is at block 4,406,400 on current block spacing; the shorter 25-second blocks introduced by NU7 (ZIP 218, active since November 6, 2026) move that height, as ZIP 214 Revision 3 specifies."],
  ["## The smaller fixes\n", DISBURSEMENT],
  ["## Glossary\n", TODAY],
  ["3. This gives the people who hold ZEC a direct voice in how Zcash funds its future.",
   "3. This gives the people who hold ZEC a direct voice in how Zcash funds its future. Key-holder organizations hold the multisig keys and administer the fund according to the votes. They can veto a passed grant only for legal or reporting reasons, or if two or more of them object on principle, and they cannot override a coin-holder rejection."],
];

export function rewriteNu61Guide(original: string): string {
  let text = original;
  for (const [from, to] of EDITS) {
    if (!text.includes(from)) return original;
    text = text.replace(from, to);
  }
  return rewriteUpgradePage(text, "NU6.1", GLANCE, "November 24, 2025");
}

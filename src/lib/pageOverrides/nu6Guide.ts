import { rewriteUpgradePage } from "./upgradePage";

// NU6 page: same template as the other upgrade pages. The content already agrees with this wiki's NU6.1 page and
// Network Upgrades table, so the only substantive addition is "Where funding stands today": NU6's split was
// replaced by the NU6.1 model (ZIP 1016, in place until the third halving, as the NU6.1 page says), and an
// October 2026 draft ZIP proposing to redirect the 8% ZCG stream to the NSM is still under debate (Unchained,
// October 27, 2026; no decision at that date). Branch id and dates come from the wiki's upgrade table.
// Every replacement must match exactly, otherwise the original markdown is returned untouched.
const GLANCE = `| | |
|---|---|
| **Activated** | Mainnet block 2,726,400, November 23, 2024 (UTC) |
| **Deployed by** | [ZIP 253](https://zips.z.cash/zip-0253) |
| **Consensus branch id** | c8e71055 |
| **Development funding** | 20% of the block subsidy, split 8% to Zcash Community Grants and 12% to the Deferred Dev Fund Lockbox ([ZIP 1015](https://zips.z.cash/zip-1015), [ZIP 2001](https://zips.z.cash/zip-2001)) |
| **Supply accounting** | Coinbase must balance exactly, so no ZEC can be burned by under-claiming ([ZIP 236](https://zips.z.cash/zip-0236)) |
| **Endorsed by** | Electric Coin Company and Zcash Foundation |
| **Funding today** | The NU6.1 model (ZIP 1016) replaced this split on November 24, 2025 |`;

const TODAY = `## Where funding stands today

NU6's split was replaced by the [NU6.1](/zcash-tech/nu6-1) model ([ZIP 1016](https://zips.z.cash/zip-1016)): 8% of the block subsidy to Zcash Community Grants and 12% to a coin-holder-controlled fund seeded by the lockbox. Per the NU6.1 page, those rules stay in place until the third Zcash halving.

The model is still being debated. In October 2026 a draft ZIP proposed redirecting the 8% Zcash Community Grants stream to the Network Sustainability Mechanism (ZIP 237). As of October 27, 2026 it was under discussion and no decision had been made ([Unchained](https://unchainedcrypto.com/zcash-developers-split-over-where-grants-programs-8-block-share-should-go/)).

## Glossary
`;

export function rewriteNu6Guide(original: string): string {
  if (!original.includes("## Glossary\n")) return original;
  const text = original.replace("## Glossary\n", TODAY);
  return rewriteUpgradePage(text, "NU6", GLANCE, "November 23, 2024");
}

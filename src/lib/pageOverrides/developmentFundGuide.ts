// Zcash Development Fund (start-here/development-fund). The source is one paragraph and a bare link. Figures come from ZIP 214
// (revisions 0 to 3): Canopy 7% Bootstrap, 5% ZF, 8% Major Grants until block 2,726,400; NU6 8% ZCG + 12% deferred; NU6.1 8% ZCG +
// 12% Coinholder-Controlled Fund; NU7 moves both end heights to 6,132,390 and ZIP 2008 updates the ZCG address list.
// The governance page has the organizations; this page keeps to the mechanics. If the page does not have the expected title,
// the original markdown is returned untouched.
export function rewriteDevelopmentFundGuide(original: string): string {
  const i = original.indexOf("# Zcash Development Fund");
  if (i < 0) return original;
  const body = [
    "# Zcash Development Fund",
    "",
    "## TL;DR",
    "",
    "- Zcash funds its own development from the block reward. Teams do not have to take outside investors.",
    "- 20% of every block's new ZEC goes to two funding streams: **8%** to Zcash Community Grants and **12%** to the Coinholder-Controlled Fund. Miners keep 80%.",
    "- Both streams run until the third halving.",
    "- The model has changed twice: at NU6 (November 2024) and at NU6.1 (November 2025).",
    "",
    "---",
    "",
    "## Core Explanation",
    "",
    "Zcash is a unique blockchain protocol because it is self-funded. This means that teams working on Zcash do not need to take money from outside investors, and can remain focused on driving adoption while also staying aligned with Zcash's broader ethos and mission.",
    "",
    "The money comes from the protocol itself. Part of each block's new ZEC is sent to funding streams defined in [ZIP 214](https://zips.z.cash/zip-0214), and the rest goes to the miner.",
    "",
    "## How the fund has changed",
    "",
    "| Period | Split of the block reward |",
    "|--|--|",
    "| Canopy to November 2024 | 7% Bootstrap, 5% Zcash Foundation, 8% Major Grants, 80% miners |",
    "| NU6 (November 2024) | 8% Zcash Community Grants, 12% deferred lockbox, 80% miners |",
    "| NU6.1 (November 2025) | 8% Zcash Community Grants, 12% Coinholder-Controlled Fund, 80% miners |",
    "",
    "NU7 (November 2026) did not change the percentages. It moved the end of both streams to block 6,132,390 to account for 25-second blocks, and updated the address list of the Zcash Community Grants stream ([ZIP 2008](https://zips.z.cash/zip-2008)). See [Zcash Monetary Policy](/start-here/zcash-monetary-policy) for the block schedule.",
    "",
    "## Who decides what",
    "",
    "Zcash Community Grants is run by a committee that reviews applications from independent teams. The Coinholder-Controlled Fund is defined in [ZIP 1016](https://zips.z.cash/zip-1016). The full picture, including each organization's role, is on the [Zcash Governance](/zcash-community/zcash-governance) page.",
    "",
    "## Common Mistakes",
    "",
    "| Common belief | What is actually the case |",
    "|--|--|",
    "| \"The development fund still pays ECC and the Zcash Foundation.\" | That ended in November 2024. Neither receives a share of the block reward now. |",
    "| \"The fund is an extra 20% on top of the supply.\" | It is part of each block's reward, so the 21 million cap does not change. |",
    "| \"The fund lasts forever.\" | Both streams end at the third halving unless a future network upgrade extends them. |",
    "",
    "## Related Pages",
    "",
    "- [Zcash Governance](/zcash-community/zcash-governance) - the organizations and how decisions are made",
    "- [Zcash Monetary Policy](/start-here/zcash-monetary-policy) - supply, halvings and block rewards",
    "- [Network Upgrades](/start-here/network-upgrades) - when each funding change activated",
    "",
  ].join("\n");
  return original.slice(0, i) + body;
}

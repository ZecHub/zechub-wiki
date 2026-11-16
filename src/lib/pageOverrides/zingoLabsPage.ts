// Zingo Labs page. The source page had a logo, described the organization as "a team of visionaries" and a "Shielded DAO" ("Zingo Lab
// Cyan") that treasury-votes, and claimed the wallet was the first to support Orchard and NU5. None of these could be confirmed, so they are
// dropped. It is rewritten from:
// - The Zingo Labs thread on the Zcash Community Forum ("Zingo Labs: Zcash by anyone for everyone"): the project list (Z3, ZeWIF, ZExCavator,
//   Zaino, Chasqui), partners (Blockchain Commons for ZeWIF; the Zcash Foundation, Shielded Labs and ECC engineering for Zaino), and ZExCavator
//   started by James Katz with the Zcash Brasil community.
// - "Ironwood in Zingo" (28 July 2026, by zancas): the Ironwood release for Zingo Mobile and Zingo PC, funds sent go into Ironwood, change
//   stays in Orchard, iOS release delayed in Apple's review, Nym privacy not yet active in that release.
// - The Zingo 3.0.0 release on GitHub (31 October): NU7 support and a new Swap tab with quotes, deposits, tracking and history that links
//   to the SwapKit Explorer.
// - "Zingo Labs Hackfest, Grant Proposal": approved at the 16 February 2026 ZCG meeting, a two-week hackfest in Rome in May 2026 where
//   participants integrated Nym into zingolib.
// - "Zaino Unchained" (26 May 2026): a one-year maintenance grant proposal, deferred on 16 June 2026 until Zaino is production ready.
// Dropped as unconfirmed: "Shielded DAO" governance, "first wallet to support Orchard", and the wallet's supported pools list.
// If the page no longer looks like this one, the original markdown is returned untouched.
const PAGE = `# Zingo Labs

**Zingo Labs** is an open-source team that builds Zcash software for wallets and infrastructure. It makes the **Zingo** wallet for mobile and desktop, the **Zingolib** wallet library, and **Zaino**, an indexer that serves wallets and block explorers from a Zebra node.

[Website](https://zingolabs.org/) - [GitHub](https://github.com/zingolabs) - [X](https://x.com/ZingoLabs)

## At a glance

| | |
|---|---|
| Products | Zingo wallet (mobile and desktop), Zingolib, Zaino, zingo-cli |
| Other projects | Z3 stack work, ZeWIF, ZExCavator, Chasqui, zcash-local-net |
| Funding | Zcash Community Grants and other ecosystem funding |
| Works with | Zcash Foundation, Shielded Labs, Blockchain Commons, Nym |

## Zingo wallet

Zingo is a Zcash wallet for Android, iOS and desktop. It is built on Zingolib and has an address book, shielded memos and several languages. Downloads are on [zingolabs.org](https://zingolabs.org/).

- **Ironwood.** Zingo shipped Ironwood support when the network upgrade activated on 28 July 2026. Funds you send go into Ironwood, and change stays in Orchard. The iOS release was delayed in Apple's review. Zingo said that release did not yet include Nym mixnet privacy.
- **Zingo 3.0 (31 October).** The mobile app added support for NU7 and a Swap tab with quotes, deposits, live tracking and history, linked to the SwapKit Explorer. It also redesigned the main screens.

For how it compares with other wallets, see the [wallets list](/wallets). Always get the app from the official site or store pages and read the release notes before you update.

## Zingolib and zingo-cli

**Zingolib** is the Rust library behind Zingo. It exposes wallet functions to other apps, and **zingo-cli** is a command-line light wallet that talks to an indexer such as Zaino. See the [Zingolib and Zaino tutorial](/guides/zingolib-and-zaino-tutorial).

## Zaino

**Zaino** is a Rust indexer for the Zcash blockchain. It reads chain data from a [Zebra](/zcash-tech/zebra-full-node) validator and serves wallets, explorers and other clients, including the finalized chain and the mempool. It is part of the [Z3 stack](/zcash-tech/z3-stack) and is the replacement path for lightwalletd, since zcashd reached its end of support on 18 July 2026. See [Zaino](/zcash-tech/zaino).

Zaino has been funded through Zcash Community Grants. A one-year maintenance grant proposed in May 2026 was deferred in June 2026 until Zaino is ready for production use. Check the project's release notes for its current state.

## Other projects

| Project | What it is |
|---|---|
| Z3 | The effort to replace zcashd with Zebra, Zaino and Zallet. The Zingo team says it spends most of its Rust development time on it |
| ZeWIF | A wallet interchange format, developed with Blockchain Commons |
| ZExCavator | A recovery project for old wallet files, started by James Katz with the Zcash Brasil community. It is work in progress. For recovery, see [Recovering funds](/using-zcash/recovering-funds) |
| Chasqui | A project that compiles and refines Zcash statistics |
| zcash-local-net | Tools that start and manage Zcash nodes, indexers and light clients for integration testing |

## Hackfest in Rome

A Zcash Community Grants award approved in February 2026 paid for a two-week Zingo Labs hackfest in Rome in May. According to the follow-up post, participants integrated the Nym mixnet into Zingolib, so that Zingolib-based wallets can send transactions to the network through Nym, and attended the Zcash Dev Summit, ZKProof and Eurocrypt.

## Related pages

- [Zaino](/zcash-tech/zaino): the indexer in detail
- [Z3 stack](/zcash-tech/z3-stack): Zebra, Zaino and Zallet
- [Zcash Foundation](/zcash-organizations/zcash-foundation): maintains Zebra and works with Zingo Labs on Zaino
- [Zcash Community Grants](/zcash-organizations/zcash-community-grants): funds Zingo Labs projects
- [Recovering funds](/using-zcash/recovering-funds): tools for old wallets

## Sources

- [Ironwood in Zingo](https://forum.zcashcommunity.com/t/ironwood-in-zingo/56833), Zcash Community Forum, 28 July 2026
- [Zingo 3.0.0 release](https://github.com/zingolabs/zingo-mobile/releases/tag/zingo-3.0.0-324), GitHub
- [Zingo Labs: Zcash by anyone for everyone](https://forum.zcashcommunity.com/t/zingo-labs-zcash-by-anyone-for-everyone/50698), Zcash Community Forum
- [Zingo Labs Hackfest, Grant Proposal](https://forum.zcashcommunity.com/t/zingo-labs-hackfest-grant-proposal/54602) and [Zaino Unchained](https://forum.zcashcommunity.com/t/zaino-unchained/55849), Zcash Community Forum
`;

export function rewriteZingoLabsPage(original: string): string {
  if (!original.includes("ZingoLabs") && !original.includes("Zingo Labs")) return original;
  if (!original.includes("Zaino")) return original;
  return PAGE;
}

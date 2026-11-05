// Rewrite of "Namada Protocol". The source page is long, repeats the same points in several paragraphs,
// gives the MASP two different expansions, and presents the Zcash alliance as a fresh proposal. This
// keeps its facts, diagrams, video and links, tightens the prose into scannable sections, uses one name
// for the MASP, and states the alliance status as far as it could be checked. If the source is not this
// page any more, the original markdown is returned untouched.
export function rewriteNamadaGuide(original: string): string {
  if (!/^# Namada Protocol\s*$/im.test(original)) return original;
  if (!/Multi-Asset Shielded Pool|MASP/.test(original) || !/namada\.net/.test(original)) return original;

  const fm = original.match(/^---\n[\s\S]*?\n---\n/)?.[0] ?? "";
  const edit = original.match(/^\[!\[Edit Page\][^\n]*\n/m)?.[0] ?? "";
  const video = original.match(/<div className="my-8 w-full aspect-video[\s\S]*?<\/iframe>|<div className="my-8 w-full aspect-video[\s\S]*?\/>\s*<\/div>/)?.[0] ?? "";
  const img = (alt: string) => original.match(new RegExp(`!\\[${alt}\\]\\([^)]+\\)`))?.[0] ?? "";
  const bridge = img("Ethereum Bridge Diagram");
  const shielded = img("Shielded Assets Transaction Diagram");
  const alliance = img("Namada-Zcash Strategic Alliance Diagram");

  return `${fm}${edit}
# Namada Protocol

Namada is a proof-of-stake Layer 1 blockchain built for interchain, asset-agnostic privacy. Any asset that reaches Namada, fungible or not, can be moved through one shared shielded pool that uses an enhanced version of Zcash's Sapling design.

> **Status.** Namada's mainnet launched in December 2024. The alliance with Zcash described below began as a 2023 proposal. The ZEC–NAM shielded airdrop was still being specified in Zcash Community Forum threads in 2025 and 2026, and the Zcash–Namada bridge has not been confirmed as live. Check the [forum](https://forum.zcashcommunity.com) and [namada.net](https://namada.net/blog) before relying on either.

${video}

## How its privacy works

Namada uses the **Multi-Asset Shielded Pool (MASP)**, an enhanced version of the Zcash Sapling circuit. Every supported asset, including ETH-bridged NFTs, ATOM and NAM, shares the same shielded set, so a shielded transfer looks the same whatever it moves.

${shielded}

- **One shared set.** Privacy is not split between assets. A token with little volume gets the same protection as a busy one, and more users make the set better for everyone.
- **zk-SNARKs for all tokens.** Namada transfers native and non-native, fungible and non-fungible tokens privately with zk-SNARKs, like Zcash does for ZEC.
- **Shielded set rewards.** The updated MASP circuit includes a Convert Circuit that rewards people for holding shielded assets. Namada treats the shielded set as a non-exclusive, anti-rivalrous public good, and the rewards pay for privacy as one.

Read more in Namada's [introduction to the protocol](https://namada.net/blog/what-is-namada).

## Connecting to other chains

- **IBC.** Namada connects to any fast-finality chain that supports the Inter-Blockchain Communication protocol.
- **Ethereum bridge.** A trustless two-way bridge is part of the protocol itself rather than a separate system. Namada validators run it alongside the core software and act as relayers for transfers into Namada. Transfers to Ethereum use external relayers, who carry no responsibility for validating or securing the bridge.
- **Safety.** The bridge enforces flow controls on every connection, and faulty Ethereum transfers are treated as an offence that can lead to slashing.

${bridge}

## Speed and fees

Namada pairs fast proof generation with modern Byzantine Fault Tolerant (BFT) consensus. Cheaper proofs make shielded transfers quick to verify, and BFT consensus gives finality: once a transaction is confirmed it is irreversible, which removes the risk of double-spending or rollback. The project says this gives low fees and fast confirmation.

## Namada and Zcash

In its [RFC for a strategic alliance](https://namada.net/blog/rfc-proposal-for-a-strategic-alliance-between-namada-and-zcash), the Namada team proposed three things between the two assets, chains and communities:

1. **A grants pool** to fund projects that benefit both Zcash and Namada.
2. **An airdrop of NAM** to ZEC holders.
3. **A trust-minimized bridge** between Zcash and Namada. ZEC holders (Zolders) could then use ZEC on Namada and reach the wider Cosmos and Ethereum ecosystems through it.

${alliance}

Discussion continues on the [Zcash Community Forum](https://forum.zcashcommunity.com/t/rfc-proposal-for-a-strategic-alliance-between-namada-and-zcash/44372).

## Links

- [Namada website](https://namada.net/)
- [Namada blog](https://namada.net/blog)
- [Namada docs](https://docs.namada.net/)
- [Official video: Namada–Zcash strategic alliance](https://www.youtube.com/watch?v=Wg_WtPdBig0)
`;
}

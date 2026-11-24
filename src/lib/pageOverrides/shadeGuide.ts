// Rewrite of "Shade Protocol". The source describes Shade as an active privacy DeFi ecosystem ("future
// leader in DeFi", "potential for rapid growth is undoubtedly immense"). In 2026 Shade put its Secret
// Network applications into maintenance mode and wound them down, so the page is reframed as a record of
// what the project was, with the status stated first. Descriptions, diagrams and links from the
// ZecHub/zechub page are kept. If the source is not this page any more, the original markdown is returned.
export function rewriteShadeGuide(original: string): string {
  if (!/^# Shade Protocol\s*$/im.test(original)) return original;
  if (!/Silk/.test(original) || !/Secret Network/.test(original)) return original;

  const fm = original.match(/^---\n[\s\S]*?\n---\n/)?.[0] ?? "";
  const edit = original.match(/^\[!\[Edit Page\][^\n]*\r?\n/m)?.[0] ?? "";
  const img = (alt: string) => original.match(new RegExp(`!\\[${alt}\\]\\([^)]+\\)`))?.[0] ?? "";

  return `${fm}${edit}
# Shade Protocol

Shade Protocol was a privacy-preserving DeFi ecosystem built on Secret Network. It offered a governance and treasury token, a privacy-focused stablecoin, lending and swaps, with balances and transactions kept encrypted.

> **Status: winding down.** In June 2026 the Shade team announced that the protocol was entering maintenance mode: ShadeX, SILK minting, bonds, analytics and SHD staking are being wound down, and the team is focused on Feather, a separate lending product ([The Road to Feather](https://forum.shadeprotocol.io/t/the-road-to-feather/593)). SHD holders could burn their tokens to register for a future Feather allocation, with no guaranteed amount; that window was later brought forward and has closed ([CryptoSlate, 21 August 2026](https://cryptoslate.com/holders-face-permanent-token-destruction-with-no-guarantee-of-value-as-immediate-deadline-looms-for-shades-privacy-protocol/)). Separately, SCRT Labs said it would end its own development of the Secret L1 on 1 September 2026. This page is kept as a record of what Shade was. Do not use it as a guide to an active privacy tool.

## What Shade was

Shade ran on Secret Network, a Cosmos-based layer 1 with **encrypted smart contracts**. Contract inputs, outputs and state are encrypted, so data stays off the public ledger. Developers could build apps with encrypted data on Secret and, through cross-chain messaging, on other blockchains.

${img("Secret Network Diagram")}

It also used two standard Cosmos components:

- **Cosmos SDK**, a modular framework for building interoperable blockchains.
- **Tendermint Core**, which provides Byzantine Fault Tolerant (BFT) consensus with fast finality.

${img("Cosmos SDK and Tendermint Core Diagram")}

Together these let Shade offer encrypted transactions, private asset management and selective disclosure, while staying part of the wider Cosmos ecosystem.

## The two tokens

| Token | Role |
| --- | --- |
| **Shade (SHD)** | Treasury, governance and revenue-sharing token. Used for staking, governance proposals, liquidity provision and bonds. |
| **Silk (SILK)** | A privacy-focused stablecoin. Instead of tracking one currency, it was pegged to a weighted basket (USD, CAD, EUR, JPY, plus gold and Bitcoin) to avoid depending on a single peg. |

Both used **viewing keys**, so balances were hidden unless the owner chose to share them.

${img("Shade and Silk Tokens - Part 1")}

${img("Shade and Silk Tokens - Part 2")}

## What it offered

- **Privacy.** Encrypted inputs, outputs and state kept balances and transaction history off the public ledger.
- **Stable value.** Silk aimed to hold its value without relying on the US dollar, using the Silk Currency Basket. The team argued that gold and Bitcoin held value better than traditional currencies.
- **Decentralized governance.** Token holders could propose changes and vote on the protocol's direction.
- **Interoperability.** Being in the Cosmos ecosystem let Shade interact with other chains while keeping those transfers confidential.

${img("Interoperability Diagram")}

## Why it appears here

Shade is a separate project from Zcash. It is listed with other privacy tools because it applied similar ideas, encrypted state and selective disclosure, to DeFi. If you are looking for private ways to swap or hold value today, check the current state of any project before using it, and prefer tools you can verify.

## Links

- [Shade Protocol website](https://shadeprotocol.io/)
- [The Road to Feather](https://forum.shadeprotocol.io/t/the-road-to-feather/593)
- [What is Shade Protocol? (Medium)](https://medium.com/@shadeprotocoldevs/what-is-shade-protocol-efc1ef7aeabf)
- [Messari profile](https://messari.io/project/shade/profile)
`;
}

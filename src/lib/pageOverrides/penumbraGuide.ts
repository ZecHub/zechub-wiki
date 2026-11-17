// Rewrite of "Penumbra". The source page opened and continued with two images that no longer exist
// (_unavailable.svg), repeated "Penumbra" typos ("Panumbra"), used promotional wording ("at the speed of
// light", "top of the food chain"), and named the staking token PEN (it is UM, with delegation tokens
// delUM). This keeps the substance, corrects the token name, and lays it out as short sections.
// If the source is not this page any more, the original markdown is returned untouched.
export function rewritePenumbraGuide(original: string): string {
  if (!/^# Penumbra\s*$/im.test(original)) return original;
  if (!/ZSwap|Zswap/.test(original) || !/dPEN/.test(original)) return original;

  const fm = original.match(/^---\n[\s\S]*?\n---\n/)?.[0] ?? "";
  const edit = original.match(/^\[!\[Edit Page\][^\n]*\n/m)?.[0] ?? "";

  return `${fm}${edit}
# Penumbra

Penumbra is a fully shielded proof-of-stake Layer 1 in the Cosmos ecosystem. Users can transact, stake, swap and provide liquidity without revealing their activity on-chain. There are no transparent transactions and no transparent value pool, so privacy is the default rather than an option.

> **Status.** Penumbra's mainnet has been live since July 2024. Its original site, penumbra.zone, now redirects to penumbra.exchange; check the project's current channels and the [protocol documentation](https://protocol.penumbra.zone/) before using it. Penumbra is a separate network from Zcash.

## How it works

- **Zero-knowledge proofs.** Every transaction is verified without revealing the sender, the receiver or the amount.
- **IBC.** Penumbra uses the Inter-Blockchain Communication protocol to move tokens and data between chains in the Cosmos ecosystem, so assets from other chains can enter the shielded pool and leave it again.
- **A private DEX.** Trading happens through ZSwap, a decentralized exchange built into the chain. Orders are sealed when they are submitted and settle in batches, so trading strategies and history stay private.
- **Optional disclosure.** Every address supports a viewing capability. Users can choose to share their activity with a third party they authorize, for example for compliance.

## What you can do

| Use | What it means |
| --- | --- |
| **Private transfers** | Send any supported asset with the sender, receiver, amount and asset type all hidden, including as it moves across chains. |
| **Staking** | Stake UM, the network's staking token, to secure the chain and vote in on-chain governance. Delegating gives you delegation tokens (delUM), which live in the shielded pool and can be traded like any other asset. |
| **Swaps** | ZSwap supports shielded swaps between any pair of assets. Because transactions leak no data about user activity, there is no MEV (maximal extractable value) to extract. |
| **Market making** | Liquidity providers decide what to reveal about their strategy rather than exposing all of their activity to the world. |

## Learn more

- [Penumbra protocol documentation](https://protocol.penumbra.zone/)
- [Penumbra guide: the DEX](https://guide.penumbra.zone/dex)
- [Interchain Privacy is Here](https://penumbra.zone/blog/interchain-privacy-is-here): Penumbra's announcement of IBC support
`;
}

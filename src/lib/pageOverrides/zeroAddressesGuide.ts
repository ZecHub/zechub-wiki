// Rewrite of "Zero to Zero Knowledge: Transparent vs Shielded Transactions & Unified Addresses". Corrections:
// - the Unified Address typecodes were wrong: ZIP 316 uses 0x00 (P2PKH), 0x01 (P2SH), 0x02 (Sapling), 0x03 (Orchard)
// - the "Future improvements" paragraph described new zcashd RPC methods; zcashd halted on 18 July 2026 (see the
//   Full Nodes page), so it is replaced by guidance on choosing a wallet
// - the large Zcon3 poster image is replaced by a plain link to the talk, and the chatty opener and promo footer go.
// Pool status (Orchard closed to new inflows at NU6.3, block 3,428,143) comes from the site's own turnstile page.
// If the page has no "Unified Addresses" heading, the original markdown is returned untouched.
export function rewriteZeroAddressesGuide(original: string): string {
  if (!/^#\s+.*Unified Addresses/im.test(original)) return original;

  const fm = original.match(/^---\n[\s\S]*?\n---\n/)?.[0] ?? "";
  const edit = original.match(/<a href="https:\/\/github\.com[^>]*>[\s\S]*?<\/a>/)?.[0] ?? "";

  return `${fm}
${edit}

# Zero to Zero Knowledge: Transparent vs Shielded Transactions & Unified Addresses

**Series:** [Zero to Zero Knowledge](/zero-to-zero-knowledge/zero-to-zero-knowledge)

Zcash has two kinds of transactions, transparent and shielded, and a way to combine their addresses, the Unified Address. This page explains the difference, how a Unified Address is built, and what to look for in a wallet.

## Transparent and shielded transactions

| | Transparent | Shielded |
|---|---|---|
| Addresses | t-addresses (Base58Check) | Addresses for the Sapling, Orchard or Ironwood pools |
| What is public | Sender, receiver and amount, as in Bitcoin | Nothing beyond the proof that the transaction is valid |
| How privacy works | None | Zero-knowledge proofs |

"Shielded transaction" means any transaction whose addresses belong to a shielded pool. Moving value between pools can reveal the amount to an outside observer, which is why the pool balances are tracked (see [The turnstile](/zcash-tech/the-turnstile)).

## Address types

| Type | Encoding | Notes |
|---|---|---|
| Transparent | Base58Check | Public, like Bitcoin |
| Sapling | Bech32 | Shielded |
| Unified Address (UA) | Bech32m | Bundles several receivers in one address |

Each type is longer than the last, so QR codes grow as well.

## How a Unified Address works

A UA is a single address that carries one receiver for each pool the owner supports. The sender's wallet picks the best receiver it can use, so the sender does not need to choose a pool.

Under the hood (ZIP 316):

- Each receiver is encoded as a **typecode**, a **length** and the **address data**.
- The typecodes are: \`0x00\` transparent (P2PKH), \`0x01\` transparent (P2SH), \`0x02\` Sapling, \`0x03\` Orchard.
- The receivers are joined, then encoded with Bech32m.
- A UA must contain at least one shielded receiver, so privacy is always available. Sprout addresses cannot be part of a UA.

Full specification: [ZIP 316: Unified Addresses](https://zips.z.cash/zip-0316). See also [Unified addresses](/zcash-tech/unified-addresses).

## Why Unified Addresses matter

- **Simpler for exchanges and merchants.** One address can accept shielded deposits safely without separate flows per pool.
- **Future-proof.** New pools can be added as new receivers without breaking existing wallets or invalidating addresses people already use.
- **Shielded by default.** Because every UA contains a shielded receiver, using one moves value toward the shielded pools.

## Orchard and Actions

The Orchard pool introduced **Actions**. An Action merges what Sapling handled as a separate Spend and Output into one value commitment. Two benefits follow:

- All Actions in a transaction share a **single anchor**, which reduces leakage of metadata.
- The merged structure lets the Halo 2 proof system be optimised.

Daira-Emma Hopwood explains Anchor positions in [Explaining the Security of Zcash](https://www.youtube.com/watch?v=f6UToqiIdeY) (Zcon3).

Since the NU6.3 upgrade, the Orchard pool is closed to new inflows and wallets can move funds into the Ironwood pool. For the status of each pool, see [Shielded pools](/using-zcash/shielded-pools).

## Value balance and privacy

In some cases, such as a transaction between pools, the amount may be visible to an outside observer. Each pool carries a value balance, built from homomorphic commitments, that proves the total value in the pool and prevents counterfeiting. See [ZIP 209: Prohibit Out-of-Range Chain Value Pool Balances](https://zips.z.cash/zip-0209).

## Choosing a wallet

Prefer a maintained wallet that shows what a transaction will reveal before you send it. The wallet comparison on the [Wallets](/wallets) page lists which wallets are maintained and which support the newest pools. Wallets that are no longer maintained cannot follow network upgrades and should not be used for new funds.

## Further reading

- [Unified addresses](/zcash-tech/unified-addresses)
- [Shielded pools](/using-zcash/shielded-pools)
- [Zero to Zero Knowledge](/zero-to-zero-knowledge/zero-to-zero-knowledge): the full series
`;
}

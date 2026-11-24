// Rewrite of "What a block explorer can see on Zcash" (checked 6 Nov 2026). The page was accurate but written for a
// two-address world ("z addresses") and one shielded pool. Changes: address types now include unified addresses (u1...,
// ZIP 316) next to legacy Sapling (zs...) and Sprout (zc...); four ways to move value become a table; shielded pools
// (Sprout, Sapling, Orchard, Ironwood) are named and the amount crossing between pools is public (Keystone's Ironwood
// migration guide: the turnstile hides sender, recipient and addresses, the cross-pool amount is public); coinbase
// shielded outputs are public (ZIP 213, as used on the Heartwood page); metadata stays visible. TL;DR kept, "Common
// questions" added. If the page no longer has this shape, the original markdown is returned untouched.
export function rewriteBlockExplorerGuide(original: string): string {
  if (!/^# What a block explorer can see on Zcash\s*$/im.test(original)) return original;
  const edit = original.match(/<a href="https:\/\/github\.com[^>]*>[\s\S]*?<\/a>/)?.[0] ?? "";
  if (!original.includes("## Put it into practice") || !original.includes("zecblock.com")) return original;

  return `${edit}

# What a block explorer can see on Zcash

> A block explorer shows the public part of the chain. On Zcash that is the transparent activity and the edges of the shielded pools, not what happens inside them.

## TL;DR

- On Bitcoin, a block explorer shows everything: sender, receiver and amount.
- On Zcash, that is only true for transparent activity.
- An explorer can see value enter and leave a shielded pool, but not what happens inside it.
- Fully shielded transactions reveal no sender, no receiver and no amount.
- Any public "shielded share" figure is a floor, because fully private activity is invisible from outside.

## Address types

Zcash has transparent and shielded addresses, and most wallets now hand out one address that covers both.

- **Transparent addresses** start with \`t\` and work like Bitcoin addresses. Balances and payments are public.
- **Unified addresses** start with \`u1\` ([ZIP 316](https://zips.z.cash/zip-0316)). One unified address can carry several receivers, including shielded ones, and a wallet picks the best one. A draft revision of ZIP 316 would change the prefixes, so check the ZIP if you rely on them.
- **Older shielded addresses** start with \`zs\` (Sapling) or \`zc\` (Sprout). The network can confirm a shielded payment is valid without revealing the sender, the receiver or the amount.

## What an explorer sees, by transaction type

| Transaction | Sender | Receiver | Amount |
|---|---|---|---|
| Transparent to transparent | Visible | Visible | Visible |
| Transparent to shielded (shielding) | Visible | Hidden | Visible |
| Shielded to transparent (deshielding) | Hidden | Visible | Visible |
| Shielded to shielded | Hidden | Hidden | Hidden |
| Between two shielded pools | Hidden | Hidden | Visible |

In every row, other details stay public: when the transaction was mined, its size, its fee and how many inputs, outputs or shielded actions it has.

The total ZEC held in each shielded pool is also public, so the network can prove no coins were created from nothing.

## Several pools, one boundary

Zcash has four shielded pools: Sprout, Sapling, Orchard and Ironwood. Ironwood activated on July 28, 2026, and Orchard has been spend-only since then, so new shielded funds go to Ironwood. Orchard no longer receives payments, and existing funds stay there until you move them, with no deadline. See [Ironwood](/zcash-tech/ironwood).

Moving value from one pool to another crosses a turnstile, and the amount that crosses is public. The sender, receiver and addresses stay hidden. That is why an explorer can show funds leaving Orchard for Ironwood during a migration. See [The Turnstile](/zcash-tech/the-turnstile).

## What an explorer cannot see

- The sender, receiver and amount of a fully shielded transaction.
- The balance of an individual shielded address.
- What happens to funds once they are inside a pool.

If you query the raw data, the shielded sender and receiver fields come back empty. The explorer is not hiding them by choice: they were never on the chain in readable form. The data is encrypted, and only someone with the right [viewing key](/zcash-tech/viewing-keys) can read it.

One exception is worth knowing. Miners can receive their block reward at a shielded address, but those coinbase outputs are public ([ZIP 213](https://zips.z.cash/zip-0213)): they use a fixed key that reveals the address and the amount. A shielded address does not make a mining reward private.

## Why it matters

**Your privacy comes from the cryptography, not from trusting a company.** A data provider cannot look inside a shielded transaction even if it wants to.

**Public shielded-share numbers undercount privacy.** Researchers can only measure what crosses the public boundary, so they cannot count fully shielded activity from outside.

**A bigger shielded pool protects everyone.** The more people use shielded addresses, the larger the crowd any single private payment hides in.

## Put it into practice

- Use a wallet that defaults to shielded addresses, such as [ZODL](https://zodl.com) or [Zingo!](https://www.zingolabs.org/). See [Wallets](/using-zcash/wallets) for current support.
- When you receive ZEC at a transparent address, move it into a shielded address before you spend it.
- Pay to shielded addresses where you can. Every transparent payment is fully public, and a shielded one is not.
- Remember that shielding and deshielding show the amount.

## Common questions

<FaqItem q="Can a block explorer see my balance?">

Only for transparent addresses. For shielded funds an explorer sees pool totals, not the balance of any address.

</FaqItem>

<FaqItem q="If I shield ZEC, can anyone tell I did?">

Yes. The transparent side of a shielding transaction and its amount are public. What happens afterwards inside the pool is not.

</FaqItem>

<FaqItem q="Can someone read my shielded transactions with my address?">

No. An address only lets people send to you. Reading your history takes a viewing key, which you choose whether to share.

</FaqItem>

<FaqItem q="Why do shielded stats look small?">

Explorers can only count what crosses the public boundary, so they undercount fully shielded activity.

</FaqItem>

## Resources

- [Zcash: privacy and security recommendations](https://z.cash/support/security/privacy-security-recommendations/)
- [A shielded ecosystem (Electric Coin Company)](https://web.archive.org/web/20260903010654/https://electriccoin.co/blog/shielded-ecosystem/)
- [How Zcash technology works](https://z.cash/technology/)
- [ZecBlock](https://zecblock.com/)

## Related pages

- [Zcash basics](/start-here/what-is-zec-and-zcash)
- [Shielded pools](/using-zcash/shielded-pools)
- [Viewing Keys](/zcash-tech/viewing-keys)
- [The Turnstile](/zcash-tech/the-turnstile)
- [zk-SNARKs](/zcash-tech/zk-snarks)
`;
}

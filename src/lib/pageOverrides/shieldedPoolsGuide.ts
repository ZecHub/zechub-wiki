// Shielded Pools page: rewritten body. Keeps the facts the wiki already verified (Ironwood activation block 3,428,143
// on 28 July 2026, Orchard spend-only, ZIP 2005 quantum recoverability, turnstile accounting) and the five pool charts.
// Removed: "current/currently/now" wording, the "migration is in progress" claim (no source for its state), the
// "Sprout retired/deprecated for years" claims, an outdated wallet list, and repeated rules. Pool transfers become a table.
// If the page no longer has the anchors, the original markdown is returned untouched.

const BODY = `## TL;DR

- Zcash has **five value pools**: Transparent, Sprout, Sapling, Orchard and Ironwood.
- **Ironwood** is the newest shielded pool. It activated with NU6.3 on 28 July 2026 at block 3,428,143, and new shielded value goes there.
- **Orchard** is **spend-only**: no new value can enter it, and funds already there can be spent and migrated into Ironwood.
- **Sapling** (addresses starting with \`zs\`) is still accepted and widely supported.
- **Sprout** is the original shielded pool from 2016. Newer wallets focus on Sapling and Ironwood.
- **Transparent** addresses (\`t...\`) work like Bitcoin: everything is public.
- Moving value between pools is public and counted by the turnstile. The most private payments stay inside a shielded pool.

## What is a value pool?

Zcash keeps funds in separate accounting systems called **value pools**. Each pool has its own cryptographic rules and its own privacy properties. The protocol tracks how much value is in each pool and checks every move between them, so a bug in one pool cannot create coins in another.

| Pool | Privacy | Notes |
| --- | --- | --- |
| Transparent | None | Public, like Bitcoin. Addresses start with \`t\`. |
| Sprout | Shielded | The original pool, launched 28 October 2016. |
| Sapling | Shielded | Introduced 28 October 2018. Addresses start with \`zs\`. |
| Orchard | Shielded | Activated 31 May 2022 with NU5. Spend-only after Ironwood. |
| Ironwood | Shielded | Activated 28 July 2026 with NU6.3. Where new shielded value goes. |

You rarely choose a pool yourself. A **unified address** (\`u1...\`) bundles several receivers, and your wallet picks the right pool for each payment.

![img1](/content-images/4ba8cca2-cea5-42d2-8ec2-2122b26f5144-9db37e245e.webp)
Fig 1: The three shielded pools (Sprout, Sapling and Orchard) up to 29 October 2025, before Ironwood activated

## The pools

<h3 id="ironwood" class="text-3xl font-bold my-4">Ironwood</h3>

Ironwood activated on 28 July 2026 at block 3,428,143 as part of the NU6.3 network upgrade.

It exists because a vulnerability was found in Orchard's proving system in May 2026. There is no evidence it was ever exploited, but the flaw meant the proofs alone could not show that the shielded supply was sound. Rather than patch in place, the network created a fresh pool with a corrected circuit and moved value across a turnstile that counts every coin in public. That accounting restores the guarantee that the shielded supply is fully backed.

Ironwood reuses Orchard's Action model and Halo 2 proofs, so it behaves the same way in daily use. Two things are new:

- Transactions use the v6 format.
- Ironwood notes are **quantum-recoverable** under [ZIP 2005](https://zips.z.cash/zip-2005): a coin's on-chain record stays recoverable if a future quantum computer breaks today's cryptography. That is a recovery path, not quantum resistance, and it does not apply to older pools.

You do not need a new address. See [Ironwood](/zcash-tech/ironwood) for the upgrade itself.

<h3 id="orchard" class="text-3xl font-bold my-4">Orchard</h3>

![img2](/content-images/a672e001-6dbc-4e76-ab31-0ed7d7d2ff72-93b5a23e5d.webp)
Fig 2: The Orchard pool up to 29 October 2025, before Ironwood activated

Orchard activated on 31 May 2022 with the NU5 network upgrade. It introduced a shielded protocol with no trusted setup, based on **Actions** instead of separate shielded inputs and outputs, and it became the main pool used by unified addresses.

Since Ironwood activated, **Orchard is spend-only**. No new value can enter it. Funds already there can still be spent, and they move into Ironwood through the turnstile. Wallets handle the move, and most let you control its pace. Each move out of Orchard shows its amount on the blockchain, so how a wallet splits and times it matters for privacy.

If you hold Orchard funds, see [Ironwood](/zcash-tech/ironwood) for what the migration means in practice.

<h3 id="sapling" class="text-3xl font-bold my-4">Sapling</h3>

![img3](/content-images/b1c6bb71-9356-45eb-8e4a-19d7cf1790ae-5e3051b082.webp)
Fig 3: The Sapling pool up to 29 October 2025, before Ironwood activated

[Sapling](https://z.cash/upgrade/sapling) was introduced on 28 October 2018. It made shielded transactions fast enough for ordinary use, where Sprout transactions were slow and heavy to create.

What Sapling added:

- Much faster creation of shielded transactions.
- Viewing keys, so you can show incoming and outgoing activity without exposing your spending key.
- Separate keys that let hardware wallets sign shielded transactions.

Sapling addresses begin with \`zs\`. Sapling is not affected by Orchard being spend-only: it still accepts funds, and shielded wallets support it.

<h3 id="sprout" class="text-3xl font-bold my-4">Sprout</h3>

![img4](/content-images/956eceed-f4d6-4087-99d0-32a770449dda-a3cc45305e.webp)
Fig 4: The Sprout pool up to 29 October 2025, before Ironwood activated

Sprout was the first open, permissionless zero-knowledge privacy protocol. It launched on 28 October 2016, and its addresses begin with \`zc\`. The name stressed that the software was young and still growing.

Sprout was also the pool used during the [slow-start mining period](https://electriccoin.co/blog/slow-start-and-mining-ecosystem/) that shaped how early ZEC was distributed.

As shielded use grew, Sprout proved slow and limited in privacy and scalability, which led to the Sapling upgrade. If you still hold Sprout funds, move them into a newer pool with a wallet that supports it.

<h3 id="transparent" class="text-3xl font-bold my-4">Transparent</h3>

![img5](/content-images/01de2907-b62d-4421-83d7-ea4908faa828-6f74b724ed.webp)
Fig 5: The Transparent pool up to 29 October 2025, before Ironwood activated

The transparent pool is not private. Its addresses begin with \`t\`, and transactions work like Bitcoin's: multisignature support, public addresses, and every sender, receiver and amount visible on the blockchain.

Many centralized exchanges use transparent addresses for ZEC deposits and withdrawals, so a payment that touches one of those addresses is public on that side. Shielded transactions take more computation to create than transparent ones, which is why some services still choose transparent addresses.

## Moving value between pools

| Move | Name | Privacy |
| --- | --- | --- |
| Shielded to shielded | z to z | The most private. Sender, receiver and amount stay hidden. |
| Shielded to transparent | Deshielding | The amount and the transparent receiver are visible on-chain. |
| Transparent to shielded | Shielding | The transparent side is visible, and so is the amount moved. |
| Transparent to transparent | t to t | Fully public. |

For strong privacy, keep funds in a shielded pool and send shielded to shielded whenever you can.

## Orchard to Ironwood

Orchard is sealed to new deposits, and value that was already in it moves into Ironwood through the turnstile. You can follow the totals at [ironwood.live](https://ironwood.live/).

What this means for you:

1. **New shielded activity** goes into Ironwood automatically. There is nothing to do.
2. **Existing Orchard funds** need to migrate. Wallets that support Ironwood do this for you, usually in stages.
3. **Sapling is unaffected.** Only Orchard was sealed.
4. **The turnstile counts every crossing**, which is what shows that no coin was invented along the way.

> **One privacy caveat.** The turnstile publishes the *amount* that crosses between pools, along with the block height. Sender and receiver stay hidden, but a distinctive amount can be linked back to you. That is why wallets migrate in stages using standard denominations instead of moving a balance in one recognizable lump. Let your wallet set the pace, and consider Tor or a VPN so your IP address is not tied to the amounts you move.

See [The Turnstile](/zcash-tech/the-turnstile) for how the accounting works.

## Common mistakes

- **Sending from a t-address to a t-address.** It is fully public. Shield funds first.
- **Assuming Orchard still accepts funds.** It is spend-only since 28 July 2026. Value can leave, but nothing new goes in.
- **Confusing Sapling and unified addresses.** Sapling addresses start with \`zs\`. Unified addresses start with \`u1\` and bundle several receivers, so the pool your payment lands in depends on which receivers the address carries.
- **Leaving funds in Sprout.** Move them into a newer pool.
- **Expecting a migration to be invisible.** The amount crossing the turnstile is public, even though sender and receiver are not.
- **Assuming shielding is fully private.** The act of shielding is visible on-chain. What happens afterwards inside the shielded pool is not.

## Related pages

- [Ironwood](/zcash-tech/ironwood): the upgrade that created the newest pool
- [The Turnstile](/zcash-tech/the-turnstile): how value moving between pools is audited
- [Wallets](/using-zcash/wallets): which wallets support which pools
- [Transactions](/using-zcash/transactions): how to send shielded transactions
- [Buying ZEC](/using-zcash/buying-zec): acquiring ZEC before using it in pools
- [zk-SNARKs](/zcash-tech/zk-snarks): the cryptography behind shielded pools
- [Zcash Basics](/start-here/what-is-zec-and-zcash): background on Zcash privacy
`;

export function rewriteShieldedPoolsGuide(original: string): string {
  const h1 = original.match(/^# Zcash Value Pools\s*$/m);
  if (!h1 || h1.index === undefined) return original;
  const tl = original.indexOf("## TL;DR", h1.index);
  if (tl < 0) return original;
  return original.slice(0, tl) + BODY;
}

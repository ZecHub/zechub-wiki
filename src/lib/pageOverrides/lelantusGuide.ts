// Rewrite of "Zero to Zero Knowledge: Lelantus Protocol". The original thread (2023) described Lelantus as Firo's
// current protocol and Lelantus-Spark as "planned". Facts used here come from Firo's own posts:
// - Spark went live on mainnet on 18 January 2024 (firo.org/2024/01/18/spark-is-live.html)
// - Lelantus V1.0 was retired: redemption closed at block 1,223,500 (about 20 December 2025) for coins owned before
//   18 January 2024 (firo.org/2025/11/28/lelantus-v1-closing.html)
// - a Spark multi-input vulnerability was disclosed on 13 August 2026 (firo.org/2026/08/13/spark-vulnerability-mitigated.html)
// Dropped as unsupported: the "65,000 coins" set cap, "same Network Magic as Zcash's Magicbean", and the claim that
// Lelantus 1.0 "lacked correct security proofs". If the page has no Lelantus heading, the original is returned.
export function rewriteLelantusGuide(original: string): string {
  if (!/^#\s+.*Lelantus/im.test(original)) return original;

  const fm = original.match(/^---\n[\s\S]*?\n---\n/)?.[0] ?? "";
  const edit = original.match(/<a href="https:\/\/github\.com[^>]*>[\s\S]*?<\/a>/)?.[0] ?? "";

  return `${fm}
${edit}

# Zero to Zero Knowledge: Lelantus Protocol

**Series:** [Zero to Zero Knowledge](/zero-to-zero-knowledge/zero-to-zero-knowledge)

Lelantus is a privacy protocol introduced in 2019. It builds on Zerocoin and was used by Firo (formerly Zcoin) for private on-chain transactions. Firo has since retired Lelantus V1.0 in favour of its successor, Spark. This page explains the ideas behind Lelantus, why Firo replaced it, and how both compare with Zcash.

## Status

| Protocol | Status, per Firo |
|---|---|
| Lelantus V1.0 | Retired. New mints are no longer possible. The redemption window for coins owned before 18 January 2024 closed at block 1,223,500, around 20 December 2025. |
| Spark | Live on mainnet since 18 January 2024. It is Firo's private-transaction protocol today. |

Details and dates are in Firo's announcements: [Spark is live](https://firo.org/2024/01/18/spark-is-live.html) and [Lelantus V1.0 redemption period closing](https://firo.org/2025/11/28/lelantus-v1-closing.html).

## Where it comes from

Zcash and Firo started from different foundations. Zcash builds on the **Zerocash** protocol and zk-SNARKs. Firo builds on **Zerocoin**, and its privacy protocols have evolved in steps:

1. **Zerocoin**: the original design; its soundness was later broken.
2. **Sigma**: removed the trusted setup, but only allowed minting fixed denominations.
3. **Lelantus**: removed the fixed denominations.
4. **Spark**: the successor to Lelantus, with its own addresses and a modular proof design.

## The problem with Sigma

Sigma users could only mint coins of fixed denominations. That split the anonymity set by denomination, which made each set smaller. It also opened the door to timing analysis between a mint and its later redemption, and to the "tainted change" problem, where change from a spend can be linked back to the input.

## How Lelantus improved privacy

Lelantus lets users mint coins of arbitrary value into a single larger set, which:

- removes the per-denomination anonymity sets,
- reduces timing attacks between mint and redeem,
- removes the tainted-change problem, because partial redemptions keep the remainder and amounts hidden.

## Key ideas

- **Coin commitments.** A coin commitment is a double-blinded commitment to the coin's serial number and value. It plays a role similar to a note in Zcash. It is published on the ledger when the coin is created.
- **Basecoin to zerocoin.** Users move between a transparent "basecoin" and private coins. As in Zcash, transparent transactions are an explicit choice.
- **One-of-many proofs.** These let a spender prove that one commitment in a large set is theirs, and recover the values needed to check the balance, without revealing which one and without a trusted setup. A related technique appears in Monero's research (see [CryptoNote](/zero-to-zero-knowledge/cryptonote)).
- **Dandelion++.** Firo hides the IP address of the node that broadcasts a transaction. In the stem phase the transaction goes to one random peer; in the fluff phase it switches to normal gossip, so the origin is hard to trace.

## Spark: the successor

Spark is designed to hide the sender, the receiver and the amount. Per Firo, it uses a modular set of zero-knowledge proofs, each covering a specific property, rather than a single complex circuit, and it does not require a trusted setup. Spark has its own address format, separate from transparent Firo addresses.

In August 2026 Firo disclosed a vulnerability affecting multi-input Spark spends and published a mitigation. Read [Firo's report](https://firo.org/2026/08/13/spark-vulnerability-mitigated.html) for the details and the follow-up status, as it was still being resolved when it was published.

## How it compares with Zcash

| | Firo (Lelantus, now Spark) | Zcash shielded pools |
|---|---|---|
| Foundation | Zerocoin lineage | Zerocash lineage |
| Proof system | One-of-many and other zero-knowledge proofs; no trusted setup | zk-SNARKs (Orchard uses Halo 2, with no trusted setup) |
| Hiding set | Large set of coins | Every note in the shielded pool |
| Transparent transactions | Optional, chosen explicitly | Optional, chosen explicitly |
| Network layer | Dandelion++ | Optional Tor or other network tools |

## Further reading

- [Zero to Zero Knowledge](/zero-to-zero-knowledge/zero-to-zero-knowledge): the full series
- [Shielded pools](/using-zcash/shielded-pools): how Zcash's pools work
- [Firo technology](https://firo.org/about/tech/): Firo's own description of its protocols
`;
}

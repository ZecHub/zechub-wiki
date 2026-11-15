// Rewrite of "Zero to Zero Knowledge: CryptoNote Protocol". What changes: the "LIKE & SUBSCRIBE" thumbnail,
// the chatty opener and the note about a possible future "Posterity Fund" emission curve (unverified) are
// removed; the Ring CT section stops calling Pedersen commitments "homomorphic encryption" (they are
// additively homomorphic commitments, and the amount proof is a range proof); the CryptoNight note names
// RandomX; the Zcash comparison now says how the two designs differ instead of only quoting anonymity-set size.
// If the page no longer has this shape (no CryptoNote heading), the original markdown is returned untouched.
export function rewriteCryptonoteGuide(original: string): string {
  if (!/^#\s+.*CryptoNote/im.test(original)) return original;

  const fm = original.match(/^---\n[\s\S]*?\n---\n/)?.[0] ?? "";
  const edit = original.match(/<a href="https:\/\/github\.com[^>]*>[\s\S]*?<\/a>/)?.[0] ?? "";

  return `${fm}
${edit}

# Zero to Zero Knowledge: CryptoNote Protocol

**Series:** [Zero to Zero Knowledge](/zero-to-zero-knowledge/zero-to-zero-knowledge)

CryptoNote is a protocol for private digital cash. It hides who sent a payment, who received it and, in later versions, how much was sent. It is the design behind Monero and several other privacy coins, and it takes a different route to privacy than Zcash. This page covers its main ideas and how they compare.

## Background

The CryptoNote whitepaper was published in 2013 under the pseudonym "Nicolas van Saberhagen". Bytecoin was the first cryptocurrency launched on the protocol. Monero (XMR) is the best-known project built on it; Aeon and others have used it too.

## What CryptoNote provides

| Feature | What it does |
|---|---|
| Untraceable, unlinkable transactions | Ring signatures hide the sender; one-time stealth addresses hide the recipient |
| Egalitarian proof of work | A memory-hard mining algorithm meant to keep CPUs and GPUs competitive with ASICs |
| Dynamic emission | The block reward decreases smoothly instead of halving in steps |

## Hiding the sender: ring signatures

A ring signature proves that a transaction was signed by one member of a group of keys, without revealing which one. When you spend, your real output is mixed with several decoy outputs taken from the blockchain. An observer sees the whole ring, but cannot tell which member is real.

Two details matter:

- **Key images.** Each spent output produces a unique key image. The network rejects a repeated key image, which prevents double spending without identifying the spender.
- **Ring size.** The number of decoys is a protocol parameter. A larger ring gives a larger set of possible senders, but makes each transaction bigger.

## Hiding the amount: Ring CT

The original protocol hid the sender but left amounts visible, so decoys had to share the same amount. Ring Confidential Transactions (Ring CT) closed that gap:

- Amounts are replaced by **Pedersen commitments**. A commitment hides the value but can be added and compared, so the network can check that inputs equal outputs.
- A **range proof** shows that each committed amount is within a valid range, so nobody can create value by committing to a negative number. Monero uses Bulletproofs-style range proofs for this.
- **Stealth addresses** give the recipient a fresh one-time address for every payment, so outputs cannot be linked to a public address.

## Egalitarian proof of work

CryptoNote's original mining algorithm, CryptoNight, is memory-hard: it fills a large scratchpad with pseudorandom data, performs many read and write operations on it, and hashes the result. The goal was to narrow the advantage of specialized ASIC hardware. In practice, ASICs for CryptoNight appeared, and Monero has since moved to a different algorithm, RandomX (2019).

## Dynamic emission

Bitcoin halves its block reward at fixed intervals. CryptoNote instead reduces the reward smoothly, which produces a continuous emission curve rather than steps. Zcash follows a different schedule: a fixed supply cap of 21 million ZEC with halvings.

## How it compares with Zcash

| | CryptoNote (Monero) | Zcash shielded pools |
|---|---|---|
| Sender privacy | Ring signature over a set of decoys | Zero-knowledge proof; no decoys |
| Size of the hiding set | A fixed-size ring chosen per transaction | Every note in the shielded pool |
| Amounts | Hidden with Pedersen commitments and range proofs | Hidden inside the shielded note |
| Cryptographic basis | Ring signatures, commitments | zk-SNARKs |
| Privacy is | Default for every transaction | Optional: transparent and shielded transactions both exist |

The main difference is the hiding set. In a ring-based design, privacy depends on how decoys are chosen and how large the ring is. In a zero-knowledge design, a shielded spend is indistinguishable among all notes in the pool. The trade-offs on the other side are that zk-SNARKs are a newer and more complex cryptographic stack, and that Zcash users must choose to use shielded addresses.

## Further reading

- [Zero to Zero Knowledge](/zero-to-zero-knowledge/zero-to-zero-knowledge): the full series
- [Shielded pools](/using-zcash/shielded-pools): how Zcash's pools work

*Based on the Zero to Zero Knowledge thread by ZecHub on X: https://x.com/ZecHub/status/1636473585781948416*
`;
}

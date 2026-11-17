// Rewrite of "Zero to Zero Knowledge: Hash Functions" (part 1 of the series). Corrections to the 2023 thread:
// - MD5 was listed as a "common" hash function without saying it is broken (practical collisions)
// - the three required properties missed pre-image / second pre-image resistance, and the Bitcoin block-hash
//   description ("timestamp + random value / network difficulty") was wrong; the header holds the previous block
//   hash, the Merkle root, a timestamp, the difficulty target and a nonce, and is hashed with double SHA-256
// - the Zcash note commitment tree was described as "perfectly hiding"; the tree uses Pedersen hashes (Sapling)
//   and Sinsemilla (Orchard), and the hiding comes from the commitments and proofs, not from the tree itself
// - BLAKE2b is now named where Zcash uses it (ZIP 32 key derivation, ZIP 244 transaction identifiers).
// If the page has no "Hash Functions" heading, the original markdown is returned untouched.
export function rewriteHashFunctionsGuide(original: string): string {
  if (!/^#\s+.*Hash Functions/im.test(original)) return original;

  const fm = original.match(/^---\n[\s\S]*?\n---\n/)?.[0] ?? "";
  const edit = original.match(/<a href="https:\/\/github\.com[^>]*>[\s\S]*?<\/a>/)?.[0] ?? "";

  return `${fm}
${edit}

# Zero to Zero Knowledge: Hash Functions

**Series:** [Zero to Zero Knowledge](/zero-to-zero-knowledge/zero-to-zero-knowledge)

This series covers the building blocks behind privacy-preserving protocols. Part 1 is the hash function, a basic tool of cryptography that blockchains use to link blocks, commit to data and derive keys. Later pages in the series rely on the properties described here.

## What a hash function does

A hash function takes an input of any length and produces an output of a fixed length.

| Term | Meaning |
|---|---|
| Message | The input to be hashed |
| Hash function | The algorithm that processes the input |
| Hash value (digest) | The fixed-length output |

Change one character of the input and the output changes completely. You can try this with an [online hash tool](https://cryptii.com/pipes/hash-function): enter any text and compare the output of different algorithms.

## Properties of a cryptographic hash function

| Property | Meaning |
|---|---|
| Deterministic | The same input always gives the same output |
| Pre-image resistant (one-way) | Given a hash value, it is infeasible to find an input that produces it |
| Second pre-image resistant | Given one input, it is infeasible to find a different input with the same hash |
| Collision resistant | It is infeasible to find any two different inputs with the same hash |

Real hash functions are judged by these properties. When a function loses one of them in practice, it should not be used for security.

## Common hash functions

| Function | Notes |
|---|---|
| SHA-256 (SHA-2 family) | Used by Bitcoin; widely deployed |
| SHA-3 (Keccak) | The newest NIST standard, built differently from SHA-2 |
| BLAKE2b | Fast and secure. Zcash uses it, for example in [ZIP 32](https://zips.z.cash/zip-0032) key derivation and [ZIP 244](https://zips.z.cash/zip-0244) transaction identifiers. See [blake2.net](https://www.blake2.net) |
| MD5 | **Broken.** Practical collisions exist, so it must not be used for security. It survives only as a quick, non-security checksum |

## Where hash functions are used

### Integrity checks

A checksum lets you confirm a file has not been altered or corrupted. When you download wallet software, comparing the published hash with the hash of your file shows whether they match.

### Merkle trees

A Merkle (hash) tree labels each leaf with the hash of a data block, and each branch with the hash of its children. The root is a short commitment to all the data: any leaf can be proven to belong to it with a short path of hashes. Merkle trees let peers on a network check that the data they receive is unaltered.

### The Zcash note commitment tree

Shielded pools keep their note commitments in a Merkle tree. A spender proves, with a zero-knowledge proof, that their note is a leaf of the tree without revealing which one. The tree is built from hashes designed to be cheap to check inside proofs: Pedersen hashes in Sapling and Sinsemilla in Orchard. The privacy comes from the commitments and the proof; the tree is what the proof is checked against.

### Block hashes

In Bitcoin-style chains, each block header contains the hash of the previous block, the Merkle root of the block's transactions, a timestamp, the difficulty target and a nonce. The header is hashed with double SHA-256. Changing any earlier block would change every hash after it, which is what makes the chain immutable in practice.

### Proof of work: Equihash

Zcash mining uses Equihash, a memory-hard proof-of-work algorithm built on the generalized birthday problem. See [Equihash: Asymmetric Proof-of-Work Based on the Generalized Birthday Problem](https://eprint.iacr.org/2015/946).

## Further reading

- [Hash function (Wikipedia)](https://en.wikipedia.org/wiki/Hash_function)
- [Zero to Zero Knowledge](/zero-to-zero-knowledge/zero-to-zero-knowledge): the full series
`;
}

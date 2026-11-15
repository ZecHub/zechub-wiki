// Rewrite of "Zero to Zero Knowledge: Mnemonic Seed Phrases". Main correction: the original said the seed is derived
// from the mnemonic with "Blake2b-256/512 in Zcash". BIP-39 turns the phrase into a seed with PBKDF2-HMAC-SHA512
// (2048 rounds); BLAKE2b is what ZIP 32 later uses to derive the master keys from that seed. Also adds the 24-word
// case, a safe-handling section and the wallet birthday, and drops the chatty opener and promo footer.
// ZIP 339 ("Wallet Recovery Words") is deliberately not cited: its page is still marked "Reserved".
// If the page has no "Seed Phrases" heading, the original markdown is returned untouched.
export function rewriteSeedPhrasesGuide(original: string): string {
  if (!/^#\s+.*Seed Phrases/im.test(original)) return original;

  const fm = original.match(/^---\n[\s\S]*?\n---\n/)?.[0] ?? "";
  const edit = original.match(/<a href="https:\/\/github\.com[^>]*>[\s\S]*?<\/a>/)?.[0] ?? "";

  return `${fm}
${edit}

# Zero to Zero Knowledge: Mnemonic Seed Phrases

**Series:** [Zero to Zero Knowledge](/zero-to-zero-knowledge/zero-to-zero-knowledge)

A mnemonic seed phrase, also called a recovery phrase, is a list of words that encodes the secret from which a wallet derives all of its keys. Whoever holds the phrase controls the funds, which is why it is the foundation of self-custody. This page explains how a phrase is generated, how it becomes keys and addresses, and how to handle it safely.

## What a seed phrase is

Most wallets follow the **BIP-39** standard. A phrase starts from random data, called entropy. The more entropy, the stronger the phrase:

| Entropy | Checksum | Words |
|---|---|---|
| 128 bits | 4 bits | 12 |
| 256 bits | 8 bits | 24 |

BIP-39 also defines lengths in between. Many Zcash wallets use 24 words; check your wallet to see which length it created.

## How a 12-word phrase is generated

1. **Generate entropy.** The wallet produces 128 bits from a secure random source.
2. **Add a checksum.** It hashes the entropy with SHA-256 and appends the first 4 bits of the hash. The checksum lets a wallet detect most typing mistakes when you restore.
3. **Split into 11-bit groups.** The 132 bits (128 + 4) divide into twelve groups of 11 bits.
4. **Map to words.** Each group is a number from 0 to 2047, which selects a word from the BIP-39 wordlist of exactly 2,048 words. Wordlists exist in several languages.

The result is a human-readable phrase that can be written down and typed back in.

## From phrase to seed to addresses

1. **Phrase to seed.** BIP-39 stretches the phrase into a 64-byte (512-bit) seed with PBKDF2 (HMAC-SHA512, 2,048 rounds). An optional passphrase can be mixed in; a different passphrase produces a completely different wallet.
2. **Seed to master key.** For Zcash, ZIP 32 derives a master key and a chain code from the seed using BLAKE2b. The chain code lets the wallet derive child keys in a hierarchy.
3. **Keys to addresses.** From each spending key a wallet derives the matching viewing keys and as many payment addresses as it needs.

Key generation is deterministic: the same phrase always produces the same keys, in the same order. That is what makes recovery possible on any compatible wallet.

## Zcash-specific features

ZIP 32 defines hierarchical key derivation for Zcash's shielded pools. Because keys are derived in a tree, **viewing** and **spending** authority can be delegated separately for part of the tree without exposing the master seed. From a spending key the wallet derives:

- a **full viewing key**, which sees incoming and outgoing transactions,
- an **incoming viewing key**, which sees only incoming transactions,
- a set of **payment addresses** for the Sapling and Orchard pools.

Wallets also derive *internal* addresses for their own operations, such as receiving change or auto-shielding transparent funds, separate from the addresses you give to senders.

## Wallet birthday

A Zcash wallet must scan the blockchain to find your notes. The **birthday height** is the block at which the wallet was created. Keep it with the phrase: restoring with the correct birthday avoids scanning the whole chain, and restoring with a birthday that is too late can miss funds.

## Handling a seed phrase safely

- **Write it on paper or metal** and store it offline, in more than one safe place.
- **Never share it**, type it into a website, or send it in a message. No wallet team or support agent needs it.
- **Never store it** in a photo, a notes app or cloud storage.
- **Test the backup** by restoring to a new wallet with a small amount before relying on it.
- **Protect the passphrase** separately if you use one; losing it means losing the funds.

## Further reading

- [ZIP 32: Shielded Hierarchical Deterministic Wallets](https://zips.z.cash/zip-0032)
- [Zcash Protocol Specification](https://zips.z.cash/protocol/protocol.pdf)
- [BIP-39: Mnemonic code for generating deterministic keys](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
- [Recovering funds](/guides/recovering-funds)
- [Zero to Zero Knowledge](/zero-to-zero-knowledge/zero-to-zero-knowledge): the full series
`;
}

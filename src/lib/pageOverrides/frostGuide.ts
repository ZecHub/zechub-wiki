// Reading-order rewrite of the FROST technical page. The technical content is kept (Schnorr background,
// DKG, preprocessing, the two signing rounds, Coinbase, ROAST, IETF) but regrouped: an "At a glance" table
// replaces the TL;DR, the dense paragraphs of "What is FROST?" become short blocks, DKG and signing become
// numbered steps next to their diagrams, and the ecosystem notes become a short list.
// Corrections against the source: the IETF note said draft version 11 had been submitted, but the
// protocol was published as RFC 9591 in June 2024; "signing rounds 2 and 3" contradicted the two-round
// description and is now "round 2"; "Practical Implications" described FROST as arriving in Zcash in the
// future and is now written in the present tense with links to the pages that cover tools. The three
// diagrams were wrapped in empty links with no alt text and are plain images with alt text now.
// If the page no longer has this shape, the original markdown is returned untouched.
export function rewriteFrostGuide(original: string): string {
  if (!/^# FROST\s*$/im.test(original)) return original;
  const need = ["### What is a Schnorr signature?", "### How does FROST work?", "**Distributed key generation (DKG)**", "**Threshold Signing**", "### FROST use in the wider ecosystem", "## Common Mistakes"];
  if (need.some((n) => !original.includes(n))) return original;

  const fm = original.match(/^---\n[\s\S]*?\n---\n/)?.[0] ?? "";
  const edit = original.match(/<a href="https:\/\/github\.com[^>]*>[\s\S]*?<\/a>/)?.[0] ?? "";
  const src = (needle: string) => original.match(new RegExp(`/content-images/${needle}[^"')\\s]*`))?.[0];
  const overview = src("1634081807-frost-flexible-round-optimize");
  const prep = src("preprocess-");
  const sign = src("sign-402794d36a");
  if (!overview || !prep || !sign) return original;
  const mistakes = original.match(/## Common Mistakes\n([\s\S]*?)\n## Related Pages/)?.[1]?.trim();
  if (!mistakes) return original;
  const mistakesList = mistakes
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `- ${p}`)
    .join("\n");

  return `${fm}
${edit}

# FROST

FROST lets a group of people share control of one key. Each person holds a piece, and a set number of them (for example any 3 of 5) must cooperate to sign. The result is a single ordinary signature, so nobody watching the network can tell that more than one person was involved.

## At a glance

| | |
|---|---|
| **Full name** | Flexible Round-Optimised Schnorr Threshold signatures |
| **Created by** | Chelsea Komlo (University of Waterloo, Zcash Foundation) and Ian Goldberg (University of Waterloo) |
| **What it is** | A threshold signature and distributed key generation (DKG) protocol |
| **Rounds** | Two-round signing, or a single round with a preprocessing stage |
| **Output** | One Schnorr signature, so a transaction looks like an ordinary one |
| **Standard** | [RFC 9591](https://www.rfc-editor.org/rfc/rfc9591.html), June 2024 |
| **In Zcash** | Shared control of the spend authority of shielded ZEC, for custody, escrow, non-custodial services and Zcash Shielded Assets (ZSA) |

## Background: Schnorr signatures

A Schnorr digital signature is a set of three algorithms: \`KeyGen\`, \`Sign\` and \`Verify\`. Their key advantage here is that when several keys sign the same message, the signatures can be combined into one. That can shrink multisig payments and other multi-party transactions a lot.

## What FROST adds

FROST is a threshold version of the Schnorr scheme. In a threshold setting, a set number of signers, each holding a share of a common private key, must cooperate to sign. Cooperating costs network rounds, which hurts when shares sit on limited devices or networks are unreliable. FROST reduces that cost:

- **Few rounds.** It runs as a 2-round protocol, or as a single signing round after a preprocessing stage.
- **Parallel signing.** An unlimited number of signing operations can safely run at the same time, thanks to a technique that also protects against forgery attacks.
- **Misbehavior handling.** The protocol can abort when a participant misbehaves, and that participant is identified and excluded from future operations.
- **Proven security.** [The paper](https://eprint.iacr.org/2020/852.pdf#page=16) proves security against chosen-message attacks, assuming the discrete logarithm problem is hard and the adversary controls fewer participants than the threshold.

Video: [What are Threshold Signatures? Chelsea Komlo at Zcon3](https://youtu.be/cAfTTfblzoU?t=110).

## How it works

1. **Key generation.** The *n* participants run a distributed key generation (DKG) protocol to create a common verification key. Each ends up with a private secret key share and a public verification key share.
2. **Signing.** Any *t* of the *n* participants then run the threshold signing protocol and together produce a valid Schnorr signature.

![FROST overview: key generation followed by threshold signing](${overview})

## An analogy

FROST is like a safe-deposit box that opens only when enough authorized keyholders turn their keys together. Not every keyholder is needed, just a set number, such as any 3 of 5. Once it is open, an outside observer cannot tell which keyholders showed up, or that more than one was involved. In the same way, a group can jointly authorize a Zcash transaction while the network sees one ordinary-looking signature.

## Deep dive

### Key generation (DKG)

This phase creates the long-lived secret key shares and a joint verification key, and it is run by *n* participants.

- FROST builds on Pedersen's DKG (GJKR03), which uses Shamir's secret sharing and Feldman's verifiable secret sharing as subroutines.
- Each participant also sends a zero-knowledge proof of their own secret, which is itself a Schnorr signature. This protects against rogue-key attacks when *t* ≥ *n*/2.
- At the end, a joint verification key \`vk\` exists. Each participant Pᵢ holds a long-lived secret share \`(i, skᵢ)\` and a verification key share \`vkᵢ = skᵢ·G\`. Others use \`vkᵢ\` to check Pᵢ's signature shares, and outside parties use \`vk\` to verify signatures from the group.

### Threshold signing

This phase uses additive secret sharing and share conversion to generate each signature's nonce without extra interaction. It also uses binding techniques to block known forgery attacks without limiting concurrency.

**Preprocessing (once, reused across many signatures).** Each participant prepares a fixed number of pairs of elliptic curve (EC) points for later use.

![FROST preprocessing stage: each participant prepares pairs of elliptic curve points](${prep})

**Signing round 1.** Each participant Pᵢ generates a private nonce pair \`(dᵢ, eᵢ)\` and the matching EC points \`(Dᵢ, Eᵢ)\`, then broadcasts the points to everyone and stores the pairs it receives.

**Signing round 2.** This is the operation in which *t* of the *n* participants cooperate to create the signature. Its core technique is *t*-out-of-*t* additive secret sharing, which prevents forgery because attackers cannot combine signature shares across different signing operations or reorder the signers or published points.

![FROST signing: participants combine signature shares into one Schnorr signature](${sign})

With the challenge \`c\` computed, each participant calculates a response \`zᵢ\` from its single-use nonces and its long-term share (a degree *t*−1 Shamir share of the group key), and broadcasts \`zᵢ\`.

Read the [full paper](https://eprint.iacr.org/2020/852.pdf).

## FROST in the wider ecosystem

- **[Coinbase](https://github.com/coinbase/kryptology/tree/master/pkg/dkg/frost)** built its own version for its threshold-signing systems. It drops the signature aggregator role, so every participant verifies the others' work, and replaces the one-time preprocessing stage with a third signing round.
- **[ROAST](https://eprint.iacr.org/2022/550.pdf) (Blockstream)** is a wrapper around threshold schemes like FROST, proposed for the [Liquid sidechain](https://blog.blockstream.com/roast-robust-asynchronous-schnorr-threshold-signatures/). It guarantees that a quorum of honest signers can always obtain a valid signature, even with disruptive signers and very high network latency.
- **IETF.** The two-round variant was published as [RFC 9591](https://www.rfc-editor.org/rfc/rfc9591.html) in June 2024, after review in the IRTF Crypto Forum Research Group. That makes it a standardized scheme that software, hardware devices and services can implement.

## What it means for Zcash

FROST lets several parties, in different places, jointly control the spend authority of shielded ZEC. No single person holds the whole key, and the transaction looks like any other shielded transaction. That keeps strong resistance to payment tracking and limits the blockchain data available for analysis.

It supports escrow providers, DAO and team treasuries, custodians and other non-custodial services. It is also a natural fit for managing spend and issuance authority around Zcash Shielded Assets (ZSA).

For when to use it, the trade-offs and which tools support it, read [FROST & Threshold Custody](/zcash-tech/frost-threshold-custody). For hands-on walkthroughs, see the [Zkool multisig](/guides/zkool-multisig) and [YWallet FROST demo](/guides/ywallet-frost-demo) guides.

## Common mistakes

${mistakesList}

## Related pages

- [FROST & Threshold Custody](/zcash-tech/frost-threshold-custody): when to use it and which tools support it.
- [Halo](/zcash-tech/halo): the trustless, recursive proof system used in Zcash's Orchard pool.
- [Viewing Keys](/zcash-tech/viewing-keys): selective disclosure for shielded transactions.
- [Zcash Shielded Assets](/zcash-tech/zcash-shielded-assets): where FROST helps manage spend and issuance authority.
- [Zcash Wallet Syncing](/zcash-tech/zcash-wallet-syncing): another core piece of Zcash privacy infrastructure.

## Further learning

- [Coinbase: Threshold Signatures](https://www.coinbase.com/blog/threshold-digital-signatures)
- [Shamir Secret Sharing: explainer and example](https://www.geeksforgeeks.org/shamirs-secret-sharing-algorithm-cryptography/)
- [Short video on Schnorr digital signatures](https://youtu.be/r9hJiDrtukI?t=19)
`;
}

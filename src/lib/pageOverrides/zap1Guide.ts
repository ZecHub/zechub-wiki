// Editorial rewrite of "ZAP1 Attestation Protocol". The source reads well but is a flat list: this version
// leads with what the protocol is for, shows the flow as numbered steps, adds a status line (the ZIP draft,
// PR #1243, was still open in Nov 2026), dates the March 2026 deployment figures, and drops the "Live API"
// link, which now lands on a generic studio page instead of an API. If the source no longer has this
// shape, it is returned untouched.
export function rewriteZap1Guide(original: string): string {
  if (!/^# ZAP1 Attestation Protocol\s*$/im.test(original)) return original;
  if (!/## How it works/.test(original) || !/## Where to learn more/.test(original)) return original;

  const fm = original.match(/^---\n[\s\S]*?\n---\n/)?.[0] ?? "";

  return `${fm}
# ZAP1 Attestation Protocol

ZAP1 lets an application prove that something happened, such as a deployment, a payment or a transfer, without publishing the details. Events are hashed into a Merkle tree, and only the tree's root is written to Zcash, inside a shielded memo. Anyone holding a proof can check it against the chain. The event data stays private.

> **Status:** ZAP1 is an open-source, third-party project, not an accepted Zcash standard. Its ZIP draft, [PR #1243](https://github.com/zcash/zips/pull/1243), was still open for review in November 2026.

## How it works

1. **Register event types.** An operator defines the events it cares about (deployments, payments, transfers) and sends them to its own ZAP1 instance.
2. **Hash each event.** Every event becomes a leaf, hashed with domain-separated BLAKE2b-256, and leaves are added to a Merkle tree.
3. **Anchor the root.** When a threshold is reached, the root is encoded as a \`ZAP1:09\` memo and sent in a shielded Orchard transaction.
4. **Verify.** Anyone with a leaf hash can follow the path from leaf to root to the on-chain anchor, without trusting the operator.

\`\`\`
Your app  -->  ZAP1 API  -->  Merkle tree  -->  Zcash anchor
                  |                                    |
             event types                         shielded memo
          (DEPLOYMENT, etc)                    (ZAP1:09:{root})
\`\`\`

Each operator runs its own instance, with its own keys, tree and anchors. Nothing is shared between operators.

## Key properties

- **Application-agnostic:** any Zcash operator can define its own event types and personalization strings.
- **Privacy-preserving:** event payloads are hashed first, so only hashes reach the chain.
- **Independently verifiable:** checking a proof needs the proof bundle and chain access, nothing from the operator.
- **Heading towards ZIP 302:** the current \`ZAP1:09\` memo is a transitional format. The stated goal is to register the attestation as a [ZIP 302](https://zips.z.cash/zip-0302) payload type once that ZIP is final.

## What exists

| Piece | Details |
|---|---|
| Reference implementation | Rust, MIT licensed |
| Verification SDK | Rust crate on crates.io, with a WASM build |
| JavaScript SDK | Published on npm |
| Memo decoder | Identifies ZAP1, ZIP 302 TVLV, text, binary and empty memos |
| Conformance kit | 29 API checks and 14 protocol checks |
| Multi-party anchoring | FROST 2-of-3 threshold signing design for broadcasting anchors |

As of March 2026 the project listed 4 mainnet anchors covering 14 leaves. These figures are from that date. Check the project repository for current numbers.

## Resources

- [Source code](https://github.com/Frontier-Compute/zap1)
- [Protocol specification](https://github.com/Frontier-Compute/zap1/blob/main/ONCHAIN_PROTOCOL.md)
- [Operator guide](https://github.com/Frontier-Compute/zap1/blob/main/OPERATOR_GUIDE.md)
- [Verification SDK (\`zap1-verify\`)](https://crates.io/crates/zap1-verify)
- [Memo decoder (\`zcash-memo-decode\`)](https://crates.io/crates/zcash-memo-decode)
- [ZIP draft, PR #1243](https://github.com/zcash/zips/pull/1243)
`;
}

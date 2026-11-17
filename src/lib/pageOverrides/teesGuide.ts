// Rewrite of "Zero to Zero Knowledge: Trusted Execution Environments (TEEs)". The 2023 thread said TEEs are
// "ideal" for validator keys and that Zcash "is researching a migration to Proof-of-Stake"; it said nothing
// about attacks on the hardware. This version keeps the TEE mechanics (attestation, sealing, Secret, Oasis), adds
// a "Limits" section based on the TEE.fail disclosure of 28 Oct 2025 (The Hacker News report: Intel SGX/TDX and
// AMD SEV-SNP on DDR5, physical interposer, vendors call physical attacks out of scope, no known use in the wild),
// and replaces the PoS paragraph with a pointer to the Crosslink page. No claim about the present state of Secret
// Network is made, because Secret Labs states it is no longer involved with the network.
// If the page has no TEE heading, the original markdown is returned untouched.
export function rewriteTeesGuide(original: string): string {
  if (!/^#\s+.*(TEE|Trusted Execution)/im.test(original)) return original;

  const fm = original.match(/^---\n[\s\S]*?\n---\n/)?.[0] ?? "";
  const edit = original.match(/<a href="https:\/\/github\.com[^>]*>[\s\S]*?<\/a>/)?.[0] ?? "";

  return `${fm}
${edit}

# Zero to Zero Knowledge: Trusted Execution Environments (TEEs)

**Series:** [Zero to Zero Knowledge](/zero-to-zero-knowledge/zero-to-zero-knowledge)

A Trusted Execution Environment (TEE) is a protected area of a processor where code can run on data that the rest of the machine, including its owner and operating system, cannot read. Some blockchains use TEEs to get privacy. Zcash does not: it relies on zero-knowledge proofs. This page explains how TEEs work, where blockchains use them, and what the trade-offs are.

## Why blockchains and TEEs are paired

The two technologies have opposite strengths:

| | Blockchain | TEE |
|---|---|---|
| Availability and state persistence | Yes | No: an enclave keeps no state of its own |
| Public verification of the whole state | Yes | No |
| Private, intensive computation | Limited | Yes |

A design that combines them can run private computation inside enclaves while the chain keeps the state and the public record.

## How a TEE works

- **Enclave.** Code and data inside the enclave are encrypted in memory and decrypted only inside the processor.
- **Remote attestation.** The enclave can prove to a remote party that it is genuine secure hardware, that the expected application is running, and that it has not been tampered with. Attestation relies on private keys held by the hardware, which cannot be read from outside.
- **Data sealing.** Because an enclave has no persistent storage, it encrypts data with a key derived from the CPU before storing it outside. Only the same system can unseal it.

## Examples in blockchains

**Secret Network** is a Cosmos SDK chain whose validators run Intel SGX enclaves. Transactions are processed inside enclaves and data is decrypted only there, so contracts can work on encrypted inputs, outputs and state. A consensus encryption seed is held inside each validator's TEE, and contracts use unique encryption keys.

**Oasis Network** offers confidential smart contracts through its Sapphire ParaTime. Encrypted data enters the TEE with the contract, is decrypted and processed there, and is re-encrypted before it leaves.

## TEEs and validator keys

Proof-of-stake validators must keep their signing keys secret, stay online, and avoid signing conflicting messages, which can lead to slashing. A TEE can hold and use those keys without exposing them in plaintext, which is one reason TEEs appear in proof-of-stake designs.

## Limits and risks

Privacy that depends on a TEE depends on trusting the chip vendor and the hardware. That trust has been tested:

- **Side channels and physical attacks.** Researchers have repeatedly extracted secrets from TEEs. In October 2025, the *TEE.Fail* attack showed that, with a custom device placed between the processor and DDR5 memory, an attacker with physical access could extract keys from Intel SGX and TDX and from AMD SEV-SNP. Extracted attestation keys can let an attacker impersonate genuine secure hardware. See [The Hacker News report](https://thehackernews.com/2025/10/new-teefail-side-channel-attack.html).
- **Vendor position.** Intel and AMD have said that physical attacks are outside what these products protect against. The researchers reported no evidence of use in the wild.
- **What this means.** A TEE is strongest against remote attackers. A node operator with physical access to the machine is a different threat model.

## Comparison with Zcash

| | TEE-based privacy | Zcash shielded pools |
|---|---|---|
| Where privacy comes from | Hardware isolation | Zero-knowledge proofs |
| What you must trust | The chip vendor, attestation and physical security of the nodes | The cryptography and the protocol implementation |
| Data visible to validators | Decrypted inside enclaves | Not available: validators check proofs only |
| If the hardware is broken | Data can be exposed | Not applicable |

In Zcash, shielded transactions are broadcast and checked publicly, and the proof reveals nothing beyond validity. Zcash Shielded Assets follow the same model.

## Zcash and proof of stake

Zcash research on proof of stake has produced [Crosslink](/zcash-tech/crosslink-protocol), a proposed hybrid protocol that adds a proof-of-stake finality layer to Zcash's proof-of-work chain. See that page for the design and its status.

## Further reading

- [Crosslink Protocol](/zcash-tech/crosslink-protocol)
- [The Hacker News: TEE.Fail side-channel attack](https://thehackernews.com/2025/10/new-teefail-side-channel-attack.html)
- [Zero to Zero Knowledge](/zero-to-zero-knowledge/zero-to-zero-knowledge): the full series
`;
}

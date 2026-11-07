// Rewrite of the Halo page. Changes against the source, all checked on 5 Nov 2026:
// - The source presented Orchard as running safely on Halo 2. In May 2026 a soundness bug (a missing
//   constraint in the variable-base scalar multiplication gadget, CVE-2026-54496) was found in the Orchard
//   circuit, fixed in NU6.2 (halo2_gadgets 0.5.0, orchard 0.14.0), and NU6.3 Ironwood made Orchard spend-only.
//   The page now says so, in the same words as the NU6.2 and Ironwood pages of this wiki.
// - Removed claims from 2021 that cannot be verified today ("is being developed", "potential integration"
//   for Filecoin and Ethereum, the list of other projects), and the unsupported statement that the
//   reference string "becomes upgradeable, enabling smart contracts".
// - Kept only statements found in the source page, the NU6.2/Ironwood pages or the CVE advisory; no inferences.
// - Empty "_unavailable" image and empty links around the two diagrams were dropped; TL;DR was kept and shortened to four bullets.
// If the page no longer has this shape, the original markdown is returned untouched.
export function rewriteHaloGuide(original: string): string {
  if (!/^# Halo\s*$/im.test(original)) return original;
  const need = ["### Recursive proofs", "### Halo 2", "## Common Mistakes", "## Further Learning"];
  if (need.some((n) => !original.includes(n))) return original;

  const fm = original.match(/^---\n[\s\S]*?\n---\n/)?.[0] ?? "";
  const edit = original.match(/<a href="https:\/\/github\.com[^>]*>[\s\S]*?<\/a>/)?.[0] ?? "";
  const src = (needle: string) => original.match(new RegExp(`/content-images/${needle}[^"')\\s]*`))?.[0];
  const puzzle = src("Halo-puzzle-03");
  const accum = src("l4HrYgE");
  if (!puzzle || !accum) return original;

  return `${fm}
${edit}

# Halo

Halo is a way to prove that a computation was done correctly without revealing the data behind it, and without a secret ceremony to set the system up. Sean Bowe discovered it at Electric Coin Company, and its production implementation, Halo 2, is the proof system of Zcash's Orchard shielded pool.

## TL;DR

- Halo is a zero-knowledge proof system (zk-SNARK) that needs no trusted setup and supports recursion.
- Sean Bowe discovered it ([Halo paper](https://eprint.iacr.org/2019/1021.pdf)); Halo 2 is the Rust implementation.
- Zcash uses Halo 2 in the Orchard pool, activated with NU5 on May 31, 2022 (spend-only since Ironwood, NU6.3).
- Open source under [MIT and Apache 2.0](https://github.com/zcash/halo2#readme). Last verified November 2026.

## What happened in 2026

Halo 2 had its first serious security event in 2026. On May 29, researchers found a soundness bug in the Orchard circuit: a missing constraint in the gadget that does variable-base scalar multiplication (CVE-2026-54496). In theory it let a dishonest prover forge a valid-looking proof, which could have created or stolen value inside the Orchard pool. The bug had been there since NU5 activated in 2022. There is no evidence it was ever exploited.

- **June 2:** an emergency soft fork paused Orchard transactions.
- **June 3:** [NU6.2](/zcash-tech/nu6-2) fixed the circuit (\`halo2_gadgets\` 0.5.0 and \`orchard\` 0.14.0) and re-enabled Orchard.
- **July 28:** [Ironwood (NU6.3)](/zcash-tech/ironwood) added a new pool, and Orchard became spend-only.

The published advisory describes a missing constraint in one circuit gadget. It also notes that the damage was bounded by the turnstile, which caps how much value can leave a pool.

## Why Halo matters

### No trusted setup

Earlier Zcash pools used proof systems (BCTV14 for Sprout, Groth16 for Sapling) that needed a one-time ceremony to create public parameters. If the secret behind those parameters, the "toxic waste", were ever kept, someone could forge proofs. The ceremonies were run carefully, but they still asked everyone to trust that the secret was destroyed.

Halo removes that step. There is no ceremony and no secret, so there is nothing to destroy and no risk to repeat for the next upgrade.

### Recursion

Recursive proof composition means one proof can vouch for other proofs, so a large amount of verified work shrinks into one small proof that is quick to check. Before Halo this needed a trusted setup or a lot of computation.

Halo's key technique is **nested amortization**: it repeatedly collapses multiple instances of hard problems together over cycles of elliptic curves, so proofs can reason about themselves efficiently.

A way to picture it: each new stamp certifies the stack of stamps beneath it, so checking the last one is enough to trust the whole stack.

## How Halo 2 works

Halo 2 turns the Halo idea into a practical Rust library, built from three parts:

1. **A polynomial commitment scheme** (the inner product argument). It lets a prover commit to a polynomial with a short value and later prove what the polynomial evaluates to at points the verifier picks.
2. **A PLONK-style proof system.** It gives designers a lot of flexibility to build efficient implementations for the needs of an application.
3. **An accumulation scheme.** Each new proof is added to an object called an accumulator, and each addition reasons about the previous state. Checking the current accumulator then checks every earlier proof by induction.

![Halo puzzle: how repeated proofs collapse into one](${puzzle})

![Accumulation: each new proof folds into the accumulator that carries all earlier checks](${accum})

## Where Halo is used

**Zcash.** The Orchard shielded pool uses Halo 2. [Project Tachyon](/zcash-tech/project-tachyon) builds on proof-carrying data, a technique Halo's recursion made practical, to scale verification.

**Other projects.** Halo 2 is open source under MIT and Apache 2.0, so anyone can build on it. In 2021 Electric Coin Company announced an agreement with Protocol Labs, the Filecoin Foundation and the Ethereum Foundation to explore Halo research and development ([announcement](https://electriccoin.co/blog/ethereum-zcash-filecoin-collab/)). This page does not list which projects use it today.

## Common mistakes

| Common belief | What is actually the case |
| --- | --- |
| "Halo is a future upgrade Zcash is waiting for." | Orchard has run on Halo 2 since NU5 in 2022. |
| "The 2026 Orchard bug was a flaw in Halo itself." | The advisory describes a missing constraint in one gadget of the Orchard circuit. It was fixed in NU6.2, and there is no evidence it was exploited. |
| "Halo 2 and the Halo paper are the same thing." | The paper describes nested amortization. Halo 2 is the Rust implementation, with an accumulation scheme and PLONK-style arithmetic. |

## Related pages

- [zk-SNARKs](/zcash-tech/zk-snarks): the general technology Halo belongs to
- [NU6.2](/zcash-tech/nu6-2) and [Ironwood](/zcash-tech/ironwood): the fix and the new pool after the Orchard bug
- [The Turnstile](/zcash-tech/the-turnstile): how value moves between pools under audit
- [Project Tachyon](/zcash-tech/project-tachyon): scaling work built on proof-carrying data
- [Zcash Shielded Assets](/zcash-tech/zcash-shielded-assets): an extension of Orchard

## Further learning

- [Technical explainer: Halo on Zcash](https://electriccoin.co/blog/technical-explainer-halo-on-zcash/)
- [Sean Bowe's explainer at Dystopia Labs](https://www.youtube.com/watch?v=KdkVTEHUxgo)
- [An introduction to ZKP and Halo 2, Hanh Huynh Huu](https://www.youtube.com/watch?v=jDHWJLjQ9oA)
- [Halo 2 with Daira and str4d, ZK Podcast](https://www.youtube.com/watch?v=-lZH8T5i-K4)
- [Overview of PLONK](https://www.youtube.com/watch?v=P1JeN30RdwQ)

**Documentation**

- [The Halo 2 book](https://zcash.github.io/halo2/)
- [Halo 2 on GitHub](https://github.com/zcash/halo2)
- [Halo 2 resources](https://github.com/mhchia/awesome-halo2)
- [Security advisory GHSA-2x4w-pxqw-58v9](https://github.com/zcash/orchard/releases/tag/0.14.0), in the orchard 0.14.0 release notes
`;
}

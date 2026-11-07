// ZKP & zk-SNARKs (zcash-tech/zk-snarks). Full restructure into the wiki's pattern. The long theory sections of the source
// are kept (typos fixed, one wrong definition corrected) and moved under "Deep Dive"; the new top half explains what the
// proofs do in a Zcash transaction. Facts used: Sprout and Sapling use Groth16 with a trusted setup; Orchard uses Halo 2
// with none; ZIP 258 says the Ironwood pool is another use of the Orchard protocol and does not state more, so no proof
// system is claimed for it here. The Orchard circuit bug (CVE-2026-54496) and the NU6.2/NU6.3 timeline are the same as on
// the Halo page. Removed: the "Other Zero-Knowledge Applications" section (not about Zcash, unsourced scaling figures).
// If the page does not have the expected anchors, the original markdown is returned untouched.
const THEORY_EDITS: [string, string][] = [
  ["### Interactive & Probabalistic Proofs", "### Interactive and Probabilistic Proofs"],
  ["computional power", "computational power"],
  ["comprimised setup", "compromised setup"],
  ["sepcific to a circuit", "specific to a circuit"],
  ["distinguisger algorithms/strategies", "distinguisher algorithms/strategies"],
  ["every probabilty polynomial-time verifier", "every probabilistic polynomial-time verifier"],
  ["computationaly indistinguishable", "computationally indistinguishable"],
  ["the probability is >1/2.", "the distinguisher can do no better than guess, so its chance of telling them apart stays at about 1/2."],
  ["SNARKS are useful when", "SNARKs are useful when"],
  ["In SNARKS a single message", "In SNARKs a single message"],
  ["## What is a SNARK?", "## What is a SNARK?"],
];

const HEAD = [
  "# zk-SNARKs",
  "",
  "A zk-SNARK is a short proof that a statement is true. Anyone can check it quickly, and it reveals nothing except that the statement holds. Zcash uses these proofs so the network can verify a shielded transaction without seeing who sent it, who received it or how much it moved.",
  "",
  "## TL;DR",
  "",
  "- **zk-SNARK** stands for Zero-Knowledge Succinct Non-Interactive Argument of Knowledge.",
  "- It lets you prove you know something without revealing it. \"Succinct\" means the proof is small and fast to check.",
  "- In Zcash, the proof shows a shielded transaction is valid (the coins exist, you may spend them, the amounts balance) without showing the details.",
  "- Each Zcash pool has its own proof system. Sprout and Sapling use Groth16, which needs a trusted setup. Orchard uses Halo 2, which needs none.",
  "- A proof system can still have bugs. In 2026 a missing constraint was found in the Orchard circuit and fixed; Orchard has been spend-only since Ironwood (NU6.3).",
  "",
  "---",
  "",
  "## Visual / Analogy",
  "",
  "### The solved Sudoku",
  "",
  "Say you claim to have solved a very hard Sudoku. You could show the filled grid, but then the checker learns your solution and can copy it. A zero-knowledge proof is like handing the checker a short receipt that convinces them a valid solution exists, while the grid itself stays hidden.",
  "",
  "Real proofs are mathematics, not paper, but the idea is the same. The Zcash network is the checker, and the \"solution\" is the private data of your transaction.",
  "",
  "## What the proof shows in a Zcash transaction",
  "",
  "When you send shielded ZEC, your wallet builds a proof on your device and attaches it to the transaction. Every node checks the proof, and it convinces them that:",
  "",
  "- the coins you spend exist in the pool,",
  "- you are authorized to spend them,",
  "- the same coins are not spent twice,",
  "- the amounts going in and out balance.",
  "",
  "The nodes learn none of the underlying details. The proof is not encryption: the contents of a payment, including its memo, are encrypted separately for the recipient.",
  "",
  "## Proof systems by pool",
  "",
  "| Pool | Proof system | Trusted setup |",
  "|--|--|--|",
  "| Sprout | Groth16 | Yes |",
  "| Sapling | Groth16 | Yes, from a multi-party ceremony |",
  "| Orchard | Halo 2 | No |",
  "| Ironwood | Uses the Orchard protocol ([ZIP 258](https://zips.z.cash/zip-0258)) | See the [Ironwood](/zcash-tech/ironwood) page |",
  "",
  "A trusted setup produces secret randomness that must be destroyed. If someone kept it, they could forge proofs, which means creating coins out of nothing. It would not reveal anyone's private data. Halo 2 removed that dependency, which is the main reason Orchard was built on it. Sprout is a legacy pool; see [Sprout](/zcash-tech/sprout) and [Sapling](/zcash-tech/sapling) for the older designs.",
  "",
  "### What happened in 2026",
  "",
  "No trusted setup does not mean no bugs. In May 2026 researchers found a missing constraint in the Orchard circuit (CVE-2026-54496) that could in theory let a dishonest prover forge a proof. [NU6.2](/zcash-tech/nu6-2) fixed it, and no evidence of exploitation has been reported. [Ironwood (NU6.3)](/zcash-tech/ironwood) later made Orchard spend-only. The [Halo](/zcash-tech/halo) page has the full timeline.",
  "",
  "## Common Mistakes",
  "",
  "| Common belief | What is actually the case |",
  "|--|--|",
  "| \"A zk-SNARK makes every Zcash transaction private.\" | The proof protects shielded transactions. A transaction that touches a transparent address still reveals those parts. |",
  "| \"All Zcash pools use the same proofs.\" | Sprout and Sapling use Groth16. Orchard uses Halo 2. |",
  "| \"No trusted setup means the system cannot have bugs.\" | It removes one risk only. The 2026 Orchard circuit bug shows circuits can still have flaws. |",
  "| \"The proof is what hides my payment.\" | The proof shows validity. The payment contents are hidden by encryption and by the note design. |",
  "| \"A zero-knowledge proof can be reversed to recover the data.\" | It is built so that it reveals nothing beyond the truth of the statement. |",
  "",
  "---",
  "",
  "## Deep Dive: how zk-SNARKs work",
  "",
  "The sections below cover the theory behind the proofs. You do not need them to use Zcash.",
  "",
].join("\n");

const TAIL_TOP = [
  "",
  "## How are zk-SNARKs used in Zcash?",
  "",
  "Zero-knowledge proofs enforce honest behavior in a protocol without revealing any information. Zcash is a public blockchain, so every node must be able to check the rules. The proofs let nodes check that a private transaction follows the consensus rules without learning anything else about it.",
  "",
  "[Video Explainer](https://www.youtube.com/watch?v=Kx4cIkCY2EA): in this lecture Ariel Gabizon describes the Zcash note commitment tree, blind polynomial evaluation and homomorphically hidden challenges, and how they are implemented on the network.",
  "",
  "Read the [Halo 2 book](https://zcash.github.io/halo2/index.html) for more information.",
  "",
  "---",
  "",
].join("\n");

const RELATED = [
  "",
  "---",
  "",
  "## Related Pages",
  "",
  "- [Halo](/zcash-tech/halo) - the proof system behind Orchard, with no trusted setup",
  "- [Shielded Pools](/using-zcash/shielded-pools) - how the pools use these proofs",
  "- [Ironwood](/zcash-tech/ironwood) - why Orchard is now spend-only",
  "- [Sapling](/zcash-tech/sapling) - the Groth16 pool and its setup ceremony",
  "- [Post-Quantum Security in Zcash](/zcash-tech/post-quantum-security) - how future quantum risks relate to Zcash cryptography",
  "- [Zcash Shielded Assets](/zcash-tech/zcash-shielded-assets) - assets proposed on top of the Orchard protocol",
  "- [Who Can See Your Zcash Payment?](/start-here/who-can-see-your-zcash-payment) - what stays public, and what shielding hides",
  "",
].join("\n");

export function rewriteZkSnarksGuide(original: string): string {
  if (!/^# ZKP & ZK-SNARKS\s*$/im.test(original)) return original;
  const a = original.indexOf("## What is a Proof?");
  const b = original.indexOf("## How are zk-SNARK");
  const c = original.indexOf("## Other Zero-Knowledge Applications");
  const d = original.indexOf("Further Learning:");
  const e = original.indexOf("## Related Pages");
  if (a < 0 || b < a || c < b || d < c || e < d) return original;

  let theory = original.slice(a, b);
  for (const [from, to] of THEORY_EDITS) {
    if (theory.includes(from)) theory = theory.replace(from, to);
  }
  const edit = original.match(/<a href="https:\/\/github\.com[^>]*>[\s\S]*?<\/a>/)?.[0] ?? "";
  const further = original
    .slice(d, e)
    .replace(/\n*_{3,}\n*/g, "\n")
    .replace("Further Learning:", "## Further Learning\n")
    .replace(/\n*---\s*$/, "\n");

  return [edit, "", HEAD, theory.trimEnd(), TAIL_TOP, further.trimEnd(), RELATED].join("\n");
}

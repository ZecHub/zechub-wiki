// ZKP & zk-SNARKs (zcash-tech/zk-snarks). Full restructure into the wiki's pattern. The long theory sections of the source
// are kept (typos fixed, one wrong definition corrected) and moved under "Deep Dive"; the new top half explains what the
// proofs do in a Zcash transaction. Facts used: Sprout and Sapling use Groth16 with a trusted setup; Orchard uses Halo 2
// with none; ZIP 258 says the Ironwood pool is another use of the Orchard protocol and does not state more, so no proof
// system is claimed for it here. The Orchard circuit bug (CVE-2026-54496) and the NU6.2/NU6.3 timeline are the same as on
// the Halo page. Removed: the "Other Zero-Knowledge Applications" section (not about Zcash, unsourced scaling figures).
// If the page does not have the expected anchors, the original markdown is returned untouched.
const fig = (url: string, alt: string, w: number) =>
  '<div className="my-5 mx-auto" style={{ maxWidth: ' + w + ' }}><img src="' + url + '" alt="' + alt + '" className="h-auto w-full rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700" /></div>';

const THEORY = [
  "### Proofs that can be checked quickly",
  "",
  "A proof is a claim together with a sequence of steps that lets anyone confirm the claim is true. Mathematics works this way: the fact that the angles of a triangle add up to 180 degrees can be checked independently by anyone, who plays the role of the verifier. In cryptography both the prover and the verifier are algorithms.",
  "",
  "Computer science calls proofs that can be checked efficiently **NP proofs**. The idea is that a solution exists, and the prover hands it over for the verifier to check in polynomial time. A proof system of this kind has two properties:",
  "",
  "- **Completeness:** a true claim has a proof, and an honest prover can get it accepted.",
  "- **Soundness:** a false claim has no proof. No cheating prover can convince the verifier of something false.",
  "",
  fig("/content-images/zk-np-proof.svg", "A prover sends a witness w for a claim x to a verifier, who runs a check and accepts or rejects", 640),
  "",
  "### Interaction and randomness",
  "",
  "Instead of reading a single proof, the verifier can talk to the prover over several rounds. The verifier's questions are random, so the prover has to be able to answer every possible question correctly. With interaction and randomness together, a verifier that runs only in probabilistic polynomial time can be convinced of claims that a single NP proof could not efficiently establish.",
  "",
  fig("/content-images/zk-interactive-proof.svg", "A prover and a verifier exchange several rounds of answers and questions, then the verifier accepts or rejects", 640),
  "",
  "| Statement type | Meaning | One NP proof | Interactive proof |",
  "|--|--|--|--|",
  "| NP | A solution exists | Yes | Yes |",
  "| co-NP | No solution exists | Not believed to be possible | Yes |",
  "| #P | Counting how many solutions exist | Not believed to be possible | Yes |",
  "| PSPACE | Alternating statements | Not believed to be possible | Yes |",
  "",
  "### What zero knowledge means",
  "",
  "A protocol is zero knowledge if the verifier learns nothing from the interaction beyond the fact that the claim is true. What the verifier could compute afterwards, they could already compute before: the rounds of messages did not increase their power.",
  "",
  "Cryptographers formalize this with a **simulator**, an algorithm that does not know the secret but can still produce transcripts that look like a real conversation between prover and verifier. The two views, real and simulated, are **computationally indistinguishable** if no efficient algorithm that is given many samples can tell them apart better than guessing. In other words, its chance of picking the right one stays at 1/2, plus an amount too small to matter.",
  "",
  "Interactive protocols are most useful when there is a single verifier, such as a tax auditor in a zero-knowledge proof of taxes.",
  "",
  "### What is a SNARK?",
  "",
  "A **SNARK** is a Succinct Non-Interactive Argument of Knowledge: a short proof that a statement is true, fast to verify, and sent in a single message from the prover to the verifier, who then accepts or rejects. A **zk-SNARK** adds zero knowledge, so the proof reveals nothing about the secret data.",
  "",
  "For example, the statement \"I know a message m such that SHA256(m) equals a given value\" can be proved without revealing m.",
  "",
  "### From a computation to a proof",
  "",
  "A SNARK starts by turning the statement into a **polynomial** problem. A polynomial is a sum of terms made of constants, variables and exponents of variables, such as 3x² + 8x + 17. The computation itself is written as an **arithmetic circuit**: a directed acyclic graph in which each node performs an addition or a multiplication, the way a boolean circuit carries bits on its wires but with numbers instead.",
  "",
  fig("/content-images/zk-arithmetic-circuit.svg", "An arithmetic circuit: inputs a and b feed an addition gate, whose output and input c feed a multiplication gate that outputs c times a plus b", 640),
  "",
  "In this example the prover wants to convince the verifier that they know values for a, b and c that satisfy the circuit.",
  "",
  "1. **Commitments.** The prover places all the values of the circuit, private and public, into a commitment. A commitment hides its inputs by using a function whose output cannot be reversed. A hash function such as SHA-256 is one example of what a commitment scheme can use. The prover sends the commitments to the verifier, who cannot recover the original values from them, and then shows knowledge of the value at each node.",
  "2. **Non-interaction.** The Fiat-Shamir transform removes the back-and-forth. The prover generates the random challenges that the verifier would have sent by running a cryptographic hash function, which acts as a random oracle. The prover can then send a single message that the verifier checks.",
  "3. **Building blocks for general circuits.** A SNARK for any circuit needs two ingredients. A *functional commitment scheme* lets the prover commit to a polynomial with a short string, which the verifier can use to confirm claimed evaluations of that polynomial. A *polynomial interactive oracle* lets the verifier ask the prover to open the commitments at points of their choosing, and checks that the identity holds between them.",
  "",
  "### Setup",
  "",
  "A setup procedure helps the verifier by summarizing a circuit and producing public parameters. There are three kinds:",
  "",
  "| Setup | How it works | Examples |",
  "|--|--|--|",
  "| Trusted setup per circuit | Run once for each circuit. The secret randomness (the common reference string) must be kept secret and destroyed. If someone keeps it, a dishonest prover can prove false statements. | [Groth16](https://eprint.iacr.org/2016/260) |",
  "| Trusted but universal setup | The trusted setup runs only once, and can then be used to preprocess many circuits. | [Sonic](https://www.youtube.com/watch?v=oTRAg6Km1os), [Marlin](https://www.youtube.com/watch?v=bJDLf8KLdL0), [PLONK](https://eprint.iacr.org/2019/953) |",
  "| Transparent setup (no trusted setup) | The preprocessing uses no secret randomness at all. | [DARK](https://eprint.iacr.org/2019/1229), [Halo](https://eprint.iacr.org/archive/2019/1021/20200218:011907), [STARK](https://www.youtube.com/watch?v=wFZ_YIetK1o) |",
  "",
  "Groth16 has very short proofs that can be verified quickly, but needs a trusted setup. The transparent systems avoid a trusted setup at the cost of slightly longer proofs or a prover that may take longer to run.",
  "",
  "SNARKs are useful when many verifiers need to check the same proof, as on a blockchain such as Zcash: the validating nodes do not have to interact with the prover over several rounds for every proof.",
].join("\n");

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
  "- Each Zcash pool has its own proof system. Sprout began with BCTV14 and Sapling uses Groth16, and both need a trusted setup. Orchard uses Halo 2, which needs none.",
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
  "| Sprout | BCTV14 at launch, Groth16 later | Yes, from a 2016 ceremony |",
  "| Sapling | Groth16 | Yes, from a multi-party ceremony |",
  "| Orchard | Halo 2 | No |",
  "| Ironwood | Uses the Orchard protocol ([ZIP 258](https://zips.z.cash/zip-0258)) | See the [Ironwood](/zcash-tech/ironwood) page |",
  "",
  "A trusted setup produces secret randomness that must be destroyed. If someone kept it, they could forge proofs, which means creating coins out of nothing. It would not reveal anyone's private data. Halo 2 removed that dependency, which is the main reason Orchard was built on it. Sprout is a legacy pool; see [Sprout](/zcash-tech/sprout) and [Sapling](/zcash-tech/sapling) for the older designs.",
  "",
  "### What happened in 2026",
  "",
  "No trusted setup does not mean no bugs. In May 2026 researchers found a missing constraint in the Orchard circuit (CVE-2026-54496) that could in theory let a dishonest prover forge a proof. [NU6.2](/zcash-tech/nu6-2) fixed it, and no evidence of exploitation has been reported. [Ironwood (NU6.3)](/zcash-tech/ironwood) later made Orchard spend-only. In July 2026 zkSecurity published an [audit of the fixed Orchard code](https://reports.zksecurity.xyz/reports/zcash-orchard/) (orchard 0.14.0 and halo2_gadgets 0.5.0), commissioned by the Tachyon Foundation. Its report states that its findings do not affect the security of the deployed Orchard protocol. The [Halo](/zcash-tech/halo) page has the full timeline.",
  "",
  "## Common Mistakes",
  "",
  "| Common belief | What is actually the case |",
  "|--|--|",
  "| \"A zk-SNARK makes every Zcash transaction private.\" | The proof protects shielded transactions. A transaction that touches a transparent address still reveals those parts. |",
  "| \"All Zcash pools use the same proofs.\" | Sprout began with BCTV14, Sapling uses Groth16 and Orchard uses Halo 2. |",
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

  const theory = THEORY;
  const edit = original.match(/<a href="https:\/\/github\.com[^>]*>[\s\S]*?<\/a>/)?.[0] ?? "";
  const items = original
    .slice(d, e)
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && l !== "Further Learning:" && !/^[-_]{3,}$/.test(l))
    .map((l) => l.replace("zkSNARK's with", "zkSNARKs with"));
  const further = [
    "## Further Learning",
    "",
    "- [Audit of Zcash: Orchard (zkSecurity, July 2026)](https://reports.zksecurity.xyz/reports/zcash-orchard/)",
    ...items.map((l) => "- " + l),
  ].join("\n");

  return [edit, "", HEAD, theory.trimEnd(), TAIL_TOP, further.trimEnd(), RELATED].join("\n");
}

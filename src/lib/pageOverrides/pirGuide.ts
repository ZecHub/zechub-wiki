// Edits to the Private Information Retrieval page (checked 6 Nov 2026):
// - The 9 <br/> spacers made the page look half empty (large blank bands between sections); they are removed,
//   together with the "Who is this for" list that repeated the TL;DR, which stays "TL;DR".
// - The Zcash section now names the first public piece of the Valar Group work: the pir-client crate 0.1.0
//   (docs.rs README), which fetches nullifier non-membership proofs for shielded-voting wallets with a two-tier
//   YPIR query. The README links to the valargroup/vote-nullifier-pir project and names no author.
// - Related links pointed at the production site (https://zechub.wiki/...) and now use site paths.
// Every replacement must match exactly, otherwise the original markdown is returned untouched.
const EDITS: [string, string][] = [
  ["## TL;DR", "## TL;DR"],
  ["Private information retrieval lets the wallet ask that question without revealing which nullifier it cares about.",
   "Private information retrieval lets the wallet ask that question without revealing which nullifier it cares about. A first public piece is the [pir-client](https://docs.rs/crate/pir-client/0.1.0) Rust crate (version 0.1.0). It fetches nullifier non-membership proofs through a two-tier YPIR query, so wallets that take part in shielded voting do not have to download the whole nullifier set. Its README points to the Valar Group's vote-nullifier-pir project."],
  ["(https://zechub.wiki/zcash-tech/zcash-wallet-syncing)", "(/zcash-tech/zcash-wallet-syncing)"],
  ["(https://zechub.wiki/zcash-tech/lightwallet-nodes)", "(/zcash-tech/lightwallet-nodes)"],
  ["(https://zechub.wiki/zcash-tech/zk-snarks)", "(/zcash-tech/zk-snarks)"],
  ["(https://zechub.wiki/zcash-tech/post-quantum-security)", "(/zcash-tech/post-quantum-security)"],
  ["- [Post-Quantum Security](/zcash-tech/post-quantum-security) - why lattice-based methods matter for the future",
   "- [Post-Quantum Security](/zcash-tech/post-quantum-security) - why lattice-based methods matter for the future\n- [Zingo 2.0 - Pepper Sync](/zcash-tech/pepper-sync) - a sync engine that scans in priority order"],
];

export function rewritePirGuide(original: string): string {
  if (!/^# Private information retrieval\s*$/im.test(original)) return original;
  let text = original.replace(/\n<br\/>\n/g, "");
  const who = text.match(/## Who is this for\n[\s\S]*?(?=## The problem PIR solves for Zcash)/);
  if (!who) return original;
  text = text.replace(who[0], "");
  for (const [from, to] of EDITS) {
    if (!text.includes(from)) return original;
    text = text.replace(from, to);
  }
  return text;
}

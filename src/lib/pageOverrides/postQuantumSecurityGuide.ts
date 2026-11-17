// Edits to "Post-Quantum Security in Zcash" (checked 6 Nov 2026). The page is a general explainer; what changes is
// everything that went stale or repeated itself:
// - ZIP 2005 was described as a proposal for Orchard notes. Ironwood (NU6.3, active since July 28, 2026) uses the
//   quantum-recoverable note format; the text now follows the wording of this wiki's Ironwood and
//   "Is Zcash Post-Quantum?" pages (forward-compatibility only, recovery process not defined yet).
// - Orchard is described as "the modern shielded pool"; it is spend-only now and had a 2026 circuit bug (not a
//   quantum issue), so the Halo/Orchard section says so.
// - The closing Summary repeated the TL;DR and "Example 3" repeated the ZIP 2005 analogy; both are removed.
// - The ZIP 2005 title in the references was not confirmed (this wiki uses two different titles), so it is neutral.
// Every replacement must match exactly, otherwise the original markdown is returned untouched.
const EDITS: [string, string][] = [
  ["## TL;DR", "## TL;DR"],
  ["- Zcash is preparing through research, ZIPs, and upgrade proposals such as ZIP 2005 and Project Tachyon.",
   "- Zcash is preparing through research, ZIPs and upgrades. Ironwood (NU6.3) already uses a quantum-recoverable note format (ZIP 2005), and Project Tachyon is a proposal."],
  ["### Halo And Orchard Reduced Older Assumptions\n\nHalo 2 is used by Orchard, Zcash's modern shielded pool.",
   "### Halo 2 Removed The Trusted Setup\n\nHalo 2 powered Orchard, Zcash's newest shielded pool from 2022 until Ironwood replaced it for new value in 2026. Orchard is now spend-only. A separate bug in the Orchard circuit, unrelated to quantum computers, was found and fixed in 2026; the [Halo](/zcash-tech/halo) page covers it."],
  ["ZIP 2005 is titled \"Orchard Quantum Recoverability.\" It proposes changes intended to help Orchard users recover or migrate funds if quantum attacks against older assumptions become practical.",
   "ZIP 2005 defines the quantum-recoverable note format that Ironwood (NU6.3, active since July 28, 2026) uses for new notes. It is a forward-compatibility measure: if quantum computers ever broke today's elliptic-curve cryptography, it would let the network check that a recovered note matches a real one rather than a forged one. The recovery process itself is not defined yet."],
  ["- Recoverability gives honest users a better path if older cryptography becomes unsafe.",
   "- Recoverability prepares a better path for honest users if older cryptography becomes unsafe."],
  ["- Follow Zcash network upgrade announcements.",
   "- Follow Zcash network upgrade announcements, and your wallet's guidance on moving funds from Orchard to Ironwood."],
  ["- [ZIP 2005: Orchard Quantum Recoverability](https://zips.z.cash/zip-2005)", "- [ZIP 2005: Quantum Recoverability](https://zips.z.cash/zip-2005)"],
];

export function rewritePostQuantumSecurity(original: string): string {
  if (!/^# Post-Quantum Security in Zcash\s*$/im.test(original)) return original;
  let text = original;
  const summary = text.match(/## Summary\n[\s\S]*?(?=## Related Pages)/);
  const example3 = text.match(/### Example 3: The Exit Plan\n[\s\S]*?(?=## What Users Can Do Today)/);
  if (!summary || !example3) return original;
  text = text.replace(summary[0], "").replace(example3[0], "");
  for (const [from, to] of EDITS) {
    if (!text.includes(from)) return original;
    text = text.replace(from, to);
  }
  return text;
}

// Editorial tidy-up of "Verifying Zcash Releases". Commands, outputs, fingerprints and tables are
// left exactly as written in the ZecHub/zechub repo; only the opening is tightened and the section titles are simplified, because the
// TL;DR repeated what the sections below explain, and one repeated closing paragraph is merged.
// If the source no longer has the expected sections, the original markdown is returned untouched.
export function rewriteVerifyReleasesGuide(original: string): string {
  if (!/^# verifying zcash releases\s*$/im.test(original)) return original;
  const tldr = original.match(/^## TL;DR\s*\n[\s\S]*?(?=^## )/im);
  if (!tldr) return original;
  const verified = tldr[0].match(/^\*Verified against[^\n]*\*\s*$/im)?.[0];
  if (!verified) return original;

  const opening = `## TL;DR

- A **checksum** proves the file arrived intact; a **signature** proves who produced it. You need both.
- Zebra releases are verified with \`SHA256SUMS\` and a **Sigstore** bundle, with no key to manage. Zallet releases use detached **GPG** signatures.
- Zcash release signing moved from Electric Coin Company to Zcash Open Development Lab (ZODL) in 2026. The handover is signed by both keys, so you can verify it.
- If verification fails, do not run the binary.

${verified}

`;
  let md = original.replace(tldr[0], opening);

  // Merge the two closing paragraphs of "Why this matters" into one.
  md = md.replace(
    /(they offer no protection at all when the software you are[^\n]*)\n\nThis is one of the few attack paths where the privacy guarantees of the protocol are simply not relevant\. Verification is the layer that covers it\./i,
    "$1 Verification is the layer that covers that gap.",
  );

  // Plain section titles instead of "Part N —" labels.
  const rename = (from: RegExp, to: string) => {
    md = md.replace(from, to);
  };
  rename(/^## Threat model — what verification does and does not catch\s*$/im, "## What verification does and does not catch");
  rename(/^## Part 1 — Zebra: checksums and Sigstore\s*$/im, "## Verify a Zebra release");
  rename(/^## Part 2 — Zallet: GPG signatures\s*$/im, "## Verify a Zallet release");
  rename(/^## Part 3 — A verification that fails\s*$/im, "## When verification fails");
  rename(/^## Part 4 — Reference table\s*$/im, "## Quick reference");
  rename(/^## Part 5 — Mobile and hardware wallets\s*$/im, "## Mobile and hardware wallets");
  rename(/^## Further reading\s*$/im, "## Next steps");
  return md;
}

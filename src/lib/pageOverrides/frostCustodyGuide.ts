// Reading-order rewrite of "FROST & Threshold Custody for Shielded ZEC". The wording stays as in the
// ZecHub repo; what changes is the order and shape: the "how a signing session works" steps and the
// threshold table now come right after the comparison with transparent multisig, the five trade-offs
// become a compact list, and the "see the technical page" blockquote moves into Related pages.
// Removed: the ZecHub Hackathon 2026 FROST track claim and the ZecVault and Steward entries, which could not be confirmed (the wiki's Community Projects page calls ZecVault a goal-based savings wallet). frost.zfnd.org checked live Nov 2026 (the ZF FROST Book); Zkool's FROST multisig checked in its docs.
// Fixes: the standard is no longer a draft (RFC 9591, June 2024), and the relative links
// (FROST.md, Viewing_Keys.md, /guides/Ywallet_FROST_Demo) are replaced with the real page paths.
// If the page no longer has this shape, the original markdown is returned untouched.
export function rewriteFrostCustodyGuide(original: string): string {
  if (!/^# FROST & Threshold Custody/im.test(original)) return original;

  const fm = original.match(/^---\n[\s\S]*?\n---\n/)?.[0] ?? "";
  const edit = original.match(/<a href="https:\/\/github\.com[^>]*>[\s\S]*?<\/a>/)?.[0] ?? "";
  const leadRaw = original.match(/\nFROST threshold custody keeps coming up[^\n]*/)?.[0]?.trim();
  if (!leadRaw) return original;
  // The source says FROST "was the top track at the ZecHub Hackathon 2026". That could not be confirmed
  // (and ZecVault / Steward, named under it, are described differently elsewhere in the wiki), so it is dropped.
  const lead =
    leadRaw.replace(" — it was the top track at the ZecHub Hackathon 2026 — but", ", but") +
    " For the cryptography behind it, see the [FROST technical page](/zcash-tech/frost).";

  const parts = original.split(/^## /m).slice(1);
  const sec = new Map<string, string>();
  for (const p of parts) {
    const nl = p.indexOf("\n");
    sec.set(p.slice(0, nl).trim(), p.slice(nl + 1).replace(/\n---\s*$/, "").trim());
  }
  const keys = [
    "TL;DR",
    "What is FROST in plain language?",
    "When should you use threshold custody?",
    "How does it differ from transparent multisig?",
    "Trade-offs and limitations",
    "Who is building with FROST on Zcash?",
    "How a signing session works (simplified)",
    "Choosing your threshold parameters",
    "Related Pages",
    "Resources",
  ];
  if (keys.some((k) => !sec.has(k))) return original;
  const s = (k: string) => sec.get(k)!;

  const tradeoffs = s("Trade-offs and limitations")
    .split(/^### /m)
    .slice(1)
    .map((t) => {
      const nl = t.indexOf("\n");
      return `- **${t.slice(0, nl).trim()}.** ${t.slice(nl + 1).trim().replace(/\s*\n\s*/g, " ")}`;
    });
  if (tradeoffs.length < 3) return original;
  const fixedTradeoffs = tradeoffs
    .join("\n")
    .replace(
      "The IETF standard (draft-irtf-cfrg-frost) is mature, but wallet integrations are limited.",
      "FROST is a published standard ([RFC 9591](https://www.rfc-editor.org/rfc/rfc9591.html), June 2024), but wallet integrations are limited.",
    );

  const building = s("Who is building with FROST on Zcash?")
    .replace("/guides/Ywallet_FROST_Demo", "/guides/ywallet-frost-demo")
    .replace(/### ZecHub Hackathon 2026[\s\S]*?(?=### Coinbase)/, "")
    .replace(
      /The Zcash Foundation has shipped a working FROST implementation and a demo site\. This is the reference implementation used for testing and development\./,
      "The Zcash Foundation maintains the ZF FROST libraries, Rust implementations of RFC 9591 with documentation in the [ZF FROST Book](https://frost.zfnd.org).",
    )
    .replace(
      "### Ywallet FROST Demo",
      "### Zkool\n\nZkool, the maintained successor to Ywallet, supports multi-signature shielded accounts built on FROST, with distributed key generation and no centralized coordinator. See its [documentation](https://hhanh00.github.io/zkool2) and the [Zkool multisig guide](/guides/zkool-multisig).\n\n### Ywallet FROST Demo",
    )
    .replace("### Coinbase", "### Coinbase (outside Zcash)");

  const related = `- [FROST, technical deep dive](/zcash-tech/frost): the protocol itself (DKG, signing rounds, security proofs).
- [Ywallet FROST Demo guide](/guides/ywallet-frost-demo): background only, Ywallet is no longer maintained.
- [Viewing Keys](/zcash-tech/viewing-keys): read-only access to shielded addresses, complementary to threshold custody.
- [Zcash Shielded Assets](/zcash-tech/zcash-shielded-assets): FROST is also key infrastructure for ZSA issuance.`;

  const resources = s("Resources").replace(
    "- [IETF FROST draft standard (draft-irtf-cfrg-frost)](https://datatracker.ietf.org/doc/draft-irtf-cfrg-frost/)",
    "- [RFC 9591: The FROST Protocol (IETF, June 2024)](https://www.rfc-editor.org/rfc/rfc9591.html)",
  );

  return `${fm}
${edit}

# FROST & Threshold Custody for Shielded ZEC

${lead}

## In short

${s("TL;DR")}

## What is FROST in plain language?

${s("What is FROST in plain language?")}

## When should you use threshold custody?

${s("When should you use threshold custody?")}

## How it differs from transparent multisig

${s("How does it differ from transparent multisig?")}

## How a signing session works

${s("How a signing session works (simplified)")}

## Choosing your threshold

${s("Choosing your threshold parameters")}

## Trade-offs and limitations

${fixedTradeoffs}

## Who is using FROST

${building}

## Related pages

${related}

## Resources

${resources}
`;
}

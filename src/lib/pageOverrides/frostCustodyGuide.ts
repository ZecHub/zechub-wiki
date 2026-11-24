// Reading-order rewrite of "FROST & Threshold Custody for Shielded ZEC". The wording stays as in the
// ZecHub repo; what changes is the order and shape: the "how a signing session works" steps and the
// threshold table now come right after the comparison with transparent multisig, the five trade-offs
// become a compact list, and the "see the technical page" blockquote moves into Related pages.
// Removed: the ZecHub Hackathon 2026 FROST track claim and the ZecVault and Steward entries, which could not be confirmed (the wiki's Community Projects page calls ZecVault a goal-based savings wallet).
// Fixes: the standard is no longer a draft (RFC 9591, June 2024), and the relative links
// (FROST.md, Viewing_Keys.md, /guides/Ywallet_FROST_Demo) are replaced with the real page paths.
// The TL;DR is dropped (the sections below say the same), "When should you use it" opens the page as the decision
// table, and the projects section is a table (cards on phones) instead of mixed subheadings.
// If the page no longer has this shape, the original markdown is returned untouched.
// A three column comparison table is wider than a phone, so on small screens it becomes one card per row.
function comparisonCards(section: string): string {
  const lines = section.split("\n");
  const start = lines.findIndex((l) => l.trim().startsWith("|"));
  if (start < 0) return section;
  let end = start;
  while (end < lines.length && lines[end].trim().startsWith("|")) end++;
  const rows = lines.slice(start, end).map((l) => l.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim()));
  if (rows.length < 3 || rows[0].length !== 3) return section;
  const [head, , ...body] = rows;
  const card = (r: string[]) =>
    `<div className="${CARD}">\n\n**${r[0]}**\n\n${head[1]}: ${r[1]}\n\n${head[2]}: ${r[2]}\n\n</div>`;
  const table = lines.slice(start, end).join("\n");
  const block = `<div className="hidden md:block">\n\n${table}\n\n</div>\n\n<div className="md:hidden my-4 space-y-3">\n\n${body.map(card).join("\n\n")}\n\n</div>`;
  return [...lines.slice(0, start), block, ...lines.slice(end)].join("\n");
}

const CARD =
  "rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm dark:border-slate-700 dark:bg-white/5 [&_p]:!my-0 [&_p+p]:!mt-2";

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

  const CARD =
    "rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm dark:border-slate-700 dark:bg-white/5 [&_p]:!my-0 [&_p+p]:!mt-2";
  const PROJECTS: Array<[name: string, what: string, use: string]> = [
    [
      "[ZF FROST libraries](https://frost.zfnd.org)",
      "Rust implementations of [RFC 9591](https://www.rfc-editor.org/rfc/rfc9591.html) maintained by the Zcash Foundation, documented in the ZF FROST Book",
      "Reference implementation for building and testing",
    ],
    [
      "[Zkool](https://hhanh00.github.io/zkool2)",
      "Multi-signature shielded accounts built on FROST, with distributed key generation and no centralized coordinator. The maintained successor to Ywallet. See the [Zkool multisig guide](/guides/zkool-multisig)",
      "Hands-on multisig with a wallet",
    ],
    [
      "[Ywallet FROST demo](/guides/ywallet-frost-demo)",
      "An early FROST integration. Ywallet is no longer maintained and will not be updated for Ironwood",
      "Background reading only",
    ],
    [
      "Coinbase (outside Zcash)",
      "A production FROST implementation for their threshold signing systems, for Bitcoin, with the preprocessing stage removed and the aggregator role shared among all participants",
      "Evidence that the model works at production scale",
    ],
  ];
  const building = [
    "<div className=\"hidden md:block\">",
    "",
    "| Project | What it is | Use it for |",
    "| --- | --- | --- |",
    ...PROJECTS.map(([n, w, u]) => `| **${n}** | ${w}. | ${u} |`),
    "",
    "</div>",
    "",
    "<div className=\"md:hidden my-4 space-y-3\">",
    "",
    PROJECTS.map(([n, w, u]) => `<div className="${CARD}">\n\n**${n}**\n\n${w}.\n\n*${u}.*\n\n</div>`).join("\n\n"),
    "",
    "</div>",
  ].join("\n");

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

## When should you use threshold custody?

${s("When should you use threshold custody?")}

## What is FROST in plain language?

${s("What is FROST in plain language?")}

## How it differs from transparent multisig

${comparisonCards(s("How does it differ from transparent multisig?"))}

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

// Update of the Unified Addresses page (checked 6 Nov 2026 against ZIP 316: revision 0 active, revision 1 withdrawn,
// revision 2 draft). Verified in the ZIP: receiver typecodes, preference order Orchard > Sapling > transparent,
// F4Jumble (4 rounds, left half min(64, floor(l/2)), personalizations UA_F4Jumble_G/H), 16-byte HRP padding, no Bech32m
// length limit, duplicate/ordering/P2PKH+P2SH rejection, MUST-understand metadata, expiry items 0xE0/0xE1, rev 2 prefixes.
// Not stated by the ZIP: byte lengths of Sapling/Orchard receivers (43 bytes comes from the protocol, kept as in the
// original) and any Ironwood receiver (the ZIP lists none; ZODL says existing addresses do not change).
// Every edit is optional: if its text is not found it is skipped.
const INTRO = [
  "# Unified Addresses",
  "",
  "> One address that carries several ways to pay you. Your wallet and the sender's wallet pick the best one automatically.",
  "",
  "## TL;DR",
  "",
  "- A Unified Address (UA) bundles several receivers, such as shielded and transparent, into one string.",
  "- The sender's wallet picks the most private receiver it supports. The order is Orchard, then Sapling, then transparent.",
  "- A UA must contain at least one shielded receiver (ZIP 316, revision 0).",
  "- Mainnet UAs start with `u1`. A draft revision of the ZIP would change this, so check the ZIP if you rely on prefixes.",
  "",
  "## Why it exists",
  "",
  "Before UAs, people had to choose between transparent, Sapling and Orchard addresses, and senders needed to know which pool a recipient used. A UA removes that choice: you share one address, and new receiver types can be added later without handing out a new address format.",
  "",
  "## Status of ZIP 316",
  "",
  "| Revision | Status | Mainnet address prefix |",
  "|---|---|---|",
  "| Revision 0 | Active | `u1` (HRP `u`) |",
  "| Revision 1 | Withdrawn | Not in use |",
  "| Revision 2 | Draft | `zu` for shielded-only, `tu` for addresses with a transparent receiver |",
  "",
  "Revision 2 is not adopted. In the draft, a `zu` address may not contain transparent receivers, which lets people tell by appearance whether an address could leak information on-chain. It also changes the viewing-key prefixes to `uvf` and `uvi`. Until it is adopted, everything below describes revision 0.",
  "",
  "## What about Ironwood?",
  "",
  "ZIP 316 does not define a separate Ironwood receiver. According to the [ZODL guide to Ironwood](https://support.zodl.com/article/56-what-is-the-ironwood-shielded-pool), your existing shielded funds stay in Orchard until you move them, with no change to your addresses. See [Ironwood](/zcash-tech/ironwood).",
  "",
  "## For developers: how a UA is structured",
  "",
].join("\n");

const FAQ = [
  "",
  "## Common questions",
  "",
  '<FaqItem q="Do I need a new address after Ironwood?">',
  "",
  "No. ZODL states that existing addresses do not change.",
  "",
  "</FaqItem>",
  "",
  '<FaqItem q="Can a UA contain only a transparent receiver?">',
  "",
  "Not under revision 0. It must contain at least one Sapling or Orchard receiver, and a UA with only transparent receivers is invalid.",
  "",
  "</FaqItem>",
  "",
  '<FaqItem q="Will my u1 address stop working if revision 2 is adopted?">',
  "",
  "The ZIP does not say. Revision 2 is a draft, so nothing has changed yet. Follow the ZIP and your wallet's release notes.",
  "",
  "</FaqItem>",
  "",
  '<FaqItem q="Can I decode a UA with a plain Bech32m decoder?">',
  "",
  "No. The payload is scrambled with F4Jumble before encoding, so you need the full ZIP 316 pipeline. Use a maintained library for anything that handles funds.",
  "",
  "</FaqItem>",
  "",
].join("\n");

const EDITS: Array<[string, string]> = [
  ["F4Jumble ensures that altering even a single character in the address completely changes the decoded output. This prevents address malleability attacks where an attacker swaps bytes in the middle of an address while leaving the prefix and suffix looking valid.",
   "The ZIP states two goals for F4Jumble: near second-preimage resistance and nonmalleability. In practice, this makes it impractical to alter part of an address while leaving the prefix and suffix looking valid."],
  ["A Unified Address (UA) is a single address string that carries multiple receiver types: **Transparent**, **Sapling**, **Orchard**, or a combination. The paying wallet automatically selects the best receiver pool it supports.",
   "A Unified Address (UA) is a single address string that carries one or more receivers: **Transparent**, **Sapling** or **Orchard**. The paying wallet selects the best one it supports."],
  ["*(Mainnet UAs start with `u1`, where `1` is the Bech32 separator.)*",
   "*(Mainnet UAs start with `u1`, where `1` is the Bech32 separator. This is revision 0 of the ZIP; the draft revision 2 uses different prefixes.)*"],
  ["See also: [Viewing Keys](./Viewing_Keys.md)", "See also: [Viewing Keys](/zcash-tech/viewing-keys) · [Ironwood](/zcash-tech/ironwood) · [What a block explorer can see on Zcash](/zcash-tech/what-a-block-explorer-can-see)"],
];

export function rewriteUnifiedAddressesGuide(original: string): string {
  if (!/^# Unified Address \(ZIP-316\) Validation\s*$/im.test(original)) return original;
  if (!original.includes("## The big picture")) return original;
  const disclaimer = original.match(/\*This is a learning guide[\s\S]*?\*\n/)?.[0] ?? "";
  let body = original.slice(original.indexOf("## The big picture"));
  for (const [a, b] of EDITS) if (body.includes(a)) body = body.replace(a, b);
  const glossary = body.indexOf("## Glossary");
  if (glossary > -1) body = body.slice(0, glossary) + FAQ.trimStart() + "\n---\n\n" + body.slice(glossary);
  return INTRO + (disclaimer ? disclaimer + "\n" : "") + body.replace("## The big picture", "### The big picture").replace(/\n## /g, "\n### ").replace("### Common questions", "## Common questions").replace("### Glossary", "## Glossary");
}

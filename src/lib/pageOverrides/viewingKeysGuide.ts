// Viewing Keys page (checked 6 Nov 2026). The page was already current (Zallet v0.1.0-beta.2, zcashd halt, Wallets matrix);
// this pass trims it to the wiki's current pattern and corrects what ZIP 326 and ZIP 318 actually say (both fetched today):
// - ZIP 326 (draft, "NU6.3 Consequences for Wallets"): a receiver and its incoming viewing key belong to the Orchard
//   protocol, so one ivk decrypts Orchard and Ironwood notes; ZIP 2005 ("Ironwood Quantum Recoverability") adds use_qsk,
//   which changes key derivation but does not decide whether a note is quantum recoverable (all Ironwood notes are,
//   Orchard-pool notes are not); a wallet restoring from seed tries both values.
// - ZIP 318 (draft, "Orchard to Ironwood Migration"): one Orchard note to one canonical-denomination Ironwood output,
//   randomized schedule; a wallet with its viewing keys recognizes its own transfers, observers see amount, anchor and time.
// Removed because no source confirms them: the quantum-adversary remark about published addresses, "over weeks", and the
// ZIP 229 resource line. TL;DR shortened, the duplicated "window" and migration passages folded away, Ywallet notice and a
// hardware wallet section added. If any replacement does not match exactly, the original markdown is returned untouched.
const TLDR = `## TL;DR

- A viewing key gives **read-only** access to a shielded account. The holder can see activity but can never spend.
- A full key (UFVK) shows incoming and outgoing transactions. An incoming key (UIVK) shows incoming only.
- A key you have handed out cannot be recalled. Share the narrowest key that answers the question.
- You can export and import keys with [Zallet](https://github.com/zcash/zallet) (v0.1.0-beta.2 or newer) and watch-only accounts in wallets such as Zkool. See [Wallets](/using-zcash/wallets) for current support.

---

## Why use a viewing key?`;

const HARDWARE = `## Viewing keys and hardware wallets

Cold signing is built on the same split. A hardware wallet exports a viewing key (a UFVK, or an Orchard FVK on Ledger) to a companion app, which uses it to watch the account and prepare transactions. The spending key stays on the device. The companion app can see all of your shielded activity, so treat it like any other holder of a key. See [Shielded Cold Signing](/zcash-tech/shielded-cold-signing).

## Exporting a viewing key`;

function cut(text: string, from: string, to: string): string | null {
  const i = text.indexOf(from);
  const j = text.indexOf(to);
  if (i < 0 || j < 0 || j < i) return null;
  return text.slice(0, i) + text.slice(j);
}

export function rewriteViewingKeysGuide(original: string): string {
  if (!/^# Viewing Keys\s*$/im.test(original)) return original;
  let text = original;

  const tl = cut(text, "## TL;DR", "## Why use a viewing key?");
  if (!tl) return original;
  text = tl.replace("## Why use a viewing key?", TLDR);

  const trapStart = text.indexOf("**A published address already exposes");
  const trapEnd = text.indexOf("## Viewing keys after Ironwood");
  if (trapStart < 0 || trapEnd < trapStart) return original;
  text = text.slice(0, trapStart) + text.slice(trapEnd);

  const window = cut(text, "### Why you cannot take the window back", "## Deep Dive");
  if (!window) return original;
  text = window;
  const mig = cut(text, "### What migration looks like to a viewer", "## Practical Implications");
  if (!mig) return original;
  text = mig;

  const EDITS: [string, string][] = [
    ["Two disclosure traps are worth knowing before you share anything.", "One disclosure trap is worth knowing before you share anything."],
    ["sees holdings shift from one pool to the other in steps over weeks, not in a single move.", "sees holdings shift from one pool to the other in steps over time, not in a single move."],
    ["[ZIP 2005](https://zips.z.cash/zip-2005) adds a `use_qsk` flag for quantum-recoverable keys, and it changes how the incoming, outgoing and diversifier keys are derived, so `use_qsk = true` keys are genuinely different keys.",
     "[ZIP 2005](https://zips.z.cash/zip-2005) (Ironwood Quantum Recoverability) adds a `use_qsk` flag that changes how the incoming, outgoing and diversifier keys are derived, so `use_qsk = true` keys are genuinely different keys. The flag does not decide whether a note is quantum recoverable: all Ironwood-pool notes are, and Orchard-pool notes are not. A wallet restoring from a seed does not know the value and has to try both."],
    ["- **The Ywallet walkthrough.** The Wallets page marks Ywallet **Ironwood: Not Ready**, so it is not the wallet to point people at for Ironwood-era viewing keys. Zkool, from the same developer, accepts the same range of keys and is marked Ready.",
     "- **The Ywallet walkthrough.** Ywallet has stopped receiving updates and was succeeded by Zkool, which accepts the same range of keys. The Wallets page marks Ywallet **Ironwood: Not Ready**, so point people at Zkool instead."],
    ["The `use_qsk` flag from [ZIP 2005](https://zips.z.cash/zip-2005) changes the derivation itself, so quantum-recoverable keys are a different key family entirely, not a variant of the old one.",
     "The `use_qsk` flag from [ZIP 2005](https://zips.z.cash/zip-2005) changes the derivation itself, so `use_qsk = true` keys are a different key family, not a variant of the old one."],
    ["- [ZIP 229: Version 6 Transaction Format](https://zips.z.cash/zip-0229) — defines the Orchard and Ironwood pools\n",
     "- [ZIP 318: Orchard to Ironwood Migration](https://zips.z.cash/zip-0318) — how a wallet migrates its own Orchard funds, and what a viewing key can recognize\n"],
    ["- [Wallets](/using-zcash/wallets) — the full directory of wallets",
     "- [Shielded Cold Signing](/zcash-tech/shielded-cold-signing) — how hardware wallets share a viewing key and keep the spending key\n- [Wallets](/using-zcash/wallets) — the full directory of wallets"],
    ["## Exporting a viewing key", HARDWARE],
  ];
  for (const [from, to] of EDITS) {
    if (!text.includes(from)) return original;
    text = text.replace(from, to);
  }
  return text;
}

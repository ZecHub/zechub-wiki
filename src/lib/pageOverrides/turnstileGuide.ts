// Update of "The turnstile" (checked 6 Nov 2026 against ZIP 209 (final, pools incl. Ironwood and the deferred fund),
// ZIP 258 (final, NU6.3 at block 3,428,143: Orchard spend-only, value can move to Ironwood through the turnstile)
// and ZIP 318 (draft: standard amounts, randomized delays)). Changes: spacers and "Who is this for" removed, links
// become site paths, the unsupported "no value ever left Sprout ... evidence" sentence replaced by the NU7 fact,
// "once migration completes" replaced (the migration has no deadline), ZIP 318 labeled as a draft.
// Every edit is optional: if its text is not found it is skipped.
const EDITS: Array<[string, string]> = [
  [
    "It has guarded every major shielded pool transition in Zcash history",
    "It already guarded the Sprout wind-down before Ironwood",
  ],
  [
    "- The turnstile is the reason the Orchard to Ironwood migration can prove the shielded supply is sound",
    "- The Orchard to Ironwood migration crosses the turnstile, so the public pool balances show how much value has moved",
  ],
  [
    "Years later, the fact that no value ever improperly left Sprout stands as evidence that its early cryptography was never successfully exploited.",
    "NU7, which activated on November 6, 2026, went further: ZEC still in Sprout can no longer be spent. See [Sprout](/zcash-tech/sprout).",
  ],
  [
    "The response is to seal the old Orchard pool and have everyone migrate their funds through the turnstile into Ironwood, a fresh pool using the corrected protocol. Forcing funds through the turnstile means any hypothetical counterfeit coins left behind cannot follow, and once migration completes, anyone can confirm the shielded supply is sound.",
    "The response is to close the old Orchard pool to new deposits and let everyone move their funds through the turnstile into Ironwood, a fresh pool using the corrected protocol. Funds that stay in Orchard can still be spent, and there is no deadline to move them. Anything that crosses the turnstile is counted, so any hypothetical counterfeit coins left behind cannot follow without breaking the count.",
  ],
  [
    "At the NU6.3 upgrade, the Orchard pool is closed to new inflows, and wallets are directed to send Orchard funds across the turnstile into the new Ironwood pool.",
    "At the NU6.3 upgrade (block 3,428,143, July 28, 2026), the Orchard pool was closed to new inflows, and wallets can send Orchard funds across the turnstile into the new Ironwood pool.",
  ],
  [
    "which is why ZIP 318 asks wallets to migrate in standard amounts over time",
    "which is why ZIP 318, a draft, recommends that wallets migrate in standard amounts over time",
  ],
  [
    "3. [ZIP 258: NU6.3](https://zips.z.cash/zip-0258) - the upgrade that introduces the Ironwood pool and directs value across the turnstile",
    "3. [ZIP 258: NU6.3](https://zips.z.cash/zip-0258) - the upgrade that introduces the Ironwood pool and directs value across the turnstile\n3. [ZIP 318: Orchard to Ironwood Migration](https://zips.z.cash/zip-0318) - draft wallet guidance for migrating in standard amounts",
  ],
  [
    "- [Halo](/zcash-tech/halo) - the proof system behind the Orchard pool",
    "- [Halo](/zcash-tech/halo) - the proof system behind the Orchard pool\n- [Ironwood](/zcash-tech/ironwood) - the pool that replaces Orchard\n- [What a block explorer can see on Zcash](/zcash-tech/what-a-block-explorer-can-see) - what the public tally looks like from outside",
  ],
];

export function rewriteTurnstileGuide(original: string): string {
  if (!/^# The turnstile\s*$/im.test(original)) return original;
  let t = original.replace(/^\s*<br\s*\/?>\s*$/gim, "");
  t = t.replace(/## Who is this for[\s\S]*?(?=\n## )/, "");
  t = t.replace(/https:\/\/zechub\.wiki\//g, "/");
  for (const [a, b] of EDITS) if (t.includes(a)) t = t.replace(a, b);
  return t.replace(/\n{3,}/g, "\n\n");
}

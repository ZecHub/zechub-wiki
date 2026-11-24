// Update of "Zcash Shielded Assets" (checked 7 Nov 2026). Sources: QEDIT's "OrchardZSA Finalization" grant thread
// (forum.zcashcommunity.com/t/orchardzsa-finalization/53732: ZCG approval Dec 22, 2025; single-node testnet feature complete
// in Feb 2026; latest update read April 1, 2026), a NU7 explainer that lists NU7 contents (ZSAs not included, ZIP 226 draft,
// not scheduled for any upgrade), and the ZIP 258 notes already used on other pages (Orchard spend-only since July 28,
// 2026). NOT used: a Substack post claiming a dedicated ZSA public testnet launched August 2 (AI-assisted, no direct source),
// and any claim about how OrchardZSA relates to Ironwood (no project update mentions it). The top image was removed at the
// user's request. Every edit is optional: if its text is not found it is skipped.
const EDITS: Array<[string, string]> = [
  [
    "[![Video Thumbnail](/content-images/hqdefault-3ae84de424.webp)](https://youtu.be/1MZMGC9ViyA)",
    '<div className="my-5 w-full max-w-[720px]">\n<iframe src="https://www.youtube.com/embed/1MZMGC9ViyA" title="ZSA demo on Zebra" className="w-full aspect-video"></iframe>\n</div>',
  ],
  [
    "- **Status:** not live on mainnet and not part of Network Upgrade 7 (NU7). [ZIP 259](https://zips.z.cash/zip-0259), which lists everything NU7 deploys, does not include ZIP 226 or ZIP 227, and no ZSA activation date has been set.",
    "- **Status:** not live on mainnet. NU7 activated on November 6, 2026 without ZSAs: [ZIP 259](https://zips.z.cash/zip-0259), which lists everything NU7 deploys, does not include ZIP 226 or ZIP 227. No ZSA activation date has been set.",
  ],
  [
    "As this project is still being actively developed, updates are posted on [this thread](https://forum.zcashcommunity.com/t/grant-update-zcash-shielded-assets-monthly-updates/41153) of the Zcash forum.",
    "The project is still in development. Updates are posted on the Zcash forum, in the [earlier monthly thread](https://forum.zcashcommunity.com/t/grant-update-zcash-shielded-assets-monthly-updates/41153) and in the newer [OrchardZSA Finalization](https://forum.zcashcommunity.com/t/orchardzsa-finalization/53732) thread.",
  ],
  [
    "### ZSA Grant Proposal",
    "### Where the project stands\n\nFrom the [OrchardZSA Finalization](https://forum.zcashcommunity.com/t/orchardzsa-finalization/53732) grant thread:\n\n| Date | Update |\n|---|---|\n| December 22, 2025 | Zcash Community Grants approved the proposal and asked for monthly updates |\n| February 2, 2026 | The team described its single-node testnet as feature complete, covering issuance, transfer, burn and finalize |\n| March to April 2026 | Code review of the Orchard changes continued, with the ECC reviewer's comments being answered |\n\nThe latest update on that thread is dated April 1, 2026. It gives no activation date and does not say how OrchardZSA relates to Ironwood. Orchard has been spend-only since July 28, 2026, so check the thread for newer updates before relying on any plan.\n\n### ZSA Grant Proposal",
  ],
  [
    "| \"ZSAs are live on Zcash today.\" | They are not. ZSA is not part of Network Upgrade 7 (NU7), which [ZIP 259](https://zips.z.cash/zip-0259) defines without ZIP 226 or ZIP 227, and it is still under review and testing. |",
    "| \"ZSAs are live on Zcash today.\" | They are not. NU7 activated on November 6, 2026 without them: [ZIP 259](https://zips.z.cash/zip-0259) defines NU7 without ZIP 226 or ZIP 227. The work is still in review and testing. |",
  ],
  [
    "- [Halo](/zcash-tech/halo) — the proving system behind Orchard, the protocol ZSA extends",
    "- [Halo](/zcash-tech/halo) — the proving system behind Orchard, the protocol ZSA extends\n- [Ironwood](/zcash-tech/ironwood) — the shielded pool that replaced Orchard for new funds in 2026",
  ],
];

export function rewriteShieldedAssetsGuide(original: string): string {
  if (!/^# Zcash Shielded Assets\s*$/im.test(original)) return original;
  let t = original.replace(
    /<a href="">\s*<img src="\/content-images\/image-2023-11-18-160742427-658dda69c0\.webp"[^>]*\/>\s*<\/a>\s*/,
    "",
  );
  for (const [a, b] of EDITS) if (t.includes(a)) t = t.replace(a, b);
  return t;
}

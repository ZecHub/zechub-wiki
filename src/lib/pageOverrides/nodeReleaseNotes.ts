// Small, guarded additions to the Zebra and Zakura pages so the version they name is current.
// Checked on the projects' GitHub releases pages on 5 Nov 2026: Zebra 7.0.0 (30 Oct 2026, supports NU7 on
// mainnet at height 3,543,405) and Zakura 1.8.3 (5 Nov 2026). Release numbers move often, so both notes
// point to the releases pages. If the expected text is missing the page is returned untouched.
export function rewriteZebraNode(original: string): string {
  const h1 = "# Zebra Full Node";
  if (!original.includes(h1) || original.includes("Current release")) return original;
  return original.replace(
    h1,
    `${h1}

> **Current release (checked 5 Nov 2026):** Zebra 7.0.0, published 30 Oct 2026. It activates NU7 on mainnet at block height 3,543,405, so mainnet nodes must upgrade before that height. The database moves from v28 to v29 on first start without a resync, but Zebra 6.x cannot read v29, so back up \`state/v28\` first. See the [Zebra releases](https://github.com/ZcashFoundation/zebra/releases).`,
  );
}

export function rewriteZakuraNode(original: string): string {
  let md = original;
  md = md.replace(
    "Version 1.0.0 was released on July 15, 2026.",
    "Version 1.0.0 was released on July 15, 2026, and the latest release is 1.8.3 (5 November 2026, see the [releases](https://github.com/zakura-core/zakura/releases)).",
  );
  md = md.replace("Active (v1.0.0, Jul 2026)", "Active (v1.8.3, Nov 2026)");
  return md;
}

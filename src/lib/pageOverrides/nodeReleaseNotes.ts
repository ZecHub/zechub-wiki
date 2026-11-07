// Small, guarded additions to the Zebra and Zakura pages so the version they name is current.
// Checked on the projects' GitHub releases pages on 5 Nov 2026: Zebra 7.0.0 (corrected 7 Nov 2026 to 22 Oct 2026, supports NU7 on
// mainnet at height 3,543,405) and Zakura 1.8.3 (5 Nov 2026). Release numbers move often, so both notes
// point to the releases pages. If the expected text is missing the page is returned untouched.
export function rewriteZebraNode(original: string): string {
  const h1 = "# Zebra Full Node";
  if (!original.includes(h1) || original.includes("NU7 support:")) return original;
  // Corrected 7 Nov 2026: Zebra 7.0.0 was published on 22 Oct 2026 (GitHub release page and a news report), not 30 Oct.
  // Facts below come from the v7.0.0 release notes and the Zebra book upgrading guide. Every edit is optional.
  const callout = `${h1}

> **NU7 support:** Zebra 7.0.0, published 22 Oct 2026, was the first stable release with NU7 support. NU7 activated on mainnet at block height 3,543,405, and older releases cannot follow the chain past it. Zebra publishes releases often and each one is supported for a limited time, so check the [Zebra releases](https://github.com/ZcashFoundation/zebra/releases) for the current one. See [Upgrading to Zebra 7.0.0](#upgrading-to-zebra-700).`;
  const upgrading = `## Upgrading to Zebra 7.0.0

From the [v7.0.0 release notes](https://github.com/ZcashFoundation/zebra/releases/tag/v7.0.0) and the [Zebra book upgrading guide](https://zebra.zfnd.org/next/user/upgrading.html):

- **NU7.** Mainnet nodes needed 7.0.0 before block 3,543,405. After activation, Mainnet nodes disconnect peers that advertise a protocol version below 170190.
- **Database.** The first start renames \`state/v28\` to \`state/v29\` and converts it without a resync. Zebra 6.x cannot read v29, so downgrading means a full resync. Back up \`state/v28\` before upgrading. States in format 27 (Zebra 2.4 to 5.x) are not reused, so restore a snapshot instead of syncing from genesis.
- **zcashd-compat sidecar.** It must be \`zebra-compat-v1.3.0\`. Earlier builds stop at NU7. Zebra no longer publishes zcashd-compat Docker images, so use the split-binary, supervised or build-from-source modes instead.
- **Software that reads Zebra's database.** [Zallet](/zcash-tech/zallet) 0.1.0-beta.3 reads state with its \`zebra\` backend and cannot read a 7.0.0 state, while its \`zaino\` backend is not affected. Upgrade dependent software in the same window, start Zebra first, and wait for \`database format is valid\`.
- **Monitoring.** Per-peer labels were removed from network metrics, and some log lines changed, so check dashboards and alerts. \`getblocktemplate\` now advertises only \`time\` as mutable.
- **Security.** According to a [CryptoTicker report](https://cryptoticker.io/de/zcash-zebra-sicherheitsupdate-nu7/), 7.0.0 fixes seven security advisories (five high, two medium) that affect node availability, none of which allow theft of coins.`;
  let t = original.replace(h1, callout);
  if (t.includes("## Running Zebra")) t = t.replace("## Running Zebra", upgrading + "\n\n## Running Zebra");
  const mistake = "- Treating an unexpected resync as a fault. A database version change triggers one by design.";
  if (t.includes(mistake)) t = t.replace(mistake, mistake + "\n- Upgrading Zebra without upgrading the software that reads its database, such as Zallet or Zaino. They need builds that match the new format.");
  return t;
}

export function rewriteZakuraNode(original: string): string {
  let md = original;
  md = md.replace(
    "Version 1.0.0 was released on July 15, 2026.",
    "Version 1.0.0 was released on July 15, 2026, and version 1.7.0 (October 22, 2026) added NU7 support. New releases are frequent, so check the [Zakura releases](https://github.com/zakura-core/zakura/releases) for the current one.",
  );
  md = md.replace("Active (v1.0.0, Jul 2026)", "Active");
  return md;
}

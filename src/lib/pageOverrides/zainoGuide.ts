// Update of the Zaino page (checked 6 Nov 2026 against the Zaino README (github.com/zingolabs/zaino) and the Z3 README
// (github.com/ZcashFoundation/z3)). Verified there: Zaino indexes finalized chain, best chain and mempool from Zebra;
// Zallet embeds Zaino's libraries and connects to Zebra JSON-RPC, so the default Z3 stack does not need standalone Zaino;
// the indexer Compose profile starts Zaino (mainnet ports 8137 gRPC, 8237 JSON-RPC); JSON-RPC has no transport encryption
// and public binds are rejected unless a build feature is set; gRPC may bind publicly only with TLS; the optional
// metrics/admin listener is unauthenticated. The READMEs do not mention Ironwood, so the Ironwood status comes from the Zainod release announcements
// (forum.zcashcommunity.com/t/zainod-release-announcements/55845) and the 0.6.0 release notes (newreleases.io mirror):
// 0.6.0 (2026-07-13) added full Ironwood (NU6.3) support, upgrade before block 3,428,143, Zebra 6.0.0; NU7 is not mentioned anywhere. The "Last updated: August 2026" line was removed (it goes stale). Every edit is optional.
const EDITS: Array<[string, string]> = [
  [
    "## Zaino and lightwalletd",
    "## Release status\n\nThe Zaino team publishes release announcements on the [Zcash Community Forum](https://forum.zcashcommunity.com/t/zainod-release-announcements/55845). The ones relevant to network upgrades:\n\n| Version | Date | Relevant change |\n|---|---|---|\n| 0.4.0 | June 18, 2026 | NU6.2 support, announced as full parity with lightwalletd |\n| 0.6.0 | July 13, 2026 | Full Ironwood (NU6.3) support, built on Zebra 6.0.0. Operators had to upgrade before block 3,428,143 |\n| 0.8.0 | August 14, 2026 | Mempool upgrade with vulnerability mitigations |\n\nNone of the announcements mentions NU7. Check the latest release on GitHub before running Zaino across a network upgrade.\n\n## Zaino and lightwalletd",
  ],
  [
    "* Zaino is active infrastructure, but operators should check the official Zaino and Z3 documentation for current deployment details before running it in production.",
    "* Zaino added Ironwood (NU6.3) support in version 0.6.0. NU7 is not mentioned in its release notes, so check the latest release before running it.",
  ],
  [
    "In the default Z3 deployment, Zebra and Zallet run together. Zallet reaches Zebra directly, so an operator running only a local wallet stack does not need to start the standalone Zaino service.",
    "In the default Z3 deployment, Zebra and Zallet run together. Zallet embeds Zaino's indexer libraries and connects to Zebra's JSON-RPC, so an operator running only a local wallet stack does not need the standalone Zaino service. See [Z3 Stack](/zcash-tech/z3-stack) and [Zallet](/zcash-tech/zallet).",
  ],
  [
    "lightwalletd is the original light wallet server. Zaino is the Rust-based successor path for this role.",
    "[lightwalletd](/zcash-tech/lightwallet-nodes) is the original light wallet server. Zaino is the Rust-based successor path for this role.",
  ],
  [
    "Zaino exposes two kinds of network service. The gRPC service is the lightwallet-facing API. The JSON-RPC service is intended for loopback or trusted private networks unless an external layer provides protection. Do not expose an unauthenticated or unencrypted JSON-RPC endpoint to the public internet.",
    "Zaino exposes two kinds of network service. In Z3 the mainnet ports are 8137 for gRPC and 8237 for JSON-RPC.\n\n* **gRPC** is the lightwallet-facing API. It may bind to a public address only with TLS configured.\n* **JSON-RPC** has no transport encryption. It is meant for loopback or trusted private networks, and Zaino rejects public binds unless a build feature explicitly allows them. Do not expose it to the public internet.\n* The optional metrics and admin listener is unauthenticated and unencrypted. Keep it on a private network.",
  ],
  [
    "**Presenting planned features as already deployed.** Zaino is actively developed, so check the current release notes and docs before describing a feature as available.",
    "**Presenting planned features as already deployed.** The Zaino README describes the gRPC and JSON-RPC support as its scope. Check the current release notes and docs before describing a feature as available.",
  ],
  ["\n**Last updated:** August 2026\n", "\n"],
];

export function rewriteZainoGuide(original: string): string {
  if (!/^# Zaino Indexer\s*$/im.test(original)) return original;
  let t = original;
  for (const [a, b] of EDITS) if (t.includes(a)) t = t.replace(a, b);
  return t;
}

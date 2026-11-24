// Update of the Zakura Node page (checked 7 Nov 2026). Sources: Zakura v1.7.0 release notes (github.com/zakura-core/zakura,
// released Oct 22, 2026: NU7 on mainnet at height 3,543,405, older releases halt before NU7, mainnet end of support at height
// 3,640,098 est. Dec 4, 2026, config/DB changes), the Zakura README (nearly 5x faster sync, ~11 GB pruned snapshots, optional
// zcashd RPC compat mode, P2P v2 off by default with known DoS risks and not production-hardened, MIT/Apache-2.0), and a NU7
// explainer (Zebra 7.0.0+ or Zakura 1.7.0+ required, zcashd end of life July 2026). Removed: "DoS-resistant gossip" (README
// says the opposite for now), the "~300 GB for a full Zebra node" and Zebra "Partial" zcashd-RPC figures (no source), the
// "Led by" TL;DR line. Not verified (original text kept): the Valar Group / Project Tachyon collaboration and leads, the
// benchmark figures (Zakura's own), the Zakura Common numbers. The 1.8.3 release (5 Nov 2026) comes from nodeReleaseNotes.ts, checked on the releases page in an earlier session. Every edit is optional: if its text is not found it is skipped.
const TLDR = [
  "## TL;DR",
  "",
  "- Zakura is a Zcash full node written in Rust, forked from Zebra and consensus-compatible with it.",
  "- NU7 activated on November 6, 2026. Mainnet nodes needed Zakura 1.7.0 or later, or Zebra 7.0.0 or later.",
  "- Native block pruning and published snapshots cut disk use and sync time, by the project's own figures.",
  "- An optional compatibility mode reproduces the legacy zcashd RPC interface.",
  "- The experimental P2P transport is off by default and not yet production-hardened.",
  "",
].join("\n");

const NU7 = [
  "### NU7 and Ironwood",
  "",
  "Zakura is compatible with Ironwood (NU6.3), which activated on mainnet on July 28, 2026. Version 1.7.0, released on October 22, 2026, activates NU7 on mainnet at block 3,543,405. Per the release notes, older releases deliberately halt before NU7, and older zcashd-compat sidecars stop following the chain when NU7 activates. Mainnet end of support for the previous release line is block 3,640,098, estimated for December 4, 2026 (UTC).",
  "",
  "#### Upgrading to 1.7.0",
  "",
  "The release notes list changes that can stop a node from starting. Check them before upgrading:",
  "",
  "- `nat_traversal = true` and `qlog_dir` under `[network.zakura]` now fail at startup. Set `nat_traversal` to false or remove it.",
  "- `tracing.endpoint_addr` is removed. Set `tracing.filter` before startup instead.",
  "- Durations in weeks, months or years are rejected. Write them in days or smaller units.",
  "- TOML arrays used as config sections, such as `rpc = []`, are rejected.",
  "- Log targets change from `iroh` to `zakura_quic`, so update tracing filters.",
  "- Pruned databases no longer keep transparent address and spender indexes. Address balance, UTXO and history queries then return an explicit unavailable error. The database upgrade runs in place, and older binaries cannot open the upgraded state.",
  "",
  "Source: [Zakura v1.7.0 release notes](https://github.com/zakura-core/zakura/releases/tag/v1.7.0).",
  "",
].join("\n");

const EDITS: Array<[string, string]> = [
  ["Zakura publishes pre-built chain snapshots that dramatically reduce initial sync time:", "Zakura publishes pre-built chain snapshots that reduce initial sync time. The times below are the project's own figures:"],
  ["- Sub-500ms worst-case block propagation across the network\n- Mempool aggregation for more efficient transaction relay\n- DoS-resistant gossip protocol to improve network resilience",
   "- Sub-500ms worst-case block propagation across the network\n- Mempool aggregation for more efficient transaction relay\n\nThe README warns that this layer has known denial-of-service risks and is not yet production-hardened. In version 1.7.0 it moved to a Zakura-owned QUIC transport (`zakura-quic`), and earlier releases connect to it only over the legacy Zcash protocol."],
  ["| Status | Deprecated | Active | Active (v1.0.0, Jul 2026) |", "| Status | End of life (July 2026) | Active | Active |"],
  ["| zcashd RPC compat | Native | Partial | Yes (compat mode) |\n", ""],
  ["| Sync speed | Baseline | ~1× | ~5× faster |", "| Sync speed | Baseline | Reference | Nearly 5× faster (project figure) |"],
  ["## How Zakura Relates to Other Zcash Nodes", "## How Zakura Relates to Other Zcash Nodes\n\nThe comparison below follows the Zakura project's own description of the nodes."],
  ["(Zebra_Full_Node.md)", "(/zcash-tech/zebra-full-node)"],
  ["(Zaino.md)", "(/zcash-tech/zaino)"],
  ["(Full_Nodes.md)", "(/zcash-tech/full-nodes)"],
  ["(Lightwallet_Nodes.md)", "(/zcash-tech/lightwallet-nodes)"],
  ["a Rust-based indexer compatible with Zebra and Zakura", "a Rust-based indexer that reads chain data from a Zebra validator"],
];

export function rewriteZakuraNodeGuide(original: string): string {
  if (!/^# Zakura Node\s*$/im.test(original)) return original;
  let t = original;
  t = t.replace(/## TL;DR[\s\S]*?(?=\n---)/, TLDR.trimEnd() + "\n");
  t = t.replace(/### Ironwood \(NU6\.3\) Compatible[\s\S]*?(?=\n---)/, NU7.trimEnd() + "\n");
  for (const [a, b] of EDITS) if (t.includes(a)) t = t.replace(a, b);
  return t;
}

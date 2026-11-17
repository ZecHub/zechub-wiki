// Reading-order rewrite of "Full Nodes". The facts are the ones already on the page (and checked against
// the zcashd book's End of Life page: halt reached 18 July 2026 at block 3417100). What changes:
// - an "At a glance" strip of three linked cards (Zebra, Zakura, zcashd) replaces the TL;DR; a four-column table scrolled sideways on a phone, and a plain list read as unformatted,
// - the zcashd build steps (git checkout v5.4.1 and the Raspberry Pi guide) are removed: the page itself
//   warns that those binaries halt at the deprecation height, so keeping the commands only invites the
//   first "common mistake",
// - "Practical Implications" becomes "Why run your own node", and the line that zcashd enables shielded
//   coinbase mining is dropped because zcashd no longer runs.
// The "Sync and requirements" table and NU7 note were added Nov 2026 from the Zebra and Zakura GitHub
// releases pages, zakura.com and the existing Zebra / Zakura wiki pages.
// If the page no longer has this shape, the original markdown is returned untouched.
const GLANCE = JSON.stringify([
  { label: "Zebra · Recommended", text: "Zcash Foundation, written in Rust. Independent implementation. Wallet is separate (Zallet).", href: "/zcash-tech/zebra-full-node" },
  { label: "Zakura · Alternative", text: "Valar Group with Project Tachyon. Consensus-compatible fork of Zebra, wallet separate.", href: "/zcash-tech/zakura-node" },
  { label: "zcashd · Retired", text: "Electric Coin Company. Original implementation with the wallet built in. Halted on 18 July 2026.", href: "/guides/migration-guide-zcashd-to-zebrad-zallet" },
]);

export function rewriteFullNodesGuide(original: string): string {
  if (!/^# Full Nodes\s*$/im.test(original)) return original;
  const need = ["### Zebra", "### Zakura", "### zcashd (retired)", "## Practical Implications", "## Common Mistakes", "## Related Pages"];
  if (need.some((n) => !original.includes(n))) return original;

  const fm = original.match(/^---\n[\s\S]*?\n---\n/)?.[0] ?? "";
  const edit = original.match(/<a href="https:\/\/github\.com[^>]*>[\s\S]*?<\/a>/)?.[0] ?? "";
  const mistakes = original.match(/## Common Mistakes\n\n([\s\S]*?)\n\n## Related Pages/)?.[1];
  const related = original.match(/## Related Pages\n\n([\s\S]*?)\n\n## Further Learning/)?.[1];
  if (!mistakes || !related) return original;

  const fixedMistakes = mistakes.replace(
    "- Building zcashd from the instructions above and expecting a working node. Those binaries halt at the deprecation height.",
    "- Building or installing zcashd and expecting a working node. zcashd halted at the deprecation height and will not restart.",
  );

  return `${fm}
${edit}

# Full Nodes

A full node keeps a complete copy of the Zcash blockchain and checks every new block and transaction against the consensus rules. Running your own means you verify the chain yourself instead of trusting someone else's server.

## At a glance

<FaqGlance items='${GLANCE}' />

> **Which to use:** install Zebra (\`zebrad\`) today. zcashd is gone: its End-of-Support halt was reached on 18 July 2026 at block height 3417100, and those nodes no longer start. The node and the wallet are now separate programs, and Zallet runs against a node and holds the keys.

## Sync and requirements

| | Zebra | Zakura |
|---|---|---|
| **Latest release** | 7.0.0 (30 Oct 2026) | 1.8.3 (5 Nov 2026) |
| **Initial sync** | From genesis, about 20 hours per Zakura's own comparison | About 5x faster, per Zakura |
| **Fast start** | None | Chain snapshots: archive in about 37 minutes, pruned in under 2 minutes |
| **Disk (mainnet)** | About 300 GB and growing | About 11 GB with a pruned snapshot |
| **Hardware** | 4 cores, 16 GB RAM recommended (minimum 2 cores, 4 GB) | See the [download guide](https://zakura.com/download/) |
| **Ports** | 8233 mainnet, 18233 testnet | Same protocol ports |
| **More** | [Zebra Full Node](/zcash-tech/zebra-full-node) | [Zakura Node](/zcash-tech/zakura-node) |

Sync speeds and snapshot times for Zakura are the project's own figures, not independent tests.

> **NU7 upgrade:** NU7 activated on mainnet on November 6, 2026 at block height 3,543,405, and Zebra 7.0.0 supports it. Mainnet nodes must run a version that supports NU7 to follow the consensus chain. Zebra 7 also moves its database from format v28 to v29 on first start, without a resync, but Zebra 6.x cannot read v29, so downgrading means a full resync. Back up the \`state/v28\` directory before upgrading. Check the [Zebra releases](https://github.com/ZcashFoundation/zebra/releases) for the current version.

## What a full node does

A full node runs a full copy of a blockchain and gives you access to the protocol's features. It holds a complete record of every transaction since genesis, so it can verify the validity of new transactions and blocks as they are added.

## The implementations

### Zebra

Zebra is an independent, production-ready full node created by the Zcash Foundation and written in Rust. It validates blocks and transactions, takes part in the peer-to-peer network and exposes an RPC interface for applications.

The wallet is a separate component: [Zallet](https://github.com/zcash/zallet) runs against a Zebra node and handles keys and balances. This replaces zcashd, which bundled the node and the wallet in one process.

To serve shielded light wallets, the node runs next to an indexer: the established [lightwalletd](https://github.com/zcash/lightwalletd) or the newer [Zaino](/zcash-tech/zaino).

- [GitHub](https://github.com/ZcashFoundation/zebra/)
- [The Zebra Book](https://zebra.zfnd.org), for set-up instructions
- [Zebra Full Node](/zcash-tech/zebra-full-node): install steps, configuration and hardware requirements

### Zakura

Zakura is a second consensus-compatible full node, forked from Zebra and developed by Valar Group together with Project Tachyon. It follows the same protocol rules and adds faster synchronization, block pruning and a zcashd RPC compatibility layer. See [Zakura Node](/zcash-tech/zakura-node).

### zcashd (retired)

> **zcashd has been retired.** The Electric Coin Company [announced the deprecation](https://z.cash/support/zcashd-deprecation/). The automatic End-of-Support halt was reached on 18 July 2026 at block height 3417100: every unmodified zcashd 6.20.0 node shut down at that height and refuses to restart, and the software does not support NU6.3. Use Zebra. If you hold a zcashd \`wallet.dat\`, follow the [Migration Guide: zcashd to zebrad/Zallet](/guides/migration-guide-zcashd-to-zebrad-zallet).

zcashd was the original full node for Zcash, developed and maintained by the Electric Coin Company, and it exposed its functions to applications through an RPC interface. [lightwalletd](https://github.com/zcash/lightwalletd) is an example of an application built on a full node so that developers can offer mobile-friendly shielded light wallets without talking to the node directly. Reference: [The zcashd book](https://zcash.github.io/zcash/).

## Why run your own node

- **Network health.** Every node supports decentralization, helps prevent adversarial control and keeps the network resilient to some forms of disruption. DNS seeders expose a list of reliable nodes so that transactions can propagate.
- **Independent verification.** You check every transaction and block yourself, which avoids some privacy risks of using a third-party service to verify for you.
- **Private connections.** Your own node can connect to the network over [Tor](https://zcash.github.io/zcash/user/tor.html), and other users can then reach your node privately through its .onion address.
- **Mining.** Miners need a full node for the mining RPCs such as \`getblocktemplate\` and \`getmininginfo\`. See [The Mining Guide](https://zcash.readthedocs.io/en/latest/rtd_pages/zcash_mining_guide.html) or the Community Forum page for [Zcash Miners](https://forum.zcashcommunity.com/c/mining/13).
- **Network data.** Example platforms: [Zcash Block Explorer](https://mainnet.zcashexplorer.app) and [Coin Metrics](https://docs.coinmetrics.io/info/assets/zec). You can also help by running tests, proposing improvements and providing metrics.

## Common mistakes

${fixedMistakes}

## Related pages

${related}

## Further learning

- [Support documentation](https://zcash.readthedocs.io/en/latest/)
- [Discord server](https://discord.gg/zcash), or reach out on [X](https://X.com/ZecHub)
`;
}

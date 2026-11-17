// Condensed rewrite of "Crosslink Protocol". The source repeats the same points in the TL;DR, the
// introduction, "Aims and Objectives" and the miners section; this version says each once, keeps the three
// diagrams, the video and the technical terms (LOG_fin, LOG_ba, L, Safety Mode), and drops the claim that
// staking gives coinholders voting rights over upgrades, which is not part of the Crosslink design as
// described by Shielded Labs. The "Where Crosslink stands" part names no single Feature Net release as
// current beyond the dated note, because releases ship every few weeks (Version 16 stable on 2 Nov 2026,
// Version 17 pre-release on 5 Nov). If the source no longer has this shape, it is returned untouched.
export function rewriteCrosslinkGuide(original: string): string {
  if (!/^# Crosslink Protocol\s*$/im.test(original)) return original;
  if (!original.includes("### Bounded Availability and Safety Mode") || !original.includes("### Where Crosslink stands")) return original;

  const fm = original.match(/^---\n[\s\S]*?\n---\n/)?.[0] ?? "";
  const edit = original.match(/<a href="https:\/\/github\.com[^>]*>[\s\S]*?<\/a>/)?.[0] ?? "";
  const img = (id: string) => original.match(new RegExp(`!\\[[^\\]]*\\]\\(/content-images/${id}[^)]*\\)`))?.[0];
  const imgIntro = img("a2ffb19d");
  const imgAnalogy = img("b34afda4");
  const imgLedgers = img("fd039664");
  const video = original.match(/<div className="my-8[\s\S]*?<iframe[\s\S]*?\/>\s*<\/div>/)?.[0];
  if (!imgIntro || !imgAnalogy || !imgLedgers || !video) return original;

  return `${fm}
${edit}

# Crosslink Protocol

Crosslink is a proposed design for the next stage of Zcash consensus: a hybrid of Proof-of-Work (PoW) and Proof-of-Stake (PoS). Miners keep producing blocks, and a group of staked validators adds a second layer that makes blocks final. It is developed by Shielded Labs.

> **Status:** Crosslink is a proposal. It is not active on Zcash mainnet and would have to go through Zcash's standard governance process first. It runs today on Shielded Labs' Feature Net, a public test network.

## At a glance

| | |
|---|---|
| **What it is** | A hybrid PoW/PoS design that combines PoW with a Byzantine Fault Tolerance (BFT) protocol |
| **Main guarantee** | Assured finality as long as either PoW or PoS remains secure |
| **Two ledgers** | A finalized ledger (\`LOG_fin\`) and a lower-latency ledger (\`LOG_ba\`) |
| **Fail-safe** | Safety Mode pauses economic activity if finality falls too far behind |
| **Who builds it** | Shielded Labs, with partners such as ZODL |
| **Where it runs** | The Crosslink Feature Net (test network) |

## Why a hybrid design

- **Less dependence on mining hardware.** Staking lets more coinholders help secure the network, instead of only specialized ASIC operators.
- **Stronger security.** Staked validators add protection against chain reorganization and 51% attacks.
- **Lower energy use.** Part of the security moves from computation to stake.
- **A gradual path.** A hybrid is a first step towards pure PoS. It lets mining and staking coexist, and it limits risk while validator stake and confidence grow. Ethereum has run a similar approach in production.

${imgIntro}

## How it works

Crosslink gives Zcash two views of the same chain:

- **Finalized ledger (\`LOG_fin\`).** Once a block is in it, it will not roll back, as long as either the BFT protocol or the PoW chain stays secure. It stays live even under network partitions, with a latency slightly more than double the current Zcash blockchain for equivalent confirmations.
- **Lower-latency ledger (\`LOG_ba\`).** The fast view. It extends the finalized ledger by no more than *L* blocks, and its security and latency are no worse than Zcash's today. In the simplified Crosslink 2* design it is a PoW chain.

${imgLedgers}

**Finalizers.** Validators called finalizers sign off on blocks based on staked ZEC. Stakers delegate coins to a finalizer, and the finalizers with the most stake vote to finalize blocks. Older documents call them notaries. Early phases use a fixed set, and later phases elect them by stake.

**Crosslink 2.** This simplified design unifies the BFT proposers with the miners. That means fewer structural changes and it allows a "dummy" BFT layer, which makes it easier to prototype and deploy.

### Safety Mode

If the finalized ledger falls behind the lower-latency ledger by more than *L* blocks, Crosslink enters **Safety Mode**. PoW block production continues, so basic security holds, but economic activity pauses until finality catches up. This guards against the fast ledger running far ahead of what is final, and it supports recovery from exceptional events such as a major attack.

## An analogy

${imgAnalogy}

A parcel service issues two documents for one delivery. The **tracking scan** appears quickly and is occasionally corrected. The **signed delivery receipt** arrives later, but once it exists nobody disputes it. The lower-latency ledger is the scan and the finalized ledger is the receipt. Safety Mode is the depot refusing to pay out against scans alone while signed receipts have stopped arriving.

## Where Crosslink stands

Crosslink is still a proposal. Shielded Labs' [Crosslink FAQ](https://shieldedlabs.net/crosslink-faq/) says it "would need to go through the standard Zcash governance process" before it could activate on mainnet.

What exists today is the **Feature Net**: a test network run by Shielded Labs, with its own test coin, cTAZ, where anyone can mine, stake and run a finalizer. It is built from [crosslink_monolith](https://github.com/ShieldedLabs/crosslink_monolith/releases), and new numbered releases arrive every few weeks. Version 16 was the latest stable release on 2 November 2026, and Version 17 was in pre-release on 5 November with a scheduled Feature Net network upgrade.

Each release starts as plain proof-of-work and switches Crosslink on in stages: staking first, then the first roster of finalizers, then BFT finality. The exact block heights change from release to release, so read the release notes before you join.

Activating Crosslink on mainnet would also require consensus changes (defining the stake distribution and updating the network rules for hybrid consensus), a reworked reward structure, and a phased rollout. The earlier prototype is in the [zebra-crosslink repository](https://github.com/ShieldedLabs/zebra-crosslink) and [its book](https://shieldedlabs.github.io/zebra-crosslink/). The current design is in the [Crosslink book](https://shieldedlabs.github.io/crosslink_book/).

To try it, follow the [Crosslink Feature Net](/guides/crosslink-feature-net) guide. To watch the network without running anything, open the Crosslink tab on [ZecHub Tools](https://zechub.wiki/tools?tool=crosslink).

## What it means for miners

Over time, a growing share of the block reward would go to stakers, so PoW miners would earn less. The design introduces this gradually, so miners have time to adapt, for example by staking or by other network roles. PoW itself does not go away: even in Safety Mode, mining continues.

## Common mistakes

- **Treating it as active.** It is a proposal with a test network, not a mainnet rule.
- **Assuming PoS replaces mining.** It is a hybrid. PoW block production continues alongside staked validation.
- **Reading finality as faster confirmation.** Finality adds rollback safety, not speed. The lower-latency ledger is the fast view.
- **Confusing the two ledgers.** \`LOG_ba\` is not a separate chain: it extends the finalized ledger by at most *L* blocks.

## Related pages

- [Crosslink Feature Net](/guides/crosslink-feature-net): install the desktop app, stake to a finalizer and check your position.
- [Zebra Full Node](/zcash-tech/zebra-full-node): the client Crosslink 2* is planned to be integrated into.
- [Full Nodes](/zcash-tech/full-nodes): how nodes validate consensus rules today.
- [Network Upgrades](/start-here/network-upgrades): how consensus rule changes reach the network.
- [Zcash Monetary Policy](/start-here/zcash-monetary-policy): the block reward structure Crosslink would redistribute.

## Resources

- [Crosslink: Incentivized Feature Net (Zcash Community Forum)](https://forum.zcashcommunity.com/t/crosslink-incentivized-feature-net/55210)
- [Crosslink at Shielded Labs](https://shieldedlabs.net/crosslink/) and the [Feature Net releases](https://github.com/ShieldedLabs/crosslink_monolith/releases)
- [The Crosslink book](https://shieldedlabs.github.io/crosslink_book/)

${video}
`;
}

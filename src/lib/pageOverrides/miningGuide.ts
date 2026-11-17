// Zcash Mining Guide: adds a TL;DR, a short block time / reward section (ZIP 218, NU7: 25 s blocks, 0.52083333 ZEC
// per block, about 1,800 ZEC per day), and Related pages. Removes figures that go stale or have no source (pool and network
// hashrates, "latest lolMiner 1.88", "profitable in 2026", "currently"), drops Zecwallet Lite from the wallet list, and
// moves the Foundry monitoring section out of the middle of the Sovright section, where it split a code block.
// Every edit is optional. Without the H1 the original is returned untouched.

const TLDR = `## TL;DR

- Zcash mining uses the **Equihash** proof-of-work algorithm. Most people mine by joining a **pool** instead of mining alone.
- You need a Zcash address for payouts, mining hardware (a GPU rig or an Equihash ASIC) and mining software or the ASIC's own dashboard.
- Mining is not profitable for everyone. Check hardware cost, electricity price and local rules before you buy anything.
- Pool fees, payout rules and addresses change. Confirm them on the pool's own site before you point hardware at it.
- Blocks target 25 seconds since NU7, which changes how often shares and rewards arrive.

`;

const BLOCKS = `## Block time and rewards

NU7 activated [ZIP 218](https://zips.z.cash/zip-0218), which shortens the target block time from 75 seconds to **25 seconds** (3,456 blocks per day) and sets the block reward to **0.52083333 ZEC**. That keeps daily issuance at about 1,800 ZEC, with a different number of blocks. The halving interval is 5,040,000 blocks. See [Zcash Monetary Policy](/start-here/zcash-monetary-policy) for the full schedule.

For a miner this means blocks and pool shares arrive more often, with a smaller reward each. Your expected share of the daily reward still depends on your hashrate compared with the whole network.

`;

const RELATED = `

## Related pages

- [Zcash Mining Pools](/using-zcash/zcash-mining-pools): pool listings and comparisons
- [Zcash Monetary Policy](/start-here/zcash-monetary-policy): block rewards and issuance
- [Wallets](/using-zcash/wallets): choose a wallet for payouts
- [Zebra Full Node](/zcash-tech/zebra-full-node): run your own node
`;

const EDITS: [string, string][] = [
  ["Note that while GPUs can still mine Zcash, ASICs are far more efficient and profitable in 2026 due to network difficulty. Always check current profitability using tools like WhatToMine.com, as factors like electricity costs, hardware prices, and ZEC value affect viability.",
   "GPUs can mine Zcash, but ASICs are far more efficient. Check profitability with a tool such as WhatToMine.com, because electricity costs, hardware prices and the ZEC price all change the result."],
  [" ASICs dominate the network (~13 GSol/s total hashrate in 2026), making GPU mining less competitive but still possible for hobbyists.",
   " ASICs dominate the network, which makes GPU mining less competitive but still possible for hobbyists."],
  ["**Recommended Pools (Based on Hashrate, Fees, and Reviews):**",
   "**Pools the community uses.** Fees, payout minimums and rules change, so confirm them on each pool's site:"],
  [" High hashrate (~1.17 GSol/s), reliable servers.", ""],
  [" Large pool (~2.57 GSol/s).", " Large multi-coin pool."],
  [" good for ASICs (~494 MSol/s).", " good for ASICs."],
  ["A Zcash pool built on Stratum V2, currently running as a public testnet.", "A Zcash pool built on Stratum V2, run as a public testnet."],
  ["(latest version, e.g., 1.88)", "(see its releases page for the version to use)"],
  ["  - Transparent (easier but less private): Edge Wallet, Zecwallet Lite.", "  - Transparent (easier but less private): Edge Wallet."],
];

export function rewriteMiningGuide(original: string): string {
  const h1 = original.match(/^# Zcash Mining Guide[^\n]*\n/m);
  if (!h1 || h1.index === undefined) return original;
  let t = original;
  for (const [a, b] of EDITS) if (t.includes(a)) t = t.replace(a, b);

  // Move the Foundry monitoring block out of the Sovright section.
  const fStart = t.indexOf("### Monitoring Foundry Zcash Pool");
  const fEnd = t.indexOf("  ```\n  git clone https://github.com/sovright/mining-infra");
  if (fStart >= 0 && fEnd > fStart) {
    const foundry = t.slice(fStart, fEnd).replace(/\s+$/, "");
    t = t.slice(0, fStart) + t.slice(fEnd);
    t = t.replace(/\s+$/, "") + "\n\n" + foundry + "\n";
  }

  const intro = t.indexOf("## Introduction");
  if (intro >= 0) t = t.slice(0, intro) + TLDR + t.slice(intro);
  const req = t.indexOf("## Requirements");
  if (req >= 0) t = t.slice(0, req) + BLOCKS + t.slice(req);
  return t.replace(/\s+$/, "") + RELATED;
}

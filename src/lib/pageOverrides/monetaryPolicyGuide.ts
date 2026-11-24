// Zcash Monetary Policy (start-here/zcash-monetary-policy). The source page still says a block arrives every 75 seconds
// and pays 1.5625 ZEC, which stopped being true when NU7 activated (block 3,543,405). Figures below come from
// ZIP 259 (what NU7 deploys), ZIP 218 (25-second blocks), ZIP 235 (fee removal), ZIP 237 (NSM) and ZIP 214 (funding streams).
// If the page structure does not match, the original markdown is returned untouched.
const BODY = [
  "# Zcash Monetary Policy",
  "",
  "## TL;DR",
  "",
  "- The supply is capped at **21 million ZEC**, the same cap as Bitcoin.",
  "- The block reward is cut in half about every four years. The halvings so far were in 2020 and 2024, and the next is expected in 2028.",
  "- **Network Upgrade 7 (NU7)** changed the schedule at block 3,543,405: blocks now arrive every **25 seconds** instead of 75, and each pays a third of the previous reward. The amount issued per day stays about the same.",
  "- Since NU7, **60% of transaction fees** are removed from circulation instead of going to miners. They are not destroyed for good: the protocol is designed to reissue them through later block rewards.",
  "- **20% of every block reward** funds ecosystem development, and the other 80% goes to miners.",
  "",
  "---",
  "",
  "## What are the economics of Zcash?",
  "",
  "Zcash has a fixed maximum supply of 21 million ZEC. New coins enter circulation only as block rewards, and the reward halves on a fixed schedule until the supply is exhausted. Inflation falls with every halving, in the same way as Bitcoin's.",
  "",
  "A [block](https://zcash.readthedocs.io/en/latest/rtd_pages/glossary.html#:~:text=Block,mempool%20in%20an%20unconfirmed%20state.) is a batch of transactions added to the chain by a miner, who is paid the block reward plus a share of the transaction fees.",
  "",
  "## What changed with NU7",
  "",
  "| | Before NU7 | Since NU7 |",
  "|--|--|--|",
  "| Time between blocks | 75 seconds | 25 seconds |",
  "| Blocks per day | 1,152 | 3,456 |",
  "| Reward per block | 1.5625 ZEC | 0.52083333 ZEC |",
  "| New ZEC per day | about 1,800 | about 1,800 |",
  "| Transaction fees | All paid to the miner | 40% to the miner, 60% removed from circulation |",
  "",
  "Blocks come three times as often, so each one pays a third of the old reward. Halvings still happen about every four years of real time, because the number of blocks between them was tripled to 5,040,000 ([ZIP 218](https://zips.z.cash/zip-0218)). Rounding down makes the total slightly smaller than before: the effective cap ends up about 0.68 ZEC under 21 million.",
  "",
  "### Fees and the Network Sustainability Mechanism",
  "",
  "[ZIP 235](https://zips.z.cash/zip-0235) removes 60% of the fees in each block from circulation. The Network Sustainability Mechanism ([ZIP 237](https://zips.z.cash/zip-0237)) keeps a running balance of the removed value and adds a small fraction of it to each block reward once reissuance begins. That start is set far ahead, at block 8,939,664, so it does not affect issuance today. The aim is to keep long-run issuance tied to the halving schedule instead of letting removed fees disappear.",
  "",
  "## Where the block reward goes",
  "",
  "| Share | Recipient |",
  "|--|--|",
  "| 80% | Miners |",
  "| 8% | Zcash Community Grants (ZCG) |",
  "| 12% | Coinholder-Controlled Fund |",
  "",
  "The two funding streams run until the third halving ([ZIP 214](https://zips.z.cash/zip-0214), [ZIP 1016](https://zips.z.cash/zip-1016)). Before November 2024 the original development fund took 20% under [ZIP 1014](https://zips.z.cash/zip-1014), split between three organizations. See [Zcash Development Fund](/start-here/development-fund) for how the fund is used.",
  "",
  "## Resources",
  "",
  "[ZIP 259: Network Upgrade 7](https://zips.z.cash/zip-0259)",
  "",
  "[ZIP 218: 25-second block target spacing](https://zips.z.cash/zip-0218)",
  "",
  "[ZIP 237: Network Sustainability Mechanism](https://zips.z.cash/zip-0237)",
  "",
  "[What are the economics of Zcash?](https://z.cash/support/faq/)",
  "",
].join("\n");

export function rewriteMonetaryPolicyGuide(original: string): string {
  if (!original.includes("What are the economics of Zcash?")) return original;
  if (!original.includes("1.5625 ZEC")) return original;
  const i = original.search(/^# /m);
  if (i < 0) return original;
  return original.slice(0, i) + BODY;
}

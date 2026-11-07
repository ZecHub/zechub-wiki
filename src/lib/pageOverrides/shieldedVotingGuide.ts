// Shielded Coinholder Voting page (checked 6 Nov 2026). Protocol description is kept as written in the ZecHub source.
// Added: a TL;DR strip, the results of the NU7 poll (CoinDesk, Sept 16, 2026, and Decrypt: about 2.4 million
// ZEC took part, roughly two-thirds of about 3.6 million eligible; outcomes of the five questions; the 1,000,000 ZEC
// quorum was met) and what NU7 activated on Nov 6, 2026 (CoinDesk). A sponsored CoinDesk research piece is not used.
// Removed unsupported claims: the ~2 GB nullifier list size and the "older method" for transparent ZEC.
// Reader changes: relative "../" links become site paths, the FAQ becomes expandable items, and the quiz answer is
// shown directly. If the page no longer has this shape, the original markdown is returned untouched.
const GLANCE = JSON.stringify([
  { label: "What it is", text: "A private, stake-weighted poll of shielded ZEC holders" },
  { label: "Weight", text: "One Ironwood ZEC at the snapshot block equals one vote" },
  { label: "Built by", text: "Valar Group, on a separate voting chain" },
  { label: "Latest poll", text: "NU7 scope poll, results published in September 2026" },
]);

const RESULTS = `## Results of the NU7 poll

The NU7 poll closed on September 14, 2026. According to [CoinDesk](https://www.coindesk.com/tech/2026/09/16/zcash-holders-overwhelmingly-back-faster-transactions-and-bitcoin-style-halvings), about 2.4 million ZEC took part, roughly two-thirds of the 3.6 million ZEC eligible at the snapshot. That is well above the 1,000,000 ZEC quorum.

| Question | Result |
|---|---|
| Block time | 99.9% backed cutting it from 75 to 25 seconds |
| Halvings | 98.9% voted to keep the bitcoin-style halvings instead of a smoother issuance curve |
| Fee reissuance (Network Sustainability Mechanism) | 96.6% voted to delay reissuing collected fees until February 2031 |
| NU7 timing | About 99.3% voted to ship NU7 as soon as possible, dropping any feature not ready by a September 30 deadline |
| Sprout | Voters supported disabling Sprout transactions (no percentage was reported) |

[Decrypt](https://decrypt.co/378460/zcash-closes-on-1400-after-coinholders-vote-to-keep-bitcoin-style-halvings) reports the same outcomes and notes that the advisory panels had preferred an earlier start for fee reissuance. NU7 activated on November 6, 2026 with 25-second target blocks and a split of transaction fees that feeds a reserve beginning around February 2031 ([CoinDesk](https://www.coindesk.com/tech/2026/11/06/zcash-s-landmark-nu7-upgrade-goes-live-speeding-up-private-payments)). See [NU7](/start-here/network-upgrades) for the upgrade itself.

`;

export function rewriteShieldedVotingGuide(original: string): string {
  if (!/^# Shielded Coinholder Voting\s*$/im.test(original)) return original;
  let text = original;

  // Claims the NU7 vote announcement does not support (checked 6 Nov 2026) are replaced by what it does say.
  const FIXES: [string, string][] = [
    [" Transparent ZEC is handled separately by the older method, not by this protocol.", " Only spendable shielded funds count, so transparent ZEC does not take part."],
    [", roughly 2 GB for Orchard-era data and far larger as Zcash grows.", "."],
  ];
  for (const [from, to] of FIXES) {
    if (!text.includes(from)) return original;
    text = text.replace(from, to);
  }

  // 1. Site-path links instead of ../
  text = text.replace(/\]\(\.\.\/([a-z0-9-]+\/[a-z0-9-]+)\)/g, "](/$1)");

  // 2. At a glance + results before the first section
  const first = text.indexOf("## Why private voting is hard");
  if (first < 0) return original;
  text = text.slice(0, first) + `## TL;DR\n\n<FaqGlance items='${GLANCE}' />\n\n` + RESULTS + text.slice(first);

  // 3. FAQ -> expandable items
  const faqAt = text.search(/^## FAQ\s*$/m);
  const quizAt = text.search(/^## Test your understanding\s*$/m);
  const resAt = text.search(/^## Resources\s*$/m);
  if (faqAt < 0 || quizAt < 0 || resAt < 0 || !(faqAt < quizAt && quizAt < resAt)) return original;
  const faqRaw = text.slice(faqAt, quizAt).replace(/^## FAQ\s*/, "").trim();
  const items = faqRaw.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean).map((p) => {
    const i = p.indexOf("? ");
    if (i < 0) return null;
    return `<FaqItem q=${JSON.stringify(p.slice(0, i + 1))}>\n\n${p.slice(i + 2)}\n\n</FaqItem>`;
  });
  if (items.some((x) => x === null) || items.length < 3) return original;

  // 4. Quiz answer shown directly
  const quizRaw = text.slice(quizAt, resAt).replace(/^## Test your understanding\s*/, "");
  const q = quizRaw.split("<details>")[0].trim();
  const a = quizRaw.match(/<\/summary>\s*([\s\S]*?)\s*<\/details>/)?.[1]?.trim();
  if (!q || !a) return original;

  return text.slice(0, faqAt) + `## Common questions\n\n${items.join("\n\n")}\n\n## Check your understanding\n\n**${q}**\n\n${a}\n\n` + text.slice(resAt);
}

import { historicalNote } from "./upgradePage";

// Editorial rewrite of "Blossom". Facts, ZIP links and both diagrams are kept as in the ZecHub repo; what
// changes is the reading order: a before/after table up front, the "why it matters" paragraph split into
// short points, the FAQ shown as always-visible questions, and the quiz answer left open so a reader sees
// it without clicking. If the source no longer has this shape, it is returned untouched.
export function rewriteBlossomGuide(original: string): string {
  if (!/^# Blossom\s*$/im.test(original)) return original;
  const need = ["## Faster blocks", "## Keeping issuance steady", "## A mandatory upgrade", "## Where Blossom fits", "## Glossary", "## FAQ"];
  if (need.some((n) => !original.includes(n))) return original;

  const fm = original.match(/^---\n[\s\S]*?\n---\n/)?.[0] ?? "";
  const edit = original.match(/<a href="https:\/\/github\.com[^>]*>[\s\S]*?<\/a>/)?.[0] ?? "";
  const imgs = [...original.matchAll(/!\[([^\]]*)\]\((\/content-images\/blossom-[^)]+)\)/g)];
  if (imgs.length < 2) return original;
  const spacing = `![${imgs[0][1]}](${imgs[0][2]})`;
  const issuance = `![${imgs[1][1]}](${imgs[1][2]})`;
  const glossary = original.match(/## Glossary\n\n([\s\S]*?)\n\n## FAQ/)?.[1];
  if (!glossary) return original;
  const seeAlso = original.match(/### See also\n\n([\s\S]*?)\n\n---/)?.[1]?.split("\n").filter(Boolean).map((l) => `- ${l}`).join("\n");
  const resources = original.match(/### Resources\n\n([\s\S]*?)\n\n### See also/)?.[1]?.split("\n").filter(Boolean).map((l) => `- ${l}`).join("\n");
  const series = original.match(/Series: [^\n]*/)?.[0];
  if (!seeAlso || !resources || !series) return original;

  const faq: Array<[string, string]> = [
    ["Does Blossom change how much ZEC exists or when halvings happen?", "No. The per-block reward was halved and the halving interval was doubled at the same time, so the amount of ZEC created per unit of time, and the timing of future halvings, stayed the same."],
    ["Does Blossom change my ZEC or my privacy?", "No. Blossom changed block timing and reward math. It did not touch your balances or your shielded transactions."],
    ["What does 75 seconds actually mean?", "It is a target, not a guarantee. Blocks are found by proof of work, so the real gap between blocks varies. The network aims for one about every 75 seconds instead of every 150."],
    ["Did I have to do anything when Blossom activated?", "If you ran a full node, you needed to upgrade it, because Blossom was mandatory. If you used a wallet, you needed a version that supported the new rules."],
    ["Why halve the block reward at all?", "Because blocks now come twice as fast. Halving the per-block reward keeps the network from creating ZEC twice as quickly."],
  ];
  const faqMd = faq.map(([q, a]) => `<FaqItem q=${JSON.stringify(q)}>\n\n${a}\n\n</FaqItem>`).join("\n\n");

  return `${fm}
${edit}

# Blossom

Blossom made Zcash blocks arrive about twice as fast, without changing how much ZEC the network creates over time. It went live on mainnet at block 653,600 on December 11, 2019 (UTC).

${historicalNote("Blossom", "December 11, 2019")}

## At a glance

| | Before Blossom | After Blossom |
|---|---|---|
| **Target time between blocks** | 150 seconds | 75 seconds |
| **Block reward** | Full reward | Halved |
| **Halving interval** | 840,000 blocks | 1,680,000 blocks |
| **ZEC created per unit of time** | Unchanged | Unchanged |

Blossom is a Zcash [network upgrade](../start-here/network-upgrades), deployed by [ZIP 206](https://zips.z.cash/zip-0206). Its main consensus change is defined in [ZIP 208](https://zips.z.cash/zip-0208). The Electric Coin Company led and announced it.

## Why it matters

When you send ZEC, you wait for a block to confirm it. Blossom cut the expected wait for that first confirmation in half and let the chain carry more transactions in the same amount of time. It did this without creating more ZEC and without moving the timing of future halvings.

## Faster blocks

The target block spacing is the time the network aims for between one block and the next. Blossom dropped it from 150 to 75 seconds ([ZIP 208](https://zips.z.cash/zip-0208)). Blocks are found by proof of work, so the real gap varies, but the aim is now one block about every 75 seconds.

Two things follow:

1. **More capacity.** Blocks arrive about twice as often, so the chain can carry roughly double the transactions per unit of time.
2. **Quicker first confirmation.** You do not wait as long for the next block.

${spacing}

## Keeping issuance steady

Faster blocks raise a question: if Zcash made twice as many blocks and each still paid the same reward, the network would create ZEC twice as fast. Blossom avoids that in two steps:

1. It **halved the reward** paid per block.
2. It **doubled the halving interval**, from 840,000 to 1,680,000 blocks ([ZIP 208](https://zips.z.cash/zip-0208)).

Twice as many blocks, each paying half as much, adds up to the same ZEC per unit of time. The supply schedule and the timing of future halvings, in real time, did not change.

${issuance}

## A mandatory upgrade

Blossom was a bilateral consensus change, so every node had to upgrade to keep following the chain ([ZIP 206](https://zips.z.cash/zip-0206)). It activated at block 653,600 and carries its own consensus branch id, a tag that lets nodes and transactions confirm they follow the Blossom rules. It used Zcash's standard network upgrade mechanism ([ZIP 200](https://zips.z.cash/zip-0200)).

## Where Blossom fits

Blossom was Zcash's third network upgrade, after Overwinter and Sapling and before Heartwood and Canopy. Sapling reworked the shielded cryptography. Blossom was about scale and speed, and it added no new privacy features.

## Glossary

${glossary}

## Common questions

${faqMd}

## Check your understanding

**Blossom made Zcash blocks arrive about twice as often. Why did that not double the rate at which new ZEC is created?**

Because Blossom also halved the reward paid per block and doubled the halving interval. Twice as many blocks, each paying half as much, adds up to the same amount of ZEC per unit of time.

## Resources

${resources}

## See also

${seeAlso}

---

${series}
`;
}

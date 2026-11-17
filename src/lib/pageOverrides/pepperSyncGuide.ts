// Rewrite of the Pepper Sync page (checked 5 Nov 2026). The source was marketing copy ("a leap forward", "minutes,
// not hours", a before/after table) with no benchmark behind it. The technical facts below come from the
// pepper-sync crate documentation (docs.rs, version 0.7.0, published October 27, 2026): non-linear scanning by
// priority (chain tip, verify, found note, historic, scanned), shard-based scanning, spend-before-sync, reorg
// verification of the first 10 blocks, performance levels, pause and resume. The speed claims and the comparison
// with older Zingo versions are removed because nothing here supports them; the privacy line now points to what a
// light wallet server can still see. The two flow diagrams are kept. If the page no longer has this shape,
// the original markdown is returned untouched.
// Second pass (Nov 6): at-a-glance cards, a short summary callout, the simplified diagram shown at a limited width with the
// detailed one folded away, and the questions as FAQ items. The download link no longer points at the zingolib library repository.
export function rewritePepperSyncGuide(original: string): string {
  if (!/^# Zingo 2\.0 - Pepper Sync\s*$/im.test(original)) return original;
  const fm = original.match(/^---\n[\s\S]*?\n---\n/)?.[0] ?? "";
  const edit = original.match(/<a href="https:\/\/github\.com[^>]*>[\s\S]*?<\/a>/)?.[0] ?? "";
  const src = (needle: string) => original.match(new RegExp(`/content-images/${needle}[^"')\\s]*`))?.[0];
  const detailed = src("119c13ec");
  const simple = src("9b612cbd");
  if (!detailed || !simple) return original;

  const GLANCE = JSON.stringify([
    { label: "Scanning", text: "Non-linear: block ranges carry a priority, highest first" },
    { label: "Spend before sync", text: "Yes, for notes that have already been scanned" },
    { label: "Pause and resume", text: "Yes. Sync can be paused, resumed or stopped" },
    { label: "Crate version", text: "0.7.0, published October 27, 2026, MIT license", href: "https://docs.rs/pepper-sync" },
  ]);
  const fig = (url: string, alt: string) =>
    `<div className="my-5 mx-auto max-w-[420px]"><img src="${url}" alt="${alt}" className="h-auto w-full rounded-lg border border-slate-200 dark:border-slate-700" /></div>`;

  return `${fm}
${edit}

# Zingo 2.0 - Pepper Sync

Pepper Sync is the synchronization engine of the Zingo wallet, built by Zingo Labs and published as the pepper-sync Rust crate. It finds your shielded funds and transactions by scanning blocks, but it does not read the chain from start to finish. It scans in priority order, so what matters for spending is handled first.

<FaqGlance items='${GLANCE}' />

> **In short:** Pepper Sync scans the blocks that matter first, lets you spend notes it has already found, and can be paused and resumed. The crate documentation gives no speed figures, and neither does this page. Last verified November 2026.

## How it works

A wallet has to check every block for payments to its addresses. Pepper Sync does that in six steps, as the crate documentation describes them:

1. **Set the ranges.** The wallet tracks ranges of blocks. It starts with one range from its last height plus one up to the chain height, and splits and merges ranges as it goes.
2. **Check for reorganizations.** The engine re-verifies the first 10 blocks after the last scanned height. If continuity fails, it checks earlier blocks and removes wallet data that is no longer on the chain.
3. **Pick by priority.** Ranges are ranked chain tip, verify, found note, historic, scanned. The highest-priority range is always scanned first.
4. **Fetch and decrypt.** A loader streams compact blocks in batches bounded by an output budget, which keeps memory use steady. Worker threads trial-decrypt notes and build transactions in parallel.
5. **Scan by shard.** Subtree data from the server seeds the wallet's note trees. Scanning is organized by shard, so decrypted outputs can become spendable sooner.
6. **Detect spends.** Nullifier and outpoint maps reveal when your notes are spent. When one is found, the blocks around it move up to found-note priority.

${fig(simple, "Simplified flow of Pepper Sync")}

<details>
<summary>Show the detailed flow</summary>

${fig(detailed, "Detailed flow of Pepper Sync")}

</details>

An older, linear sync is like reading a long book from page one before you may say anything about it. Pepper Sync keeps track of which pages are read, reads the chapters that decide what you can spend first, and lets you act on those before the last page.

## Settings

- **Performance level.** Low, Medium, High or Maximum. It sets how many outputs are loaded at a time and how large the nullifier map can grow. At Low and Medium the map only holds the chain tip.
- **Transparent address discovery.** A gap limit and address scopes (external, internal, and refund or ephemeral) control how far the engine looks for transparent addresses.

## Privacy

Trial decryption happens on your device, so your keys stay with you. Syncing still talks to a light wallet server, which can see your IP address and the timing of your activity even though it cannot read shielded amounts or memos. [Lightwallet Nodes](/zcash-tech/lightwallet-nodes) explains this and how to reduce it.

## Common questions

<FaqItem q="Can I spend before the sync finishes?">

Yes, for notes that have already been scanned. Funds in ranges that are still waiting to be scanned are not available yet.

</FaqItem>

<FaqItem q="What happens if I close the app or lose my connection?">

Sync does not start over. The engine can be paused and resumed, and the wallet keeps track of the block ranges it has scanned.

</FaqItem>

<FaqItem q="How long does the first sync take?">

It depends on your device, your connection, the server and the age of the wallet. The crate documentation gives no throughput figures and this page has no benchmark, so there is no number to quote.

</FaqItem>

<FaqItem q="Is Pepper Sync a wallet?">

No. It is the engine inside Zingo. You install Zingo, and Pepper Sync runs underneath it.

</FaqItem>

<FaqItem q="Does faster scanning change what the server can see?">

No. Pepper Sync changes the order in which blocks are scanned, not what the server learns about your connection.

</FaqItem>

## Getting started

1. Get Zingo from the official [Zingo Labs](https://github.com/zingolabs) channels.
2. Create a wallet or restore one from your seed phrase. Zingo Labs has a [Zingo 2.0 video](https://www.youtube.com/watch?v=FREwMzf_LlM).
3. Let the first sync run. You can watch it in the app, as in this [Zingo Labs post](https://x.com/ZingoLabs/status/1961871338441724191).
4. Send and receive shielded ZEC once your notes have been scanned.

## Related pages

- [Zcash Wallet Syncing](/zcash-tech/zcash-wallet-syncing): how wallet synchronization works across the Zcash ecosystem
- [Lightwallet Nodes](/zcash-tech/lightwallet-nodes): the servers a light wallet such as Zingo syncs against
- [Zaino](/zcash-tech/zaino): the indexer developed by the Zingo team
- [Wallets](/using-zcash/wallets): the directory of Zcash wallets

## Further learning

- [pepper-sync crate documentation](https://docs.rs/pepper-sync)
- [Zingo Labs code repositories](https://github.com/zingolabs)
- [Zingo Labs on X](https://twitter.com/ZingoLabs)
- [Zcash Community Forum](https://forum.zcashcommunity.com/)
`;
}

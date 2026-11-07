// Rewrite of Zcash Wallet Syncing (checked 6 Nov 2026). Sources checked today: Warp (forum thread by Hanh, Sept 6, 2024:
// trial decryption re-implemented, spam filter dropping transactions with more than 32 outputs, author's own timings);
// Zkool docs (successor to Ywallet, "Warp Sync 2", developers' own claim); Zecwallet forum thread (maintainer stepped back
// May 16, 2022, zingolabs fork June 2022); DAGSync post (Jack Grigg, July 20, 2022: follows the chain of spends, proposal);
// Zcash Android SDK README (Spend-before-Sync listed as an unstable feature still under development; end-of-support notice
// naming 4.0.0 as the final release); Slipstream README (Rust, AGPL-3.0-only, Znewco; own benchmarks); pepper-sync 0.7.0
// (Oct 27, 2026); Zodl 3.6.0 (ZecHub newsletter, June 25, 2026); HackMD benchmark on 25-second blocks (author co-wrote the
// proposal, simulator only). Removed from the source: "X5" faster for Blaze Sync (no source), "thousands of blocks per second"
// for Warp (only the developer's timings are quoted), the misplaced diagram under Spend-before-sync (it is a Merkle tree).
// If the page no longer has this shape, the original markdown is returned untouched.
export function rewriteWalletSyncing(original: string): string {
  if (!/^# Zcash Wallet Syncing\s*$/im.test(original)) return original;
  const edit = original.match(/<a href="https:\/\/github\.com[^>]*>[\s\S]*?<\/a>/)?.[0] ?? "";
  const tree = original.match(/\/content-images\/363d08df[^"')\s]*/)?.[0];
  const dag = original.match(/\/content-images\/eee7e08d[^"')\s]*/)?.[0];
  if (!tree || !dag) return original;
  const fig = (url: string, alt: string, w: number) =>
    `<div className="my-5 mx-auto" style={{ maxWidth: ${w} }}><img src="${url}" alt="${alt}" className="h-auto w-full rounded-lg border border-slate-200 bg-white dark:border-slate-700" /></div>`;

  return `${edit}

# Zcash Wallet Syncing

> Syncing is how a wallet finds its own shielded funds. It is slow because Zcash cannot let a server do the looking, so every wallet has to do some of the work itself.

## TL;DR

- A server cannot look up a shielded balance the way it can for Bitcoin, because shielded transactions hide their details.
- Light wallets download small compact blocks from a server such as lightwalletd and decrypt the relevant data locally with their keys.
- Decrypting and processing those blocks takes time, so wallets use faster strategies to let you spend sooner.
- Most of these strategies trade extra memory or processing power for speed.

## Why syncing is hard

Zcash uses zero-knowledge proofs to hide transaction details from outsiders. Think of the chain as a huge mailroom full of locked boxes. With a transparent coin the clerk can read the labels and tell you which boxes are yours. With Zcash the labels are hidden, so your wallet has to take its keys and quietly try the boxes itself.

A light wallet does not store the full blockchain. It relies on a server, but the server cannot see transaction details, so it cannot answer "what is my balance?". Zcash handles this by splitting the job:

1. **Compact blocks.** A server such as lightwalletd takes data from a full node and keeps only what a wallet needs to identify its transactions. These compact blocks are much smaller than full blocks.
2. **Local decryption.** The wallet downloads the compact blocks and tries to decrypt each shielded output with its own keys. The ones that decrypt are its payments. This is trial decryption.
3. **Local bookkeeping.** To spend a note, the wallet also keeps a witness, a proof that the note is in the commitment tree. Keeping witnesses up to date is part of the sync work.

${fig(tree, "A Merkle tree: eight transactions are hashed individually, then in pairs, up to a single root hash", 380)}

Even compact blocks take time to process, especially when blocks carry many transactions. Every method below is a different way to cut that wait. See [Lightwallet Nodes](/zcash-tech/lightwallet-nodes) for the server side.

## Approaches at a glance

| Approach | Core idea | Where it appears | Status |
|---|---|---|---|
| Non-linear scanning and spend-before-sync | Scan the ranges most likely to hold spendable notes first | Zcash Android SDK (unstable feature), Zingo's [Pepper Sync](/zcash-tech/pepper-sync) | Pepper Sync is published; the SDK feature was still under development in its README |
| Slipstream | Parallel block fetching, a sparse commitment tree and write-behind persistence | Published by Znewco, the company behind Zodl (AGPL-3.0) | Published, benchmarks are self-reported |
| Warp Sync | Re-implemented trial decryption, cheaper witness updates and a server-side spam filter | Ywallet, and Zkool ("Warp Sync 2") | Ywallet is no longer maintained; Zkool's claims are its own |
| Blaze Sync | Scan backward from the newest block and run the sync stages in parallel | Zecwallet | Historical: its maintainer stepped back in 2022 |
| DAGSync | Follow the chain of spends from known notes toward current unspent notes | Proposal by Jack Grigg (str4d), July 2022 | Proposal; shipping not confirmed |
| Oblivious retrieval | Fetch only your own data while hiding what you asked for | [PIR](/zcash-tech/private-information-retrieval), [Tachyon](/zcash-tech/project-tachyon), OMR | Research |

## Spend-before-sync and non-linear scanning

Spend-before-sync lets you spend funds soon after opening the wallet, without waiting for a full sync. It works by scanning blocks in a non-linear order. Instead of processing the chain from oldest to newest, the wallet scans several ranges, usually looking for recent transactions while older blocks are still downloading. If it finds a recent unspent note, that note becomes spendable immediately. The cost is a bit more memory and processing power.

The Zcash Android SDK README lists a "Spend-before-Sync" algorithm under its unstable features, says its compact block processor handles blocks from the lightwalletd server in non-linear order, and says the feature is still under development. The same README carries an end-of-support notice naming version 4.0.0 as the SDK's final release, so check which SDK your wallet uses.

Zingo's [Pepper Sync](/zcash-tech/pepper-sync) is a published implementation of the idea. Its crate gives block ranges a priority and scans the highest first, and it can be paused and resumed.

## Slipstream

Slipstream is an open-source sync engine for Zcash light wallets, written in Rust and maintained by Znewco, Inc. (Zcash Open Development Lab) under the zodl-inc organization on GitHub. It leaves the cryptography and wallet logic to unmodified librustzcash crates and handles the orchestration: parallel block fetching, a sparse commitment tree, write-behind persistence, tip-following and Tor transport policy. Its README says it produces the same wallet database as the reference path.

The README includes benchmarks from one wallet on four devices. On a MacBook Pro with an M4 chip it reports a sync in about 20 seconds against 22 minutes 30 seconds for the reference SDK, and on a 2016 iPad 4 minutes 43 seconds against 1 hour 4 minutes. These are the project's own measurements, not independent tests, and they depend on the wallet and device. The project is licensed AGPL-3.0-only, with commercial licenses available.

Separately, a ZecHub newsletter from June 25, 2026 reported that Zodl 3.6.0 syncs new wallets from the current chain tip and skips unnecessary scanning.

## Warp Sync

Warp is a sync engine by Ywallet's developer, Hanh, announced in early access on the Zcash Community Forum on September 6, 2024 to replace the engine in Ywallet. According to those posts it re-implemented trial decryption, stops sending and hashing spam note commitments just to update witnesses, and uses a server-side spam filter that discards transactions with more than 32 outputs. It also splits heavy ranges of blocks into smaller sections.

In the author's own test, it synced a wallet from Sapling activation in about 5 minutes on a Mac Air M1 with a local server, against 1 hour 26 minutes without the spam filter. A forum user reported about 8 minutes on an Intel i7 with a remote server. The filter also wrongly discarded 7 transactions in that test, which shows the trade-off of filtering. These figures are the developer's and a user's, not an independent benchmark. See the [forum thread](https://forum.zcashcommunity.com/t/warp-the-next-engine-for-ywallet/48722) and [Warp Sync](https://ywallet.app/warp/).

> Ywallet is no longer maintained and will not be updated for Ironwood, so it is not a wallet to install today. Its successor is Zkool, which describes itself as the successor to Ywallet and says it syncs with "Warp Sync 2". That speed claim is the developers' own.

## Blaze Sync

Developed by the Zecwallet team, Blaze Sync scanned the blockchain backward, starting from the newest block. This lets the wallet find spent notes before received ones and make unspent notes available without waiting for the full sync. It also decoupled the sync stages (downloading blocks, trial decryption and updating witnesses) and ran them in parallel, which cost more memory and CPU in exchange for speed. This is historical: in May 2022 Zecwallet's maintainer announced he was stepping back and said the wallet would be deprecated over the following six months without a new team ([forum thread](https://forum.zcashcommunity.com/t/future-of-zecwallet/41681)). A community fork appeared under the zingolabs organization in June 2022.

## DAGSync

DAGSync is a wallet sync algorithm proposed by Jack Grigg (str4d) on July 20, 2022. A wallet's transactions form a directed acyclic graph (DAG): funds flow from source transactions through spends to unspent notes. Instead of scanning the chain linearly, DAGSync follows that chain of spends from known notes toward the wallet's current unspent notes, using targeted decryption. The goal is to give a spendable lower bound on the balance sooner and settle the full balance later. When it was published, the post said the ECC core team was working on implementing it in the Zcash Rust crates. The post does not say whether it has shipped, and this page could not confirm it. See the [original post](https://words.str4d.xyz/dagsync-graph-aware-zcash-wallets/).

${fig(dag, "A directed acyclic graph with five nodes, a to e, where arrows only point forward and never return to a node", 240)}

## Do 25-second blocks slow syncing?

NU7 cut the target block time from 75 to 25 seconds, so wallets see three times as many blocks. A community benchmark published for the 25-second proposal measured scan time in Zodl's Swift SDK (v0.18.1-beta) on an iPhone 17 simulator, using a mock lightwalletd with real mainnet transactions. With the same number of Orchard actions, tripling the block count added about 18 milliseconds (about 2%) to the scan time, and the author concluded that scan cost tracks the number of actions rather than the number of blocks. The author co-wrote the proposal, tested on a simulator and not real hardware, and did not measure download time, so treat it as a limited result ([HackMD](https://hackmd.io/@FK8-oLpkSJ6U-VQEemQY7A/HkqDYuy2bg)).

## Beyond faster scanning

Faster scanning still means the wallet touches a lot of data. Two lines of work try to avoid that.

- **Oblivious retrieval.** The Zcash Foundation has studied [Oblivious Message Retrieval (OMR)](https://zfnd.org/oblivious-message-retrieval/) to see whether it could solve the recent performance problems affecting wallet users. [Private information retrieval](/zcash-tech/private-information-retrieval) lets a wallet fetch an item without the server learning which one.
- **Moving payment details off chain.** [Project Tachyon](/zcash-tech/project-tachyon) is a proposal to stop using the blockchain to deliver payment secrets, so wallets would not need trial decryption at all. It is not live.

Zcash Security's post on [scalable private messaging](https://zecsec.com/posts/scalable-private-money-needs-scalable-private-messaging/) frames the same problem. Some wallets also download all memo data except what belongs to an address, which improves privacy at the cost of extra resources.

## Common mistakes

- **Assuming the server knows your balance.** It only delivers compact blocks. Your wallet decrypts and interprets them locally with your own keys.
- **Stopping sync too early.** Some methods make recent spendable funds available before the sync completes, but older history and notes may still be in progress.
- **Comparing Zcash sync with transparent-chain sync.** A slower path can be the cost of preserving privacy. The wallet does work that a public-coin server would do by reading your account openly.

## Common questions

<FaqItem q="Why does my wallet take so long to sync?">

The wallet has to try to decrypt shielded outputs itself, and the effort follows the size of the chain, not how many payments you received. A wallet that has been closed for a while has more to catch up on.

</FaqItem>

<FaqItem q="Does the server learn my balance when I sync?">

No. The server sends compact blocks and does not see which outputs decrypt for you. What a light wallet server can still observe is covered on the [Lightwallet Nodes](/zcash-tech/lightwallet-nodes) page.

</FaqItem>

<FaqItem q="Can I spend before the sync finishes?">

In wallets that scan non-linearly, yes, for notes the wallet has already found. Older history may still be loading.

</FaqItem>

<FaqItem q="Will syncing get faster?">

Several teams are working on it, and some publish benchmarks, but those figures are the projects' own. Approaches that avoid scanning altogether, such as oblivious retrieval and Tachyon, are research or proposals and are not live.

</FaqItem>

## Related pages

- [Lightwallet Nodes](/zcash-tech/lightwallet-nodes) - the lightwalletd infrastructure that light wallets rely on
- [Viewing Keys](/zcash-tech/viewing-keys) - the keys wallets use to detect and decrypt their own notes
- [Pepper Sync](/zcash-tech/pepper-sync) - Zingo's sync engine, with non-linear scanning
- [Private Information Retrieval](/zcash-tech/private-information-retrieval) - fetching data without revealing what you asked for
- [Project Tachyon](/zcash-tech/project-tachyon) - a proposal to remove trial decryption
- [FROST](/zcash-tech/frost) - distributed signing authority for shielded ZEC

## Resources

- [Slipstream on GitHub](https://github.com/zodl-inc/slipstream)
- [DAGSync: Graph-aware Zcash wallets](https://words.str4d.xyz/dagsync-graph-aware-zcash-wallets/)
- [Oblivious Message Retrieval](https://zfnd.org/oblivious-message-retrieval/)
- [Scalable private money needs scalable private messaging](https://zecsec.com/posts/scalable-private-money-needs-scalable-private-messaging/)
`;
}

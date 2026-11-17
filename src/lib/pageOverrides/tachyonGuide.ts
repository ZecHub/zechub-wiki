// Rewrite of the Project Tachyon page (checked 6 Nov 2026). Kept from the source: the problem statement (trial
// decryption), the two diagrams, the out-of-band / oblivious-sync explanation, the technical notes and the glossary.
// Changed: 11 <br/> spacers and the "Who is this for" list are gone; NU7 is now ACTIVE (CoinDesk, Nov 6, 2026: block
// 3,543,405, 25-second target blocks, fee split), so "not part of NU7" is stated as a fact about what NU7 contains;
// new section "What has happened since": Udon released into Zakura Common on Sept 28, 2026 (CoinDesk, Sept 29), with
// CoinDesk's own caveat that it does not show Tachyon's speed and that more development and a security review are
// needed; the long-term goal of more than 50,000 private payments per second (CoinDesk, Sept 29). The three-part plan
// (one recursive proof per block, nullifier set compression, private information retrieval) comes from a BigGo
// Finance summary of remarks by Sean Bowe and Dev Ojha, a secondary source, and is labelled that way.
// Not repeated here: dates for post-quantum work and throughput estimates, which only that secondary source gives.
// If the page no longer has this shape, the original markdown is returned untouched.
export function rewriteTachyonGuide(original: string): string {
  if (!/^# Project Tachyon\s*$/im.test(original)) return original;
  const edit = original.match(/<a href="https:\/\/github\.com[^>]*>[\s\S]*?<\/a>/)?.[0] ?? "";
  const src = (needle: string) => original.match(new RegExp("/content-images/" + needle + "[^\"')\\s]*"))?.[0];
  const today = src("tachyon-scanning-today");
  const oblivious = src("tachyon-oblivious-sync");
  if (!today || !oblivious) return original;

  const GLANCE = JSON.stringify([
    { label: "Status", text: "Proposal in development. Not activated, and not part of NU7 (active since Nov 6, 2026)" },
    { label: "Author", text: "Sean Bowe, first published April 2, 2025", href: "https://seanbowe.com/blog/tachyon-scaling-zcash-oblivious-synchronization/" },
    { label: "Goal", text: "Wallet sync that follows your activity, not the size of the chain" },
    { label: "Long-term target", text: "More than 50,000 private payments per second" },
  ]);

  return `${edit}

# Project Tachyon

<FaqGlance items='${GLANCE}' />

## TL;DR

- A shielded wallet today has to try to decrypt a large share of the blockchain to find its own payments. This is the main reason shielded syncing is slow.
- Tachyon replaces that with **oblivious synchronization**: the wallet fetches what it needs without scanning everything and without telling a server which parts it wanted.
- It also moves payment details out of the blockchain and into the payment request itself, which simplifies the protocol and gives wallets more responsibility.
- It is a proposal, not a shipped feature, and it needs an engineering effort on the scale of the Sapling upgrade.

## The problem Tachyon solves

Zcash hides who a payment is for. That is the whole point, and it creates an awkward problem: if nobody can tell who a payment belongs to, how does your own wallet find yours?

In Bitcoin this is easy. Addresses are public, so a wallet can ask a server "what was sent to this address?" and get an answer. A Zcash wallet cannot ask that question, because asking it would reveal exactly what the shielded pool is designed to hide.

So Zcash does something different. The sender encrypts the payment details and places them inside the transaction itself. Your wallet then works through the transactions on the chain and tries to decrypt each one. Almost every attempt fails, and the few that succeed are your payments. This is called **trial decryption**. It is private and correct, but slow.

![Today a Zcash wallet downloads every shielded transaction and tries to decrypt each one, with almost every attempt failing, to find the few payments that belong to it](${today})

The catch is what the work depends on. The effort your wallet spends is set by how big the chain is, not by how many payments you received. Someone who has never received a payment does nearly as much work as someone who receives them daily. As Zcash grows, that gets worse for everybody. In the words of the proposal, it "simply does not scale."

## What Tachyon changes

Tachyon attacks the problem at its root: it stops using the blockchain as the delivery channel for payment secrets.

Instead, the details you need travel with the payment request itself, out of band. A payment request, a URI or a QR code carries the information that used to be encrypted into the transaction. Sean Bowe describes this as embracing **out-of-band payments** for the first time in a Zcash shielded protocol. Once the chain no longer carries that information, your wallet has no reason to search it, and the trial decryption problem disappears.

Your wallet still needs to know the current chain state in order to spend. That is the second half of the design, **oblivious synchronization**: a way for a wallet to fetch the specific things it needs without revealing to the server which things it asked for.

![With Tachyon the sender passes payment details to the recipient out of band, and the wallet uses oblivious synchronization to retrieve only the data it needs instead of scanning the whole chain](${oblivious})

## What it would mean for someone using a wallet

- **Syncing stops growing with the chain.** The time your wallet spends catching up would track your own activity rather than the size of Zcash.
- **Payments work more like handing someone a bill.** The payment request carries what the recipient needs, so the exchange between sender and recipient matters more than it does today.
- **Wallets carry more responsibility.** Because the chain no longer holds an encrypted copy of your payment details, losing your wallet data matters more. Backup and recovery move from being a protocol feature to something wallet software has to get right.
- **Some familiar pieces move.** Tachyon takes key diversification, viewing keys and payment addresses out of the core protocol and leaves them to the wallet layer. This is one of the more consequential parts of the proposal and is still being worked through.

## What has happened since the proposal

| Date | Event |
|---|---|
| April 2, 2025 | Sean Bowe publishes the proposal, [Tachyon: Scaling Zcash with Oblivious Synchronization](https://seanbowe.com/blog/tachyon-scaling-zcash-oblivious-synchronization/) |
| May 15, 2025 | A follow-up, [Tachyaction at a Distance](https://seanbowe.com/blog/tachyaction-at-a-distance/), works through consensus and protocol implications |
| July 2026 | [Zakura](/zcash-tech/zakura-node), a full node built jointly by the Tachyon team and the Valar Group, is released |
| September 17, 2026 | The scope agreed for NU7 does not include Tachyon ([ZIP 259](https://zips.z.cash/zip-0259)) |
| September 28, 2026 | Udon, a component first developed for Tachyon, is released into Zakura Common, a shared cryptography library ([CoinDesk](https://www.coindesk.com/tech/2026/09/29/zcash-s-faster-private-payment-code-is-being-rebuilt-for-its-bigger-scaling-plan)) |
| November 6, 2026 | NU7 activates at block 3,543,405 with 25-second target blocks, without a new transaction format ([CoinDesk](https://www.coindesk.com/tech/2026/11/06/zcash-s-landmark-nu7-upgrade-goes-live-speeding-up-private-payments)) |

CoinDesk's report on the Udon release is careful about its limits: it says Udon does not demonstrate Tachyon's speed, and that the upgrade still needs further development and a security review before it could be considered for activation. The same report gives the long-term goal set by Sean Bowe and Dev Ojha as more than 50,000 private payments per second.

According to a summary by BigGo Finance of remarks by Bowe and Ojha, a secondary source, the plan has three parts: recursive proofs so that a node checks one proof per block instead of one per shielded transaction, compression of the nullifier set, and private information retrieval so wallets can find their payments without revealing which ones. Treat this as a description of intent, not a specification.

## A closer look for technical readers

Tachyon is described as a reverse-compatible change to the Orchard protocol. It could be deployed either as an upgrade to the existing Orchard pool or as a separate shielded pool reached through a [turnstile](/zcash-tech/the-turnstile), the same mechanism Zcash used for Ironwood. The choice affects deployment, not the design.

It keeps several things from Orchard: RedPallas key re-randomization, homomorphic value commitments and binding signatures, and the partitioned key structure that lets a device delegate proving without handing over spend authority.

The scaling work leans on **proof-carrying data**, a technique in which data travels alongside a proof of its own correctness, so that combining it with other proof-carrying data produces something that inherits and extends those proofs. This is what allows a large amount of verified work to be compressed into something small and quick to check. Halo, discovered by the team behind Zcash, is what made proof-carrying data practical enough to build on.

The third strand is **shielded transaction aggregates**, which changes how shielded state changes are communicated and has knock-on effects on how signing works.

## Where the work stands

Tachyon is a **proposal, not a shipped feature**. It was named as a candidate for NU7, but NU7 is now active and contains something different: 25-second target blocks, a new split of transaction fees, and the end of version 4 transactions. No activation date has been set for Tachyon, and the proposal's author describes it as an actionable plan that needs an engineering effort comparable to Sapling, with some harder questions deliberately left for later.

Related work is already visible. [Zakura](/zcash-tech/zakura-node) previews some of the network-level changes, and [private information retrieval](/zcash-tech/private-information-retrieval) research aims at the same scanning bottleneck from a different angle.

## Common misconceptions

- **Tachyon is not live.** No wallet uses it today, and no upgrade has activated it.
- **Tachyon is not in NU7.** NU7 activated on November 6, 2026 without it. It covers shorter blocks, fee recycling and the end of version 4 transactions.
- **Tachyon is not the same as Ironwood.** Ironwood activated in July 2026 and dealt with the Orchard pool and the turnstile. Tachyon is a separate, later proposal about scaling.
- **Tachyon is not a privacy reduction.** The goal is to keep ledger indistinguishability while removing the scaling cost, not to trade privacy for speed.
- **zk-SNARK verification was never the bottleneck.** The proposal is explicit that the slow part is how wallets discover and coordinate state, not the cost of checking proofs.
- **Udon is not Tachyon.** It is one component built for Tachyon and released early inside shared software. It does not activate anything on the network.

## Glossary

| Term | Meaning |
|---|---|
| Trial decryption | Attempting to decrypt transactions one by one to find the ones addressed to you |
| In-band secret distribution | Putting the payment secret inside the transaction on the blockchain, as Zcash does today |
| Out-of-band payment | Passing the payment details directly between sender and recipient instead of through the chain |
| Oblivious synchronization | Fetching the chain data a wallet needs without revealing which data was requested |
| Proof-carrying data (PCD) | Data that travels with a proof of its own correctness, so proofs can be combined and compressed |
| Shielded transaction aggregate | Tachyon's way of bundling shielded state changes, changing how they are communicated and signed |
| Ledger indistinguishability | The property that shielded transactions cannot be told apart from one another |

## FAQ

<FaqItem q="Will this make my wallet sync faster?">
That is the goal. Syncing time would follow your own activity instead of the size of the chain. Nothing has shipped, so there is no measured figure to quote yet.
</FaqItem>

<FaqItem q="Do I need to do anything now?">
No. Tachyon is a proposal. If it is adopted, it would arrive through a network upgrade with the usual notice.
</FaqItem>

<FaqItem q="Does removing viewing keys mean losing the ability to share read access?">
The proposal moves that capability out of the core protocol and into the wallet layer. What that looks like in practice is one of the open questions.
</FaqItem>

<FaqItem q="Is my money at risk if Tachyon ships?">
Deployment would use either an Orchard upgrade or a turnstile, both designed so that value moves under public accounting rules. The [Ironwood](/zcash-tech/ironwood) page explains how a turnstile is used.
</FaqItem>

## Related pages

- [Private Information Retrieval](/zcash-tech/private-information-retrieval) - another approach to the same wallet scanning bottleneck
- [Zakura Node](/zcash-tech/zakura-node) - a node built jointly by the Tachyon team and the Valar Group
- [Ironwood](/zcash-tech/ironwood) - the upgrade that activated in July 2026, often confused with Tachyon
- [The Turnstile](/zcash-tech/the-turnstile) - the mechanism Tachyon could use if deployed as its own pool
- [Post-Quantum Security](/zcash-tech/post-quantum-security) - longer-term protocol work
- [How Zcash Is Organized](/start-here/how-zcash-is-organized) - who is doing this work and how the ecosystem fits together

## Resources

- [Tachyon: Scaling Zcash with Oblivious Synchronization](https://seanbowe.com/blog/tachyon-scaling-zcash-oblivious-synchronization/) - Sean Bowe, April 2, 2025, the original proposal
- [Tachyaction at a Distance](https://seanbowe.com/blog/tachyaction-at-a-distance/) - Sean Bowe, May 15, 2025, consensus and protocol implications
- [Sean Bowe's blog](https://seanbowe.com/blog/) - where the Tachyon series is published
- [tachyon.z.cash](https://tachyon.z.cash/) - project site
- [CoinDesk, September 29, 2026](https://www.coindesk.com/tech/2026/09/29/zcash-s-faster-private-payment-code-is-being-rebuilt-for-its-bigger-scaling-plan) - Udon released into Zakura Common
- [CoinDesk, November 6, 2026](https://www.coindesk.com/tech/2026/11/06/zcash-s-landmark-nu7-upgrade-goes-live-speeding-up-private-payments) - NU7 goes live
`;
}

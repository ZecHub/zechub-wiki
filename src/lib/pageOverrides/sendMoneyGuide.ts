// Editorial rewrite of the "Send Money Without Linking Your Identity" guide. The wiki content lives
// in the external ZecHub/zechub repo, so the text is restructured here. If the source no longer
// looks like the guide this was written for, the original markdown is returned untouched.
export function rewriteSendMoneyGuide(original: string): string {
  if (!/send money without linking/i.test(original)) return original;

  return `# Send Money Without Linking Your Identity

<span>Intermediate - 7 min</span>

Send ZEC without leaving a public trail that connects the payment to you. On most blockchains, a payment reveals your wallet, your history and who you deal with, which builds a traceable financial graph. Shielded Zcash payments break that link. This guide is for anyone sending sensitive payments, including people who face surveillance risk.

## Why shielded sending breaks the link

A transparent payment publishes the sender, the receiver and the amount, so anyone can follow your address from one payment to the next. A shielded payment hides all three, and an observer of the chain cannot connect it to your other activity.

Privacy on the chain still depends on how you behave. Timing, reused addresses and public posts can link you even when the payment itself is hidden.

## What You Need

- A wallet that supports shielded transactions and unified addresses. See the [wallet directory](/wallets).
- The recipient's unified address, ideally one with a shielded receiver.

## How to send

### Step 1: Check where your funds are

Open your wallet and look at your balances. If your ZEC sits in a transparent address, shield it first. Moving funds into the shielded pool is visible on the transparent side, so do it once and in a single transaction, not in a pattern that others can recognize.

### Step 2: Send shielded to shielded

Send from your shielded balance to the recipient's shielded address. Nothing about the payment is public. If the recipient only gives you a transparent address, the amount and that address become public, so ask for a shielded one. If your ZEC is split across pools and the payment has to cross between them, the amount can also become public, as [the turnstile](/zcash-tech/the-turnstile) explains.

### Step 3: Do not link your identity

- Do not announce or confirm payments in public.
- Do not reuse one address across different people or contexts.
- Do not connect your addresses to your name or accounts.

### Step 4: Watch timing and patterns

Observers can learn from metadata even when amounts are hidden. Avoid sending immediately after receiving a large payment, and avoid regular schedules or round amounts that make you recognizable.

### Step 5: Mind the network layer

The chain does not show your IP address, but your wallet's server connection can. If this matters to you, connect through Tor or a trusted VPN, and remember that an exchange knows what you deposit and withdraw.

## Common Mistakes to Avoid

- **Sending from a transparent address.** The sender, receiver and amount become public.
- **Reusing addresses across people.** It ties separate relationships together.
- **Confirming payments publicly.** A single post can connect you to a transaction.
- **Ignoring metadata.** Timing, frequency and amounts can identify you.

## Related

- [What a Block Explorer Can See](/zcash-tech/what-a-block-explorer-can-see)
- [The Turnstile](/zcash-tech/the-turnstile)
- [Receive Donations Privately](/zcash-use-cases/receive-donations-privately)

## Progress

**Step 2 of 8**

You can now send funds privately without exposing your identity.

## Next Step

- [Freelancer Privacy Setup](/zcash-use-cases/freelance-privacy-setup)
`;
}

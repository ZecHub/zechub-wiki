// Editorial rewrite of the "Journalist Privacy Setup with Zcash" guide. The wiki content lives in
// the external ZecHub/zechub repo, so the text is restructured here. If the source no longer looks
// like the guide this was written for, the original markdown is returned untouched.
export function rewriteJournalistGuide(original: string): string {
  if (!/journalist privacy setup/i.test(original)) return original;

  return `# Journalist Privacy Setup with Zcash

<span>Intermediate - 8 min</span>

Make and receive payments for sensitive work without leaving a public record of who paid whom, when and how much. This guide is for journalists, investigators, activists and anyone else whose payments could expose a source or a project.

> Shielded Zcash hides payment details on the blockchain. It does not hide who you are on the network, what an exchange knows about you or what is on your device. Read the limits below before you rely on it.

## Why transparent crypto is risky for sensitive work

On a transparent blockchain, anyone who learns one of your addresses can follow the money: who paid you, who you paid, when and how much. For a journalist this can point an adversary toward a source, a freelancer or a client. Shielded Zcash payments encrypt the sender, the receiver and the amount, so an observer of the chain learns none of that.

## What shielding does not protect

- **Your network location.** Your wallet connects to a server to sync, which can see your IP address. Consider routing your wallet through Tor or a trusted VPN.
- **Your exchange account.** An exchange that verifies your identity knows when you withdraw or deposit ZEC, and in what amount.
- **Your device.** Anyone with your unlocked phone or computer, or your recovery phrase, can see your wallet.
- **What you say off-chain.** Posting about a payment, or confirming it publicly, links you to it.

## What You Need

- A wallet that supports shielded Zcash. See the [wallet directory](/wallets).
- A secure communication channel outside the blockchain, such as an end-to-end encrypted messenger.
- A device protected with a strong passcode and an encrypted backup of your recovery phrase.

## How to set up

### Step 1: Use a dedicated wallet

Keep a wallet for sensitive work only. Do not mix it with personal spending, and do not move funds between it and wallets tied to your name.

### Step 2: Transact only at shielded addresses

Use a unified address with a shielded receiver and send shielded to shielded. A transparent transaction on either side puts the amount on the public chain.

### Step 3: Pay sources with care

- Send from your shielded balance to the source's shielded address.
- Use a new address for each person so one payment cannot be tied to another.
- Avoid regular schedules and amounts that could be recognized later.

### Step 4: Keep memos neutral

Memos are encrypted, but anyone who has the recipient's wallet or viewing key can read them. Never put names, locations or sensitive details in a memo. Use a neutral reference if you need one.

### Step 5: Practice good operational security

- Keep your identity out of the wallet: no name, email or handle linked to the address.
- Do not confirm or discuss payments in public.
- Agree on payment details through your secure channel, not through the blockchain.
- Back up your recovery phrase offline and keep it away from your devices.

## Common Mistakes to Avoid

- **Using transparent addresses.** Amounts and history become public.
- **Reusing one address for several sources.** It ties those payments together.
- **Putting sensitive data in memos.** They can be read by anyone with access to the wallet.
- **Linking the wallet to your public identity.** A single public post can undo your privacy.
- **Funding the wallet straight from a verified exchange.** The exchange can see where the money went.

## Related

- [Who can see your Zcash payment](/start-here/who-can-see-your-zcash-payment)
- [Send Money Without Linking Identity](/zcash-use-cases/send-money-without-linking-identity)
- [Wallets](/wallets)

## Progress

**Step 8 of 8**

You have completed the recommended path and know how to use Zcash privately in real situations.

## Next Step

- [Explore all use cases](/zcash-use-cases/about)
`;
}

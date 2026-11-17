// Editorial rewrite of the "Freelancer Privacy Setup with Zcash" guide. The wiki content lives in
// the external ZecHub/zechub repo, so the text is restructured here. If the source no longer looks
// like the guide this was written for, the original markdown is returned untouched.
export function rewriteFreelancerGuide(original: string): string {
  if (!/freelancer privacy setup/i.test(original)) return original;

  return `# Freelancer Privacy Setup with Zcash

<span>Beginner - 6 min</span>

Get paid in ZEC without publishing your income, your client list or your payment history. On a transparent blockchain, anyone who learns your address can see all three. With shielded payments, only you and the person paying see the details.

This guide is for freelancers, contractors and remote workers who are paid in crypto and want to keep their finances private.

## Why privacy matters when you invoice in crypto

A public address works like an open ledger. A client, a competitor or a stranger can read what you earn, which clients pay you and how often. That weakens your position when you negotiate rates, and it ties your professional life to your wallet history.

Shielded Zcash payments hide the sender, the receiver and the amount, so each client sees only the payment they made.

## What You Need

- A wallet that supports shielded Zcash and memos. See the [wallet directory](/wallets).
- A basic understanding of shielded and unified addresses. The [address guide](/using-zcash/unified-addresses) covers it.

## How to get paid

### Step 1: Create a shielded receiving address

Generate a unified address that includes a shielded receiver. If your wallet can create several addresses from the same account, make one for each client.

### Step 2: Share it privately

Send the address to your client in your invoice or in a direct message. Do not post it on your portfolio, your social profiles or a public chat, because it would then be linked to your name.

### Step 3: Agree on the amount

ZEC changes in price, so settle the amount before you invoice. Agree on a price in your usual currency, state the ZEC amount it converts to on the invoice date, and say which rate you used.

### Step 4: Track payments with memos

Ask the client to put the invoice number in the memo. The memo is encrypted, so only you and the client can read it. Memos are optional for the sender, so also match payments by client address and amount.

### Step 5: Keep clients separate

Use a different address for each client. If some clients must not be linked to each other, give them separate wallets. This keeps the clients unaware of each other and keeps your records tidy.

### Step 6: Keep your records

Payments you receive are generally income, and you may owe tax on them in your country. Keep each payment's date, ZEC amount and value at that time. A viewing key gives your accountant read-only access to your incoming payments and cannot spend your funds. See [Keeping records with shielded ZEC](/zcash-use-cases/keeping-records-with-shielded-zec) for how to set it up.

## Common Mistakes to Avoid

- **Receiving at a transparent address.** Amounts and history become public.
- **Using one address for every client.** It links your clients together and makes payments harder to tell apart.
- **Publishing your address next to your name.** Anyone could then connect you with it.
- **Skipping the invoice reference.** Without it, payments are hard to match to work you delivered.
- **Forgetting your records.** Private does not mean untracked; you still need clean books.

## Related

- [Wallets](/wallets)
- [Keeping records with shielded ZEC](/zcash-use-cases/keeping-records-with-shielded-zec)
- [Who can see your Zcash payment](/start-here/who-can-see-your-zcash-payment)

## Progress

**Step 3 of 8**

You now know how to receive income privately.

## Next Step

- [Accept Payments as a Merchant](/zcash-use-cases/accept-payments-as-a-merchant)
`;
}

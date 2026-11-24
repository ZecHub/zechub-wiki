// Editorial rewrite of the "Accept Payments as a Merchant" guide. The wiki content lives in the
// external ZecHub/zechub repo, so the text is restructured here. If the source no longer looks
// like the guide this was written for, the original markdown is returned untouched.
export function rewriteMerchantGuide(original: string): string {
  if (!/accept payments as a merchant/i.test(original)) return original;

  return `# Accept Payments as a Merchant with Zcash

<span>Beginner - 5 min</span>

Take ZEC at your shop without publishing your revenue, your customers' purchases or your order history. On a transparent blockchain anyone can read all three. A shielded Zcash payment shows nothing about who paid, who received or how much, so your books stay your own.

This guide is for online shops, service providers and small businesses that want to accept crypto without exposing their business to the public.

## Why shielded payments suit merchants

Public blockchains turn every sale into public information. Anyone who learns your payment address can follow your revenue, your busiest days and your repeat customers, and can link a customer's purchase to the rest of their wallet history.

Shielded Zcash payments encrypt the sender, the receiver and the amount. Customers keep their purchases private, and competitors cannot read your income from the chain.

## What You Need

- A wallet that supports shielded Zcash and unified addresses. See the [wallet directory](/wallets).
- A way to show payment details: a manual process for a handful of orders, or a payment processor for a busy shop.
- A simple way to match each payment to an order.

## How to take payments

### Step 1: Choose your payment flow

For a few orders a week, a wallet is enough. For an online shop, use a processor that creates the invoice and checks the payment for you. The [BTCPay Server Zcash plugin](/guides/btcpayserver-zcash-plugin) and the [payment processors](/payment-processors) listed on the wiki both support shielded payments.

### Step 2: Create a shielded receiving address

Generate a unified address that includes a shielded receiver, and keep it away from transparent addresses. If your wallet can create a fresh address for each order, use that. Every order then has its own address, and you can tell payments apart without extra tools.

### Step 3: Show clear payment instructions

For each order, give the customer:

- The address, as text and as a QR code
- The exact amount in ZEC, with a note on how long the quoted price is valid
- An order reference, if you want them to add a memo

### Step 4: Match payments to orders

Use one of these methods, in order of reliability:

- A separate address for each order
- A unique amount for each order
- A memo that carries the order ID, for example Order #4821

Senders are not required to add a memo, so do not rely on memos alone.

### Step 5: Confirm the payment

Watch your wallet or processor for the incoming shielded payment and match it to the order. Zcash produces a block about every 75 seconds. Decide how many confirmations you need before shipping, and ask for more on higher-value orders.

### Step 6: Keep your books

You do not need to expose your ledger to run your accounts. A viewing key gives an accountant read-only access to incoming payments and cannot spend your funds. The [record keeping guide](/zcash-use-cases/keeping-records-with-shielded-zec) explains how to set this up.

## Common Mistakes to Avoid

- **Accepting payments at a transparent address.** Amounts and history become public.
- **Posting transaction IDs or payment proofs in public.** A shared proof can tie a customer to a specific payment.
- **Linking customer identity to on-chain data.** Keep order details in your own system, not in public posts.
- **Relying on memos alone.** Customers can forget them, so pair them with per-order addresses or amounts.
- **Sending shielded revenue to transparent addresses.** It exposes the amount when the funds move.

## Related

- [Wallets](/wallets)
- [Payment processors](/payment-processors)
- [Who can see your Zcash payment](/start-here/who-can-see-your-zcash-payment)

## Progress

**Step 4 of 8**

You can now run private payment flows for your business.

## Next Step

- [Run a Private Community Treasury](/zcash-use-cases/private-community-treasury)
`;
}

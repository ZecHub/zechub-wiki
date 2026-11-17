// Transactions (using-zcash/transactions). The source page is already detailed and accurate, so this keeps it and
// edits around it: a table of the four payment types and what each one reveals (the clearest way to explain
// shielding and deshielding), a short step list for sending a shielded payment, a corrected description of what a
// shielded transaction is (the source said it "occurs when you move ZEC into your shielded wallet", which describes
// shielding only), and "current" wording removed. Every replacement is optional: if the text it targets has changed
// upstream, that edit is skipped and the page still renders.

const TYPES = `## Four Kinds of Payment

Every Zcash payment falls into one of four types. What anyone watching the chain can see depends on which one you send.

| Type | Route | Visible on-chain |
| --- | --- | --- |
| Shielded | Shielded to shielded | Nothing about sender, receiver or amount |
| Shielding | Transparent to shielded | Sender and amount |
| Deshielding | Shielded to transparent | Receiver and amount |
| Transparent | Transparent to transparent | Sender, receiver and amount |

The amount is visible whenever funds cross between the transparent and shielded sides, because the network has to account for the value entering or leaving the shielded pool. Memos exist only in payments that reach a shielded address, and they are encrypted.

`;

const STEPS = `## Sending a Shielded Payment

The exact screens differ by wallet, but the steps are the same:

1. **Check that your wallet is synced** and up to date.
2. **Paste or scan the recipient's address.** A unified or shielded address keeps the payment private. A transparent address makes it a deshielding payment.
3. **Enter the amount** and, if you want, an encrypted memo.
4. **Review the fee.** The wallet picks it for you.
5. **Send**, then watch the status until the transaction is confirmed.

For a first payment, send a small amount and confirm that it arrived before you send more.

`;

function swap(text: string, from: string, to: string): string {
  return text.includes(from) ? text.replace(from, to) : text;
}

export function rewriteTransactionsGuide(original: string): string {
  if (!/^# Transactions\s*$/m.test(original)) return original;
  let t = original;
  t = swap(t, "## Shielded Transactions\n", TYPES + "## Shielded Transactions\n");
  t = swap(
    t,
    "Shielded transactions occur when you move ZEC into your shielded wallet. Your shielded wallet address starts with a `u` or `z`.",
    "A shielded transaction moves ZEC between shielded addresses. Shielded addresses start with `u` (unified) or `z` (Sapling)."
  );
  t = swap(
    t,
    "Sending a shielded transaction is easiest when you use a wallet that supports the current Zcash network and current shielded pools.",
    "Sending a shielded transaction is easiest when you use a wallet that supports the shielded pools you plan to use."
  );
  t = swap(t, "In most current wallets, users", "In most wallets, users");
  t = swap(t, "## A Simple Way to Picture It", "## A Simple Way to Picture It");
  t = swap(t, "## Zcash Fees\n", STEPS + "## Zcash Fees\n");
  return t;
}

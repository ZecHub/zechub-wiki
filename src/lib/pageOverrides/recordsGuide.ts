// Editorial rewrite of the "Keeping records with shielded ZEC" guide. The wiki content lives in the
// external ZecHub/zechub repo, so the text is restructured here. If the source no longer looks
// like the guide this was written for, the original markdown is returned untouched.
export function rewriteRecordsGuide(original: string): string {
  if (!/keeping records with shielded zec/i.test(original)) return original;

  return `# Keeping records with shielded ZEC

<span>Beginner - 6 min</span>

Shielded ZEC is private to the public, not to you. Your wallet can show your complete history, and a viewing key lets you share it with an accountant on your own terms. You can keep clean books and report your income without making a single transaction public.

This guide is for freelancers and small businesses paid in ZEC, and for anyone who needs to prepare records for an accountant or for tax.

## What You Need

- A wallet that shows your full transaction history and memos. See the [wallet directory](/wallets).
- A spreadsheet or accounting tool to hold your ledger.
- A habit of adding a clear [memo](/using-zcash/memos) to the payments you can label.

## How to keep your records

### Step 1: Agree on a memo format

A shielded transaction can carry an encrypted memo. Use it as a line item in your ledger: an invoice number, a project code or a short note such as March rent. Agree on the format with your clients, for example the invoice number alone, so matching payments to invoices is simple later. Keep memos free of sensitive details, because anyone with access to the wallet or a viewing key can read them.

### Step 2: Separate clients and purposes

Use a different address for each client or purpose. It keeps each payment stream apart in your history, so you do not have to untangle them at year end.

### Step 3: Review your history regularly

Your wallet holds the keys that decrypt your shielded transactions, so it can show every payment with its date, amount, direction and memo. Review it every month, not only at year end, so mistakes are caught while you still remember the context.

### Step 4: Record each payment in your books

For each payment, note:

- The date and time
- The amount in ZEC
- The value in your own currency at that time, and the price source you used
- The memo or invoice reference
- The transaction ID

### Step 5: Total by period

Add up what you received and sent for any span you need: a month, a quarter or a year. Consistent memos let you group payments by purpose, not only by date and amount.

### Step 6: Share with your accountant using a viewing key

When someone else must see your activity, share a [viewing key](/zcash-tech/viewing-keys). A full viewing key is read-only: it shows incoming and outgoing transactions for the account, with amounts and memos, but it cannot move your funds. This is called selective disclosure. Your accountant sees what they need, your money stays under your control and the public still sees nothing. Never share your spending key or recovery phrase.

## A note on tax

Tax rules differ by country and change over time, so this is general information, not tax advice. In many places, receiving or disposing of crypto can have tax consequences, and you may be expected to keep a record of what you received, when and what it was worth then. Shielded Zcash does not stop you from meeting those duties: you can keep complete private records, total them for the period your authority requires and disclose them with a viewing key. If you are unsure what applies to you, speak to a qualified professional in your country.

## Common Mistakes to Avoid

- **Skipping memos.** You end up with amounts and no context at year end.
- **Reusing one address for everything.** It makes clients and purposes harder to separate.
- **Waiting for tax season.** Reviewing a whole year at once is slow and error-prone.
- **Sharing a spending key.** A read-only viewing key is all an accountant needs.

## Related

- [Memos](/using-zcash/memos): how encrypted memos work
- [Viewing Keys](/zcash-tech/viewing-keys): how to export and share read-only access
- [Freelancer Privacy Setup](/zcash-use-cases/freelance-privacy-setup): receiving income privately, the step before keeping records
`;
}

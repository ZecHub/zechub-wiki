// Editorial rewrite of the "Run a Private Community Treasury with Zcash" guide. The wiki content
// lives in the external ZecHub/zechub repo, so the text is restructured here. If the source no
// longer looks like the guide this was written for, the original markdown is returned untouched.
export function rewriteTreasuryGuide(original: string): string {
  if (!/private community treasury/i.test(original)) return original;

  return `# Run a Private Community Treasury with Zcash

<span>Intermediate - 7 min</span>

Hold and spend shared funds without publishing your balance, your spending history or who is on the team. This guide is for DAOs, grant programs, open-source teams and other groups that manage money together.

## Why a public treasury is a risk

On a transparent blockchain, anyone can read a treasury's balance, every payment it makes and often the people behind it. That invites targeting of the funds, puts pressure on decisions that should be made internally and gives away your strategy to anyone watching.

A shielded treasury keeps the balance, the payments and the counterparties private, while members can still hold the group accountable through records that you choose to share.

## What You Need

- A wallet that supports shielded Zcash, ideally one with threshold or multisig signing so no single person controls the funds. See the [wallet directory](/wallets).
- Clear internal rules for who can request, approve and send payments.
- A shared place for the treasury's records, such as a spreadsheet kept by the group.

## How to set it up

### Step 1: Decide who controls the funds

One person holding the only key is a single point of failure, for loss and for pressure. For shared funds, prefer a wallet that lets several people approve a payment, such as wallets with FROST multisig support. If you start with a single treasurer, write that down and plan to move to shared control.

### Step 2: Create the treasury address

Create a dedicated wallet and generate a unified address with a shielded receiver. Store the recovery phrase offline, and make sure at least two trusted members know where it is.

### Step 3: Define roles

Separate responsibilities:

- **Treasurer:** controls the funds and sends approved payments
- **Contributors:** request spending
- **Reviewers:** approve requests inside the group

Keep these roles tied to pseudonyms or internal names, not to public identities.

### Step 4: Receive funds privately

Publish the shielded address and ask contributors to send from shielded wallets. A contributor who sends from a transparent address exposes their own side of the payment.

### Step 5: Track every movement internally

Use memos and an off-chain log together. A memo such as Grant #12 - Developer payment ties each payment to a decision. Reconcile the wallet against your log every month.

### Step 6: Pay privately

After a payment is approved, send it from the shielded balance to the recipient's shielded address. Do not announce amounts or recipients in public channels.

### Step 7: Report to members without exposing the treasury

Share periodic summaries of income and spending. If members or auditors need to verify the numbers, give them a [viewing key](/zcash-tech/viewing-keys), which shows activity but cannot spend funds.

## Common Mistakes to Avoid

- **Using a transparent address for the treasury.** Balance and history become public.
- **Publishing the balance or the address next to a team member's name.** It ties the treasury to individuals.
- **Giving one person the only key.** Loss, pressure or a dispute can freeze the funds.
- **Skipping the internal log.** Private does not mean untracked.

## Related

- [Who can see your Zcash payment](/start-here/who-can-see-your-zcash-payment)
- [Send Money Without Linking Identity](/zcash-use-cases/send-money-without-linking-identity)
- [Keeping records with shielded ZEC](/zcash-use-cases/keeping-records-with-shielded-zec)

## Progress

**Step 5 of 8**

You understand how to manage shared funds privately.

## Next Step

- [Accept Private Donations as a US Nonprofit](/zcash-use-cases/accept-private-donations-as-a-us-nonprofit)
`;
}

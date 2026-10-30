// Editorial rewrite of the "Receive Donations Privately with Zcash" guide. The wiki content lives
// in the external ZecHub/zechub repo, so the text is restructured here. If the source no longer
// looks like the guide this was written for, the original markdown is returned untouched.
export function rewriteDonationsGuide(original: string): string {
  if (!/receive donations privately/i.test(original)) return original;

  return `# Receive Donations Privately with Zcash

<span>Beginner - 5 min</span>

Accept donations without publishing your balance, your supporters or your history. On most blockchains anyone who sees your address can read all three. A shielded Zcash address keeps them private. This guide is for creators, open-source contributors, communities and anyone raising support online.

## Why shielded donations

A public donation address exposes your balance, who sent you money and every payment you have ever received. That puts your supporters in public view and invites surveillance or targeting.

Shielded Zcash transactions hide the sender, the receiver and the amount, so you can receive support without exposing your financial graph.

## What You Need

- A wallet that supports shielded addresses, such as Zodl or Zingo!. See the [wallet directory](/wallets) for more.

## How to receive donations

### Step 1: Create a shielded address

Open your wallet and create a unified address with a shielded receiver. Unified addresses start with \`u1\`. Older shielded addresses starting with \`zs\` still work, but new wallets use unified addresses.

### Step 2: Publish only the shielded address

Put it on your website, your social profiles and your donation page, as text and as a QR code. Never publish a transparent address, which starts with \`t1\` or \`t3\`. Transparent addresses show every payment you receive.

### Step 3: Tell donors how to send

Ask supporters to send from a shielded wallet. A donor who sends from a transparent address exposes their own address and the amount, even though your balance stays private. If you can, add a short note on your page, because some exchanges only withdraw ZEC to transparent addresses.

### Step 4: Invite an optional memo

Donors can attach an encrypted memo to a shielded payment, for example a name or message. Mention that this is optional and that only you can read it.

### Step 5: Keep your address separate from your identity

Do not post the address next to personal details that you want to keep apart. Use a separate address for unrelated projects or communities, so one set of donors cannot be linked to another.

## Common Mistakes to Avoid

- **Sharing a transparent address.** All your incoming payments become public.
- **Posting the address next to your personal identity.** It lets anyone link you to the wallet.
- **Reusing one address for unrelated causes.** It ties those audiences together.
- **Ignoring transparent senders.** Their side of the payment is public, so tell donors how to send shielded.

## Related

- [What a Block Explorer Can See](/zcash-tech/what-a-block-explorer-can-see)
- [Wallets](/wallets)
- [Accept Private Donations as a US Nonprofit](/zcash-use-cases/accept-private-donations-as-a-us-nonprofit)

## Progress

**Step 1 of 8**

You have learned how to receive funds privately.

## Next Step

- [Send Money Without Linking Identity](/zcash-use-cases/send-money-without-linking-identity)
`;
}

// Editorial rewrite of "Zcash Tools for Creators". Changes: the broken Zcash.me logo is dropped, the
// inline Table of Contents and TL;DR go (the page is short and the site already shows "On this page"),
// the two tools are compared side by side, and the unverifiable "Coming Soon" roadmap is removed.
// Both sites were checked live in Nov 2026. If the source no longer has this shape, it is returned untouched.
export function rewriteCreatorsTipsGuide(original: string): string {
  if (!/^# Zcash Tools for Creators/im.test(original)) return original;
  if (!/### Zcash\.me/.test(original) || !/### TIPZ/.test(original)) return original;

  const fm = original.match(/^---\n[\s\S]*?\n---\n/)?.[0] ?? "";
  const edit = original.match(/<a href="https:\/\/github\.com[^>]*>[\s\S]*?<\/a>/)?.[0] ?? "";
  const related = original.match(/## Related Pages\n[\s\S]*?(?=\n\*\*Last updated|$)/)?.[0]?.trim();
  if (!related) return original;

  return `${fm}
${edit}

# Zcash Tools for Creators

Two community tools let creators get paid in ZEC without exposing their income. Zcash.me publishes a profile with your address, and TIPZ lets fans tip in other cryptocurrencies while you receive shielded ZEC. Both are third-party projects, so check the sites yourself before sending funds.

## At a glance

| | Zcash.me | TIPZ |
|---|---|---|
| **What it is** | Directory of verified Zcash profiles | Private tipping link |
| **Website** | [zcash.me](https://zcash.me/) | [tipz.cash](https://tipz.cash/) |
| **X account** | [@zcashme](https://x.com/zcashme) | [@tipz_cash](https://x.com/tipz_cash) |
| **Your link** | \`zcash.me/[username]\` | \`tipz.cash/@[username]\` |
| **Who pays** | Sender uses their own wallet and sends ZEC | Fan pays in ETH, USDC, USDT or SOL, converted to ZEC |
| **Platform fee** | None listed | 0% platform fee |

## Zcash.me

Zcash.me is a profile directory, a "Linktree for Zcash". Each profile shows a name, a short bio, social links and a copyable unified address, with a verified badge for confirmed accounts.

### Set up a profile

1. Open [zcash.me](https://zcash.me/) and choose **Join**.
2. Pick a username and add a bio and profile picture.
3. Paste your unified address (\`u1...\`). Use a shielded receiver so payments stay private.
4. Link your X account and other profiles to earn the verified badge.
5. Share your link, \`zcash.me/[yourusername]\`.

## TIPZ

TIPZ is a private tipping protocol for creators. Fans open your link, pick an amount and optionally add an encrypted note. They can pay in ETH, USDC, USDT or SOL, and the payment is routed and converted so that you receive shielded ZEC.

| Fan pays with | Network |
|---|---|
| ETH | Ethereum |
| USDC, USDT | Multiple chains |
| SOL | Solana |
| ZEC | Zcash directly |

What the project advertises:

- **No platform fee**, and tips are non-custodial, so funds go to your own wallet.
- **Shielded delivery**, so your balance and income are not visible on-chain.
- **Private notes** that travel with the tip.
- **No KYC** and no account that can be suspended.

Conversion happens at market rates and settlement takes a few minutes, according to the site. Network and bridge costs may still apply to the fan.

## How tips flow

A tip jar on a café counter is glass: everyone sees who dropped in a coin and how full it is. A shielded address is a locked mailbox with a slot. Fans drop in a coin and a note, and only the owner opens the box. TIPZ adds a currency exchange at the door, so a fan can arrive with ETH or SOL and what lands in the mailbox is ZEC.

\`\`\`
Fan (ETH / USDC / USDT / SOL)  ->  TIPZ routing and conversion  ->  Your shielded ZEC address
\`\`\`

${related}
`;
}

// New User Guide: rebuilt as a step-by-step onboarding path. It has a TL;DR, a "path at a glance" table, five numbered
// steps, a seed phrase and safety section, a shielded-vs-transparent explainer, common mistakes and next steps.
// The TL;DR no longer names exchanges (the list changes) and the Zashi video is labeled with its new name, ZODL.
// The three tutorial videos and the Ledger article link are kept, and the image marker that the MDX image component
// swaps for the native RecommendedWallets cards is added in step 2. The Zcash logo image is removed. If the H1 is
// missing the original markdown is returned untouched.

const frame = (id: string, title: string) => `<div className="my-8 w-full aspect-video max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-lg bg-black">
  <iframe
    className="w-full h-full"
    src="https://www.youtube.com/embed/${id}"
    title="${title}"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowFullScreen
    loading="lazy"
  />
</div>`;

const BODY = `New to Zcash? This guide takes you from zero to your first private payment. It is written for someone who has never held ZEC before, and every step links to a deeper page when you want more detail.

## TL;DR

1. **Buy ZEC** on an exchange from the [exchange list](/using-zcash/custodial-exchanges), or use another way from [Buying ZEC](/using-zcash/buying-zec).
2. **Set up a shielded wallet** such as ZODL, Zingo! or Zkool, and write down its seed phrase.
3. **Withdraw** your ZEC from the exchange to your wallet.
4. **Send a small shielded payment** to try it.
5. **Join the community** on the forum or Discord.

You do not need to buy a whole ZEC. ZEC is divisible, so you can start with a fraction.

## The path at a glance

| Step | What you do | Why it matters |
| --- | --- | --- |
| 1. Buy ZEC | Get ZEC from an exchange or swap service | You need the coin to use the network |
| 2. Set up a wallet | Install a shielded wallet and back up its seed phrase | You hold the keys, not the exchange |
| 3. Withdraw | Send your ZEC from the exchange to your wallet | Your coins are now under your control |
| 4. Send a payment | Make a small shielded transaction | You confirm that everything works |
| 5. Join the community | Ask questions on the forum or Discord | You get help from other users |

## 1. Buy ZEC

To use the Zcash network you need its currency, ZEC. Pick an exchange from the [exchange list](/using-zcash/custodial-exchanges), or see [Buying ZEC](/using-zcash/buying-zec) for swap services and other ways to get it.

Supported countries, fees and withdrawal options differ by service and change over time, so check the service's own site before you buy. Start with a small amount.

## 2. Set up a wallet

An exchange holds your coins for you. A wallet that you control holds them yourself, which is why people say "not your keys, not your coins". This [article from Ledger](https://www.ledger.com/academy/not-your-keys-not-your-coins-why-it-matters) explains the idea.

Choose a **shielded wallet**, because shielded wallets give you the privacy that makes ZEC different. The [Wallets](/using-zcash/wallets) page compares all of them by device, features and status. These are a good place to start:

![mobile](/content-images/8b7618f5-dec6-4e6b-9804-db75be5c1e2f-14fa53d3bd.webp)

This video reviews the shielded wallets:

${frame("6IIRRZ17Q74", "Zcash Shielded Wallets Explained")}

### Back up your seed phrase

When the wallet asks you to back up a **seed phrase**, write it on paper and keep it offline.

- Anyone who has the phrase can take your funds, and nobody can recover it for you.
- Never share it, and never store it as a screenshot or in a cloud note.
- Check that the phrase you wrote down is correct before you put money in the wallet.

## 3. Withdraw ZEC to your wallet

Open your wallet, copy its receiving address, and paste it into the exchange's withdrawal form. Check the first and last characters of the address before you confirm.

Which address you use decides how private the withdrawal is:

| Address | What it is | What to do |
| --- | --- | --- |
| Shielded or unified | Hides the receiver and the amount on-chain | Use it whenever the exchange accepts it |
| Transparent | Public, like a Bitcoin address | Use it only if the exchange requires it, then shield the funds from inside your wallet after they arrive |

Start with a small withdrawal, wait for it to arrive, and then send the rest.

This video shows the steps. It uses the wallet's former name, Zashi, which is now called ZODL.

${frame("Avweu5V9QRc", "Coinbase + Zashi: Buy Zcash & Shield Instantly")}

## 4. Send a shielded transaction

Once ZEC is in your wallet, you can send a shielded payment. A shielded transaction hides the sender, the receiver and the amount. Start with a small test amount, confirm it arrived, and then send larger ones. The [Transactions](/using-zcash/transactions) page explains how sending and receiving work.

${frame("tEfQaYPV0UE", "Useful Tips when using Zcash")}

## 5. Join the community

The [Zcash Community Forum](https://forum.zcashcommunity.com/) is where the community discusses all things Zcash, and there is also a [Discord server](https://discord.gg/zcash). Conversations can get technical, but newcomers are welcome and questions are fine.

## Common mistakes

- **Leaving ZEC on the exchange.** The exchange holds the keys. Withdraw to your own wallet.
- **Losing the seed phrase.** There is no recovery without it. Never share it or store it as a screenshot.
- **Sending a large first payment.** Send a small amount first and confirm it arrived.
- **Sending to a transparent address by accident.** Transparent payments are public. Use a shielded or unified address when you want privacy.
- **Leaving funds at a transparent address.** Shield them as soon as they arrive.

## What to learn next

- [Zcash Basics](/start-here/what-is-zec-and-zcash): what ZEC and Zcash are, before you start
- [Shielded Pools](/using-zcash/shielded-pools): why shielded transactions matter
- [Unified Addresses](/zcash-tech/unified-addresses): one address for several receiver types
- [Viewing Keys](/zcash-tech/viewing-keys): share transaction history without giving up spending control

## Related Pages

- [Buying ZEC](/using-zcash/buying-zec): ways to acquire ZEC
- [Wallets](/using-zcash/wallets): compare all Zcash wallets by features and platform
- [Transactions](/using-zcash/transactions): how to send and receive ZEC privately
`;

export function rewriteNewUserGuide(original: string): string {
  const h1 = original.match(/^# Zcash New User Guide\s*$/m);
  if (!h1 || h1.index === undefined) return original;
  return original.slice(0, h1.index + h1[0].length) + "\n\n" + BODY;
}

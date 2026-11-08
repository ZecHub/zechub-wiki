// New User Guide: steps become numbered sections, the TL;DR no longer names exchanges (the list changes), a seed
// phrase and small-test-payment safety section is added, the Zashi video is labeled (Zashi is now ZODL), and the logo
// image is removed. The three tutorial videos and the Ledger article link are kept. If the H1 is missing the
// original markdown is returned untouched.

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

const BODY = `## TL;DR

1. **Buy ZEC** on an exchange from the [exchange list](/using-zcash/custodial-exchanges).
2. **Set up a shielded wallet** such as ZODL, Zingo! or Zkool, and write down its seed phrase.
3. **Withdraw** your ZEC from the exchange to your wallet's shielded address.
4. **Send a small shielded payment** to try it.
5. **Join the community** on the forum or Discord.

You do not need to buy a whole ZEC. ZEC is divisible, so you can start with a fraction.

---

## 1. Buy ZEC

To use the Zcash network you need its currency, ZEC. Pick an exchange from the [exchange list](/using-zcash/custodial-exchanges), or see [Buying ZEC](/using-zcash/buying-zec) for the other ways to get it.

## 2. Set up a wallet

An exchange holds your coins for you. A wallet that you control holds them yourself, which is why people say "not your keys, not your coins". This [article from Ledger](https://www.ledger.com/academy/not-your-keys-not-your-coins-why-it-matters) explains the idea.

Choose a **shielded wallet**, because shielded wallets give you the privacy that makes ZEC different. The [Wallets](/using-zcash/wallets) page compares them by device, features and status.

${frame("6IIRRZ17Q74", "Zcash Shielded Wallets Explained")}

When the wallet asks you to back up a **seed phrase**, write it on paper and keep it offline. Anyone who has the phrase can take your funds, and nobody can recover it for you.

## 3. Withdraw ZEC to your wallet

Open your wallet, copy its receiving address, and paste it into the exchange's withdrawal form. Check the first and last characters of the address before you confirm. Some exchanges only send to transparent addresses. If yours does, shield the funds from inside your wallet after they arrive.

This video shows the steps. It uses the wallet's former name, Zashi, which is now called ZODL.

${frame("Avweu5V9QRc", "Coinbase + Zashi: Buy Zcash & Shield Instantly")}

## 4. Send a shielded transaction

Once ZEC is in your wallet, you can send a shielded payment. A shielded transaction hides the sender, the receiver and the amount. Start with a small test amount, confirm it arrived, and then send larger ones.

${frame("tEfQaYPV0UE", "Useful Tips when using Zcash")}

## 5. Join the community

The [Zcash Community Forum](https://forum.zcashcommunity.com/) is where the community discusses all things Zcash, and there is also a [Discord server](https://discord.gg/zcash). Conversations can get technical, but newcomers are welcome and questions are fine.

---

## Common mistakes

- **Leaving ZEC on the exchange.** The exchange holds the keys. Withdraw to your own wallet.
- **Losing the seed phrase.** There is no recovery without it. Never share it or store it as a screenshot.
- **Sending a large first payment.** Send a small amount first and confirm it arrived.
- **Sending to a transparent address by accident.** Transparent payments are public. Use a shielded or unified address when you want privacy.

## Related Pages

- [Zcash Basics](/start-here/what-is-zec-and-zcash): understand the basics before you start
- [Buying ZEC](/using-zcash/buying-zec): ways to acquire ZEC
- [Wallets](/using-zcash/wallets): compare all Zcash wallets by features and platform
- [Shielded Pools](/using-zcash/shielded-pools): why shielded transactions matter
- [Transactions](/using-zcash/transactions): how to send and receive ZEC privately
`;

export function rewriteNewUserGuide(original: string): string {
  const h1 = original.match(/^# Zcash New User Guide\s*$/m);
  if (!h1 || h1.index === undefined) return original;
  return original.slice(0, h1.index + h1[0].length) + "\n\n" + BODY;
}

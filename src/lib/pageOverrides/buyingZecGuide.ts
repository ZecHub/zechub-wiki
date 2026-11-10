// Buying ZEC: rewritten around a TL;DR, a three-way "how to get ZEC" table, the shielded-vs-transparent withdrawal
// rule, and a step list. Removed because no source confirms them from here: which exchanges support shielded or
// transparent withdrawals (the page now tells readers to check the exchange before they buy and links to the exchange
// pages), the "flyp.me was one of the safest" claim, and the Coinbase/Kraken/Binance "transparent only" claim.
// Kept: the two videos, the wallet and exchange page links, and the two image markers that the MDX image component
// swaps for the native RecommendedExchanges and RecommendedWallets cards. The "ways to get ZEC" table is kept for
// wide screens and phones get one card per way. Skipped if the H1 is missing.

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

- You can get ZEC on an **exchange** (custodial), through a **swap service** (non-custodial) or by **mining**.
- Check where an exchange sends your withdrawal: some send to shielded addresses, many only to **transparent** ones.
- If you receive ZEC at a transparent address, **shield it** from inside your wallet as soon as it arrives.
- You do not need a whole ZEC. ZEC is divisible, so you can buy a fraction.
- Start with a small amount and confirm it arrives before you move more.

## Ways to get ZEC

<div className="hidden md:block">

| Way | What it is | Where to look |
| --- | --- | --- |
| Custodial exchange | You make an account, buy ZEC and withdraw it. The exchange holds your coins until you do | [Custodial Exchanges](/using-zcash/custodial-exchanges) |
| Non-custodial swap | You swap another coin for ZEC without making an account, and the ZEC goes to your own wallet | [Non-Custodial Exchanges](/using-zcash/non-custodial-exchanges) |
| Centralized swap service | A service that converts one coin to another for a fee | [Centralized Swaps](/using-zcash/centralized-swaps) |
| Mining | Earn ZEC by running mining hardware. This is usually out of reach for most people | [Zcash Mining Guide](/using-zcash/zcash-mining-guide) |

</div>

<div className="md:hidden my-4 space-y-3">

<div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm dark:border-slate-700 dark:bg-white/5 [&_p]:!my-0 [&_p+p]:!mt-2">

**Custodial exchange**

You make an account, buy ZEC and withdraw it. The exchange holds your coins until you do.

[Custodial Exchanges](/using-zcash/custodial-exchanges)

</div>

<div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm dark:border-slate-700 dark:bg-white/5 [&_p]:!my-0 [&_p+p]:!mt-2">

**Non-custodial swap**

You swap another coin for ZEC without making an account, and the ZEC goes to your own wallet.

[Non-Custodial Exchanges](/using-zcash/non-custodial-exchanges)

</div>

<div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm dark:border-slate-700 dark:bg-white/5 [&_p]:!my-0 [&_p+p]:!mt-2">

**Centralized swap service**

A service that converts one coin to another for a fee.

[Centralized Swaps](/using-zcash/centralized-swaps)

</div>

<div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm dark:border-slate-700 dark:bg-white/5 [&_p]:!my-0 [&_p+p]:!mt-2">

**Mining**

Earn ZEC by running mining hardware. This is usually out of reach for most people.

[Zcash Mining Guide](/using-zcash/zcash-mining-guide)

</div>

</div>

Supported coins, countries, fees and withdrawal options differ by service and change over time. Check the service's own site before you buy.

## Swap services and decentralized exchanges

These services let you swap another coin for ZEC without making an account. Many of them pay out to a transparent address, so plan to shield the ZEC after it arrives. See [Non-Custodial Exchanges](/using-zcash/non-custodial-exchanges) for more.

![dex](/content-images/bfe2e9cf-2def-4593-b790-152e14b23da3-f94f97c7e6.webp)

## Choose a wallet

You need a receiving address before you can withdraw. These wallets are a good place to start. The [Wallets](/using-zcash/wallets) page compares all of them.

![mobile](/content-images/8b7618f5-dec6-4e6b-9804-db75be5c1e2f-14fa53d3bd.webp)

## Before you buy

1. **Check the wallet you chose.** Prefer one that lists Sapling or Ironwood under Pools.
2. **Copy a shielded address if the service accepts it.** A shielded or unified address keeps the withdrawal private.
3. **Otherwise use a transparent address** and shield the funds afterwards. A transparent address is public, so the deposit is visible on-chain until you shield it.

## After you receive ZEC

- Open your wallet and look for **Shield funds**, or its equivalent.
- Wait for the shielding transaction to confirm. Shielding is visible on-chain, but what happens afterwards inside the shielded pool is not.
- Send a small shielded payment to test, then move larger amounts.

These videos show the steps. The first uses the wallet's former name, Zashi, now ZODL.

${frame("Avweu5V9QRc", "Coinbase + Zodl: Buy Zcash & Shield Instantly")}

${frame("6IIRRZ17Q74", "Reviewing all Zcash Shielded Wallets")}

## Common mistakes

- **Withdrawing to a transparent address when a shielded one is available.** Use the shielded or unified address when the service accepts it.
- **Leaving ZEC at a transparent address.** Shield it right after it arrives.
- **Leaving ZEC on the exchange.** The exchange holds the keys. Withdraw to your own wallet.
- **Buying a large amount first.** Start small and confirm the flow works.
- **Trusting a list on a wiki page.** Services change. Confirm on the service's own site that it supports your country, your coin and your withdrawal type.

## Related pages

- [Wallets](/using-zcash/wallets): choose a wallet before you withdraw
- [Custodial Exchanges](/using-zcash/custodial-exchanges): exchanges that list ZEC
- [Non-Custodial Exchanges](/using-zcash/non-custodial-exchanges): swap without an account
- [Shielded Pools](/using-zcash/shielded-pools): why shielded withdrawals matter
- [New User Guide](/start-here/new-user-guide): the full onboarding checklist
`;

export function rewriteBuyingZecGuide(original: string): string {
  const h1 = original.match(/^# Obtaining Zcash\s*$/m);
  if (!h1 || h1.index === undefined) return original;
  return original.slice(0, h1.index + h1[0].length) + "\n\n" + BODY;
}

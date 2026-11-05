// Rewrite of "Web Browsers". The source opens with a three-item list, has the "Mulvad" typo, says Tor Browser
// blocks Flash, RealPlayer and QuickTime (dead plug-ins), uses invented test names ("HTTPS Test", "Navigation
// Test"), and describes Brave's Zcash support in the future tense ("would integrate", a 2022-era Filecoin
// messaging plan) although Brave Wallet has supported shielded ZEC on desktop since April 2025. The page is
// rebuilt around a comparison and a selection checklist; the Zcash section reports what Brave published.
// If the source is not this page any more, the original markdown is returned untouched.
export function rewriteWebBrowsersGuide(original: string): string {
  if (!/^# Web Browsers\s*$/im.test(original)) return original;
  if (!/Brave/.test(original) || !/Mulvad|Mullvad/.test(original)) return original;

  const fm = original.match(/^---\n[\s\S]*?\n---\n/)?.[0] ?? "";
  const edit = original.match(/^<a href="https:\/\/github\.com\/[^"]*\/edit\/[^"]*"[^>]*>\s*<img[^>]*Edit[^>]*>\s*<\/a>\s*\r?\n/m)?.[0] ?? "";

  return `${fm}${edit}
# Web Browsers

Your browser sees everything you do online, and it is also the easiest place for sites to track you. This page compares three privacy-focused browsers, lists what to check when choosing one, and explains where Zcash fits in.

## Three options compared

| Browser | Best for | What it does |
| --- | --- | --- |
| [Brave](https://brave.com/) | Everyday use | Blocks privacy-invasive ads and trackers and third-party data storage. Includes a built-in crypto wallet with Zcash support. |
| [Mullvad Browser](https://mullvad.net/en/browser) | Reducing tracking and fingerprinting | Developed by Mullvad VPN together with the Tor Project. It uses Tor Browser's anti-fingerprinting design but does not use the Tor network, so it is meant to be paired with a VPN. |
| [Tor Browser](https://www.torproject.org/download/) | Anonymity | Sends your traffic through the Tor network, which hides your IP address from the sites you visit. |

On Tor Browser, do not install extra add-ons or plug-ins. They can change how your browser looks to a site, which makes you easier to single out, and some can leak your real IP address. For more on Tor, see [Tor and I2P](/privacy-tools/tor-and-i2p). On a phone, the browser comes with the operating system; see [GrapheneOS](/privacy-tools/grapheneos).

## What to look for in a browser

- **Fingerprinting resistance.** Sites can identify you from your software, hardware and settings. Prefer a browser that makes users look alike or limits what sites can read.
- **HTTPS everywhere.** HTTPS encrypts the connection, so people on the network cannot read the content or see which pages or cookies you use. Choose a browser that can force HTTPS and warn you when a site does not support it.
- **Tracker and cookie blocking.** Many pages carry hidden third-party trackers that read and write cookies to follow you across sites. Choose a browser that blocks them.
- **Cross-site tracking protection.** When you click a link, browser features can tell the second site where you came from. Choose a browser that stops sites sharing tracking data this way.
- **Careful extensions.** Extensions can open security holes. Install them only from a trusted source, and keep the list short.
- **Updates.** Browser vulnerabilities are found regularly, so keep your browser up to date.

## Brave and Zcash

Brave Wallet is the wallet built into the Brave browser, and it supports shielded Zcash. According to Brave's [announcement](https://brave.com/blog/shielded-zcash/), shielded transactions arrived on desktop in April 2025 with version 1.77, and Android and iOS were announced as coming later. Brave Wallet also supports cross-chain swaps that include Zcash through NEAR Intents.

Some limits were reported by users on the Zcash Community Forum in August 2025, and they may have changed since: restoring a wallet from its seed phrase recovered only transparent funds, only one shielded account was allowed, and sending from a shielded to a transparent address was not possible ([forum post](https://forum.zcashcommunity.com/t/current-limitations-of-zcash-support-in-brave-wallet/51908)). Read the [Brave Wallet guide](/guides/brave-wallet-guide) and check the current state before holding funds there.

## Related pages

- [Tor and I2P](/privacy-tools/tor-and-i2p)
- [VPN & dVPN](/privacy-tools/vpn-and-dvpn)
- [GrapheneOS](/privacy-tools/grapheneos)
- [Secure Messengers](/privacy-tools/secure-messengers)
`;
}

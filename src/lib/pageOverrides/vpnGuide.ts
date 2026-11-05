// Rewrite of "VPN & dVPN". The source lists Mullvad, ExpressVPN, NordVPN and CyberGhost as VPNs "that accept
// Zcash". Current payment pages show Mullvad takes Monero, Bitcoin, Bitcoin Cash, Lightning and cash,
// NordVPN pays through CoinGate (BTC, ETH, LTC, stablecoins, DOGE) and ExpressVPN through BitPay (Bitcoin),
// none with ZEC. NymVPN does take shielded ZEC. The page is rebuilt around that, keeping the VPN/dVPN
// explanations, the selection checklist and the VPN diagram. The second image (323 px wide, and a hub-and-spoke
// enterprise "DVPN" drawing rather than a decentralized VPN) is replaced by a readable diagram component. If the source is not this page any more, the
// original markdown is returned untouched.
export function rewriteVpnGuide(original: string): string {
  if (!/^# VPN & dVPN\s*$/im.test(original)) return original;
  if (!/Mullvad/.test(original) || !/Nym VPN/.test(original)) return original;

  const fm = original.match(/^---\n[\s\S]*?\n---\n/)?.[0] ?? "";
  const edit = original.match(/^<a href="https:\/\/github\.com\/[^"]*\/edit\/[^"]*"[^>]*>\s*<img[^>]*Edit[^>]*>\s*<\/a>\s*\n/m)?.[0] ?? "";
  const img = (alt: string) => original.match(new RegExp(`!\\[${alt}\\]\\([^)]+\\)`))?.[0] ?? "";

  return `${fm}${edit}
# VPN & dVPN

A VPN hides your traffic from your internet provider and your network by sending it through a server run by someone else. A decentralized VPN (dVPN) spreads that job across many independent nodes. This page explains the difference, what to look for when choosing one, and which services you can pay for with Zcash.

> **Check before you pay.** Several services that were once listed here as accepting Zcash do not take it today. Payment options change, so confirm on the provider's own checkout page before you send funds.

## VPN or dVPN?

| | Traditional VPN | Decentralized VPN (dVPN) |
| --- | --- | --- |
| How it works | An encrypted tunnel from your device to one server run by the provider | Traffic is routed through a network of independent nodes, often with blockchain-based incentives |
| What it hides | Your activity from hackers, your ISP and local networks | The same, and it is harder for any single entity to watch the whole path |
| Main trust risk | You have to trust the provider not to log or share your traffic | Trust is spread out, but node quality and incentives vary |
| Censorship | Servers can be blocked or ordered to comply | More resistant, since no central authority controls the network |
| Common uses | Private browsing, geo-restricted content, protection on public Wi-Fi | The same, plus censorship resistance |

${img("image223")}

<DvpnDiagram />

## What to look for in a VPN

1. **Strong encryption.** Use modern protocols such as WireGuard or OpenVPN.
2. **A no-logs policy,** ideally one that has been independently audited.
3. **Jurisdiction.** Check where the provider is based and what data-retention laws apply.
4. **A kill switch,** which cuts your connection if the VPN drops so nothing leaks.
5. **Leak protection** against DNS and WebRTC leaks.
6. **Server locations,** for access to content in other regions and for lower latency.
7. **Price and features,** so the plan fits how you will use it.

## Paying with Zcash

### NymVPN

[NymVPN](https://nym.com/) is a decentralized VPN that can route traffic through a mixnet. It does not ask for personal information, and it accepts shielded ZEC at checkout through BTCPay ([how to pay](https://support.nym.com/hc/en-us/articles/38626320242833-Paying-for-NymVPN-with-ZEC-Zcash)).

- Send from a **shielded address.** Sending from a transparent address can still work, but then the address and amount are public on the blockchain. At the time of Nym's guide, unified addresses were not supported.
- Send the exact amount shown, then wait for one confirmation, usually a few minutes. Your subscription is credited and you can create your access code.
- Anyone can run a node and earn rewards, which keeps the network decentralized.

To route a Zcash wallet's traffic through Nym, see [Route Zcash Wallet Traffic Over the Nym Mixnet](/guides/nym-mixnet-wallet-setup). For setup, see [Nym VPN](/guides/nym-vpn).

### Private Internet Access

[Private Internet Access (PIA)](https://www.privateinternetaccess.com/) announced support for Zcash shielded payments in 2018 ([announcement](https://www.privateinternetaccess.com/blog/private-internet-access-now-accepts-anonymous-zcash-shielded-payments/)). We could not confirm that this is still available, so check its checkout page.

## Privacy VPNs that do not accept ZEC

These are often recommended for privacy, but their payment pages do not list Zcash.

| Service | What it accepts |
| --- | --- |
| [Mullvad](https://mullvad.net/en) | Monero, Bitcoin, Bitcoin Cash, Lightning and cash. Accounts are a random number, with no personal details. |
| [NordVPN](https://nordvpn.com/) | Crypto through CoinGate: Bitcoin, Ethereum, Litecoin, stablecoins and Dogecoin. |
| [ExpressVPN](https://www.expressvpn.com/) | Bitcoin through BitPay. |

If you use one of these, you can buy the coin they accept with ZEC through a swap service first. See [Centralized Swaps](/using-zcash/centralized-swaps), and keep in mind that this can link the payment to you.
`;
}

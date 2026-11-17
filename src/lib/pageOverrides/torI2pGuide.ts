// Rewrite of the Tor and I2P page. The page is published under the title "Why Privacy Matters" although it
// is about Tor and I2P, repeats its TL;DR in the body, has an empty heading ("Tor & I2P Technologies"), a
// sentence used as a heading, an unsupported claim that I2P is "more secure" than Tor, and "Related pages"
// links that point at .md files. The research in it (zcashd end of support, Zebra's disabled Tor feature,
// ports, Orbot steps) is kept. If the source is not this page any more, the original markdown is returned.
export function rewriteTorI2pGuide(original: string): string {
  if (!/Routing a mobile wallet through Tor with Orbot/.test(original)) return original;
  if (!/Running a node over Tor/.test(original) || !/Installing I2P/.test(original)) return original;

  const fm = original.match(/^---\n[\s\S]*?\n---\n/)?.[0] ?? "";
  const edit = original.match(/^<a href="https:\/\/github\.com\/[^"]*\/edit\/[^"]*"[^>]*>\s*<img[^>]*Edit[^>]*>\s*<\/a>\s*\n/m)?.[0] ?? "";
  const between = (from: RegExp, to: RegExp) => {
    const a = original.search(from);
    if (a < 0) return "";
    const rest = original.slice(a).replace(from, "");
    const b = rest.search(to);
    return (b < 0 ? rest : rest.slice(0, b)).trim();
  };
  const i2pInstall = between(/^### Installing I2P\s*\n/m, /^### Using I2P with Zcash/m);
  const i2pZcash = between(/^### Using I2P with Zcash\s*\n/m, /^## Tor and I2P share/m);
  const nodeSection = between(/^## Running a node over Tor\s*\n/m, /^### What you can still do today/m);
  const torInstall = between(/^## Installing Tor on PC or desktop\s*\n/m, /^## Running a node over Tor/m);
  const orbotIntro = between(/^## Routing a mobile wallet through Tor with Orbot\s*\n/m, /^1\.\s/m);
  const stepsRaw = between(/^1\.\s+Download and install/m, /^\*Note: If Tor is blocked/m);
  const bridgeNote = original.match(/^\*Note: If Tor is blocked[^\n]+$/m)?.[0];
  const canDo = between(/^### What you can still do today\s*\n/m, /^## Related pages/m);
  if (!i2pInstall || !i2pZcash || !nodeSection || !torInstall || !orbotIntro || !stepsRaw || !bridgeNote || !canDo) return original;

  const steps = `1. Download and install${stepsRaw}`
    .split(/\n\s*(?=\d\.\s)/)
    .map((chunk) => chunk.match(/^\s*(\d)\.\s+([\s\S]*)$/))
    .filter((m): m is RegExpMatchArray => !!m)
    .map((m) => ({ n: m[1], text: m[2].trim().replace(/\s+/g, " ") }));
  if (steps.length < 5) return original;
  const titles = ["Install Orbot", "Open Tor Enabled Apps", "Select your wallet", "Approve the VPN request", "Check the connection"];
  const stepItems = steps
    .slice(0, 5)
    .map((s, i) => `<PointItem n="${s.n}" title="${titles[i]}">\n\n${s.text}\n\n</PointItem>`)
    .join("\n\n");

  return `${fm}${edit}
# Tor and I2P

Tor and I2P are two networks that hide where your traffic comes from. This page explains how they differ, how to route a Zcash wallet through Tor, and what is not possible today for Zcash nodes.

> **Short answer.** Tor is the practical choice for anonymising a wallet connection or browsing. No current Zcash node speaks I2P. Running a node over Tor is not supported right now: zcashd reached end of support on 18 July 2026, and Zebra's Tor feature is still disabled upstream. Tor hides *where you are*, not *what you do on-chain*, so transparent transactions stay public.

## Tor and I2P compared

| | Tor | I2P |
| --- | --- | --- |
| What it is | A network that routes your traffic through three relays | A fully encrypted peer-to-peer overlay network |
| Reaches the normal web | Yes, and onion services | No, it is built for services inside I2P (email, chat, torrents) |
| Zcash support | Wallets can connect through it; see below | No current Zcash node supports it |
| Best used for | Anonymising wallet connections and browsing | Reaching sites and services without revealing your address |

For a detailed comparison see the [I2P project's comparison with Tor](https://geti2p.net/en/comparison/tor), and the [Privacy Guides page on Tor](https://www.privacyguides.org/en/tor/).

## Tor

[Tor](https://www.torproject.org/) is a proxy network. Applications connect through it, and their traffic is routed through the Tor network, which hides the user's IP address from the sites and servers they talk to.

### Route a mobile wallet through Tor with Orbot

${orbotIntro}

<PointList>

${stepItems}

</PointList>

${bridgeNote}

### Install Tor on a computer

${torInstall}

## I2P

The [Invisible Internet Project](https://geti2p.net/en/about/intro) hides the contents, the source and the destination of messages from observers.

### Install I2P

${i2pInstall}

### I2P and Zcash

${i2pZcash}

## Run a node over Tor

${nodeSection}

## What you can still do today

${canDo}

## Related pages

- [VPN and DVPN](/privacy-tools/vpn-and-dvpn): VPN alternatives and how they compare
- [Web Browsers](/privacy-tools/web-browsers): browser hardening for everyday privacy
- [Arti](/privacy-tools/arti-tor): the Tor Project's Rust client
- [Secure Messengers](/privacy-tools/secure-messengers): private communication tools
- [What a Block Explorer Can See](/zcash-tech/what-a-block-explorer-can-see): what network-level privacy does and does not protect
- [Shielded Pools](/using-zcash/shielded-pools): what stays visible on-chain even with network-layer anonymity
`;
}

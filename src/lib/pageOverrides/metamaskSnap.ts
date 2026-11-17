// Editorial rewrite of the MetaMask Snap guide. The wiki content lives in the external
// ZecHub/zechub repo, so this restructures the text here while reusing the page's own
// screenshots (taken, in order, from the fetched markdown). If the source no longer has the
// expected seven screenshots, the original markdown is returned untouched.
const IMG = /!\[[^\]]*\]\(\s*([^)\s]+)[^)]*\)/g;

export function rewriteMetamaskSnap(original: string): string {
  const imgs = [...original.matchAll(IMG)].map((m) => m[1]);
  if (imgs.length !== 7) return original;
  const [install, network, connect, summary, fund, transfer, components] = imgs;
  const shot = (src: string, alt: string) => `![${alt}](${src})`;

  return `# MetaMask Zcash Snap Integration Guide

Use private, shielded ZEC from inside MetaMask. The Zcash Snap, built by ChainSafe, audited by Hacken and listed in the official MetaMask Snaps Directory, adds Zcash accounts to your existing wallet. You do not need any separate Zcash software.

<div>
<iframe src="https://www.youtube.com/embed/UJh9Ilkohdw" title="How to use ZEC on Metamask"></iframe>
</div>

## Before you start

- **MetaMask on desktop.** The extension for Chrome, Edge or Firefox, with the [latest version](https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en) so Snaps are supported.
- **A backed-up recovery phrase.** The Snap derives your Zcash keys from your MetaMask account.
- **A stable connection.** The wallet needs to sync with the Zcash network.
- **Funds.** ETH to swap for ZEC, or ZEC withdrawn from an exchange.

> **Protect your recovery phrase.** It controls both your ETH and your ZEC.

## 1. Install the Zcash Snap

1. Open the [MetaMask Snaps Directory](https://snaps.metamask.io/snap/npm/chainsafe/webzjs-zcash-snap/).
2. Find **Zcash Shielded Wallet** (also listed as **WebZjs Zcash Snap**) published by ChainSafe.
3. Click **Add to MetaMask**.
4. Review and approve the permissions: **Manage Zcash accounts** and **Store data on your device**.

${shot(install, "Installing the Zcash Snap from the MetaMask Snaps Directory")}

## 2. Add the network (optional)

Adding a network is optional. It gives MetaMask network details and explorer links. In MetaMask, choose **Add network** and enter the values below.

**BNB Smart Chain**

| Field | Value |
| --- | --- |
| Name | BNB Smart Chain |
| RPC URL | \`https://bsc-dataseed.binance.org\` |
| Chain ID | 56 |
| Symbol | BNB |
| Block explorer | \`https://bscscan.com\` |

${shot(network, "Adding a custom network in MetaMask")}

**Zcash Mainnet**

| Field | Value |
| --- | --- |
| Name | Zcash Mainnet |
| RPC URL | \`https://zjs.zec.rocks\` |
| Symbol | ZEC |

\`https://zjs.zec.rocks\` is a WebZjs-compatible (gRPC-web) lightwalletd server run by zec.rocks (@emersonian). For testnet, use \`https://zjs.zec.rocks/testnet\`. If you host the WebZjs web wallet yourself, set this value as \`LIGHTWALLETD_PROXY\`.

## 3. Connect to the WebZjs wallet

1. Go to [webzjs.chainsafe.dev](https://webzjs.chainsafe.dev).
2. Click **Connect MetaMask Snap**.

${shot(connect, "WebZjs wallet connection screen")}

3. Approve the connection in MetaMask.
4. Review your account summary, which shows your Unified Address and your Transparent address.
5. Wait for synchronization to complete before you use the wallet.

${shot(summary, "Account summary with Unified and Transparent addresses")}

## 4. Fund your wallet

- **Swap ETH for ZEC.** Use a service such as LeoDex and send the ZEC to your shielded address.
- **Withdraw from an exchange.** Send the ZEC you bought to your WebZjs shielded address.

${shot(fund, "Swapping ETH for ZEC with LeoDex")}

> **Stay shielded.** Use your shielded address for full privacy.

## 5. Send and receive ZEC

1. In WebZjs, open **Transfer Balance**.
2. Enter the **shielded recipient address** and the **amount**.

${shot(transfer, "Transfer Balance screen in WebZjs")}

3. Confirm the transaction by signing it in MetaMask.

Received funds appear in WebZjs once the transaction is confirmed.

## 6. Verify and troubleshoot

MetaMask does not list ZEC directly, so check **WebZjs** for your updated balance. If something goes wrong:

- Confirm that you installed the official ChainSafe Snap.
- Check that your network settings are correct.
- Check that the address format is correct.
- Reconnect with **Connect Snap** if needed.

> **Security tip.** Only install the audited ChainSafe Snap, and review its permissions before you approve them.

## 7. Check your address components

1. Open the **Receive** section. Your Unified Address is shown by default.
2. Copy it and paste it into the search bar of the [Zcash Block Explorer](https://zcashblockexplorer.com).
3. The explorer lists every component of the Unified Address: the **Orchard**, **Sapling** and **Transparent** addresses.

${shot(components, "Unified Address components in the block explorer")}

## Good to know

- Shielded proofs can take a little time. WebAssembly runs the computation in your browser.
- Recovery is simple: install MetaMask and the Snap, then import your existing seed phrase.
- The Snap defaults to shielded ZEC. Transparent addresses are not its focus.
- Use [zcashblockexplorer.com](https://zcashblockexplorer.com) to confirm transactions.
`;
}

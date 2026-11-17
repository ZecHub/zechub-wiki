// Testnet page: adds a TL;DR and Related pages, and fixes wording that goes stale or has no source:
// the list of upgrades tested (now NU6.3 Ironwood and NU7), "Updated to support Testnet protocols (including NU6 Testnet)",
// "Testnet resets often", "instantly", and a faucet pointer to the Faucets page. Each edit is optional; if the page
// shape changes the unmatched edits are skipped and, without the H2 anchor, the original is returned.

const TLDR = `## TL;DR

- The **Testnet** is a separate Zcash blockchain with the same rules as Mainnet, used to try software and network upgrades without risking money.
- Its coins are **TAZ**. They have no value and cannot be exchanged for ZEC.
- Upgrades are tested on Testnet before they activate on Mainnet.
- You need a Testnet wallet or node and a faucet to get TAZ. [Zkool](/using-zcash/wallets) and Zingo! list Testnet support on the Wallets page.
- Do not send real ZEC to a Testnet address. The two networks are separate.

`;

const EDITS: [string, string][] = [
  ["(e.g., NU6.1, NU6.2 and Ironwood)", "(for example NU6.3, Ironwood, and NU7)"],
  ["- Updated to support Testnet protocols (including NU6 Testnet)", "- Lists Testnet support on the [Wallets](/using-zcash/wallets) page"],
  ["Testnet and Mainnet are identical** -> False, Testnet resets often and isn't economically secured like Mainnet.", "Testnet and Mainnet are identical** -> False. Testnet can be reset and is not economically secured like Mainnet."],
  ["4. Receive TAZ instantly to start testing", "4. Receive TAZ once the transaction confirms, then start testing"],
  ["**Why it matters:**", "Faucets come and go. The [Faucets](/using-zcash/faucets) page lists the ones the wiki knows about.\n\n**Why it matters:**"],
];

const RELATED = `

## Related pages

- [Faucets](/using-zcash/faucets): where to get TAZ
- [Wallets](/using-zcash/wallets): wallets with Testnet support
- [Zebra Full Node](/zcash-tech/zebra-full-node): the node to run for Testnet
- [Zcash Network Upgrades](/start-here/network-upgrades): what gets tested before Mainnet
`;

export function rewriteTestnetGuide(original: string): string {
  const anchor = "## What Is the Zcash Testnet?";
  if (!original.includes(anchor)) return original;
  let t = original.replace(anchor, TLDR + anchor);
  for (const [a, b] of EDITS) if (t.includes(a)) t = t.replace(a, b);
  return t.replace(/\s+$/, "") + RELATED;
}

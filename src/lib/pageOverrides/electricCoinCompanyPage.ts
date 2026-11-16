// Electric Coin Company page. The source page was written while ECC was active, then patched with a "(Sunset)" title. It is
// rewritten as a record of what ECC did and of what happened in January 2026.
// Sources: The Block, "Zcash Company rebrands to Electric Coin Company" (22 Feb 2019); The Block, "Zcash developers quit, form new
// company after board clash" (8 Jan 2026: the whole staff resigned on 7 Jan 2026, Josh Swihart's "constructive discharge" account,
// the plan for a new company); ECC's own blog posts for Sapling, NU5 and the Zashi integrations; this wiki's ZODL, Zcash Foundation,
// Full Nodes and Funding & Governance pages.
// Dropped as unverified: the NYDFS/FATF policy claims, the Brave and Gemini partnership lines, a named VP and sponsorship, and the
// note about the old GitHub organization name. ECC's legal status after January 2026 is not documented in these sources, so the page
// says only that it has no development team. If the page no longer looks like this one, the original markdown is returned untouched.
const PAGE = `# Electric Coin Company

The **Electric Coin Company (ECC)** launched Zcash in 2016 and led its development for most of the network's history. Its whole team resigned in January 2026, and the work now continues at [ZODL](/zcash-organizations/zodl).

> **Status.** ECC no longer has a development team. Its staff resigned on 7 January 2026 and the former team went on to form ZODL. This page records what ECC built and what happened next. For current wallet and protocol work, see [ZODL](/zcash-organizations/zodl).

[Website](https://electriccoin.co) - [X/Twitter](https://x.com/ElectricCoinCo) - [GitHub (now ZODL)](https://github.com/zodl-inc)

## Mission

ECC described its mission as empowering economic freedom, with financial privacy at its core. It argued that private payments should be as easy as closing the curtains at home, and that the tools for it should be easy to use, private by default with options for disclosure, and backed by distributed infrastructure.

## Timeline

| When | What happened |
|---|---|
| 2016 | Zcash launches. ECC, then called the Zcash Company, leads its development. |
| October 2018 | The Sapling network upgrade activates. |
| February 2019 | The Zcash Company is renamed the Electric Coin Company. |
| 2022 | NU5 activates with the Halo 2 proving system. |
| 2024 | ECC releases the Zashi wallet. |
| December 2025 | ECC reorganizes its engineering around the Zashi wallet. |
| 7 January 2026 | The whole ECC staff resigns. |
| February 2026 | Zashi is renamed Zodl, under ZODL. |

## What ECC built

### Protocol

- **Zcash itself.** ECC [launched Zcash](https://electriccoin.co/blog/zcash-begins/) and employed much of the core development team.
- **Sapling.** The [Sapling network upgrade](https://electriccoin.co/blog/sapling-activation-complete/) made shielded transactions much lighter. ECC reported a 90% cut in the time to build a transaction and a memory reduction of over 97%, which made shielded transactions practical on a phone for the first time.
- **NU5 and Halo 2.** [NU5](https://electriccoin.co/blog/nu5-activates-on-mainnet-eliminating-trusted-setup-and-launching-a-new-era-for-zcash/) introduced the Halo 2 proving system, which removed the trusted setup for the newest shielded pool. It has been active on mainnet since 2022.
- **zcashd.** The original Zcash full node, developed and maintained by ECC. It has been retired and replaced by Zebra and Zallet. See [Full Nodes](/zcash-tech/full-nodes).

### Zashi wallet

Zashi was a self-custody shielded wallet released in 2024. It was designed so that people with no crypto experience could set up a wallet, get ZEC and start sending private payments within minutes. In February 2026 it was renamed **Zodl**, and ZODL now maintains it. The store links for the wallet open Zodl. See the [ZODL page](/zcash-organizations/zodl) for the current wallet.

Integrations added during the ECC years:

- [Coinbase](https://electriccoin.co/blog/coinbase-zashi-1-2-release/): buy ZEC inside the wallet, without opening an exchange account and withdrawing.
- [Flexa](https://electriccoin.co/blog/zashi-flexa-integration-is-here-spend-zec-at-thousands-of-retailers/): spend ZEC at retailers that accept Flexa payments.
- [Keystone](https://electriccoin.co/blog/drumroll-please-introducing-zashi-keystone-hardware-wallet-integration-for-shielded-zec/): cold storage of shielded ZEC on a hardware wallet.

## Structure and funding

ECC was a for-profit company wholly owned by the **Bootstrap Project**, a 501(c)(3) nonprofit that governed it. Bootstrap and ECC each had a board of directors, and ECC also had a Scientific Advisory Group.

For most of Zcash's history, ECC was funded by a share of the block reward set aside for development. How that funding was split, and how it changed, is explained in [Development Fund](/start-here/development-fund) and [Zcash Funding & Governance Overview](/zcash-community/zcash-governance). ECC published financial details in the transparency reports on its [blog](https://electriccoin.co/blog/).

## The January 2026 departure

On 7 January 2026, ECC's CEO Josh Swihart announced on X that the whole team had resigned. He described it as a constructive discharge: in his account, changes made by a majority of the Bootstrap board made it impossible to do the work with integrity. The team said it would form a new company to keep building Zcash, and that the protocol itself was unaffected. Reporting at the time is in [The Block](https://www.theblock.co/post/384737/zcash-developers-form-new-company).

The people involved gave different accounts of the dispute, and this page does not take a side. The [Funding & Governance Overview](/zcash-community/zcash-governance) gives the wider background. What both sides said is that the Zcash network kept running normally, and that its software is open source and not owned by any single company.

## Related pages

- [ZODL](/zcash-organizations/zodl): the organization formed by the former ECC team, and the Zodl wallet
- [Zcash Foundation](/zcash-organizations/zcash-foundation): maintains Zebra, the node that replaced zcashd
- [Development Fund](/start-here/development-fund): how the block reward funded development
- [Zcash Funding & Governance Overview](/zcash-community/zcash-governance): who funds and governs Zcash today

## Sources

- [Zcash Company rebrands to Electric Coin Company](https://www.theblock.co/linked/13086/zcash-company-rebrands-to-electric-coin-company), The Block
- [Zcash developers quit, form new company after board clash](https://www.theblock.co/post/384737/zcash-developers-form-new-company), The Block
- [ECC blog](https://electriccoin.co/blog/), for the Sapling, NU5 and Zashi announcements linked above
`;

export function rewriteEccPage(original: string): string {
  if (!original.includes("Electric Coin Company") || !original.includes("Bootstrap")) return original;
  return PAGE;
}

// ZODL page. The source page had a logo, a "Guardian of the Sovereign" philosophy section, a long list of wallet features and
// impact figures (Orchard pool growth, "USD 600 million in swaps", a quote calling the wallet "the single biggest factor" for Zcash) that
// have no source on the page. It is rewritten around what independent reporting supports:
// - ForkLog (17 Feb 2026) and Bitcoinist: the former ECC team now makes up ZODL; the rename of Zashi to Zodl was announced on 16 Feb 2026
//   and arrives with the next app update, with no action needed from users; the team says it aims to grow without relying on the Dev Fund.
// - Whale Alert / FXStreet / CoinMarketCap coverage (9-10 March 2026): seed round of over USD 25 million, investors including Paradigm,
//   a16z crypto, Winklevoss Capital, Coinbase Ventures, Cypherpunk Technologies, Chapter One and Balaji Srinivasan; founded by Josh Swihart;
//   funds for hiring engineers and product development. The coverage does not say who led the round and introduces the list with
//   "including", so the page says the list is not complete.
// - Bitcoinist: Bootstrap said the dispute centered on a proposed move of Zashi into a for-profit structure with outside investment;
//   ECC's side blamed board actions. The page states both and takes no side.
// - The wiki's own ECC, Ironwood, Shielded Labs and Valar Group pages for the 7 January 2026 resignations and ZODL's role in Ironwood.
// Dropped as unconfirmed: the USD 5M figure for one investor, David Friedberg, the impact numbers, the "Guardian of the Sovereign"
// section, retailer names and the full feature list. If the page no longer looks like this one, the original markdown is returned.
const PAGE = `# ZODL

**ZODL (Zcash Open Development Lab)** is a company formed by the former Electric Coin Company (ECC) team after they left ECC in January 2026. It works on Zcash protocol software and maintains the **Zodl** wallet, which was called Zashi until February 2026. It describes its mission as a world without mass financial surveillance, where financial privacy is the default.

[Website](https://zodl.com/) - [About](https://zodl.com/about/) - [GitHub](https://github.com/zodl-inc) - [X](https://x.com/zodl_app)

## At a glance

| | |
|---|---|
| Type | A company, not a non-profit |
| Founder | Josh Swihart, former CEO of ECC |
| Team | The former ECC team |
| Product | The Zodl wallet, formerly Zashi |
| Funding | A seed round of more than USD 25 million, reported in March 2026 |
| Other work | Core Zcash protocol software, including its part in [Ironwood](/zcash-tech/ironwood) |

## Background

ECC launched Zcash in 2016 and led its development for most of the network's history. In January 2026 its whole team resigned after a governance dispute with Bootstrap, the non-profit that oversaw ECC. Bootstrap said the dispute centered on a proposal to move Zashi into a for-profit structure with outside investment. The ECC side said board actions had forced the team out. See [Electric Coin Company](/zcash-organizations/electric-coin-company) for the events and the [Sovright](/zcash-organizations/sovright) page for the non-profit on the other side of the split.

The former team then formed ZODL. On 16 February 2026 it announced that Zashi would be renamed Zodl, and that the change would arrive with the next app update with nothing for users to do. The team said it wants to grow without relying on the Zcash development fund.

## Funding

ZODL's seed round of more than USD 25 million was reported on 9 and 10 March 2026. The reports name these investors:

- Paradigm
- a16z crypto
- Winklevoss Capital
- Coinbase Ventures
- Cypherpunk Technologies
- Chapter One
- Balaji Srinivasan

The reports introduce the list with "including", so it may not be complete, and they do not say who led the round. The money is meant for hiring engineers and for product development.

Because ZODL has outside investors, it works differently from the Development Fund and Zcash Community Grants model that ECC relied on. See the [Funding & Governance Overview](/zcash-community/zcash-governance) for how Zcash development is funded today.

## The Zodl wallet

Zodl is a self-custodial mobile wallet for private Zcash payments, available for iOS, Android and F-Droid. It was released as Zashi in 2024 and is built to be simple enough for people new to crypto. Notes from this wiki's guides:

- It supports the Keystone hardware wallet. See [Keystone with Zodl](/guides/keystone-zashi).
- It has a Tor setting under Advanced Settings. See [Tor and I2P](/privacy-tools/tor-and-i2p).
- For how it compares with other wallets, see the [wallets list](/wallets).

Check the wallet's own site and release notes for its current feature list, because features change often.

## Protocol work

ZODL's engineers include many of the people who built Zcash's shielded protocols at ECC. After the Orchard vulnerability of 2026, ZODL led the emergency fix, and with Project Tachyon and [Valar Group](/zcash-organizations/valar-group) it helped define the architecture of [Ironwood](/zcash-tech/ironwood), wrote its consensus rules and did the formal verification work. It is one of the five organizations in the coordinator multisig of [Shielded Coinholder Voting](/zcash-tech/shielded-coinholder-voting), and it works with [Shielded Labs](/zcash-organizations/shielded-labs) and the [Zcash Foundation](/zcash-organizations/zcash-foundation).

## Related pages

- [Electric Coin Company](/zcash-organizations/electric-coin-company): the organization ZODL's team came from
- [Sovright](/zcash-organizations/sovright): the non-profit that continues from Bootstrap's side of the split
- [Ironwood](/zcash-tech/ironwood): the upgrade ZODL helped design and build
- [Zcash Foundation](/zcash-organizations/zcash-foundation): works with ZODL and maintains Zebra
- [Keystone with Zodl](/guides/keystone-zashi): signing with a hardware wallet

## Sources

- [Zcash developers establish new entity and rebrand wallet](https://forklog.com/en/news/zcash-developers-establish-new-entity-and-rebrand-wallet), ForkLog, 17 February 2026
- [Zashi becomes Zodl](https://bitcoinist.com/zashi-becomes-zodl-zcash-wallet/), Bitcoinist
- [Zcash Open Development Lab raises over $25 million in seed funding](https://www.fxstreet.com/amp/cryptocurrencies/news/zcash-open-development-lab-raises-over-25-million-in-seed-funding-202603100327), FXStreet, 10 March 2026
- [ZODL website](https://zodl.com/)
`;

export function rewriteZodlPage(original: string): string {
  if (!original.includes("ZODL") || !original.includes("Zcash Open Development Lab")) return original;
  return PAGE;
}

// Obscura Labs page. The source page led with a photo, described planned work in the same tone as work already running, and named
// a second team member the forum announcement does not mention. It is rewritten around the organization's own announcement
// (Zcash Community Forum, 22 June 2026, "Obscura Labs: An independent Non-US Organisation"): registered in Nigeria, founded by Chidi
// Olisa who leads Zcash Nigeria, infrastructure already running (DNS seeder, Zebra nodes, lightwalletd, monitoring in development),
// public RPC endpoints and developer APIs described as something it intends to explore, ZecFiat, a planned small part-time team, and
// funding mainly from donations, partnerships and other ecosystem-aligned sources. Dropped as unconfirmed: the second named
// contributor and the claim that RPC endpoints are already public. If the page no longer looks like this one, the original is returned.
const PAGE = `# Obscura Labs

**Obscura Labs** is an independent organization registered in Nigeria that works on Zcash infrastructure and adoption in Africa and other emerging markets.

[Website](https://www.obscuralabs.org/) - [Announcement](https://forum.zcashcommunity.com/t/obscura-labs-an-independent-non-us-organisation/56325) - [Zcash Nigeria on X](https://x.com/ZcashNigeria)

## At a glance

| | |
|---|---|
| Registered in | Nigeria |
| Founder | Chidi Olisa, who also leads the Zcash Nigeria community |
| Focus | Infrastructure and practical adoption in Africa and other emerging markets |
| Announced | 22 June 2026, on the Zcash Community Forum |
| Stage | Early. A small team of part-time contributors is planned |

## Why it exists

Before starting Obscura Labs, Chidi Olisa worked on Zcash community building, education and user support in Nigeria. That work showed him what held back Zcash adoption in Africa: limited infrastructure, difficulty buying ZEC with local currencies, little developer support, few educational resources in local languages and few connections to everyday payment systems. Obscura Labs was created to address those barriers. Its view is that awareness alone is not enough, and that people also need reliable infrastructure, accessible products, tools, financial access and education.

## What it runs today

| Service | What it does |
|---|---|
| DNS seeder | Helps new Zcash nodes find peers when they connect to the network. A seeder in Africa adds to the geographic spread of the peer-to-peer network. |
| Zebra nodes | Full nodes running [Zebra](/zcash-tech/zebra-full-node), the Rust implementation of Zcash consensus. They add to the diversity and geographic spread of nodes. |
| lightwalletd | Serves blockchain data to light-client wallets, so that wallet users do not have to run a full node. See [Full Nodes](/zcash-tech/full-nodes). |

Obscura Labs is also building public monitoring and status pages, so that developers and users can check whether its public services are available.

## ZecFiat

**ZecFiat** is an Obscura Labs initiative to make it easier to move between ZEC and African local currencies and to lower the barriers for people and businesses that want to buy, use or exchange ZEC. Its structure, supported markets and operating model have not yet been published. See [zecfiat.com](https://zecfiat.com).

## Areas of focus

- **Infrastructure.** Reducing reliance on a few infrastructure operators. Public mainnet and testnet RPC endpoints and developer APIs are things the organization says it intends to explore, not services that are available today.
- **Adoption and financial access.** Access between ZEC and local currencies, on-ramps and off-ramps, merchant adoption, cross-border payments and onboarding. These matter in markets with currency instability, financial exclusion and expensive cross-border transfers.
- **Community growth.** Workshops, university outreach, localized content and translations, developer training and support for regional Zcash communities.
- **Ecosystem collaboration.** Working with developers, educators, researchers, businesses and infrastructure operators in the wider Zcash community, while operating independently.

## Team and funding

Chidi Olisa is the founder and the only person named in the announcement. He plans to build a small team of part-time contributors in infrastructure operations, software and product development, education, community development, business and payment integrations, and communications, and is looking for board members and advisors.

The organization says it will launch mainly on donations, partnerships and other funding from within the ecosystem. The announcement thanks Shielded Labs and an individual supporter for their help.

## Related pages

- [Full Nodes](/zcash-tech/full-nodes): the node software that Obscura Labs operates
- [Zcash Foundation](/zcash-organizations/zcash-foundation): maintains Zebra
- [Shielded Labs](/zcash-organizations/shielded-labs): another independent, donation-funded organization
- [Zcash Community Grants](/zcash-organizations/zcash-community-grants): funding for community projects

## Sources

- [Obscura Labs: An independent Non-US Organisation](https://forum.zcashcommunity.com/t/obscura-labs-an-independent-non-us-organisation/56325), Zcash Community Forum, 22 June 2026
- [Obscura Labs website](https://www.obscuralabs.org/)
`;

export function rewriteObscuraLabsPage(original: string): string {
  if (!original.includes("Obscura Labs") || !original.includes("Nigeria")) return original;
  return PAGE;
}

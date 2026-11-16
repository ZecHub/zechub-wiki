// Zcash Foundation page. The source page had a logo, said the team is "~12 employees", listed a Zcash Community Grants section that
// duplicated the ZCG page, and had nothing about 2025-2026. It is rewritten from the Foundation's own posts on the Zcash Community Forum:
// - "Zcash Foundation: 2025 Year in Review" (21 Jan 2026): four Zebra releases (2.5.0, 3.0.0-rc.0, 3.0.0, 3.1.0), Least Authority audit of the
//   NU6.1 changes, FROST 2.2.0 and an audit of frost-client and frostd, Zcon VI online, first in-person Zcash Dev Summit in Sofia, ZCAP moved
//   from Helios to Secure Internet Voting, Community & Coinholder Funding Model adopted, Alex Bornstein appointed Executive Director, Shielded
//   Aid Initiative launched in Q3, 4-star Charity Navigator rating, quarterly reports published.
// - "Zcash Foundation 2026: Stewardship and Innovation" (28 Jan 2026): after NU7 Zebra becomes the sole consensus node implementation; 2026
//   work on Zebra performance, NU7 ZIPs and the Z3 stack (Zebra, Zaino, Zallet); FROST v3, ZIP 312 and DKG; Shielded Aid Initiative; events
//   (Zcomm 24 March, Zcash Dev Summit in Rome 8 May, Zcon7 27-29 October in Cancun).
// - Q1 2026 transparency report as reported by Bitcoin.com: Zebra 4.3.0 fixed two critical flaws, Scott Onder joined the board in February.
// - Shielded Labs's Ironwood page: the Foundation implemented Ironwood in Zebra.
// Changed from the source page: "~12 employees" was dropped (no current figure is published in these sources), funding figures are not
// repeated because they change every quarter (the page links to the transparency reports), and the Zcash Community Grants block was reduced
// to a link because the ZCG page covers it. If the page no longer looks like this one, the original markdown is returned.
const PAGE = `# Zcash Foundation

The **Zcash Foundation (ZF)** is a US 501(c)(3) non-profit that builds and supports open, privacy-preserving software and community infrastructure. It maintains **Zebra**, an independent Zcash consensus node, and **FROST**, a threshold signature library, and runs the Zcash Community Advisory Panel (ZCAP) and community events such as Zcon. It also works beyond Zcash, for example on privacy tools for humanitarian aid.

[Website](https://zfnd.org/) - [Zebra](https://zebra.zfnd.org/) - [FROST](https://frost.zfnd.org/) - [Transparency reports](https://zfnd.org/category/transparency-reports/) - [Donate](https://zfnd.org/#donate)

## At a glance

| | |
|---|---|
| Type | US 501(c)(3) non-profit with a Board of Directors |
| Leadership | Alex Bornstein, Executive Director, appointed in 2025 |
| Software | Zebra (node), FROST (threshold signatures), Zaino and Zallet in the Z3 stack |
| Community | ZCAP polls, Zcon, Zcomm, Zcash Dev Summit, community calls |
| Other work | Shielded Aid Initiative, which brings privacy tools to humanitarian aid |
| Funding | Donations. It has not received Development Fund money since November 2024 |

## What it does

- **Zebra.** The Foundation maintains Zebra, written in Rust. After the NU7 upgrade it is meant to be the only consensus node implementation, replacing zcashd. The Foundation implemented [Ironwood](/zcash-tech/ironwood) in Zebra. See [Zebra](/zcash-tech/zebra-full-node) and [Full Nodes](/zcash-tech/full-nodes).
- **The Z3 stack.** Zebra, Zaino (an indexer and light-client server) and Zallet (a command-line wallet) are meant to replace the legacy zcashd. See [Zaino](/zcash-tech/zaino) for the indexer.
- **FROST.** A threshold signature scheme that lets a group sign without any one person holding the whole key. The 2026 goals include FROST v3, finalizing [ZIP 312](https://zips.z.cash/zip-0312), integrating FROST into zcash-devtool and a distributed key generation protocol. See [FROST](/zcash-tech/frost).
- **Shielded Aid Initiative.** Field-tested pilots and technical support to help aid organizations use privacy-by-design tools, and work on a zero-knowledge identity solution.
- **ZCAP.** The Zcash Community Advisory Panel is the Foundation's polling mechanism. It is used to elect the committee of [Zcash Community Grants](/zcash-organizations/zcash-community-grants). In 2025 ZCAP voting moved from Helios to Secure Internet Voting, and the first election with it had record turnout.
- **Trademark.** The Foundation enforces the [Zcash trademark policy](https://zfnd.org/new-zcash-trademark-policy/), which came with ECC's donation of the trademark, to help people tell official sources, apps and services from fraudulent ones.

## Events

The Foundation holds Zcon and supports community events. For 2026 it announced:

| Event | When and where |
|---|---|
| Zcomm | 24 March 2026, virtual, for community builders |
| Zcash Dev Summit | 8 May 2026, Rome |
| Zcon7 | 27-29 October 2026, Cancún, Mexico |

The 2025 Zcash Dev Summit in Sofia was the first in person, and Zcon VI was held online. See [Arborist Calls](/zcash-community/arborist-calls) for the Foundation's community calls.

## Funding and transparency

Until November 2024 the Foundation received part of the Development Fund under [ZIP 1014](https://zips.z.cash/zip-1014). It now relies on donations, and its use of funds is in the quarterly [Transparency Reports](https://zfnd.org/category/transparency-reports/). The 2025 review notes that it published reports for every quarter from Q4 2024 to Q3 2025 and holds a 4-star Charity Navigator rating. See the reports for balances and spending, because they change every quarter.

## Security work

In 2025 the Foundation commissioned a Least Authority audit of the Zebra NU6.1 changes and an external audit of FROST's client and server tools. In its Q1 2026 report it said Zebra 4.3.0 fixed two critical flaws: a remote denial-of-service bug and a consensus error that could allow a chain split. If you run Zebra, always read the [release notes](https://github.com/ZcashFoundation/zebra/releases).

## Videos

**Zebrad for Linux Tutorials**

<div className="my-8 w-full aspect-video max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-lg bg-black">
  <iframe
    className="w-full h-full"
    src="https://www.youtube.com/embed/videoseries?si=SZKFP5eAFDJ0MjJj&amp;list=PL40dyJ0UYTLI671cVldA_DhFSYxNwUJeQ"
    title="Zebrad for Linux Tutorials"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowFullScreen
    loading="lazy"
  />
</div>

**How to Zcash**

<div className="my-8 w-full aspect-video max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-lg bg-black">
  <iframe
    className="w-full h-full"
    src="https://www.youtube.com/embed/videoseries?si=fIbX-UP6HCMET0R2&amp;list=PL40dyJ0UYTLKyRbrz0sVLSWUh6bdVsQE1"
    title="How to Zcash"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowFullScreen
    loading="lazy"
  />
</div>

**Zcon Vozes: Brasil 2023**

<div className="my-8 w-full aspect-video max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-lg bg-black">
  <iframe
    className="w-full h-full"
    src="https://www.youtube.com/embed/videoseries?si=2h0YZZuRvayZ34Fb&amp;list=PL40dyJ0UYTLJm_hwYzpEPOOafwihL_mIu"
    title="Zcon Vozes: Brasil 2023"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowFullScreen
    loading="lazy"
  />
</div>

## Related pages

- [Zcash Community Grants](/zcash-organizations/zcash-community-grants): the committee the Foundation's ZCAP elects
- [ZODL](/zcash-organizations/zodl) and [Shielded Labs](/zcash-organizations/shielded-labs): organizations the Foundation works with
- [ZK AV Club](/zcash-organizations/zkav): the community media group that began as the Foundation's A/V Club
- [Ironwood](/zcash-tech/ironwood): the upgrade the Foundation implemented in Zebra

## Sources

- [Zcash Foundation: 2025 Year in Review](https://forum.zcashcommunity.com/t/zcash-foundation-2025-year-in-review/54401), Zcash Community Forum, January 2026
- [Zcash Foundation 2026: Stewardship and Innovation](https://forum.zcashcommunity.com/t/zcash-foundation-2026-stewardship-and-innovation/54477), Zcash Community Forum, January 2026
- [Zcash Foundation patches 2 critical Zebra flaws, reports $817K in Q1 spending](https://news.bitcoin.com/zcash-foundation-patches-2-critical-zebra-flaws-reports-817k-in-q1-spending/), Bitcoin.com
- [Zcash Foundation](https://zfnd.org/)
`;

export function rewriteZcashFoundationPage(original: string): string {
  if (!original.includes("Zcash Foundation") || !original.includes("501(c)(3)")) return original;
  return PAGE;
}

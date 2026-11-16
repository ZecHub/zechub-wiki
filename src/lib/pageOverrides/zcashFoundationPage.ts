// Zcash Foundation page. The source page had a logo, said the team is "~12 employees", listed a Zcash Community Grants section that
// duplicated the ZCG page, and had nothing about 2025-2026. It is rewritten from the Foundation's own posts on the Zcash Community Forum:
// - "Zcash Foundation: 2025 Year in Review" (21 Jan 2026): four Zebra releases (2.5.0, 3.0.0-rc.0, 3.0.0, 3.1.0), Least Authority audit of the
//   NU6.1 changes, FROST 2.2.0 and an audit of frost-client and frostd, Zcon VI online, first in-person Zcash Dev Summit in Sofia, ZCAP moved
//   from Helios to Secure Internet Voting, Community & Coinholder Funding Model adopted, Alex Bornstein appointed Executive Director, Shielded
//   Aid Initiative launched in Q3, 4-star Charity Navigator rating, quarterly reports published.
// - "Zcash Foundation 2026: Stewardship and Innovation" (28 Jan 2026): after NU7 Zebra becomes the sole consensus node implementation; 2026
//   work on Zebra performance, NU7 ZIPs and the Z3 stack (Zebra, Zaino, Zallet); FROST v3, ZIP 312 and DKG; Shielded Aid Initiative; events
//   (Zcomm 24 March, Zcash Dev Summit in Rome 8 May, Zcon7 27-29 October in Cancun).
// - Zcash Foundation announcement (20 Oct 2026): the Board named David Campbell Executive Director; Alex Bornstein (COO from 2021, ED from March 2025)
//   stays in a transition role through January 2027. Q2 2026 report: seven Zebra releases, Orchard soundness bug in June (NU6.2), FROST v3,
//   ZCG election with 14 candidates, stewardship of the Zcash GitHub, z.cash and @Zcash, Zcon7 details. November 2025 leadership post.
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
| Leadership | David Campbell, Executive Director, named on 20 October 2026. Alex Bornstein, who led the Foundation from March 2025, stays in a transition role until the end of January 2027 |
| Software | Zebra (node), FROST (threshold signatures), Zaino and Zallet in the Z3 stack |
| Community | ZCAP polls, Zcon, Zcomm, Zcash Dev Summit, community calls |
| Other work | Shielded Aid Initiative, which brings privacy tools to humanitarian aid |
| Funding | Donations. It has not received Development Fund money since November 2024 |

## Leadership

On 20 October 2026 the Board of Directors named **David Campbell** Executive Director. He has about three decades of experience building and securing systems: he founded the security firm Electric Alchemy, was founding CEO of JumpCloud and was Chief Security Officer at SendGrid through its IPO. He has been in the Zcash ecosystem since 2018, as an advisor to the company that became ECC, then as its Chief Operating Officer for four years, and for the past two years as a technical consultant to the Foundation. His stated first priorities are keeping Zebra and the Foundation's infrastructure fast, secure and reliable as more teams share responsibility for Zcash, and making privacy usable for ordinary people.

He succeeds **Alex Bornstein**, who joined in 2021 as Chief Operating Officer and became Executive Director in March 2025. Bornstein announced that he was stepping down and will stay through the end of January 2027 to help with the handover.

Other leaders named in the Foundation's announcements are Danika Delano (Chief Operating Officer), Pili Guerra (Head of Engineering) and Elise Hamdon (Chief Communications Officer). The Board is chaired by Andrew Miller, and its members are unpaid volunteers. See the [team page](https://zfnd.org/#our-team) for the current list.

## What it does

- **Zebra.** The Foundation maintains Zebra, written in Rust. zcashd reached its end of life in July 2026, and Zebra is the Foundation's node. Zakura, a Zebra-based node led by other teams, is covered on its own page. When an Orchard proof-circuit soundness bug was found in June 2026, the Foundation shipped emergency Zebra releases that paused Orchard actions and then activated NU6.2, and it implemented [Ironwood](/zcash-tech/ironwood), the upgrade that followed, in Zebra. See [Zakura Node](/zcash-tech/zakura-node). See [Zebra](/zcash-tech/zebra-full-node) and [Full Nodes](/zcash-tech/full-nodes).
- **The Z3 stack.** Zebra, Zaino (an indexer and light-client server) and Zallet (a command-line wallet) are meant to replace the legacy zcashd. See [Zaino](/zcash-tech/zaino) for the indexer.
- **FROST.** A threshold signature scheme that lets a group sign without any one person holding the whole key. FROST v3 was published in 2026. The goals include finalizing [ZIP 312](https://zips.z.cash/zip-0312), integrating FROST into zcash-devtool and a distributed key generation protocol. See [FROST](/zcash-tech/frost).
- **Shielded Aid Initiative.** Field-tested pilots and technical support to help aid organizations use privacy-by-design tools, and work on a zero-knowledge identity solution.
- **ZCAP.** The Zcash Community Advisory Panel is the Foundation's polling mechanism. It is used to elect the committee of [Zcash Community Grants](/zcash-organizations/zcash-community-grants). In 2025 ZCAP voting moved from Helios to Secure Internet Voting, and the first election with it had record turnout. The 2026 election for the committee had 14 candidates and added two members from 1 July.
- **Community assets.** The Foundation took over stewardship of the Zcash GitHub organization, the z.cash domain and the @Zcash X account in 2026. ZecHub runs the account day to day under a multi-year grant.
- **Trademark.** The Foundation enforces the [Zcash trademark policy](https://zfnd.org/new-zcash-trademark-policy/), which came with ECC's donation of the trademark, to help people tell official sources, apps and services from fraudulent ones.

## Events

The Foundation holds Zcon and supports community events. For 2026 it announced:

| Event | When and where |
|---|---|
| Zcomm | 24 March 2026, virtual, for community builders |
| Zcash Dev Summit | 8 May 2026, Rome |
| Zcon7 | 27-29 October 2026, Cancún, Mexico, on the week of Zcash's tenth anniversary. Tickets were free |

The Zcash Dev Summit began in Sofia in 2025 and its second edition was held in Rome in May 2026. Zcon VI in 2025 was online. See [Arborist Calls](/zcash-community/arborist-calls) for the Foundation's community calls.

## Funding and transparency

Until November 2024 the Foundation received part of the Development Fund under [ZIP 1014](https://zips.z.cash/zip-1014). It now relies on donations, and its use of funds is in the quarterly [Transparency Reports](https://zfnd.org/category/transparency-reports/). The 2025 review notes that it published reports for every quarter from Q4 2024 to Q3 2025 and holds a 4-star Charity Navigator rating. See the reports for balances and spending, because they change every quarter.

## Security work

In 2025 the Foundation commissioned a Least Authority audit of the Zebra NU6.1 changes and an external audit of FROST's client and server tools. Its Q1 2026 report said Zebra 4.3.0 fixed two critical flaws, a remote denial-of-service bug and a consensus error that could allow a chain split. Its Q2 report says seven Zebra releases shipped, including security fixes for 13 issues reported through responsible disclosure, and that release binaries are reproducible and signed. If you run Zebra, always read the [release notes](https://github.com/ZcashFoundation/zebra/releases).

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
- [Zcash Foundation Names David Campbell Executive Director](https://zfnd.org/zcash-foundation-names-david-campbell-executive-director/), Zcash Foundation, 20 October 2026
- [Stepping down from the Zcash Foundation](https://forum.zcashcommunity.com/t/stepping-down-from-the-zcash-foundation/58381), Alex Bornstein, Zcash Community Forum
- [Zcash Foundation Q2 2026 Report](https://zfnd.org/wp-content/uploads/2026/08/Zcash-Foundation-Q2-2026-Report.pdf)
- [Zcash Foundation Announces New Leadership Appointments](https://zfnd.org/zcash-foundation-announces-new-leadership-appointments/), November 2025
- [Zcash Foundation patches 2 critical Zebra flaws, reports $817K in Q1 spending](https://news.bitcoin.com/zcash-foundation-patches-2-critical-zebra-flaws-reports-817k-in-q1-spending/), Bitcoin.com
- [Zcash Foundation](https://zfnd.org/)
`;

export function rewriteZcashFoundationPage(original: string): string {
  if (!original.includes("Zcash Foundation") || !original.includes("501(c)(3)")) return original;
  return PAGE;
}

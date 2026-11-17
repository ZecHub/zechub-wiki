// Zcash Community Grants page. The source page described ZCG with a list of "recent projects" from years ago (ZSA, Ledger, ZGo, Zcash
// Media), no word on how the committee is chosen, and nothing about the debate over ZCG's funding that began in October 2026. It is
// rewritten from:
// - ZIP 1015 and ZIP 1016 (funding stream, Financial Privacy Foundation's role, third halving) and the wiki's FPF page.
// - Zcash Community Forum, "ZCG and Governance" (Nov 2025): ZCG is elected through ZCAP, the Zcash Foundation's polling system; proposals to
//   move some seats to coinholder voting were discussed and not adopted; the allocations end at the November 2028 halving unless a ZIP
//   replaces them.
// - The Block (27 Oct 2026): Sean Bowe's draft proposal (26 Oct) to end ZCG's automatic 8% share and send it to the Network Sustainability
//   Mechanism for the rest of the stream without raising supply; the 12% Coinholder-Controlled Fund is unchanged; ZCG keeps its assets and
//   honors commitments; it is a draft in the ZIPs repository, is not in NU7 and needs a future network upgrade. The "over USD 125M" figure
//   is Bowe's; his draft lists 91,452.98 ZEC and about USD 8.8M in dollar assets against USD 2.4M of outstanding grant liabilities.
// - Cointelegraph (30 Oct 2026) and Bankless (4 Nov 2026): ZCG floated moving about 36,200 of its roughly 91,500 ZEC to the NSM and taking
//   less of the future allocation; after criticism ZCG said it had decided not to take that proposal forward. A compromise from Bowe and
//   Zooko was also discussed.
// Dropped: the dated project list (replaced by a link to ZCG's own site), the committee description "currently five people" is kept because
// Bankless confirms five members. Individual names, quotes and the dollar value of ZEC are left out because they change.
// If the page no longer looks like this one, the original markdown is returned untouched.
const PAGE = `# Zcash Community Grants

**Zcash Community Grants (ZCG)** funds independent teams that do ongoing development and other work for the public good of the Zcash ecosystem. A committee of five people reviews applications and decides which to fund. ZCG is independent of the Electric Coin Company, now [ZODL](/zcash-organizations/zodl), and of the [Zcash Foundation](/zcash-organizations/zcash-foundation).

<OrgLinks items='[{"label": "Website", "href": "https://zcashcommunitygrants.org/"}, {"label": "Committee", "href": "https://zcashcommunitygrants.org/committee/"}, {"label": "Funded projects", "href": "https://docs.google.com/spreadsheets/d/1FQ28rDCyRW0TiNxrm3rgD8ai2KGUsXAjPieQmI1kKKg/edit?gid=135980745#gid=135980745"}]' />

## At a glance

| | |
|---|---|
| Decides | A five-member committee |
| Chosen by | A ZCAP poll run by the Zcash Foundation |
| Funding | 8% of the block subsidy under [ZIP 1016](https://zips.z.cash/zip-1016), until Zcash's third halving |
| Money is held by | The [Financial Privacy Foundation](/zcash-organizations/financial-privacy-foundation), which pays grants and milestones |
| Applications | A GitHub issue, plus a thread on the Zcash Community Forum |

## How it works

- **Funding.** The 8% stream began under the funding model of NU6.1 (ZIP 1016), when the earlier [ZIP 1015](https://zips.z.cash/zip-1015) stream expired. It runs until the third halving, at block 4,406,400 under the current block spacing, around November 2028. After that the allocation ends unless a new ZIP replaces it.
- **Custody.** FPF receives and administers the funds as a restricted fund. The committee's funding decisions do not need approval from FPF's board, but FPF can veto a decision that would break Cayman law or its reporting duties.
- **Committee.** Members are chosen through ZCAP, the Zcash Foundation's polling mechanism. Proposals to elect some seats by coinholder vote have been discussed on the forum and have not been adopted.
- **Transparency.** ZCG and FPF publish a dashboard, meeting minutes and reports. See the [funded projects list](https://docs.google.com/spreadsheets/d/1FQ28rDCyRW0TiNxrm3rgD8ai2KGUsXAjPieQmI1kKKg/edit?gid=135980745#gid=135980745) for what has been approved.

## The funding debate

In October 2026 the future of ZCG's automatic funding became a public debate.

- **26 October.** Zcash co-founder Sean Bowe submitted a draft proposal to end ZCG's automatic 8% share and send it to the [Network Sustainability Mechanism](https://shieldedlabs.net/nsm/) for the remainder of the stream, without increasing the ZEC supply. ZCG would keep the assets it already holds, keep approving grants and honor its outstanding commitments. The 12% Coinholder-Controlled Fund would not change. The draft is not part of the NU7 upgrade and would need a future network upgrade to take effect.
- **Treasury size.** Bowe said ZCG has "over $125M" in funding. His draft lists 91,452.98 ZEC and about USD 8.8 million in dollar-denominated assets, against USD 2.4 million in outstanding grant liabilities. The dollar value of the ZEC changes with the price.
- **ZCG's own proposal.** Around 29 October ZCG floated moving about 36,200 of its roughly 91,500 ZEC to the NSM and taking less of the allocation still due before the halving. After criticism, ZCG said it had decided not to take that proposal forward.
- **Other ideas.** A compromise from Sean Bowe and Zooko was also discussed: end ZCG's 8% share, put it in a locked fund for future development and legal defense, and have ZCG give 50,000 ZEC to the miners' reserve.

Zcash has no on-chain vote on this. Changes to the funding stream go through the ZIP process, with coinholder polls and community input as advisory signals. See [Funding & Governance Overview](/zcash-community/zcash-governance) and [Shielded Coinholder Voting](/zcash-tech/shielded-coinholder-voting). Because this debate is moving, check the forum and the ZIPs repository for where it stands.

## How to apply

<div className="my-8 w-full aspect-video max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-lg bg-black">
  <iframe
    className="w-full h-full"
    src="https://www.youtube.com/embed/ItEwc1lzvzc"
    title="How to Submit a Grant Application via ZCG"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowFullScreen
    loading="lazy"
  />
</div>

1. **Prepare a proposal.** Include the title and applicant details, the problem and your solution, deliverables with a timeline and milestones, the budget and funding request, and your relevant experience and the risks.
2. **Submit on GitHub.** Open a new issue in the Zcash Community Grants repository and use the grant application template. The GitHub issue is the official record of the application.
3. **Post on the forum.** Create a thread in the Zcash Community Grants category with the same title as the issue, a short summary and a link to the issue.
4. **Take part in the review.** Follow the issue and the thread and answer questions from the committee and the community.
5. **Outcome.** Approved proposals go on to funding and reporting. A proposal that is not approved may be revised and submitted again.

## Related pages

- [Financial Privacy Foundation](/zcash-organizations/financial-privacy-foundation): holds and pays out the ZCG funds
- [Coinholder-Directed Retroactive Grants](/zcash-organizations/coinholder-directed-retroactive-grants): the separate 12% fund, decided by ZEC holders
- [Funding & Governance Overview](/zcash-community/zcash-governance): who funds and governs Zcash
- [Development Fund](/start-here/development-fund): how block rewards have funded development
- [Shielded Labs](/zcash-organizations/shielded-labs): works on the Network Sustainability Mechanism

## Sources

- [ZIP 1016](https://zips.z.cash/zip-1016) and [ZIP 1015](https://zips.z.cash/zip-1015)
- [ZCG and Governance](https://forum.zcashcommunity.com/t/zcg-and-governance/53562), Zcash Community Forum
- [Zcash co-founder proposes ending grants subsidy](https://theblock.co/news/ecosystems/2026-10-27-zcash-co-founder-proposes-ending-grants-subsidy-citing-125-million-treasury-431847), The Block, 27 October 2026
- [Zcash grants committee floats $46M proposal](https://cointelegraph.com/news/zcash-grants-46m-proposal-governance-backlash), Cointelegraph, 30 October 2026
- [Zcash grants committee backs down on plan to give up 98,000 ZEC](https://www.bankless.com/read/news/zcash-grants-committee-backs-down-on-plan-to-give-up-98-000-zec.md), Bankless, 4 November 2026
`;

export function rewriteZcgPageFull(original: string): string {
  if (!original.includes("Zcash Community Grants") || !original.includes("8%")) return original;
  return PAGE;
}

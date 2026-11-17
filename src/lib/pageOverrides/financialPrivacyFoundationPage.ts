// Financial Privacy Foundation page. The source page described FPF only through its 2024 FPF x FPF grant program ("is currently
// creating a grant program") and did not mention its present roles. It is rewritten from primary sources:
// - ZIP 1015 (zips.z.cash/zip-1015): FPF is a Cayman Islands non-profit foundation company limited by guarantee that receives and
//   administers the Zcash Community Grants funds (8% of the block subsidy), keeps them as a Restricted Fund with separate accounting,
//   administers committee compensation, may veto committee decisions that break Cayman law or its reporting duties, and publishes
//   the dashboard, minutes and reports. ZCG Committee decisions need no FPF board approval.
// - FPF Q1 2026 report on the Zcash Community Forum (back-office services, ZCG milestones, retroactive grants cycles, feasibility
//   supplement on a separate ZCG entity) and the Q3 2026 retroactive grants call (FPF administers submissions and reporting and
//   performs KYC above USD 50,000).
// - The 2024 FPF x FPF program details come from the previous version of this page. Whether a round is open is not stated anywhere
//   in these sources, so the page points to FPF's grants page. If the page no longer looks like this one, the original is returned.
const PAGE = `# Financial Privacy Foundation

The **Financial Privacy Foundation (FPF)** is an independent non-profit based in the Cayman Islands. It does the legal, financial and administrative work for Zcash teams that have no company of their own, and it receives and pays out the money for [Zcash Community Grants](/zcash-organizations/zcash-community-grants).

<OrgLinks items='[{"label": "Website", "href": "https://www.financialprivacyfoundation.org"}, {"label": "Grants", "href": "https://www.financialprivacyfoundation.org/grants"}]' />

## What FPF does

| Role | What FPF does | Basis |
|---|---|---|
| Zcash Community Grants | Receives and administers the 8% of the block subsidy set aside for ZCG and pays grants and milestones | [ZIP 1015](https://zips.z.cash/zip-1015) and [ZIP 1016](https://zips.z.cash/zip-1016) |
| Coinholder-directed retroactive grants | Runs the application process: submissions, reporting, a summary before each vote and KYC checks | [Retroactive grants program](/zcash-organizations/coinholder-directed-retroactive-grants) |
| Back office for Zcash teams | Provides legal, financial and administrative services so that unincorporated teams can focus on building | [FPF Q1 2026 report](https://forum.zcashcommunity.com/t/fpf-q1-report-supplements/55722) |

## Zcash Community Grants

ZIP 1015 sets out FPF's duties for the ZCG funding stream, and ZIP 1016 continues the 8% stream under the same rules once the original stream expires. It is a company limited by guarantee incorporated in the Cayman Islands. Under the ZIP, FPF:

- receives and administers the ZCG funds and may spend them only on grants and on expenses reasonably related to running ZCG, not on its own operations;
- records the funds as a restricted fund and keeps separate accounts for them;
- administers the compensation of ZCG Committee members;
- publishes the ZCG dashboard, meeting minutes, quarterly and annual reports and an annual financial report;
- must explore turning ZCG into an independent organization if that is economically viable.

The ZCG Committee takes the funding decisions. They are final and do not need approval from FPF's board, but FPF can veto a decision that would violate Cayman law or its reporting obligations. The ZCG stream runs until Zcash's third halving. See [Zcash Community Grants](/zcash-organizations/zcash-community-grants) for how to apply.

## Retroactive grants

FPF also administers the [Coinholder-Directed Retroactive Grants Program](/zcash-organizations/coinholder-directed-retroactive-grants). It handles submissions and reporting, publishes a summary of each round before ZEC holders vote and carries out KYC checks before payments above USD 50,000. ZEC holders decide which grants are funded.

## Reports

FPF publishes quarterly reports on the Zcash Community Forum. Its Q1 2026 report included:

- 14 grants and independent contractor agreements approved in the quarter, with about USD 650,000 in new grants approved;
- 68 submissions received and 62 milestones paid;
- a feasibility study on turning ZCG into an independent organization, as ZIP 1015 asks FPF to explore. It found a separate ZCG Foundation feasible but expected administrative costs to rise by 50 to 70 percent, and FPF recommended keeping the current model and reviewing it again near the 2028 halving.

Read the full [Q1 2026 report and supplements](https://forum.zcashcommunity.com/t/fpf-q1-report-supplements/55722) on the forum.

## FPF x FPF grant program (2024)

FPF launched an experimental grant program on 18 March 2024, called FPF x FPF, with very limited funds so that it could refine its grant process. It funded engineering projects that benefit the Zcash ecosystem and could be fully completed within the program's limits.

| Detail | FPF x FPF (2024 round) |
|---|---|
| Total funding | Up to USD 50,000 |
| Maximum request | USD 25,000 |
| KYC | None |
| Payment | On successful completion of the project |

Applicants were told whether they were eligible within 5 calendar days of the deadline, and an ad hoc review committee decided awards within 20 calendar days. This describes the 2024 round. See [FPF's grants page](https://www.financialprivacyfoundation.org/grants) for the status of any program, and the [FPF and ZecHub bounty announcement](https://www.financialprivacyfoundation.org/post/partnership-announcement-zechub) for the partnership with ZecHub.

## Contact

Questions about FPF programs can be sent to info@financialprivacyfoundation.org.

## Related pages

- [Zcash Community Grants](/zcash-organizations/zcash-community-grants): the grant program FPF administers
- [Coinholder-Directed Retroactive Grants](/zcash-organizations/coinholder-directed-retroactive-grants): grants for completed work, decided by ZEC holders
- [Development Fund](/start-here/development-fund): how block rewards have funded Zcash development
- [Zcash Funding & Governance Overview](/zcash-community/zcash-governance): who funds and governs Zcash today

## Sources

- [ZIP 1015: Block Subsidy Allocation for Non-Direct Development Funding](https://zips.z.cash/zip-1015) and [ZIP 1016](https://zips.z.cash/zip-1016)
- [FPF Q1 Report + Supplements](https://forum.zcashcommunity.com/t/fpf-q1-report-supplements/55722), Zcash Community Forum
- [Call for Proposals: Coinholder-Directed Retroactive Grants Program Q3](https://forum.zcashcommunity.com/t/call-for-proposals-coinholder-directed-retroactive-grants-program-q3/56885)
`;

export function rewriteFpfPageFull(original: string): string {
  if (!original.includes("Financial Privacy Foundation") || !original.includes("FPF")) return original;
  return PAGE;
}

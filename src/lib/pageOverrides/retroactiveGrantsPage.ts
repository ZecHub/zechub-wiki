// Coinholder-Directed Retroactive Grants page. The source page mixed round-specific dates, an out-of-date "current round"
// note and a few unsourced details, so it is rewritten from primary sources:
// - ZIP 1016 (zips.z.cash/zip-1016): 8% ZCG and 12% Coinholder-Controlled Fund, lockbox seed, votes every three months with
//   at least 30 days of community review, 420,000 ZEC minimum participation and a simple majority, independent votes,
//   competing proposals, veto rules, funds usable until the third halving.
// - The July 2025 program design post and the Q3 2026 call for proposals on the Zcash Community Forum (retroactive only, anyone
//   may apply or nominate, GitHub template plus forum thread, USD requests paid in shielded ZEC, FPF administers submissions,
//   reporting and KYC above USD 50,000, Key-Holder Organizations hold the multisig).
// Dropped as unsourced: the Orchard-only/no-lockup voting detail, a forum title format, and the Key-Holder names (ZIP 1016 does
// not name them). Round dates are not repeated here because each round announces its own. If the page no longer looks like this
// one, the original markdown is returned untouched.
const PAGE = `# Coinholder-Directed Retroactive Grants

The **Coinholder-Directed Retroactive Grants Program** pays for work that has already been done. People who hold ZEC vote on each application, and the money comes from the Coinholder-Controlled Fund, one of the two funding streams created by [ZIP 1016](https://zips.z.cash/zip-1016).

## How the program is funded

ZIP 1016 took effect with [NU6.1](/zcash-tech/nu6-1) in November 2025. It splits the development funding in the block subsidy between two streams, and both run until Zcash's third halving in 2028.

| Stream | Share of the block subsidy | Who decides | What it is for |
|---|---|---|---|
| [Zcash Community Grants](/zcash-organizations/zcash-community-grants) | 8% | The ZCG committee | Proposed work, paid against milestones |
| Coinholder-Controlled Fund | 12% | ZEC holders, by vote | Work that is already complete |

The Coinholder-Controlled Fund started with the coins that had accumulated in the Deferred Dev Fund Lockbox (see [Development Fund](/start-here/development-fund)). Its money is held in a multisig wallet by **Key-Holder Organizations**, which are legally bound to execute what coin holders approve. ZIP 1016 does not name them, so the program announcements for each round are the place to check who currently serves. The [Financial Privacy Foundation](/zcash-organizations/financial-privacy-foundation) runs the application process: it handles submissions and reporting, publishes a summary before each vote and carries out KYC checks.

## What qualifies

- **Completed work only.** The program does not fund proposed or in-progress work. The work must be finished and publicly verifiable when the application is submitted.
- **Anyone can apply.** You can apply for your own work or nominate another person, company or project.
- **No fixed cap.** The program does not set a maximum request.
- **No scoring rubric.** Each coin holder decides whether the work was worth paying for. Links to code, reports, usage figures or other public evidence make that decision easier.
- **Looking for funding for future work?** Apply to [Zcash Community Grants](/zcash-organizations/zcash-community-grants) instead. A proposal that coin holders reject can also go through ZCG's milestone-based model.

## How to apply

1. **Fill in the proposal template on GitHub.** It is the grant application issue template in the Financial Privacy Foundation's coinholder grants repository.
2. **Post the proposal on the Zcash Community Forum.** Copy it into a new thread in the Community Grants category, in the Retroactive Grants section, so the community can comment.
3. **Submit before the round's deadline.** Each round announces its own call for proposals and deadline on the forum.
4. **Answer questions during the review period.**

Two practical points:

- Requests are stated in USD but paid in shielded ZEC, so the amount you receive can move with the exchange rate.
- Grants above USD 50,000 require a KYC check by the Financial Privacy Foundation before payment.

## Timeline of a round

| Stage | What happens |
|---|---|
| Call for proposals | The forum announces the round with its submission deadline. |
| Review | Applications are open for community review for at least 30 days, and a summary is published before the vote opens. |
| Poll | ZEC holders vote on each proposal. Recent rounds have kept the poll open for about two weeks. |
| Payment | Key-Holder Organizations sign the payments for approved grants, unless a veto applies. |

## How voting works

- Every proposal gets its own Yes/No vote.
- A vote counts only if at least **420,000 ZEC**, about 2% of the eventual supply, takes part.
- A **simple majority** approves a proposal.
- Votes are independent, so the same coins can be used in every vote.
- If proposals compete for the same funding, each gets a separate vote and the approved one with the most ZEC committed wins.
- Coin holders are not obliged to fund anything. They can leave the money at rest.

For how private, stake-weighted polls of shielded ZEC work, see [Shielded Coinholder Voting](/zcash-tech/shielded-coinholder-voting).

## Key-Holder veto

Key-Holder Organizations can block a grant that coin holders have approved in two cases:

- any one of them declares that funding it would break its legal or reporting obligations, or
- two or more of them declare a principled objection.

They cannot override a rejection: a proposal that coin holders vote down stays rejected.

## Related pages

- [Zcash Community Grants](/zcash-organizations/zcash-community-grants): funding for proposed work
- [Financial Privacy Foundation](/zcash-organizations/financial-privacy-foundation): runs the application process
- [Zcash Labs](/zcash-organizations/zcash-labs): seeks reimbursement through this program for work it funds itself
- [Development Fund](/start-here/development-fund): where the funding streams come from

## Sources

- [ZIP 1016: Community and Coinholder Funding Model](https://zips.z.cash/zip-1016)
- [NU6.1: Coinholder-Directed Retroactive Grants Program](https://forum.zcashcommunity.com/t/nu6-1-coinholder-directed-retroactive-grants-program/51713), program design post on the Zcash Community Forum
- [Call for Proposals: Coinholder-Directed Retroactive Grants Program Q3](https://forum.zcashcommunity.com/t/call-for-proposals-coinholder-directed-retroactive-grants-program-q3/56885), an example of a round announcement
- [Zcash Community Forum](https://forum.zcashcommunity.com/), where each round is announced
`;

export function rewriteRetroactiveGrantsPage(original: string): string {
  if (!original.includes("Retroactive Grants") || !original.includes("Coinholder-Controlled Fund")) return original;
  return PAGE;
}

// Zcash Labs page. The source page had a logo, repeated the same "go to market" idea in several sections and asserted the organization's
// intent in its own words. It is rewritten from the announcement and the thread under it:
// - "Announcing Zcash Labs: A Zcash Go To Market Company" (Zcash Community Forum, 12 Aug 2026, posted by the forum user thowar2, whom commenters
//   call Tom; no founders or team members are named): integrations for businesses and institutions, a Shielded Vote validator, lightwalletd and
//   full-node instances with RPC planned, initial grants and consulting, upfront funding repaid through retroactive grants at cost plus 20%,
//   no equity taken, ZcashToCash (zcashto.cash) as the first project with an initial USD 5,000, questions from the community about voting
//   by funded applicants, undisclosed ZEC holdings and low usage of ZcashToCash.
// - AMBCrypto (16 Sept 2026): Zcash Labs committed USD 80,000 to help Ledger integrate Ironwood.
// - crypto.news (1 Oct 2026): Q3 retroactive grants round, for context on how reimbursement works; the report does not mention Zcash Labs.
// Dropped as unconfirmed: whether the USD 6,000 request for ZcashToCash was approved (a forum comment says so but the announcement thread does
// not), the ZEC seed grant range, and the claim that Zcash Labs is a "go-to-market" leader. If the page no longer looks like this one, the
// original markdown is returned untouched.
const PAGE = `# Zcash Labs

**Zcash Labs** is an independent organization that helps businesses, institutions and builders integrate and use Zcash. It describes itself as a "go to market" company: it offers consulting, technical integration, infrastructure and early funding, and it pays for some of this work with its own capital before asking ZEC holders to reimburse it.

[Website](https://zcashlabs.org/) - [Announcement](https://forum.zcashcommunity.com/t/announcing-zcash-labs-a-zcash-go-to-market-company/56975) - [X](https://x.com/ZcashLabs)

## At a glance

| | |
|---|---|
| Type | Independent organization, not affiliated with the Zcash Foundation or [ZODL](/zcash-organizations/zodl) |
| Announced | The website went public on 6 August 2026 and the forum announcement followed on 12 August |
| Team | Not named in the announcement. It was posted by a forum user, thowar2 |
| Offers | Consulting, technical integration, infrastructure, initial grants and co-marketing |
| Funding model | Its own capital up front, then a request to ZEC holders to cover the cost plus 20% |
| First project | ZcashToCash, a peer-to-peer service for turning ZEC into fiat |

## What it does

- **Consulting.** It starts by asking whether Zcash fits a business's needs, and says it will say so if it does not.
- **Technical integration.** It helps companies and institutions plan and build Zcash integrations, including custom solutions when existing tools fall short.
- **Infrastructure.** It runs a [Shielded Vote](/zcash-tech/shielded-coinholder-voting) validator and is building full-node and lightwalletd instances. It plans to add RPC services. See [Full Nodes](/zcash-tech/full-nodes).
- **Initial grants and co-marketing.** It gives early money to Zcash-focused projects and helps them reach their audience.

Zcash Labs says it had been working with Zcash projects before the public announcement.

## How it is funded

Zcash Labs pays up front from its own capital, so a team does not have to wait for a grant. When the work is done, it can ask ZEC holders to reimburse the cost through the [Coinholder-Directed Retroactive Grants](/zcash-organizations/coinholder-directed-retroactive-grants) program.

- **Markup.** It plans to ask for its costs plus 20%. For example, a project that cost USD 5,000 would be submitted as USD 6,000. Zcash Labs says the markup pays for the financial risk, and compares it with typical consulting fees of 10 to 20%.
- **Risk.** Holders decide whether to reimburse. If they refuse, Zcash Labs bears the cost.
- **Equity.** It says it has not taken equity in the projects it supports, that teams are paid for agreed work, and that it would disclose it if that changed.

## Projects

- **ZcashToCash** ([zcashto.cash](https://zcashto.cash)) is a service for converting ZEC to fiat through peer-to-peer trades. Zcash Labs invested USD 5,000 in it as a proof of concept. When asked about its low volume, Zcash Labs said the money was meant for early traction and that more funding would depend on usage.
- **Ledger.** In September 2026 AMBCrypto reported that Zcash Labs committed USD 80,000 to help Ledger integrate Ironwood, so that users can keep their own ZEC with Ledger's hardware wallets. See [Ledger shielded ZEC](/guides/ledger-shielded-zec) for the state of that support.

## Questions raised by the community

The forum thread under the announcement raised questions that readers should know about:

- Whether applicants funded by Zcash Labs could vote their own coins in the retroactive grants votes.
- That Zcash Labs holds ZEC and has not said how much.
- Whether an organization that decides what to fund and then asks holders to repay it, with a markup, has the right incentives, and how that differs from a venture investor. Zcash Labs says holders keep the final decision and that it takes the loss if they say no.

## Related pages

- [Coinholder-Directed Retroactive Grants](/zcash-organizations/coinholder-directed-retroactive-grants): the program Zcash Labs uses to be repaid
- [Zcash Community Grants](/zcash-organizations/zcash-community-grants): the committee-run funding stream
- [Ledger shielded ZEC](/guides/ledger-shielded-zec): hardware wallet support for Zcash
- [Valar Group](/zcash-organizations/valar-group): builds the Shielded Vote system Zcash Labs runs a validator for

## Sources

- [Announcing Zcash Labs: A Zcash Go To Market Company](https://forum.zcashcommunity.com/t/announcing-zcash-labs-a-zcash-go-to-market-company/56975), Zcash Community Forum, 12 August 2026
- [Zcash boosts privacy with $80K Ledger push](https://ambcrypto.com/zcash-boosts-privacy-with-80k-ledger-push-what-it-means-for-zec/), AMBCrypto, 16 September 2026
- [Zcash Labs](https://zcashlabs.org/)
`;

export function rewriteZcashLabsPage(original: string): string {
  if (!original.includes("Zcash Labs") || !original.includes("go to market")) return original;
  return PAGE;
}

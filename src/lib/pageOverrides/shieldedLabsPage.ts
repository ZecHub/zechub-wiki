// Shielded Labs page. The source page was already accurate and well organized; this rewrite keeps its content and changes the layout
// (no logo, a facts table, a projects table, a funding section). Checked against shieldedlabs.net (projects, Epoch and Ironwood pages),
// the Shielded Labs thread on the Zcash Community Forum (Swiss association, donation-funded, independent of the Dev Fund and block
// rewards, Winklevoss donation of 3,221 ZEC on 20 January 2026, Vitalik Buterin's Crosslink donation on 6 February 2026, works with ZODL and
// the Zcash Foundation) and The Block (21 January 2026). Changed from the source page: it said the Orchard vulnerability was disclosed to ZODL,
// but the official Ironwood page says only that ZODL led the emergency fix, and the degrees listed for two Epoch engineers could not be
// confirmed, so Epoch biographies are limited to previous roles from Shielded Labs's own announcement. If the page no longer looks like
// this one, the original markdown is returned untouched.
const PAGE = `# Shielded Labs

**Shielded Labs** is an independent, donation-funded organization based in Switzerland that adds engineering and research capacity to Zcash. Its stated mission is to build unstoppable private money that empowers human freedom and self-sovereignty, with a focus on the sustainability, security and scalability of the network.

[Website](https://shieldedlabs.net/) - [Projects](https://shieldedlabs.net/projects/) - [Team](https://shieldedlabs.net/team/) - [GitHub](https://github.com/ShieldedLabs)

## At a glance

| | |
|---|---|
| Based in | Switzerland, founded as a Swiss association |
| Funding | Donations from Zcash holders and supporters |
| Dev Fund | Operates independently of the Development Fund and of block rewards |
| Relationship to others | Not part of the Electric Coin Company, the Zcash Foundation or Zcash Community Grants |
| Focus | Protocol research and engineering, rather than consumer products |

## Projects

| Project | What it is |
|---|---|
| [Network Sustainability Mechanism](https://shieldedlabs.net/nsm/) | Proposed changes to support the long-term sustainability of Zcash's 21 million ZEC supply cap, including voluntary burns, a smoother issuance curve and fee burning, described in ZIPs 233, 234 and 235 |
| [Crosslink](https://shieldedlabs.net/crosslink-faq/) | A proposed hybrid consensus upgrade that adds proof-of-stake finality to Zcash's proof-of-work block production. See [Crosslink Protocol](/zcash-tech/crosslink-protocol) |
| [Dynamic Fees](https://shieldedlabs.net/fees/) | Work on transaction fees driven by the market, based on comparable transactions |
| [Zero](https://shieldedlabs.net/zero/) | A suite of open-source Zcash infrastructure software for exchanges, mining pools, wallet providers and other organizations |
| [Ironwood](https://shieldedlabs.net/ironwood/) | The network upgrade and new shielded pool that restored verifiable soundness of the circulating supply after the Orchard vulnerability |
| [Epoch](https://shieldedlabs.net/epoch-future-proof-cryptography-for-zcash/) | Research and engineering toward high-assurance post-quantum cryptography for Zcash |

Shielded Labs also supports node operators with long-running infrastructure and enterprise-level support.

## Epoch

Epoch was announced on 1 October 2026. Its aim is production-ready, high-assurance cryptography that stays secure as attackers' capabilities change, including quantum computers, AI-assisted attacks and state-level adversaries. It uses formal verification to show that implementations match the cryptographic design.

It is led by three cryptographers:

- **Ulrich Haböck**, Chief Cryptographer. Previously a cryptographer at StarkWare and an applied cryptographer at Polygon Labs (Polygon Zero).
- **Luke Edwards**, Cryptography Engineer. Previously on Aztec's cryptography engineering team from 2022, most recently as technical lead.
- **Suyash Bagad**, Cryptography Engineer. Previously at Aztec, where he worked on the Barretenberg cryptography library and the PLONK family of proof systems.

Phase 1 is research and design: surveying existing research, evaluating candidate constructions against Zcash's security and performance requirements and writing a concrete post-quantum design proposal, in coordination with [Project Tachyon](/zcash-tech/project-tachyon) and other efforts. The target is a production-ready implementation by the end of 2027 that could become the basis of a future network upgrade. Shielded Labs says it should provide at least 128 bits of security, rely on minimal and well-understood assumptions and be formally verified.

## Ironwood

In 2026 a critical counterfeiting vulnerability in the Orchard shielded pool was discovered by Shielded Labs security researcher Taylor Hornby. It was fixed through an emergency network upgrade led by ZODL.

[Ironwood](/zcash-tech/ironwood) then restored independent confidence in the circulating supply. It creates a new shielded pool that uses the corrected Orchard circuit and seals the original Orchard pool, so that funds can leave it only through Zcash's existing turnstile. Project Tachyon, Valar Group and ZODL helped define the architecture, wrote the consensus rules and did the formal verification. The Zcash Foundation implemented Ironwood in Zebra. Shielded Labs took part in finding and fixing the vulnerability, in designing and reviewing the solution and in preparing the ecosystem for activation.

## Governance information

Shielded Labs publishes a [governance page](https://shieldedlabs.net/governance/) that tracks protocol polls, ZCAP participation, coinholder-directed funding and the wallets that support voting.

Zcash does not use automatic on-chain governance for protocol changes. Polls and community input are advisory signals that feed into a rough-consensus process, and Shielded Labs's page is meant to make those signals easier to follow and verify. See [Shielded Coinholder Voting](/zcash-tech/shielded-coinholder-voting) and the [Funding & Governance Overview](/zcash-community/zcash-governance).

## Funding

Shielded Labs is funded by donations. Two gifts have been reported publicly:

- On 20 January 2026, Tyler and Cameron Winklevoss donated 3,221 ZEC, about USD 1.2 million at the time, to support the Network Sustainability Mechanism, Crosslink and Dynamic Fees. It was their second donation; their first, in 2023, helped form the Crosslink team ([The Block](https://www.theblock.co/news/ecosystems/2026-01-21-winklevoss-twins-donate-1-2m-in-zec-to-back-independent-zcash-development-386492)).
- On 6 February 2026, Vitalik Buterin made a second donation to Crosslink, to help move it from prototype to a persistent, incentivized testnet and then toward production readiness.

## How it works with others

Shielded Labs sets its own priorities, follows the ZIP process and says it works closely with ZODL and the Zcash Foundation.

## Related pages

- [Crosslink Protocol](/zcash-tech/crosslink-protocol): the proof-of-stake finality design Shielded Labs is working on
- [Ironwood](/zcash-tech/ironwood): the upgrade that restored the circulating supply
- [Project Tachyon](/zcash-tech/project-tachyon): the scaling effort Epoch coordinates with
- [ZODL](/zcash-organizations/zodl) and [Zcash Foundation](/zcash-organizations/zcash-foundation): organizations Shielded Labs works with
- [Obscura Labs](/zcash-organizations/obscura-labs): an independent organization in Nigeria whose announcement thanks Shielded Labs for its support

## Sources

- [Shielded Labs: projects](https://shieldedlabs.net/projects/), [Epoch](https://shieldedlabs.net/epoch-future-proof-cryptography-for-zcash/) and [Ironwood](https://shieldedlabs.net/ironwood/)
- [Shielded Labs: An Independent, Non-US Organization](https://forum.zcashcommunity.com/t/shielded-labs-an-independent-non-us-organization/43855), Zcash Community Forum
- [Winklevoss twins donate $1.2M in ZEC to back independent Zcash development](https://www.theblock.co/news/ecosystems/2026-01-21-winklevoss-twins-donate-1-2m-in-zec-to-back-independent-zcash-development-386492), The Block
`;

export function rewriteShieldedLabsPage(original: string): string {
  if (!original.includes("Shielded Labs") || !original.includes("Switzerland")) return original;
  return PAGE;
}

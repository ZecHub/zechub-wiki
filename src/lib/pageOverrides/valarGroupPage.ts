// Valar Group page. The source page was detailed but listed several things this rewrite could not confirm, so it keeps what primary or
// news sources support:
// - Zcash Community Forum, "The Coinholder Voting Chain" (6 Aug 2026): built by Valar Group; 1 Ironwood ZEC at the snapshot = 1 vote; vote
//   amounts split into 16 encrypted shares; homomorphic encryption to an MPC committee; PIR for nullifier non-membership (audited by Zellic);
//   proposed 2-of-5 coordinator multisig (Project Tachyon, Zcash Foundation, ZODL, Shielded Labs, Valar Group); at least 10 validators.
// - TechFlow (Zcash Q3 report): Dev Ojha leads Valar, Zakura co-led with Project Tachyon, version 1.0.0 on 15 July 2026, NU7 vote with an
//   24 Aug snapshot and a 25 Aug to 14 Sep window, nearly 2.4M of about 3.6M eligible ZEC against a 1M threshold.
// - Shielded Labs's Ironwood page for who worked on Ironwood.
// Dropped as unconfirmed: the named engineers and their prior employers, "ZIP editor", the repository list, the operator and auditor
// URLs, the NU7 testnet hostnames, and the claim that Project Tachyon co-ran the vote. If the page no longer looks like this one, the
// original markdown is returned untouched.
const PAGE = `# Valar Group

**Valar Group** is an independent engineering group that works on scaling Zcash and on private governance for ZEC holders. Its main projects are Shielded Vote, a private coinholder voting system, and [Zakura](/zcash-tech/zakura-node), a Zcash full node it co-leads with Project Tachyon.

[Website](https://valargroup.dev/) - [GitHub](https://github.com/valargroup)

## At a glance

| | |
|---|---|
| Led by | Dev Ojha, co-founder of Osmosis |
| Focus | Private coinholder governance, full-node software, wallet sync and network scaling |
| Main projects | Shielded Vote, Zakura, Private Information Retrieval (PIR) |
| Works with | Project Tachyon, ZODL, the Zcash Foundation and Shielded Labs |

Valar Group acts as an independent contributor and does not own the protocol. Protocol changes still go through ZIPs, implementation, review and community signaling. Its role is to design, build and publish the systems that make those processes practical.

## Shielded Vote

Zcash has no automatic on-chain governance. Coinholder polls are advisory signals that feed a wider rough-consensus process. Valar Group built **Shielded Vote** so that holders can vote from shielded balances without revealing who they are or how much they hold.

How it works, in short:

- **One ZEC, one vote.** Each Ironwood ZEC held at a snapshot height counts as one vote. Voters prove they hold an unspent balance at that height and create a voting note controlled by a separate governance key.
- **Encrypted amounts.** Each vote is split into 16 encrypted shares and sent to submission servers at random times, so a vote cannot be linked to the notes behind it. The amounts are added up under homomorphic encryption.
- **Private proofs.** Private Information Retrieval is used to prove that a note was unspent without revealing its nullifier. The forum post says the PIR component was audited by Zellic.
- **Shared control.** In the proposed design, a coordinator multisig of 2 of 5 representatives from Project Tachyon, the Zcash Foundation, ZODL, Shielded Labs and Valar Group creates voting rounds and admits validators. At least 10 validators run the chain and hold shares of the decryption key, and a threshold of two thirds of them is needed to decrypt the final tally, so no single party can read individual votes.

### The NU7 poll

Valar Group's system ran the NU7 coinholder poll in 2026. Only ZEC spendable in Ironwood at the 24 August snapshot could vote, and voting ran from 25 August to 14 September. Nearly 2.4 million of about 3.6 million eligible ZEC took part, above the 1 million ZEC participation threshold. See [Shielded Coinholder Voting](/zcash-tech/shielded-coinholder-voting) for what the poll decided and how to take part.

## Zakura

**Zakura** is a Zcash full node built on the Zebra codebase and compatible with its consensus rules. Valar Group and Project Tachyon co-lead it. Version 1.0.0 was released on 15 July 2026, before the end of life of zcashd on 18 July. It supports Ironwood, offers a compatibility mode that follows the zcashd interface and can start from a snapshot. See [Zakura Node](/zcash-tech/zakura-node) for features and setup, and [Full Nodes](/zcash-tech/full-nodes) for how it compares with Zebra.

## Private Information Retrieval

Shielded wallets have to scan a lot of chain data. Valar Group builds PIR services and libraries so that a wallet can fetch the proofs it needs without downloading whole nullifier sets and without revealing which notes it cares about. PIR is a core part of Shielded Vote and is aimed at faster private wallet sync more broadly.

## Ironwood

After the Orchard vulnerability, Project Tachyon, Valar Group and ZODL helped define the architecture of [Ironwood](/zcash-tech/ironwood), wrote its consensus rules and did the formal verification work. Shielded Labs and the Zcash Foundation also took part, and the Foundation implemented Ironwood in Zebra.

## Related pages

- [Zakura Node](/zcash-tech/zakura-node): the full node Valar Group co-leads
- [Shielded Coinholder Voting](/zcash-tech/shielded-coinholder-voting): how the polls work and how to vote
- [Project Tachyon](/zcash-tech/project-tachyon): the scaling effort Valar Group works with
- [Shielded Labs](/zcash-organizations/shielded-labs): one of the five organizations in the Shielded Vote multisig
- [ZODL](/zcash-organizations/zodl): another organization in the Shielded Vote multisig

## Sources

- [The Coinholder Voting Chain](https://forum.zcashcommunity.com/t/the-coinholder-voting-chain/56925), Zcash Community Forum, August 2026
- [Zcash Q3 Report: Zakura Launches, Privacy Pool Supply Returns to 29%](https://www.techflowpost.com/en-US/article/34628), TechFlow
- [Ironwood](https://shieldedlabs.net/ironwood/), Shielded Labs
`;

export function rewriteValarGroupPage(original: string): string {
  if (!original.includes("Valar Group") || !original.includes("Zakura")) return original;
  return PAGE;
}

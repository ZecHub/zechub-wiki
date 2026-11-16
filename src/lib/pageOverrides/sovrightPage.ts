// Sovright page. The source page said Sovright "was previously known as Bootstrap", described its work in general terms and left
// a "(Coming Soon)" heading. Sources used: The Block (30 June 2026: Sovright is a non-profit founded by three former Bootstrap board
// members after the dispute with ECC; Argos announced 30 June 2026; mining pool testnet launched the week before; Michelle Lai executive
// chairman, Zaki Manian, Kristi Põldsam) and The Energy Mag (15 June 2026: testnet pool, shielded payouts by default, no minimum
// hashrate). The two outlets describe the Bootstrap link differently (The Block: founded by former Bootstrap board members; Energy Mag:
// formerly known as Bootstrap), so the page states both and does not pick one. Kept from the source page: the
// 501(c)(3) description, the meaning of the name, the focus areas. Mining details beyond these (Stratum V2, relay network) are covered by the
// wiki's mining pages and are linked, not repeated. If the page no longer looks like this one, the original markdown is returned.
const PAGE = `# Sovright

**Sovright** is a US 501(c)(3) non-profit that describes its mission as supporting human autonomy. It began with Zcash infrastructure, mining, protocol development and ecosystem support, and builds tools and services meant to make private digital currency infrastructure more resilient.

<OrgLinks items='[{"label": "Website", "href": "https://sovright.com/"}, {"label": "Mining pool", "href": "https://mining.sovright.com/"}, {"label": "Argos", "href": "https://argos.sovright.com/"}, {"label": "GitHub", "href": "https://github.com/sovright"}]' />

## At a glance

| | |
|---|---|
| Type | US 501(c)(3) non-profit |
| Leadership | Michelle Lai (executive chairman), Zaki Manian and Kristi Põldsam (product development), as named by The Block |
| Products | Argos, for recovering funds from old wallets, and the Sovright Mining Pool |
| Focus | Zcash infrastructure, mining and ecosystem support, now widening to secure communications, resilient networks and private compute |

## Background

Sovright came out of the 2026 split at Electric Coin Company and Bootstrap. The sources describe the link to Bootstrap in two ways:

- The Block reports Sovright as a non-profit founded by three former Bootstrap board members, after the governance dispute that led the ECC team to leave and form [ZODL](/zcash-organizations/zodl).
- The Energy Mag reports that Sovright was formerly known as Bootstrap.

Either way, it is the non-profit that continues from Bootstrap's side of that dispute. See [Electric Coin Company](/zcash-organizations/electric-coin-company) for the events of January 2026.

The name combines **sovereign** and **right**. It reflects the organization's focus on individual sovereignty, privacy and the right to choose how personal data, money, communications, compute and online activity are controlled.

## Argos: wallet recovery

Sovright announced **Argos** on 30 June 2026. It is a tool for people whose shielded funds were stranded when the Zecwallet Lite wallet was abandoned in 2022. Users still need their old seed phrase to recover funds. Sovright has said it cannot say how many addresses are affected and described the losses as significant.

For the step-by-step process and safety advice, see [Recovering funds](/using-zcash/recovering-funds). Never type a seed phrase into a website.

## Mining pool

Sovright runs a Zcash mining pool at [mining.sovright.com](https://mining.sovright.com/). A testnet version launched on 15 June 2026. It aims to help individual miners spread out Zcash's concentrated hashrate, and it pays out to shielded addresses by default, so rewards are not publicly visible on chain the way they are with pools that pay transparent addresses. It has no minimum hashrate and is meant for solo miners and small operators. Sovright says the pool emphasizes transparent payout logic, auditability and minimal fees.

The testnet pool does not pay out real ZEC and is for testing only. For how to choose a pool, see [Zcash Mining Pools](/using-zcash/zcash-mining-pools) and the [Zcash Mining Guide](/using-zcash/zcash-mining-guide).

Mining pool concentration is a recurring concern in proof-of-work networks: when a few pools control a large share of the hashrate, decentralization weakens and the network depends on the behavior of those operators.

## Areas of focus

- **Network resilience.** The reliability of the infrastructure that carries Zcash transactions. Private transactions depend on that infrastructure as well as on cryptography.
- **Financial sovereignty.** The ability to control and access your own funds without permission from intermediaries, including private payments, self-custody and infrastructure that lets people transact on their own terms.
- **Secure communications, private compute and secure AI interactions.** Areas the organization has said its work is expanding into beyond private money.

## Related pages

- [Electric Coin Company](/zcash-organizations/electric-coin-company): the organization at the centre of the 2026 split
- [ZODL](/zcash-organizations/zodl): the organization formed by the former ECC team
- [Recovering funds](/using-zcash/recovering-funds): how Argos recovery works
- [Zcash Mining Pools](/using-zcash/zcash-mining-pools): how to choose a pool

## Sources

- [New Zcash nonprofit Sovright unveils ZEC wallet recovery tool](https://www.theblock.co/news/ecosystems/2026-06-30-new-zcash-nonprofit-sovright-unveils-zec-wallet-recovery-tool-406731), The Block, 30 June 2026
- [Sovright Launches Zcash Mining Pool Testnet With Shielded Payouts](https://theenergymag.com/news/2026-06-15/sovright-zcash-pool), The Energy Mag, 15 June 2026
- [Sovright](https://sovright.com/)
`;

export function rewriteSovrightPageFull(original: string): string {
  if (!original.includes("Sovright") || !original.includes("Mining Pool")) return original;
  return PAGE;
}

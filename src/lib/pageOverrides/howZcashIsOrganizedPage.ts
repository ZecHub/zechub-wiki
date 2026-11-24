// How Zcash is organized (start-here/how-zcash-is-organized). The page is a map of who builds Zcash, so the long numbered
// list of organizations becomes grouped tables (cards on phones) with one line each and a link, and the closing
// "where to start" list becomes a table. The history and the 2026 reorganization keep the original wording, including
// the balance between both sides of the dispute. Kept from the original: every fact and every link. Skipped if the H1
// is missing.

const CARD =
  "rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm dark:border-slate-700 dark:bg-white/5 [&_p]:!my-0 [&_p+p]:!mt-2";

type Org = [name: string, what: string, linkLabel: string, href: string];

const GROUPS: Array<{ title: string; orgs: Org[] }> = [
  {
    title: "The two organizations from the 2026 split",
    orgs: [
      [
        "ZODL",
        "The Zcash Open Development Lab, formed by the former Electric Coin Company team and led by Josh Swihart. It raised more than twenty five million dollars from outside investors and works on core protocol development, including the Halo 2 proving system that powers Zcash's newest shielded transactions, and on the ZODL wallet, a shielded by default mobile wallet formerly called Zashi",
        "ZODL",
        "/zcash-organizations/zodl",
      ],
      [
        "Sovright",
        "A nonprofit formed by three former Bootstrap board members. It focuses on tools and support for the ecosystem, and built Argos, a tool to help early users recover funds stranded in an old, unmaintained wallet",
        "Sovright",
        "/zcash-organizations/sovright",
      ],
    ],
  },
  {
    title: "Protocol stewardship, research, and node software",
    orgs: [
      [
        "Zcash Foundation",
        "Maintains Zebra, the Rust node that becomes the network's primary node as the older zcashd client is retired. It also stewards the Zcash GitHub organization, the z.cash website, and the main Zcash account on X, and partners with ZecHub to help manage some of those assets",
        "Zcash Foundation",
        "/zcash-organizations/zcash-foundation",
      ],
      [
        "Shielded Labs",
        "An independent, donation-funded nonprofit based in Switzerland. It focuses on research and long term sustainability, including the network sustainability mechanism that funds future development and the Crosslink work on adding proof of stake finality to Zcash, and it funded the security audit that discovered the Orchard pool vulnerability in 2026",
        "Shielded Labs",
        "/zcash-organizations/shielded-labs",
      ],
      [
        "Electric Coin Company",
        "Remains part of the history as the organization that created and launched Zcash in 2016",
        "Electric Coin Company",
        "/zcash-organizations/electric-coin-company",
      ],
    ],
  },
  {
    title: "Scaling and cryptography",
    orgs: [
      [
        "Project Tachyon",
        "A scaling effort led by cryptographer Sean Bowe. It proposes a new way for wallets to sync with the blockchain, called oblivious synchronization, that shrinks transactions and, as a side effect, moves Zcash toward post-quantum privacy",
        "tachyon.z.cash",
        "https://tachyon.z.cash/",
      ],
      [
        "Valar Group",
        "A cryptography research and engineering lab working on the Zcash protocol for private, post-quantum digital cash at scale. It collaborates closely with Project Tachyon on the scaling and quantum work",
        "valargroup.dev",
        "https://valargroup.dev/",
      ],
    ],
  },
  {
    title: "Regional and community organizations",
    orgs: [
      [
        "Obscura Labs",
        "An independent organization registered in Nigeria, focused on Africa and emerging markets, building infrastructure and adoption pathways",
        "Obscura Labs",
        "/zcash-organizations/obscura-labs",
      ],
    ],
  },
  {
    title: "Education",
    orgs: [
      [
        "ZecHub",
        "A decentralized education hub for Zcash. Community members work together to create, validate, and promote content that helps people understand the ecosystem and learn how to participate, through tutorials, wiki documentation, a podcast, and a weekly newsletter. The wiki you are reading now is part of ZecHub, and the Zcash Foundation partners with it to help manage some community resources",
        "What is ZecHub",
        "/start-here/what-is-zechub",
      ],
    ],
  },
  {
    title: "Funding",
    orgs: [
      [
        "Zcash Community Grants",
        "Funds independent contributors and community projects from a portion of the block reward, spreading work across many teams beyond the core organizations",
        "Zcash Community Grants",
        "/zcash-organizations/zcash-community-grants",
      ],
      [
        "Financial Privacy Foundation",
        "Supports the Zcash ecosystem and community projects",
        "Financial Privacy Foundation",
        "/zcash-organizations/financial-privacy-foundation",
      ],
    ],
  },
];

const orgTable = (orgs: Org[]) =>
  [
    "| Organization | What it does | Read more |",
    "| --- | --- | --- |",
    ...orgs.map(([n, w, l, h]) => `| **${n}** | ${w}. | [${l}](${h}) |`),
  ].join("\n");

const orgCards = (orgs: Org[]) =>
  orgs
    .map(([n, w, l, h]) => `<div className="${CARD}">\n\n**${n}**\n\n${w}.\n\n[${l}](${h})\n\n</div>`)
    .join("\n\n");

const ORGS = GROUPS.map(
  (g) => `### ${g.title}

<div className="hidden md:block">

${orgTable(g.orgs)}

</div>

<div className="md:hidden my-4 space-y-3">

${orgCards(g.orgs)}

</div>`,
).join("\n\n");

const START: Array<[string, string]> = [
  ["To use Zcash, you want a wallet", "ZODL and its wallet are a natural starting point"],
  ["To run a node or understand the network software", "The Zcash Foundation and its Zebra node"],
  ["To fund a project or contribute paid work", "Zcash Community Grants"],
  ["To follow research and the future of the protocol", "Shielded Labs, Project Tachyon, and the Valar Group"],
];

const startTable = [
  "| If you want to… | Look to |",
  "| --- | --- |",
  ...START.map(([a, b]) => `| ${a} | ${b} |`),
].join("\n");

const startCards = START.map(([a, b]) => `<div className="${CARD}">\n\n**${a}**\n\n${b}.\n\n</div>`).join("\n\n");

const BODY = `## TL;DR

- Zcash is not built by one company, it is built by many independent organizations that each own a different part of the work
- For most of its history two organizations led development, the Electric Coin Company and the Zcash Foundation
- In January 2026 the entire Electric Coin Company team resigned after a governance dispute, and the ecosystem reorganized into several independent teams
- Today the protocol, the node software, wallets, research, scaling, and funding are handled by separate groups
- No single organization controls Zcash, the network is open source and permissionless, and it kept running normally through every change

## Who is this for

- Newcomers trying to understand who actually builds and maintains Zcash
- Anyone confused by the many organization names in the ecosystem
- Contributors deciding who to work with or where to send a proposal

## Why this matters

Understanding the structure makes everything else easier. It tells you who maintains the code you rely on, who to approach for a grant, and who is responsible for the part of the network you care about. It also reveals one of Zcash's quiet strengths: because the work is spread across independent groups, no single point of failure can capture or stall the project.

This page is a map. For each organization that already has a full page on this wiki, you will find a short note and a link to read more, rather than a repeat of what is written there.

## How it used to work

For most of Zcash's history, two organizations led the way.

The Electric Coin Company launched Zcash in 2016 and employed much of the core development team. It was overseen by Bootstrap, a nonprofit board created to support Zcash. The Zcash Foundation worked alongside it as an independent nonprofit, focused on stewardship of the protocol and on building an independent node. Both were funded largely by a portion of the block reward set aside for development.

This two-pillar structure held for years, but it depended on that shared funding and on the two organizations staying aligned. As the original development funding evolved and its long term future became less certain, the question of how to pay for ongoing work grew more pressing. That funding question sits in the background of much of what changed next, and it is part of why some teams now raise outside capital while others rely on grants.

## The 2026 reorganization

In January 2026 the structure changed sharply. On January 7, Electric Coin Company chief executive Josh Swihart announced on X that the entire company team had resigned.

Bootstrap was a nonprofit created in 2020 to govern the Electric Coin Company, which had become a wholly owned subsidiary of it. The disagreement between the company team and this board built up over time and touched several issues, including the direction of the organization, how development should be funded, and the future of the Zashi wallet, which the team wanted to move into a private company to raise outside capital. Swihart described the departure as a constructive discharge, a legal term meaning conditions were changed so severely that resignation was effectively forced, and said a majority of the board had moved out of alignment with Zcash's mission.

The other side of the account matters for fairness. Bootstrap framed the conflict as a matter of governance and nonprofit legal compliance. Zcash's founder, Zooko Wilcox, publicly defended the board members named in the dispute, saying he had worked with them for many years and regarded them as people of high integrity, while making clear he was not taking a side on the disagreement itself.

Two things were not in dispute. No party alleged any criminal conduct, so this was a corporate and governance disagreement rather than a legal case. And the Zcash network itself was unaffected, it stayed open source, permissionless, secure, and fully operational throughout, a point both Swihart and Wilcox stressed to users.

What followed was reorganization rather than collapse. The former company team went on to form ZODL later in 2026, and separately three former Bootstrap board members formed Sovright. Development settled into a more distributed shape across several independent teams.

The statements described here were made publicly on X on January 7, 2026, by Josh Swihart (@jswihart) and Zooko Wilcox (@zooko), where the original posts can be read in full.

## Who builds Zcash now

The work today is spread across independent organizations, each owning a clear part.

${ORGS}

All of these organizations maintain open source repositories, so their work can be read, checked, and built on by anyone. And the organizations are not the whole story. Many significant contributions come from individuals and from contracted companies funded through grants, rather than from the core organizations alone. Alongside them sit wallet teams, regional communities, independent developers, and investors who hold and support ZEC without building the protocol. The list above is the backbone, not the full picture.

## Where to start as a newcomer

Which organization matters to you depends on what you want to do.

<div className="hidden md:block">

${startTable}

</div>

<div className="md:hidden my-4 space-y-3">

${startCards}

</div>

## Keep learning

This wiki exists to help you go deeper, so the best next step is to keep reading it. A few good follow-on topics for a newcomer:

- [What is ZEC and Zcash](/start-here/what-is-zec-and-zcash) for the basics of the network and the coin
- [New User Guide](/start-here/new-user-guide) for a first walk through using Zcash
- [Shielded Pools](/using-zcash/shielded-pools) for how Zcash keeps transactions private
- [The turnstile](/zcash-tech/the-turnstile) for how the coin supply stays verifiable
- [Ironwood](/zcash-tech/ironwood) for the shielded pool the network is migrating to
- [Network Upgrades](/start-here/network-upgrades) for how Zcash changes over time
- [zk-SNARKs](/zcash-tech/zk-snarks) for the cryptography behind the privacy

Each page links out to more, so you can follow the thread as far as you like.

## Common misconceptions

- Zcash is not owned or controlled by any single company, no one organization can change or stop the network on its own
- The 2026 dispute did not affect the network, funds, or privacy, it was an organizational disagreement, and the protocol ran normally throughout
- The team leaving the Electric Coin Company did not end Zcash, the work moved to new independent organizations
- Having many organizations is a strength, not a weakness, it removes single points of failure and keeps the project resilient
- Holding or promoting ZEC is not the same as building Zcash, investors and evangelists are part of the community but are distinct from the teams that develop the protocol
`;

export function rewriteHowZcashIsOrganizedPage(original: string): string {
  const all = [...original.matchAll(/^# How Zcash is organized\s*$/gim)];
  if (all.length === 0) return original;
  const last = all[all.length - 1];
  return original.slice(0, (last.index ?? 0) + last[0].length) + "\n\n" + BODY;
}

// Zcash Resources (start-here/zcash-resources). The source is a flat list of bold links with a paragraph each, so the
// resources are grouped by purpose (learn and follow the community, official sites, code and technical documentation)
// and shown as tables (cards on phones). Kept from the original: every resource, every link and every description,
// including the zcashd end-of-support note and the pointers to Zebra and Zallet. The closing "unfinished document"
// line is dropped. Skipped if the H1 is missing.

const CARD =
  "rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm dark:border-slate-700 dark:bg-white/5 [&_p]:!my-0 [&_p+p]:!mt-2";

type Res = [name: string, href: string, text: string];

const GROUPS: Array<{ title: string; intro: string; items: Res[] }> = [
  {
    title: "Learn and follow the community",
    intro: "Where to get introduced to Zcash and keep up with the people building and using it.",
    items: [
      [
        "Zcash Media",
        "https://www.youtube.com/c/ZcashMedia",
        'An independent organization that makes educational documentaries about Zcash. Their first video, "Built to Fix Bitcoin\'s Fatal Flaw, What is Zcash (ZEC)?", is a great introduction to Zcash',
      ],
      [
        "X (formerly Twitter)",
        "https://x.com",
        "The de facto communication hub for the Zcash community, and the broader cryptocurrency space as well. It's a great place to get a pulse check on all things Zcash, and also follow prominent community members. Here's a [document](https://www.notion.so/zechub/Social-Media-Links-05b9df645af54de7a1989d9c4ccc4d05) that lists the top accounts to follow",
      ],
      [
        "Zcash Community",
        "https://www.zcashcommunity.com/",
        "A community run site that highlights community run projects supporting the Zcash ecosystem. It's a great way to get introduced to the Zcash community and its various applications as a currency",
      ],
      [
        "The Zcash Forum",
        "https://forum.zcashcommunity.com/",
        "As mentioned in the [new user guide](/start-here/new-user-guide), the Zcash forum is a great place to have long form discussions about Zcash topics and also proposed ideas. Proposals always make it to the forum so the community has a chance to discuss and debate the proposed ideas",
      ],
    ],
  },
  {
    title: "Official website",
    intro: "The main source for Zcash content and documentation.",
    items: [
      [
        "Z.cash",
        "https://z.cash/",
        "Zcash's main website. It provides content and documentation of Zcash for a wide range of users and allows new users to dive deeper into the technical explanations around Zcash",
      ],
    ],
  },
  {
    title: "Code and technical documentation",
    intro: "For developers and anyone who wants to go deeper into how Zcash works.",
    items: [
      [
        "Zcash GitHub",
        "https://github.com/zcash/zcash",
        "Got coding chops and want to dive deeper into the technical side of Zcash? The Zcash GitHub Repo is the repository for zcashd, the first Zcash node implementation. zcashd reached its automatic end-of-support halt on 18 July 2026 and is no longer maintained, and the download page this entry used to link to is no longer served. The maintained stack is [Zebra](https://github.com/ZcashFoundation/zebra) for the node and [Zallet](https://github.com/zcash/zallet) for the wallet. See the [zcashd to Zebra and Zallet migration guide](/guides/migration-guide-zcashd-to-zebrad-zallet)",
      ],
      [
        "Zcash Foundation GitHub",
        "https://github.com/ZcashFoundation",
        "Another GitHub repository hosting projects of the Zcash Foundation, including [zebra](https://github.com/ZcashFoundation/zebra), a Zcash node implementation in Rust",
      ],
      [
        "Halo2",
        "https://zcash.github.io/halo2/index.html",
        "The concepts behind zero-knowledge proof systems",
      ],
      [
        "Zcash RPC Docs",
        "https://zcash.github.io/rpc/",
        "List of the RPC commands zcashd exposed. For the maintained wallet RPC surface, see the [Zallet Book](https://zcash.github.io/zallet/)",
      ],
    ],
  },
];

const table = (items: Res[]) =>
  [
    "| Resource | What it is |",
    "| --- | --- |",
    ...items.map(([n, h, t]) => `| **[${n}](${h})** | ${t}. |`),
  ].join("\n");

const cards = (items: Res[]) =>
  items.map(([n, h, t]) => `<div className="${CARD}">\n\n**[${n}](${h})**\n\n${t}.\n\n</div>`).join("\n\n");

const BODY =
  "There are a number of resources that help users understand Zcash.\n\n" +
  GROUPS.map(
    (g) => `## ${g.title}

${g.intro}

<div className="hidden md:block">

${table(g.items)}

</div>

<div className="md:hidden my-4 space-y-3">

${cards(g.items)}

</div>`,
  ).join("\n\n") +
  "\n";

export function rewriteZcashResourcesPage(original: string): string {
  const all = [...original.matchAll(/^# Zcash Resources\s*$/gim)];
  if (all.length === 0) return original;
  const last = all[all.length - 1];
  return original.slice(0, (last.index ?? 0) + last[0].length) + "\n\n" + BODY;
}

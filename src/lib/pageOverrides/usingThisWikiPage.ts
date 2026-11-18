// Using this Wiki (start-here/using-this-wiki). The page is the reader's map of the site, so it is organized as a
// short intro, four "start here" cards by reader type, a table of what each menu tab holds, and ways to find
// anything else. Kept from the original: every link and the four reader paths (new to Zcash, ready to use Zcash,
// community member, contributor). The tab descriptions follow the current menu. Skipped if the H1 is missing.

const CARD =
  "rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm dark:border-slate-700 dark:bg-white/5 [&_p]:!my-0 [&_p+p]:!mt-2 [&_ul]:!my-2";

const PATHS: Array<{ eyebrow: string; title: string; text: string; links: Array<[string, string, string]> }> = [
  {
    eyebrow: "First steps",
    title: "I am new to Zcash",
    text: "Get up to speed on the basics before you handle any funds.",
    links: [
      ["Zcash New User Guide", "/start-here/new-user-guide", "a first walkthrough"],
      ["Zcash Resources", "/start-here/zcash-resources", "where to keep learning"],
      ["Zcash Basics", "/start-here/what-is-zec-and-zcash", "what ZEC and Zcash are"],
    ],
  },
  {
    eyebrow: "Hands on",
    title: "I am ready to use Zcash",
    text: "Once you have read the intro pages, learn how to hold, send and receive ZEC.",
    links: [
      ["Using ZEC Privately", "/guides/using-zec-privately", "step-by-step shielded use"],
      [
        "Tutorials",
        "https://youtube.com/playlist?list=PL6_epn0lASLFF28ePj7P5TvtMG_WE7p3O&si=4vleWUbCGbNJu1-M",
        "video walkthroughs of using ZEC",
      ],
    ],
  },
  {
    eyebrow: "Community",
    title: "I am a Zcash community member",
    text: "The best way to stay current is to follow the newsletter and the community accounts.",
    links: [
      ["Zcash Ecosystem Digest", "https://zechub.substack.com/s/zcash-ecosystem-digest", "the weekly newsletter"],
      ["List of Zcash community pages", "/zcash-community/community-links", "accounts worth following"],
    ],
  },
  {
    eyebrow: "Contribute",
    title: "I want to contribute to ZecHub",
    text: "Learn what ZecHub is, then see how you can help build it.",
    links: [
      ["What is ZecHub", "/start-here/what-is-zechub", "the mission and the projects"],
      ["Help Build ZecHub", "/contribute/help-build-zechub", "ways to help and how rewards work"],
    ],
  },
];

const TABS: Array<[string, string]> = [
  ["**Learn Zcash**", "Concepts and background: what Zcash is, how privacy works, monetary policy, network upgrades and the research behind them"],
  ["**Use Zcash**", "Practical use: wallets, buying ZEC, exchanges, spending, shielded pools, memos and mining"],
  ["**Ecosystem**", "The people and projects around Zcash: organizations, community links, calls, media and events"],
  ["**Guides**", "Step-by-step walkthroughs: running a node, wallet setup, payments, DeFi and developer tools"],
  ["**Network**", "Live data and tools: the ecosystem dashboard, chain state explorer, protocol parameters and visualizers"],
  ["**DAO**", "How ZecHub makes funding decisions and how to take part"],
];

const tabsTable = [
  "| Tab | What you will find |",
  "| --- | --- |",
  ...TABS.map(([a, b]) => `| ${a} | ${b} |`),
].join("\n");

const tabsCards = TABS.map(
  ([a, b]) => `<div className="${CARD}">\n\n${a}\n\n${b}.\n\n</div>`,
).join("\n\n");

const PATH_CARD =
  "flex h-full flex-col rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm dark:border-slate-700 dark:bg-white/5 [&_p]:!my-0 [&_p+p]:!mt-2 [&_ul]:!my-3 [&_ul]:list-none [&_ul]:!pl-0 [&_li]:!my-0 [&_li]:border-t [&_li]:border-slate-200 [&_li]:py-2 dark:[&_li]:border-slate-700";

const pathCards = PATHS.map(
  (x) =>
    `<div className="${PATH_CARD}">\n\n<p className="text-xs font-semibold uppercase tracking-wider text-brand dark:text-brand-soft">${x.eyebrow}</p>\n\n**${x.title}**\n\n${x.text}\n\n${x.links
      .map(([name, href, note]) => `- [${name}](${href}): ${note}`)
      .join("\n")}\n\n</div>`,
).join("\n\n");

const BODY = `There is a lot of information on this wiki. This page shows where to begin, what each part of the wiki holds and how to find a page quickly.

## Where to start

<div className="my-6 grid gap-4 md:grid-cols-2">

${pathCards}

</div>

## How the wiki is organized

<div className="hidden md:block">

${tabsTable}

</div>

<div className="md:hidden my-4 space-y-3">

${tabsCards}

</div>

## Finding what you need

- **Search:** the search button in the top bar helps you jump straight to a page.
- **Browse all articles:** each menu tab ends with this button. It opens the section with a side menu that lists every article in it.
- **Sitemap:** the [Sitemap](/sitemap) lists every page on the wiki, with a filter to narrow it down.
- **Language:** the language selector in the top bar switches the wiki to your language where a translation exists.
`;

export function rewriteUsingThisWikiPage(original: string): string {
  const h1 = original.match(/^# Using this Wiki\s*$/im);
  if (!h1 || h1.index === undefined) return original;
  // Keep everything up to and including the first H1 (frontmatter and the Edit-page link), replace the body.
  const first = h1.index + h1[0].length;
  // The source repeats the H1 after the Edit-page link, so use the last H1 match as the cut point.
  const all = [...original.matchAll(/^# Using this Wiki\s*$/gim)];
  const last = all[all.length - 1];
  const cut = (last.index ?? first) + last[0].length;
  return original.slice(0, cut) + "\n\n" + BODY;
}

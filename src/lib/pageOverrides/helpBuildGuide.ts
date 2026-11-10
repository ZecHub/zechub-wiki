// Help Build ZecHub (contribute/help-build-zechub). The page is the short "ways to help" entry point, so it is
// organized as a TL;DR, a table of ways to help (cards on phones), how rewards work, and the contributor form that is
// required before a payout. The workflow details stay on the Contributing Guide. Kept from the original: every link,
// the ZecBounties video and image, the contributor-form requirement (name and shielded address) and the embedded
// form (same form URL, laid out with classes because the site strips inline styles). Skipped if the H1 is missing.

const frame = (id: string, title: string) => `<div className="my-8 w-full aspect-video max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-lg bg-black">
  <iframe
    className="w-full h-full"
    src="https://www.youtube.com/embed/${id}"
    title="${title}"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowFullScreen
    loading="lazy"
  />
</div>`;

const CARD =
  "rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm dark:border-slate-700 dark:bg-white/5 [&_p]:!my-0 [&_p+p]:!mt-2";

const WAYS: Array<[string, string, string]> = [
  [
    "Curate newsletter links",
    "Collect the week's Zcash news for the newsletter",
    "Add links on the newsletter's GitHub page. See the [newsletter instructions](https://github.com/ZecHub/zechub/blob/main/site/contribute/ZecWeekly_Newsletter.md)",
  ],
  [
    "Fact-check and edit the wiki",
    "Check pages against their sources, suggest edits and propose new pages",
    "Open an issue or a pull request on [GitHub](https://github.com/ZecHub/zechub-wiki/issues). Follow the [style guide](/contribute/style-guide)",
  ],
  [
    "Make video content",
    "Zcash explainer videos, wallet guides and tutorials, and third-party application demos",
    "Browse the [tutorial library](/zechub-tutorial) for the current style, then see the [Contributing Guide](/contribute/contributing-guide)",
  ],
  [
    "Design",
    "Posters, graphics and animations for the Zcash and privacy ecosystem",
    "Share ideas on [Discord](https://discord.gg/zcash)",
  ],
  [
    "Translate",
    "Translate existing wiki pages into your language",
    "See the [translation sync notes](https://github.com/ZecHub/zechub/blob/main/translation/README-sync.md)",
  ],
  [
    "Report bugs",
    "Report a problem on the wiki or in the content",
    "Open an issue in [ZecHub-Wiki](https://github.com/ZecHub/zechub-wiki/issues) or [ZecHub](https://github.com/ZecHub/zechub/issues)",
  ],
];

const waysTable = [
  "| Way to help | What it involves | Where to start |",
  "| --- | --- | --- |",
  ...WAYS.map(([a, b, c]) => `| **${a}** | ${b} | ${c} |`),
].join("\n");

const waysCards = WAYS.map(
  ([a, b, c]) => `<div className="${CARD}">\n\n**${a}**\n\n${b}.\n\n${c}.\n\n</div>`,
).join("\n\n");

const BEFORE_FORM = `## TL;DR

- You can help by curating newsletter links, fact-checking and editing the wiki, making videos, designing graphics, translating pages and reporting bugs.
- Open tasks and paid work are on [ZEC Bounties](https://bounties.zechub.wiki/), and you can suggest bounties there too.
- Reward amounts are not fixed in ZEC. They follow the [bounty amounts policy](https://bounties.zechub.wiki/docs/bounty-amounts).
- A merged pull request is not the same as an approved or paid reward.
- To be paid, complete the contributor declaration form at the bottom of this page.

If you are a member of the Zcash community and want to help build ZecHub, there are several ways to start.

## Ways to help

<div className="hidden md:block">

${waysTable}

</div>

<div className="md:hidden my-4 space-y-3">

${waysCards}

</div>

Have another idea? Message ZecHub ([@ZecHub](https://twitter.com/zechub)) on Twitter or join the [Discord](https://discord.gg/zcash).

## Earn ZEC for your work

We post open tasks on [ZEC Bounties](https://bounties.zechub.wiki/). The board shows what is open, and you can suggest a bounty yourself.

Amounts are not fixed in ZEC. The [bounty amounts policy](https://bounties.zechub.wiki/docs/bounty-amounts) is the source of truth: pick a USD interval for the class of work, convert at the spot price, and enter the ZEC amount on the board. The contributor workflow and the types of work are in the [Contributing Guide](/contribute/contributing-guide).

${frame("Lb5Bvl1GkRQ", "ZecBounties Explained | Earn ZEC by Contributing")}

![zecbounties](/content-images/0e4f5109-c0c9-4a0a-8d71-8172e36b9726-1a94469edf.webp)

Where to look for work:

- [ZEC Bounties](https://bounties.zechub.wiki/)
- [ZecHub GitHub issues](https://github.com/ZecHub/zechub/issues)
- [ZecHub-Wiki GitHub issues](https://github.com/ZecHub/zechub-wiki/issues)

A merged pull request is not the same as an approved or paid reward.

## Get paid

To make payouts, ZecHub requires every contributor to complete a declaration form with their **name** and a **shielded address**. The form accepts a Zcash, Namada, Penumbra or Ycash address.

`;

const AFTER_FORM = `

## Related pages

- [Contributing Guide](/contribute/contributing-guide): the full workflow, from picking a task to opening a pull request
- [Style guide](/contribute/style-guide): how to write for ZecHub
- [ZecHub DAO](/contribute/zechub-dao): how funding decisions are made
- [ZecWeekly newsletter](/contribute/zecweekly-newsletter): how to contribute to the newsletter
`;

export function rewriteHelpBuildGuide(original: string): string {
  const h1 = original.match(/^# Help Build ZecHub\s*$/m);
  if (!h1 || h1.index === undefined) return original;
  // The source embeds the form with an inline style, which the site strips, so the form is laid out with classes.
  const formBlock = `<div className="my-6 w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
  <iframe
    className="block w-full"
    height="540"
    title="ZecHub contributor declaration form"
    src="https://noteforms.com/forms/zechub-contributor-form-yomcwt"
    loading="lazy"
  />
</div>`;
  return original.slice(0, h1.index + h1[0].length) + "\n\n" + BEFORE_FORM + formBlock + "\n" + AFTER_FORM;
}

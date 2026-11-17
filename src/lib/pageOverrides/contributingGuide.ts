// Contributing Guide: rewritten around a TL;DR, a table of contribution types, the five-step workflow, rewards (kept
// as the bounty policy, never fixed ZEC amounts) and the merged / approved / paid distinction. All links, the three
// videos and the contributor-form requirement come from the original page. Skipped if the H1 is missing.

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

const BODY = `## TL;DR

- ZecHub helps people learn about Zcash. Contributions appear on [zechub.wiki](https://zechub.wiki/) and on ZecHub's social channels.
- You can write or fix wiki pages, translate pages, write the newsletter, make videos, design graphics or build tools.
- Accepted work is tipped in shielded ZEC. The amount follows the [bounty amounts policy](https://bounties.zechub.wiki/docs/bounty-amounts), not a fixed ZEC price.
- Work happens on GitHub: open an issue or a pull request (PR), then a maintainer reviews it.
- Follow the [style guide](/contribute/style-guide) and join the [community links](/zcash-community/community-links) before you start.

${frame("8eYDTyV39a4", "How to Contribute to ZecHub!")}

## How to contribute

1. **Join the conversation.** Join the [Discord](https://discord.gg/zcash), find the forum and other channels in the [community links](/zcash-community/community-links), and say what you want to work on.
2. **Read the overview.** The [README](https://github.com/ZecHub/zechub/blob/main/README.md) explains how the project is organized.
3. **Pick a task.** Browse open work on [ZEC Bounties](https://bounties.zechub.wiki/), the [ZecHub issues](https://github.com/ZecHub/zechub/issues) or the [ZecHub-Wiki issues](https://github.com/ZecHub/zechub-wiki/issues), or propose your own idea.
4. **Make your change and open a PR.** Follow the [style guide](/contribute/style-guide). Use an existing page in the same section as a structural reference.
5. **Respond to review.** A maintainer merges the PR when it is ready, or suggests edits in the PR. Ask in the #zechub channel on [Discord](https://discord.gg/zcash) if you need a reviewer.

If you are new to GitHub, the video above walks through the workflow from opening an issue to merging a PR.

## What you can contribute

| Contribution | What it is | How to start |
| --- | --- | --- |
| Dev work | Approved work that helps build the Zcash ecosystem, such as the wiki, wallets or apps | Pick a task on [ZEC Bounties](https://bounties.zechub.wiki/) or propose one |
| Wiki: new page | Education material on Zcash, ZEC use cases, new user guides, the community and ecosystem, and privacy tools | Check the wiki for gaps, then open a PR to the repo |
| Wiki: translation | Translate an existing page into your language | See the [translation sync notes](https://github.com/ZecHub/zechub/blob/main/translation/README-sync.md) |
| Wiki: edit or fix | Correct an out-of-date statement, a typo or a broken link | Use the edit link at the bottom of the page and submit a PR |
| Newsletter: new edition | Write the weekly ecosystem newsletter | Message the editors in #zecweekly on [Discord](https://discord.gg/zcash), then follow the [newsletter instructions](/contribute/zecweekly-newsletter) |
| Newsletter: translation | Translate the newsletter into your language | Tell the team the language and the channel you would publish on |
| Video tutorials | Tutorials on Zcash apps | Open a PR to zechub/tutorials or send the video in #video-content on [Discord](https://discord.gg/zcash) |
| Podcast or show | A news show, podcast or talk | Describe the idea in #video-content on [Discord](https://discord.gg/zcash). Larger rewards need a DAO proposal |
| Creative posts | Short videos, GIFs, memes, thumbnails | Match the style guide and ask in #design on [Discord](https://discord.gg/zcash) |

Have another idea? Tell the team in #general on [Discord](https://discord.gg/zcash), and the DAO can decide whether to support it.

## Wiki pages

The wiki covers:

- Zcash and its related technologies
- ZEC use cases
- New user guides
- The Zcash community and ecosystem
- Privacy ecosystem and tools

When you write or change a page, follow the [style guide](/contribute/style-guide): start with a TL;DR, source your claims, and avoid wording like "latest" or "last updated" that goes stale.

Translations of wiki pages are tracked against their English source by a source-hash manifest. The [translation sync notes](https://github.com/ZecHub/zechub/blob/main/translation/README-sync.md) cover staleness detection, the sync workflow and protected-terms validation. The ZecHub Global translation rate limit is 10 pages per week.

## Video tutorials

Tutorials on Zcash apps are welcome. If a video meets the criteria, ZecHub posts it and tips you. Here is an example:

${frame("qz4KzDjkqu8", "WSL Install + zcashd Compile/Transaction Tutorial")}

## Rewards

Tips are paid in shielded ZEC. The reward is not a fixed ZEC amount.

1. **Match the work** to a USD interval in the [bounty amounts policy](https://bounties.zechub.wiki/docs/bounty-amounts).
2. **Pick a target** inside that interval. It is not automatically the top.
3. **Convert** at a public ZEC/USD spot price and enter the ZEC amount on the bounty.

\`\`\`
zec_to_enter = usd_target / zec_usd_spot
\`\`\`

Round to 4 decimal places. The policy file is the source of truth. If this page and that file disagree, the policy wins. Paid work is listed on [ZEC Bounties](https://bounties.zechub.wiki/).

${frame("Lb5Bvl1GkRQ", "ZecBounties Explained | Earn ZEC by Contributing")}

Three states are not the same:

1. **Merged.** The PR is accepted into the repository.
2. **Reward approved.** A sponsor or the DAO agrees a reward is owed, and at what size.
3. **Paid.** ZEC reaches your shielded unified address.

A merged contribution does not by itself approve a reward, and an approved reward is not a completed payment.

To receive a payout, complete the contributor declaration form with your name and a shielded address. See [Help build ZecHub](/contribute/help-build-zechub) for the form.

## Common mistakes

- **Starting before you ask.** Say what you plan to write on [Discord](https://discord.gg/zcash) so two people do not do the same page.
- **Copying details that change.** Link to the official source instead of pasting versions or amounts.
- **Assuming a merged PR is paid.** Check the three states above.
- **Skipping the style guide.** Reviewers will ask you to change it.

## Related pages

- [Style guide](/contribute/style-guide): how to write for ZecHub
- [Help build ZecHub](/contribute/help-build-zechub): other ways to help and the contributor form
- [ZecHub DAO](/contribute/zechub-dao): how funding decisions are made
- [Community links](/zcash-community/community-links): Discord, forum and other channels
`;

export function rewriteContributingGuide(original: string): string {
  const h1 = original.match(/^# Contributing to ZecHub\s*$/m);
  if (!h1 || h1.index === undefined) return original;
  return original.slice(0, h1.index + h1[0].length) + "\n\n" + BODY;
}

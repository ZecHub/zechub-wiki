// Editorial rewrite of "What is ZecHub?". The wiki content lives in the external ZecHub/zechub repo,
// so the page is rebuilt here. If the source no longer looks like that page, the original markdown
// is returned untouched. The marker paragraphs are replaced by components in page.tsx.
export const ZECHUB_MARKERS = {
  cta: "[[zechub-cta]]",
  stats: "[[zechub-stats]]",
  paths: "[[zechub-paths]]",
  videos: "[[zechub-videos]]",
} as const;

export function rewriteWhatIsZecHub(original: string): string {
  if (!/decentralized education hub for zcash/i.test(original)) return original;

  return `# What is ZecHub?

ZecHub is the open-source education hub for Zcash. Learn how private digital money works through guides, videos and a weekly newsletter, all written and reviewed by the community.

${ZECHUB_MARKERS.cta}

${ZECHUB_MARKERS.stats}

## Where to start

${ZECHUB_MARKERS.paths}

More ways in: [Podcasts](/zcash-community/zcash-podcasts) · [Choose a wallet](/wallets) · [Buy ZEC](/using-zcash/buying-zec) · [ZecHub DAO](/dao) · [Bounties](https://bounties.zechub.wiki/)

## Watch first

${ZECHUB_MARKERS.videos}

## How ZecHub works

- **Open by design.** Every guide lives in a public GitHub repository, so anyone can read it, fix it or translate it.
- **Reviewed in public.** Changes arrive as pull requests that other members read before they are merged.
- **Independent.** No single person, company or server controls the content, and sponsored content is not accepted.

## How to contribute

1. Open the [ZecHub GitHub repository](https://github.com/ZecHub/zechub) and sign in, or create a free account.
2. Make your change and submit it as a pull request. The last video above walks you through it.
3. Reviewers check it against the guidelines below and merge it.

**Guidelines:** support claims with primary sources such as [z.cash](https://z.cash), keep marketing and inappropriate content out, and follow the page template in the repository.

## Support ZecHub

ZecHub is funded by the community. If it helped you, you can [donate to keep it running](/donation).

*ZecHub is an independent, open-source initiative started by members of the Zcash community. Nothing on this site is financial or investment advice.*
`;
}

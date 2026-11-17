// Editorial rewrite of "Zcash Media". The page opened with a mission statement ("our goal is to...") and
// never said what Zcash Media actually is. The rewrite explains what the channel is, who makes it and how
// it was funded, lists the topics it covers and keeps the playlist (the page turns the embed into the video
// carousel). Facts follow the Zcash Community Forum proposal and the Zcash Community Grants announcement,
// both linked at the bottom. If the source has no playlist embed, it is returned untouched.
export function rewriteZcashMediaGuide(original: string): string {
  if (!/^# .*zcash media/im.test(original)) return original;
  const list = original.match(/list=(PL[\w-]{10,40})/)?.[1];
  if (!list) return original;

  const fm = original.match(/^---\n[\s\S]*?\n---\n/)?.[0] ?? "";
  const edit = original.match(/<a href="https:\/\/github\.com[^>]*>[\s\S]*?<\/a>/)?.[0] ?? "";

  return `${fm}
${edit}

# Zcash Media

Zcash Media is an independent educational video channel about Zcash. It publishes documentary-style videos and explainers that introduce Zcash, its history and its technology to newcomers, skeptics and people who already use it.

## About the channel

- **Who makes it.** Zcash Media was created by 37 Laines, a film production team, and is separate from the channels of the Zcash Foundation and Electric Coin Company.
- **How it was funded.** The first productions were paid for by [Zcash Community Grants](/zcash-organizations/zcash-community-grants): two grants totalling US$420,000, approved in April 2022.
- **Where to watch.** On YouTube, and on Odysee for the first releases.

## What it covers

- The history of money, the origins of cryptocurrency and why private digital money matters.
- The 2016 trusted setup ceremony and Powers of Tau.
- Halo and the NU5 network upgrade. For the technical details, see [NU5](/zcash-tech/nu5) and [Halo](/zcash-tech/halo).
- Interviews with figures from the cryptocurrency world.

## Watch

<iframe src="https://www.youtube.com/embed/videoseries?list=${list}" title="Zcash Media playlist"></iframe>

## Sources

- [Zcash Media YouTube Channel](https://forum.zcashcommunity.com/t/zcash-media-youtube-channel/40984): the proposal on the Zcash Community Forum
- [Zcash Community Grants approves grants for educational Zcash content](https://rss.globenewswire.com/news-release/2022/04/25/2428313/0/en/Zcash-Community-Grants-Committee-Approves-Two-Grants-Totalling-420-000-for-the-Production-and-Distribution-of-Educational-Zcash-Content.html)
- [Zcash Community Grants](/zcash-organizations/zcash-community-grants)
`;
}

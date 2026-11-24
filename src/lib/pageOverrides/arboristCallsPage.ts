// Arborist Calls page (/zcash-community/arborist-calls). The source markdown had a yellow raw-HTML button and embedded the recordings with a
// raw <iframe src=".../embed/videoseries?list=...">. The iframe handler reads "videoseries" as a video id, so there was no cover image and the
// click-to-load player opened without the playlist. This rewrite keeps the facts of the source page (Foundation as source of truth, 15:00 UTC
// slot, notes repository, archive, Discord, forum, audience) and lays them out with the site's own components: a link row, an outlined primary
// button for the call archive and the playlist carousel with local cover images. If the source is not this page any more, the original
// markdown is returned untouched.
const PLAYLIST = "PL40dyJ0UYTLJqD_3PE9qiJTxse-iHnn1G";

const LINKS = JSON.stringify([
  { label: "Foundation page", href: "https://zfnd.org/arborist-calls/" },
  { label: "Meeting notes", href: "https://github.com/ZcashCommunityGrants/arboretum-notes" },
  { label: "YouTube playlist", href: `https://www.youtube.com/playlist?list=${PLAYLIST}` },
  { label: "Zcash R&D Discord", href: "https://discord.gg/xpzPR53xtU" },
  { label: "Community forum", href: "https://forum.zcashcommunity.com/" },
]);

const BODY = `# Arborist Calls

Arborist Calls are recurring protocol development meetings hosted by the Zcash Foundation. They focus on network upgrade planning, consensus node implementation work, wallet and infrastructure dependencies, and protocol research. Anyone can follow the discussion, and every call is recorded.

<LinkButton href="/arborist-calls" label="Search the call archive" emphasis="strong" />

<OrgLinks items='${LINKS}' />

## What the calls cover

- Network upgrade planning and deployment logistics
- Consensus node implementation issues
- Wallet, SDK and lightwallet infrastructure dependencies
- Protocol research and open proposals

## Recordings

<VideoCarousel list="${PLAYLIST}" label="Recordings from the Zcash Foundation channel" compact="true" />

## How to join

The calls alternate between two recurring time slots so that contributors in different regions can take part. One of them is **15:00 UTC**. The [Zcash Foundation's Arborist Calls page](https://zfnd.org/arborist-calls/) is the source of truth for the calendar files, registration and meeting links, because those links can change.

## Notes and agendas

- [arboretum-notes](https://github.com/ZcashCommunityGrants/arboretum-notes): full agendas and minutes
- [Arborist Calls archive](/arborist-calls): searchable list of every call on this wiki, with its notes
- [Zcash Arborist Call playlist](https://www.youtube.com/playlist?list=${PLAYLIST}): recordings on YouTube

## Who should attend

- Protocol engineers and researchers
- Node, wallet, SDK and lightwallet infrastructure developers
- Grant recipients whose work touches consensus, network upgrades or protocol dependencies
- Community members who want to follow technical decision-making in public

## Join the discussion

- [Zcash R&D Discord](https://discord.gg/xpzPR53xtU)
- [Zcash Community Forum](https://forum.zcashcommunity.com/) for long-form discussion
`;

export function rewriteArboristCallsPage(original: string): string {
  if (!/^#\s*Arborist Calls/im.test(original)) return original;
  if (!original.includes("zfnd.org/arborist-calls")) return original;
  if (!original.includes(PLAYLIST)) return original;

  const fm = original.match(/^---\n[\s\S]*?\n---\n/)?.[0] ?? "";
  const edit = original.match(/<a href="https:\/\/github\.com\/[^"]*\/edit\/[^"]*"[^>]*>[\s\S]*?<\/a>\n/i)?.[0] ?? "";
  return `${fm}${edit}\n${BODY}`;
}

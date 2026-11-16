// ZK AV Club page. The source page was a mission statement from the club's start: it had a logo, said the club was "supported by The
// Zcash Foundation", promised regular meetups and had no activity after Zcon4. It is rewritten from the club's own forum posts:
// - "Documenting ourselves (in public, together)", the 2025 wrap-up (Zcash Community Forum): Foundry livestream series (10 sessions),
//   11 workshops from 29 April to 14 November in English, Spanish and Portuguese, over 80 recordings at 8 events (Berlin Blockchain Week,
//   Dark Prague, Sub0 and Devconnect in Buenos Aires), ZconVI community translations and clip games, crowdfunding of 190 ZEC (Berlin) and
//   7.55 ZEC (Prague), ZCG funded the 2025 grant, thanks to the Zcash Foundation and ZecHub.
// - "Zcash Community Media Infrastructure & Support | Zk Av Club 2026" (posted 19 December 2025), approved by ZCG on 5 January 2026:
//   Recording Station, a Zcash PeerTube instance (MVP target 31 March 2026), paid coordination roles, a community fund, workshops and
//   archiving to the Internet Archive. The total amount is not stated in the proposal text, so it is not given here.
// Changed from the source page: "supported by the Zcash Foundation" became funding by ZCG with thanks to the Foundation and ZecHub, and the
// future-tense meetup description was replaced by what the club has done. The names of volunteers are not listed. If the page no longer
// looks like this one, the original markdown is returned untouched.
const PAGE = `# ZK AV Club

The **Zero-Knowledge Audiovisual Club (ZK AV Club)** is a global group of volunteers and creators who help Zcash communities record and publish their own stories. Its tools are workshops, livestreams and a portable Recording Station that it brings to events, and it archives the results so that they stay available.

[Website](https://zkav.club) - [GitHub](https://github.com/copernicus-mogley/zkav.club) - [X](https://x.com/ZkAv_Club) - [YouTube](https://www.youtube.com/@ZkAv_Club)

## At a glance

| | |
|---|---|
| What it is | A volunteer-driven community media group focused on Zcash and privacy |
| Main programs | Foundry livestream series, skill-sharing workshops, Recording Station, archiving |
| Languages | Workshops held in English, Spanish and Portuguese |
| Funding | Zcash Community Grants, with community crowdfunding for individual events. The Zcash Foundation and ZecHub are thanked for their support |
| Approach | Local people tell their own stories, with consent as a rule for every recording |

## Mission

The club wants stories about Zcash and financial privacy to be told by the people closest to them, in their own languages and on their own terms. Its long-term goal is a network of capable, funded media producers who publish news about Zcash and privacy that is locally relevant and globally shared. Its events are open and free, and consent is never assumed.

## Programs

| Program | What it is |
|---|---|
| Foundry | A livestream series where creators learn and work together |
| Workshops | Skill-sharing sessions on video editing, Kdenlive, live translation and animation tools such as OpenToonz |
| Recording Station | A kit and workflow for recording interviews and talks at events, with a consent and publishing process |
| Archive | Publishing backlog recordings so they remain available |

## 2025 in numbers

The club's own wrap-up reports:

- **Foundry:** 10 livestream sessions.
- **Workshops:** 11 workshops between 29 April and 14 November, in English, Spanish and Portuguese.
- **Recording Station:** more than 80 recordings across 8 events: Berlin Blockchain Week (June), Dark Prague (October) and Sub0 and Devconnect in Buenos Aires (November).
- **Zcon:** live text translations and clip games for ZconVI.
- **Crowdfunding:** the Berlin trip raised 190 ZEC in shielded donations and Prague raised 7.55 ZEC.

Read the full [2025 wrap-up](https://forum.zcashcommunity.com/t/zk-av-club-2025-wrap-up/54044) on the forum.

## 2026

In December 2025 the club proposed [Zcash Community Media Infrastructure & Support](https://forum.zcashcommunity.com/t/zcash-community-media-infrastructure-support-zk-av-club-2026/53913) to Zcash Community Grants, which approved it on 5 January 2026 and asked for monthly updates. The plan covers:

- the Recording Station, with a volunteer kit and event selection by community poll;
- a community-run Zcash PeerTube video instance, starting with Zcon and ZecHub content, with a target of 31 March 2026 for a first version;
- paid coordination and production roles, a community fund and a workshops program;
- publishing backlog recordings to the Internet Archive.

## Get involved

Anyone interested in privacy, Zcash and audiovisual work can join. Follow the club on [X](https://x.com/ZkAv_Club) and [YouTube](https://www.youtube.com/@ZkAv_Club), or see the [Guides for Creators](/zfav-club/guides-for-creators) for tools and tips.

## Related pages

- [Zcash Community Grants](/zcash-organizations/zcash-community-grants): the program that funds the club
- [Zcash Foundation](/zcash-organizations/zcash-foundation): supported the club's start and its events
- [Guides for Creators](/zfav-club/guides-for-creators): tools and tips for making Zcash content

## Sources

- [Documenting ourselves (in public, together)](https://forum.zcashcommunity.com/t/zk-av-club-2025-wrap-up/54044), ZK AV Club 2025 wrap-up, Zcash Community Forum
- [Zcash Community Media Infrastructure & Support | Zk Av Club 2026](https://forum.zcashcommunity.com/t/zcash-community-media-infrastructure-support-zk-av-club-2026/53913), Zcash Community Forum
`;

export function rewriteZkavPage(original: string): string {
  if (!original.includes("ZKAV") && !original.includes("Zk Av Club")) return original;
  return PAGE;
}

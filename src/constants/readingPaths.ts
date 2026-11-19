// Sidebar groups for the long tabs, and the reading trails built from them.
// - Every page of a tab appears in the side menu grouped by topic; a page that is not listed goes to a last "More" group.
// - A group marked `sequence: true` is an ordered trail (each page builds on the one before it). Only those groups get
//   "Previous / Next" cards at the end of a page. Groups of loose topics (tools, exchanges, media) never do, so the wiki
//   does not suggest an order that does not exist. Cards never cross from one group to the next.
import { transformGithubFilePathToWikiLink } from "@/lib/helpers";

// `nextStep` (ordered groups only) is a hand-picked "what to read next": the group that follows, and the page to start it with.
// It is shown only on the last page of the trail, where "Next" has nowhere to go. `hideTitle` drops the group label in the
// side menu when it would repeat the tab name.
export type ReadingGroup = {
  title: string;
  slugs: string[];
  sequence?: boolean;
  hideTitle?: boolean;
  nextStep?: { group: string; slug: string };
};

export const READING_GROUPS: Record<string, ReadingGroup[]> = {
  guides: [
    {
      title: "Getting started",
      sequence: true,
      nextStep: { group: "Wallets and hardware", slug: "keystone-zashi" },
      slugs: ["using-zec-privately", "my-first-zcash-workbook", "zero-knowledge-vs-decoys"],
    },
    { title: "Wallets and hardware", sequence: true, nextStep: { group: "Privacy", slug: "nym-mixnet-wallet-setup" }, slugs: ["ledger-shielded-zec", "keystone-zashi", "brave-wallet-guide", "zkool-multisig", "ywallet-frost-demo"] },
    { title: "Privacy", sequence: true, nextStep: { group: "Payments and DeFi", slug: "btcpayserver-zcash-plugin" }, slugs: ["nym-mixnet-wallet-setup", "nym-vpn", "mining-and-staking-privacy", "viewing-key-transaction-export"] },
    { title: "Payments and DeFi", sequence: true, nextStep: { group: "Run a node", slug: "raspberry-pi-4-full-node" }, slugs: ["btcpayserver-zcash-plugin", "zgo-payment-processor", "using-zec-in-defi", "avalanche-redbridge", "maya-protocol", "shapeshift-zcash"] },
    {
      title: "Run a node",
      sequence: true,
      nextStep: { group: "Deploy on Akash", slug: "akash-network-zebra" },
      slugs: ["raspberry-pi-4-full-node", "raspberry-pi-4-zebra-node", "raspberry-pi5-zebra-lightwalletd-zingo", "hardened-zebrad", "migration-guide-zcashd-to-zebrad-zallet", "zcash-node-rpc-and-indexing", "zcash-stack", "verifying-zcash-releases"],
    },
    { title: "Deploy on Akash", sequence: true, nextStep: { group: "Developer tools", slug: "zcash-devtool" }, slugs: ["akash-network-zebra", "akash-network-zcashd", "akash-network-zakura", "thus-spoke-zakura-akash"] },
    { title: "Developer tools", sequence: true, nextStep: { group: "Explore the network", slug: "blockchain-explorers" }, slugs: ["zcash-devtool", "zcash-js", "zingolib-and-zaino-tutorial", "zenith-installation", "zcash-improvement-proposals", "crosslink-feature-net"] },
    { title: "Explore the network", sequence: true, nextStep: { group: "Media", slug: "free2z-live" }, slugs: ["blockchain-explorers", "visualizing-the-zcash-network", "visualizing-zcash-addresses"] },
    { title: "Media", slugs: ["free2z-live", "free2z-livestreaming"] },
  ],
  "start-here": [
    { title: "Begin here", sequence: true, hideTitle: true, nextStep: { group: "Understand Zcash", slug: "zec-use-cases" }, slugs: ["using-this-wiki", "what-is-zec-and-zcash", "new-user-guide", "who-can-see-your-zcash-payment"] },
    { title: "Understand Zcash", sequence: true, nextStep: { group: "ZecHub and resources", slug: "what-is-zechub" }, slugs: ["zec-use-cases", "zcash-monetary-policy", "how-zcash-is-organized", "network-upgrades", "development-fund"] },
    { title: "ZecHub and resources", sequence: true, slugs: ["what-is-zechub", "zcash-resources", "developer-resources"] },
  ],
  "using-zcash": [
    { title: "Get started", sequence: true, nextStep: { group: "Swaps and exchanges", slug: "centralized-swaps" }, slugs: ["buying-zec", "__wallets", "__custodial-exchanges", "faucets", "recovering-funds"] },
    { title: "Swaps and exchanges", sequence: true, nextStep: { group: "Pay and get paid", slug: "payment-request-uris" }, slugs: ["centralized-swaps", "non-custodial-exchanges", "dex", "encifher-swaps", "solana-zec-to-shielded", "solswap"] },
    { title: "Pay and get paid", sequence: true, nextStep: { group: "Understand", slug: "transactions" }, slugs: ["__payment-processors", "payment-request-uris", "mobile-top-ups", "creators-and-tips", "zimppy", "metamask-snap"] },
    { title: "Understand", sequence: true, nextStep: { group: "Mining", slug: "zcash-mining-guide" }, slugs: ["transactions", "shielded-pools", "unified-addresses", "transparent-exchange-addresses", "memos"] },
    { title: "Mining", sequence: true, nextStep: { group: "Tools", slug: "zallet-quick-reference-guide" }, slugs: ["zcash-mining-guide", "zcash-mining-pools"] },
    { title: "Tools", sequence: true, slugs: ["zallet-quick-reference-guide", "zecmap", "testnet", "shielded-newsletter"] },
  ],
  "zcash-community": [
    { title: "Community", sequence: true, nextStep: { group: "Governance and security", slug: "zcash-governance" }, slugs: ["community-links", "community-projects", "community-blogs", "zcash-global-ambassadors", "cypherpunk-zero-nft"] },
    { title: "Governance and security", sequence: true, nextStep: { group: "Calls and events", slug: "arborist-calls" }, slugs: ["zcash-governance", "zcap", "zcash-ecosystem-security"] },
    { title: "Calls and events", sequence: true, nextStep: { group: "Media", slug: "zcash-media" }, slugs: ["arborist-calls", "zcash-engineering-office-hours", "zcon-archive", "zcon-vozes"] },
    { title: "Media", sequence: true, slugs: ["zcash-media", "zcash-podcasts"] },
  ],
};

export const EXTRA_ITEMS: Record<string, { href: string; label: string }> = {
  __wallets: { href: "/wallets", label: "Wallets" },
  "__custodial-exchanges": { href: "/using-zcash/custodial-exchanges", label: "Custodial Exchanges" },
  "__payment-processors": { href: "/payment-processors", label: "Payment Processors" },
};

export type TrailEntry = { item: string; href: string };

// Slug of a menu item ("site/guides/Foo_Bar" -> "foo-bar"); fixed entries keep their "__" key.
export const itemSlug = (item: string) =>
  item.startsWith("__") ? item : (transformGithubFilePathToWikiLink(item).split("/").pop()?.toLowerCase() ?? "");

// Previous and next page of the current page, inside its own ordered group. `items` are the tab's menu items
// without the ".md" suffix. Returns nothing when the page is not in an ordered group, or has no neighbour.
export function readingNeighbors(
  folder: string,
  items: string[],
  currentSlug: string,
): { prev?: TrailEntry; next?: TrailEntry; step?: { group: string; entry: TrailEntry } } {
  const group = READING_GROUPS[folder]?.find((g) => g.sequence && g.slugs.includes(currentSlug));
  if (!group) return {};
  const bySlug = new Map(items.map((item) => [itemSlug(item), item]));
  const trail: TrailEntry[] = [];
  for (const slug of group.slugs) {
    // Fixed entries (Wallets, Custodial Exchanges, Payment Processors) are standalone pages with no Continue reading
    // cards, so a trail that led into one would dead-end. They stay in the side menu but are skipped here.
    if (EXTRA_ITEMS[slug]) continue;
    if (bySlug.has(slug)) {
      const item = bySlug.get(slug)!;
      trail.push({ item, href: `/${transformGithubFilePathToWikiLink(item)}` });
    }
  }
  const at = trail.findIndex((e) => itemSlug(e.item) === currentSlug);
  if (at < 0) return {};
  const next = trail[at + 1];
  let step: { group: string; entry: TrailEntry } | undefined;
  if (!next && group.nextStep) {
    const target = bySlug.get(group.nextStep.slug);
    if (target) step = { group: group.nextStep.group, entry: { item: target, href: `/${transformGithubFilePathToWikiLink(target)}` } };
  }
  return { prev: trail[at - 1], next, step };
}

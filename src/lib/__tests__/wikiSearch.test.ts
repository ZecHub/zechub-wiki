import { searchWiki } from "@/lib/wikiSearch";
import type { Searcher } from "@/types";

describe("searchWiki", () => {
  it("prefers complete multiword matches over stronger partial matches", () => {
    const items: Searcher[] = [
      {
        name: "Privacy",
        desc: "Overview of private tools.",
        url: "/privacy",
      },
      {
        name: "Mobile guide",
        desc: "Privacy features for mobile users.",
        url: "/guides/mobile-privacy",
      },
    ];

    expect(searchWiki(items, "privacy mobile")).toEqual([items[1]]);
  });

  it("keeps useful partial matches when no page covers the whole query", () => {
    const items: Searcher[] = [
      {
        name: "FROST signing",
        desc: "Threshold signing overview.",
        url: "/zcash-tech/frost",
      },
      {
        name: "Multisig wallets",
        desc: "Wallet security options.",
        url: "/wallets/multisig",
      },
    ];

    expect(searchWiki(items, "frost multisig")).toEqual(items);
  });

  it("keeps typo tolerance when every query term can still be matched", () => {
    const items: Searcher[] = [
      {
        name: "Ironwood Network Upgrade",
        desc: "Zcash network upgrade information.",
        url: "/zcash-tech/ironwood",
      },
      {
        name: "Ironwood",
        desc: "Network information.",
        url: "/zcash-tech/ironwood-overview",
      },
    ];

    expect(searchWiki(items, "ironwod upgrade")).toEqual([items[0]]);
  });

  it("does not match a much shorter word embedded in the query", () => {
    const items: Searcher[] = [
      {
        name: "Sovright",
        desc: "Project information.",
        url: "/zcash-organizations/sovright",
      },
      {
        name: "Right settings",
        desc: "An unrelated page.",
        url: "/guides/right-settings",
      },
    ];

    expect(searchWiki(items, "sovright")).toEqual([items[0]]);
  });
});

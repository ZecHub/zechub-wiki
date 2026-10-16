import {
  navigations,
  type NavigationItem,
} from "@/constants/navigation";

const findSection = (name: string) =>
  navigations.find((item) => item.name === name);

const flattenLinks = (items: NavigationItem[]): NavigationItem[] =>
  items.flatMap((item) => [
    item,
    ...(item.links ? flattenLinks(item.links) : []),
  ]);

describe("navigation section entry points", () => {
  it("links Zero to Zero Knowledge from the Ecosystem menu", () => {
    expect(findSection("Zcash Community")?.links).toContainEqual(
      expect.objectContaining({
        name: "Zero to Zero Knowledge",
        path: "/zcash-social-media",
      }),
    );
  });

  it("links the ZKAV Club creator guides from the Guides menu", () => {
    expect(findSection("Guides")?.links).toContainEqual(
      expect.objectContaining({
        name: "ZKAV Club",
        path: "/zfav-club/guides-for-creators",
      }),
    );
  });

  it("keeps both section entry points unique across the navigation tree", () => {
    const allLinks = flattenLinks(navigations);

    expect(
      allLinks.filter(
        (item) => item.path === "/zcash-social-media",
      ),
    ).toHaveLength(1);
    expect(
      allLinks.filter((item) => item.path === "/zfav-club/guides-for-creators"),
    ).toHaveLength(1);
  });
});

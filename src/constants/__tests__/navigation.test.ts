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
  it("links Zcash Social Media from the Ecosystem menu", () => {
    expect(findSection("Zcash Community")?.links).toContainEqual(
      expect.objectContaining({
        name: "Zcash Social Media",
        path: "/zcash-social-media/zero-to-zero-knowledge",
      }),
    );
  });

  it("links ZFAV Club from the Guides menu", () => {
    expect(findSection("Guides")?.links).toContainEqual(
      expect.objectContaining({
        name: "ZFAV Club",
        path: "/zfav-club/guides-for-creators",
      }),
    );
  });

  it("keeps both section entry points unique across the navigation tree", () => {
    const allLinks = flattenLinks(navigations);

    expect(
      allLinks.filter(
        (item) => item.path === "/zcash-social-media/zero-to-zero-knowledge",
      ),
    ).toHaveLength(1);
    expect(
      allLinks.filter((item) => item.path === "/zfav-club/guides-for-creators"),
    ).toHaveLength(1);
  });
});

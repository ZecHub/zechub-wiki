import {
  menuSections,
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
  it("links Zero to Zero Knowledge from the Learn Zcash menu", () => {
    expect(findSection("Learn Zcash")?.links).toContainEqual(
      expect.objectContaining({
        name: "Zero to Zero Knowledge",
        path: "/zero-to-zero-knowledge/zero-to-zero-knowledge",
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
        (item) => item.path === "/zero-to-zero-knowledge/zero-to-zero-knowledge",
      ),
    ).toHaveLength(1);
    expect(
      allLinks.filter((item) => item.path === "/zfav-club/guides-for-creators"),
    ).toHaveLength(1);
  });
});

describe("menu structure", () => {
  const sectioned = Object.keys(menuSections);

  it("only offers a page from one menu: no path appears twice across the tabs", () => {
    const seen = new Map<string, string>();
    const duplicates: string[] = [];
    for (const menu of navigations.filter((item) => item.links)) {
      for (const link of menu.links ?? []) {
        if (!link.path || link.newTab) continue;
        const previous = seen.get(link.path);
        if (previous) duplicates.push(`${link.name} (${previous} and ${menu.name})`);
        else seen.set(link.path, menu.name);
      }
    }
    expect(duplicates).toEqual([]);
  });

  it.each(sectioned)("lists every link of %s under a section and never twice", (menuName) => {
    const links = findSection(menuName)?.links ?? [];
    const names = menuSections[menuName].flatMap((section) => section.items);

    // Nothing missing (it would fall into the trailing "More" group) ...
    expect(links.map((link) => link.name).filter((name) => !names.includes(name))).toEqual([]);
    // ... nothing misspelled or removed from the menu ...
    expect(names.filter((name) => !links.some((link) => link.name === name))).toEqual([]);
    // ... and nothing placed in two sections.
    expect(names.filter((name, i) => names.indexOf(name) !== i)).toEqual([]);
  });

  it.each(sectioned)("keeps the sections of %s short enough to scan", (menuName) => {
    for (const section of menuSections[menuName]) {
      expect(section.items.length).toBeLessThanOrEqual(8);
    }
  });
});

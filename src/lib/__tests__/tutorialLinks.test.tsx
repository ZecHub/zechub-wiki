import { render, screen } from "@testing-library/react";
import ZebraComponent from "@/app/[locale]/zebra/ZebraComponent";
import { navigations } from "@/constants/navigation";
import { searcher } from "@/constants/searcher";

// These pages were removed from the wiki; all of them return 404 on zechub.wiki.
const REMOVED_PAGES = [
  "/tutorials",
  "/tutorials/exchanges",
  "/tutorials/full-node-tutorials",
  "/tutorials/using-zcash",
  "/tutorials/wallet-tutorials",
];

const pathOf = (url: string) =>
  url
    .replace(/^https:\/\/zechub\.wiki/, "")
    .replace(/[?#].*$/, "")
    .replace(/(.)\/$/, "$1");

describe("tutorial links", () => {
  it("has no search results for the removed tutorial pages", () => {
    const stale = searcher.filter((entry) => REMOVED_PAGES.includes(pathOf(entry.url)));

    expect(stale).toEqual([]);
  });

  it("sends the Tutorials search result to the page the main navigation uses", () => {
    const navPath = navigations.find((item) => item.name === "Tutorials")?.path;

    expect(navPath).toBe("/zechub-tutorial");
    expect(searcher.find((entry) => entry.name === "Tutorials")?.url).toBe(navPath);
  });

  it("points the Zebra page's Full Node Tutorials button at the Full Nodes article", () => {
    render(<ZebraComponent />);

    expect(screen.getByRole("link", { name: /full node tutorials/i })).toHaveAttribute(
      "href",
      "/zcash-tech/full-nodes#content",
    );
  });
});

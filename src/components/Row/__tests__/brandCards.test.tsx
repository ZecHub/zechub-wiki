import fs from "fs";
import path from "path";
import { render, screen, within } from "@testing-library/react";
import Row from "@/components/Row/Row";
import zcashUkraineLogo from "@/assets/brand/ZcashUkraine/Zcash_Ukraine.jpg";

// Card.tsx pulls in the shared helpers module (next/cache) and the locale-aware
// Link; neither matters to these cards, so keep them out of jsdom.
jest.mock("@/lib/helpers", () => ({
  formatString: { titleCase: (value: string) => value },
}));
jest.mock("@/i18n/navigation", () => ({ Link: "a" }));

const publicDir = path.join(process.cwd(), "public");

function brandCard(title: string) {
  const heading = screen.getByRole("heading", { name: title });
  const card = heading.closest(".group");
  if (!(card instanceof HTMLElement)) throw new Error(`no card for ${title}`);
  return card;
}

describe("brand asset cards", () => {
  it("describes Zcash Ukraine as the Ukrainian community", () => {
    render(<Row />);
    const card = brandCard("Zcash Ukraine");

    expect(card).toHaveTextContent("bridging Zcash to Ukraine");
    expect(card).not.toHaveTextContent("Turkey");
  });

  it("points every Download under /downloads at a file that exists", () => {
    render(<Row />);
    const hrefs = screen
      .getAllByRole("link", { name: "Download" })
      .map((link) => link.getAttribute("href") ?? "")
      .filter((href) => href.startsWith("/downloads/"));

    expect(hrefs.length).toBeGreaterThan(0);
    const missing = hrefs.filter((href) => {
      const file = path.join(publicDir, decodeURIComponent(href));
      return !fs.existsSync(file) || !fs.statSync(file).isFile();
    });
    expect(missing).toEqual([]);
  });

  it("lets readers download the Zcash Ukraine logo", () => {
    render(<Row />);
    const download = within(brandCard("Zcash Ukraine")).getByRole("link", {
      name: "Download",
    });

    expect(download).toHaveAttribute("href", zcashUkraineLogo.src);
  });
});

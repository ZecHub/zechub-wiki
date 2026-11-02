import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Gallery from "@/components/Gallery/Gallery";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, className }: { src: string; alt: string; className?: string }) => <img src={src} alt={alt} className={className} />,
}));

const infographics = [
  ["Zcash Encrypted Memos", "/content-images/Encrypted-Memos-Infographic-b3c464eaf1.webp"],
  ["Shielded-by-default", "/content-images/Shielded-by-default-60f41919f5.webp"],
  ["Zcash Syncing", "/content-images/What-is-Zcash-Sync-Infographic-56f41eaa08.webp"],
  ["Zcash FROST", "/content-images/Zcash-FROST-Infographic-470ed34be6.webp"],
  ["Zcash Roadmap", "/content-images/Zcash-Roadmap-1c13ce1f2b.webp"],
  ["Zcash Timeline", "/content-images/Zcash-Timeline-141809aa1c.webp"],
  ["Zcash Value Pools", "/content-images/Zcash-Value-Pools-b79351c9b4.webp"],
  ["Zebra Node Compile", "/content-images/Zebra-Node-Compile-413743711e.webp"],
];

const thumbnails = (container: HTMLElement) => within(container).getAllByRole("button");

describe("Gallery image sets", () => {
  it("renders the 15 wallpapers by default", () => {
    const { container } = render(<Gallery />);
    const buttons = thumbnails(container);
    expect(buttons).toHaveLength(15);
    buttons.forEach((button, i) => {
      expect(button).toHaveAccessibleName(`Open Zcash gallery image ${i + 1}`);
      expect(within(button).getByRole("img")).toHaveAttribute("src", `/gallery/${i + 1}.png`);
      expect(within(button).getByRole("img")).toHaveAttribute("alt", `Zcash gallery image ${i + 1}`);
      expect(within(button).getByRole("img")).not.toHaveClass("object-top");
    });
  });

  it("renders the 8 infographics with captions", () => {
    const { container } = render(<Gallery set="infographics" />);
    const buttons = thumbnails(container);
    expect(buttons).toHaveLength(8);
    buttons.forEach((button, i) => {
      const [caption, src] = infographics[i];
      expect(button).toHaveAccessibleName(`Open ${caption}`);
      expect(within(button).getByRole("img")).toHaveAttribute("src", src);
      expect(within(button).getByRole("img")).toHaveAttribute("alt", `${caption} infographic`);
      expect(within(button).getByRole("img")).toHaveClass("object-top");
      expect(button).toHaveTextContent(caption);
    });
  });

  it("wraps arrow navigation and downloads over the 8 infographics", async () => {
    const user = userEvent.setup();
    let downloaded: { href: string; name: string } | undefined;
    const click = jest.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (this: HTMLAnchorElement) {
      downloaded = { href: this.getAttribute("href")!, name: this.download };
    });
    try {
      render(<Gallery set="infographics" />);
      const thumbnail = screen.getByRole("button", { name: "Open Zcash Encrypted Memos" });
      await user.click(thumbnail);
      const dialog = await screen.findByRole("dialog", { name: "Zcash Encrypted Memos" });
      const close = within(dialog).getByRole("button", { name: "Close image preview" });
      await waitFor(() => expect(close).toHaveFocus());

      await user.keyboard("{ArrowLeft}");
      expect(dialog).toHaveAccessibleName("Zebra Node Compile");
      expect(within(dialog).getByAltText("Zebra Node Compile infographic")).toHaveAttribute("src", infographics[7][1]);
      expect(within(dialog).getByText(/Image 8 of 8/)).toBeInTheDocument();
      await user.click(within(dialog).getByRole("button", { name: "Download" }));
      expect(downloaded).toEqual({ href: infographics[7][1], name: "Zebra-Node-Compile-413743711e.webp" });

      await user.keyboard("{ArrowRight}");
      expect(dialog).toHaveAccessibleName("Zcash Encrypted Memos");
      expect(within(dialog).getByText(/Image 1 of 8/)).toBeInTheDocument();
      await user.click(within(dialog).getByRole("button", { name: "Previous image" }));
      expect(dialog).toHaveAccessibleName("Zebra Node Compile");

      await user.keyboard("{Escape}");
      await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
      await waitFor(() => expect(thumbnail).toHaveFocus());
    } finally {
      click.mockRestore();
    }
  });

  it.each(["wallpapers", "posters"])("renders the wallpapers for set=%s", (set) => {
    const { container: expected } = render(<Gallery />);
    const { container } = render(<Gallery set={set} />);
    expect(container.innerHTML).toBe(expected.innerHTML);
  });
});

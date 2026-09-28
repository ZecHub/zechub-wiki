import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Gallery from "@/components/Gallery/Gallery";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

describe("Gallery keyboard access", () => {
  it.each(["{Enter}", " "])("opens a thumbnail with %s and restores focus after Escape", async (key) => {
    const user = userEvent.setup();
    render(<Gallery />);
    await user.tab();
    const thumbnail = screen.getByRole("button", { name: "Open Zcash gallery image 1" });
    expect(thumbnail).toHaveFocus();

    await user.keyboard(key);
    const dialog = await screen.findByRole("dialog", { name: "Zcash image gallery" });
    expect(within(dialog).getByAltText("Gallery image 1")).toBeInTheDocument();
    await waitFor(() => expect(within(dialog).getByRole("button", { name: "Close image preview" })).toHaveFocus());

    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await waitFor(() => expect(thumbnail).toHaveFocus());
  });

  it("keeps tab navigation inside the lightbox", async () => {
    const user = userEvent.setup();
    render(<><Gallery /><button>After gallery</button></>);
    await user.click(screen.getByAltText("Zcash gallery image 4"));
    const dialog = await screen.findByRole("dialog", { name: "Zcash image gallery" });
    const close = within(dialog).getByRole("button", { name: "Close image preview" });
    await waitFor(() => expect(close).toHaveFocus());

    await user.tab({ shift: true });
    expect(within(dialog).getByRole("button", { name: "Download" })).toHaveFocus();
    await user.tab();
    expect(close).toHaveFocus();
    await user.tab();
    expect(within(dialog).getByRole("button", { name: "Previous image" })).toHaveFocus();
    await user.tab();
    expect(within(dialog).getByRole("button", { name: "Next image" })).toHaveFocus();
  });

  it("wraps image navigation with the arrow keys while keeping focus in the lightbox", async () => {
    const user = userEvent.setup();
    render(<Gallery />);
    await user.click(screen.getByAltText("Zcash gallery image 1"));
    const dialog = await screen.findByRole("dialog", { name: "Zcash image gallery" });
    const close = within(dialog).getByRole("button", { name: "Close image preview" });
    await waitFor(() => expect(close).toHaveFocus());

    await user.keyboard("{ArrowLeft}");
    expect(within(dialog).getByAltText("Gallery image 15")).toBeInTheDocument();
    await user.keyboard("{ArrowRight}");
    expect(within(dialog).getByAltText("Gallery image 1")).toBeInTheDocument();
    expect(close).toHaveFocus();
  });

  it("closes on a backdrop click and restores the selected thumbnail", async () => {
    const user = userEvent.setup();
    render(<Gallery />);
    const thumbnail = screen.getByRole("button", { name: "Open Zcash gallery image 7" });
    await user.click(thumbnail);
    const dialog = await screen.findByRole("dialog", { name: "Zcash image gallery" });
    await user.click(dialog);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await waitFor(() => expect(thumbnail).toHaveFocus());
  });

  it("preserves pointer navigation, image clicks and the selected download", async () => {
    const user = userEvent.setup();
    let downloaded: { href: string; name: string } | undefined;
    const click = jest.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (this: HTMLAnchorElement) {
      downloaded = { href: this.getAttribute("href")!, name: this.download };
    });
    try {
      render(<Gallery />);
      await user.click(screen.getByAltText("Zcash gallery image 15"));
      await user.click(screen.getByText("→"));
      expect(screen.getByAltText("Gallery image 1")).toBeInTheDocument();
      await user.click(screen.getByText("←"));
      await user.click(screen.getByAltText("Gallery image 15"));
      await user.click(screen.getByRole("button", { name: "Download" }));
      expect(downloaded).toEqual({ href: "/gallery/15.png", name: "zechub-gallery-15.png" });
      expect(screen.getByAltText("Gallery image 15")).toBeInTheDocument();
      await user.click(screen.getByText("✕"));
      await waitFor(() => expect(screen.queryByAltText("Gallery image 15")).not.toBeInTheDocument());
    } finally {
      click.mockRestore();
    }
  });

  it("leaves arrow keys alone when the lightbox is closed", () => {
    render(<Gallery />);
    const event = new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true });
    fireEvent(document, event);
    expect(event.defaultPrevented).toBe(false);
    expect(screen.queryByAltText("Gallery image 1")).not.toBeInTheDocument();
  });
});

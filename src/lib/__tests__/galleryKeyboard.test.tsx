import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Gallery from "@/components/Gallery/Gallery";

// The gallery links to its sibling sets through the locale-aware Link; render a plain anchor
// so the suite does not need the next-intl ES modules.
jest.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>{children}</a>
  ),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

describe("Gallery keyboard access", () => {
  it.each(["{Enter}", " "])("opens a thumbnail with %s and restores focus after Escape", async (key) => {
    const user = userEvent.setup();
    render(<Gallery />);
    const thumbnail = screen.getByRole("button", { name: "Open Zcash wallpaper 1" });
    // Two section links come first in the tab order, then the first thumbnail.
    await user.tab();
    await user.tab();
    await user.tab();
    expect(thumbnail).toHaveFocus();

    await user.keyboard(key);
    const dialog = await screen.findByRole("dialog", { name: "Zcash wallpaper 1" });
    expect(within(dialog).getByAltText("Zcash wallpaper 1")).toBeInTheDocument();
    await waitFor(() => expect(within(dialog).getByRole("button", { name: "Close image preview" })).toHaveFocus());

    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await waitFor(() => expect(thumbnail).toHaveFocus());
  });

  it("keeps tab navigation inside the lightbox", async () => {
    const user = userEvent.setup();
    render(<><Gallery /><button>After gallery</button></>);
    await user.click(screen.getByAltText("Zcash wallpaper 4"));
    const dialog = await screen.findByRole("dialog", { name: "Zcash wallpaper 4" });
    const close = within(dialog).getByRole("button", { name: "Close image preview" });
    await waitFor(() => expect(close).toHaveFocus());

    await user.tab({ shift: true });
    expect(within(dialog).getByRole("link", { name: "Download" })).toHaveFocus();
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
    await user.click(screen.getByAltText("Zcash wallpaper 1"));
    const dialog = await screen.findByRole("dialog", { name: "Zcash wallpaper 1" });
    const close = within(dialog).getByRole("button", { name: "Close image preview" });
    await waitFor(() => expect(close).toHaveFocus());

    await user.keyboard("{ArrowLeft}");
    expect(within(dialog).getByAltText("Zcash wallpaper 15")).toBeInTheDocument();
    await user.keyboard("{ArrowRight}");
    expect(within(dialog).getByAltText("Zcash wallpaper 1")).toBeInTheDocument();
    expect(close).toHaveFocus();
  });

  it("closes on a backdrop click and restores the selected thumbnail", async () => {
    const user = userEvent.setup();
    render(<Gallery />);
    const thumbnail = screen.getByRole("button", { name: "Open Zcash wallpaper 7" });
    await user.click(thumbnail);
    const dialog = await screen.findByRole("dialog", { name: "Zcash wallpaper 7" });
    await user.click(dialog);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await waitFor(() => expect(thumbnail).toHaveFocus());
  });

  it("preserves pointer navigation, image clicks and the selected download", async () => {
    const user = userEvent.setup();
    render(<Gallery />);
    await user.click(screen.getByAltText("Zcash wallpaper 15"));
    const dialog = await screen.findByRole("dialog", { name: "Zcash wallpaper 15" });

    await user.click(within(dialog).getByRole("button", { name: "Next image" }));
    expect(within(dialog).getByAltText("Zcash wallpaper 1")).toBeInTheDocument();
    await user.click(within(dialog).getByRole("button", { name: "Previous image" }));
    expect(within(dialog).getByAltText("Zcash wallpaper 15")).toBeInTheDocument();

    // Download is a real link, so it works without script and keeps the file name.
    const download = within(dialog).getByRole("link", { name: "Download" });
    expect(download).toHaveAttribute("href", "/gallery/15.png");
    expect(download).toHaveAttribute("download", "zechub-wallpaper-15.png");

    await user.click(within(dialog).getByRole("button", { name: "Close image preview" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("leaves arrow keys alone when the lightbox is closed", () => {
    render(<Gallery />);
    const event = new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true });
    fireEvent(document, event);
    expect(event.defaultPrevented).toBe(false);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

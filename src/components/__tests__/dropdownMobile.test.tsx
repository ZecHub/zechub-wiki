import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DropdownMobile from "../DropdownMobile/DropdownMobile";

describe("DropdownMobile (keyboard accessibility)", () => {
  const user = userEvent.setup();

  const renderMenu = () =>
    render(
      <DropdownMobile label="Using Zcash">
        <a href="/wallets">Wallets</a>
        <a href="/faucets">Faucets</a>
      </DropdownMobile>,
    );

  it("renders the trigger as a <button>, not a <div>", () => {
    renderMenu();
    const button = screen.getByRole("button", { name: "Using Zcash" });
    expect(button.tagName).toBe("BUTTON");
  });

  it("starts closed with aria-expanded=false", () => {
    renderMenu();
    const button = screen.getByRole("button", { name: "Using Zcash" });
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveAttribute("aria-haspopup", "menu");
  });

  it("toggles open on click and updates aria-expanded", async () => {
    renderMenu();
    const button = screen.getByRole("button", { name: "Using Zcash" });

    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    // Open panel exposes its links.
    expect(screen.getByRole("link", { name: "Wallets" })).toBeInTheDocument();

    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("closes on Escape and returns focus to the trigger button", async () => {
    renderMenu();
    const button = screen.getByRole("button", { name: "Using Zcash" });

    await user.click(button); // open
    expect(button).toHaveAttribute("aria-expanded", "true");

    await user.keyboard("{Escape}");
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveFocus();
  });

  it("keeps closed links out of the tab order via the inert attribute", () => {
    renderMenu();
    // Closed state: the content container is inert, so its links are not focusable.
    const content = screen
      .getByRole("button", { name: "Using Zcash" })
      .parentElement!.querySelector(".dropdown-mobile-content");
    expect(content).not.toBeNull();
    expect(content?.hasAttribute("inert")).toBe(true);
  });

  it("removes inert when the menu is opened", async () => {
    renderMenu();
    const button = screen.getByRole("button", { name: "Using Zcash" });
    const content = button.parentElement!.querySelector(
      ".dropdown-mobile-content",
    );

    await user.click(button);
    expect(content?.hasAttribute("inert")).toBe(false);
  });
});

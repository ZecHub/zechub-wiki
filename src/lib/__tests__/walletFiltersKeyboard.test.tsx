import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WalletList from "@/components/Wallet/WalletList";

jest.mock("@/context/LanguageContext", () => ({ useLanguage: () => ({ t: {} }) }));
jest.mock("@/components/Wallet/WalletItem", () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <h2>{title}</h2>,
}));

const wallets = [
  { title: "Pocket wallet", devices: ["Mobile"], operatingSystem: ["Android"] },
  { title: "Desk wallet", devices: ["Desktop"], operatingSystem: ["Linux"] },
].map((wallet) => ({
  ...wallet, url: "https://example.com", imageUrl: "/wallet.png", pools: ["Orchard"],
  features: ["Shielded"], walletSupport: ["Unified"], syncSpeed: "", ironwood: "ready",
}));

function renderMobile() {
  // Model the existing narrow-screen sidebar visibility; this is not a layout test.
  return render(<><style>{".wl-sidebar { display: none; }"}</style><WalletList allWallets={wallets} /><button>After wallets</button></>);
}

describe("Wallet filtering keyboard access", () => {
  const originalFetch = global.fetch;
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
  });
  afterEach(() => { global.fetch = originalFetch; });

  it.each(["{Enter}", " "])("opens with %s, focuses the panel and returns to the opener after Escape", async (key) => {
    const user = userEvent.setup();
    renderMobile();
    await user.tab();
    const opener = screen.getByRole("button", { name: /Show Navigation/ });
    expect(opener).toHaveFocus();
    await user.keyboard(key);
    const dialog = await screen.findByRole("dialog", { name: "Filters" });
    await waitFor(() => expect(within(dialog).getByRole("button", { name: "Close" })).toHaveFocus());
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await waitFor(() => expect(opener).toHaveFocus());
  });

  it("contains Tab navigation and selects a filter with Space without moving focus", async () => {
    const user = userEvent.setup();
    renderMobile();
    await user.click(screen.getByRole("button", { name: /Show Navigation/ }));
    const dialog = await screen.findByRole("dialog", { name: "Filters" });
    const close = within(dialog).getByRole("button", { name: "Close" });
    await waitFor(() => expect(close).toHaveFocus());
    await user.tab({ shift: true });
    expect(within(dialog).getByRole("checkbox", { name: "ready" })).toHaveFocus();
    await user.tab();
    expect(close).toHaveFocus();
    await user.tab();
    const desktop = within(dialog).getByRole("checkbox", { name: "Desktop" });
    expect(desktop).toHaveFocus();
    await user.keyboard(" ");
    expect(desktop).toBeChecked();
    expect(desktop).toHaveFocus();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(screen.getByText("1 wallet")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Desk wallet" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Pocket wallet" })).not.toBeInTheDocument();
  });

  it.each(["{Enter}", " "])("removes the final chip with %s and restores the opener", async (key) => {
    const user = userEvent.setup();
    renderMobile();
    const opener = screen.getByRole("button", { name: /Show Navigation/ });
    await user.click(opener);
    const drawer = document.querySelector(".wl-mobile-drawer") as HTMLElement;
    await user.click(within(drawer).getByRole("checkbox", { name: "Mobile" }));
    await user.click(within(drawer).getByRole("button", { name: "Close" }));
    await waitFor(() => expect(document.querySelector(".wl-mobile-drawer")).toBeNull());
    opener.focus();
    await user.tab();
    const chip = screen.getByRole("button", { name: "Mobile Close" });
    expect(chip).toHaveFocus();
    await user.keyboard(key);
    expect(screen.queryByRole("button", { name: "Mobile Close" })).not.toBeInTheDocument();
    expect(screen.getByText("2 wallets")).toBeInTheDocument();
    expect(opener).toHaveFocus();
  });

  it("moves focus to the next chip, then the previous chip when removing selected filters", async () => {
    const user = userEvent.setup();
    renderMobile();
    await user.click(screen.getByRole("button", { name: /Show Navigation/ }));
    const drawer = document.querySelector(".wl-mobile-drawer") as HTMLElement;
    for (const name of ["Mobile", "Orchard", "Shielded"]) {
      await user.click(within(drawer).getByRole("checkbox", { name }));
    }
    await user.click(within(drawer).getByRole("button", { name: "Close" }));
    await waitFor(() => expect(document.querySelector(".wl-mobile-drawer")).toBeNull());
    await user.click(screen.getByRole("button", { name: "Mobile Close" }));
    expect(screen.getByRole("button", { name: "Orchard Close" })).toHaveFocus();
    await user.click(screen.getByRole("button", { name: "Shielded Close" }));
    expect(screen.getByRole("button", { name: "Orchard Close" })).toHaveFocus();
  });

  it("preserves pointer selection across Close and backdrop dismissal without refetching ratings", async () => {
    const user = userEvent.setup();
    renderMobile();
    const opener = screen.getByRole("button", { name: /Show Navigation/ });
    await user.click(opener);
    let dialog = await screen.findByRole("dialog", { name: "Filters" });
    await user.click(within(dialog).getByRole("checkbox", { name: "Mobile" }));
    expect(within(dialog).getByRole("checkbox", { name: "Mobile" })).toBeChecked();
    await user.click(within(dialog).getByRole("button", { name: "Close" }));
    await waitFor(() => expect(opener).toHaveFocus());
    expect(screen.getByText("1 wallet")).toBeInTheDocument();
    await user.click(opener);
    dialog = await screen.findByRole("dialog", { name: "Filters" });
    expect(within(dialog).getByRole("checkbox", { name: "Mobile" })).toBeChecked();
    await user.click(dialog);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await waitFor(() => expect(opener).toHaveFocus());
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("keeps the desktop checkbox filtering and result reset working", async () => {
    const user = userEvent.setup();
    render(<WalletList allWallets={wallets} />);
    const mobile = await screen.findByRole("checkbox", { name: "Mobile" });
    await user.click(mobile);
    expect(screen.getByText("1 wallet")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Pocket wallet" })).toBeInTheDocument();
    await user.click(mobile);
    expect(screen.getByText("2 wallets")).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

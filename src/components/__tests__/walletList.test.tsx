
import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import WalletList from "@/components/Wallet/WalletList";
import userEvent from "@testing-library/user-event";
import { parseMarkdown } from "@/lib/parseMarkdown";

jest.mock("@/context/LanguageContext", () => ({
  useLanguage: () => ({ t: {} }),
}));

jest.mock("@/i18n/navigation", () => ({
  Link: ({ children, href, ...rest }: any) => (
    <a href={href} {...rest}>{children}</a>
  ),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt }: { alt: string }) => <span>{alt}</span>,
}));

const wallets = parseMarkdown(`
## [Alive](https://alive.example)
- Devices: Mobile
- Pools: Orchard | Ironwood
- NU7: Compatible
- Stage: Beta

---
## [Gone](https://gone.example)
- Devices: Desktop
- Pools: Orchard
- Status: Deprecated | End-of-life, no NU6.3 support
`);

beforeEach(() => {
  global.fetch = jest.fn(async () => ({
    ok: true,
    json: async () => ({}),
  })) as any;
});

describe("WalletList", () => {
  it("lists deprecated wallets separately", () => {
    render(<WalletList allWallets={wallets} />);

    expect(screen.getAllByText("1 wallet").length).toBeGreaterThan(0);

    const section = screen
      .getByText(/Deprecated \/ no longer supports Zcash \(1\)/)
      .closest("details") as HTMLElement;

    expect(section).toHaveAttribute("open");
    expect(within(section).getByText("Gone")).toBeInTheDocument();
    expect(
      within(section).getByText("End-of-life, no NU6.3 support")
    ).toBeInTheDocument();

    expect(
      within(section).queryByText("Alive")
    ).not.toBeInTheDocument();

    expect(
      within(section).queryByText(/^NU7:/)
    ).not.toBeInTheDocument();
  });

  it("applies filters to deprecated wallets too", async () => {
    const user = userEvent.setup();

    render(<WalletList allWallets={wallets} />);

    const sidebar = document.querySelector(".wl-sidebar") as HTMLElement;

    const orchard = await within(sidebar).findByRole("checkbox", {
      name: "Orchard",
    });

    await user.click(orchard);

    expect(
      screen.getByText(/Deprecated \/ no longer supports Zcash \(1\)/)
    ).toBeInTheDocument();

    await user.click(
      within(sidebar).getByRole("checkbox", { name: "Mobile" })
    );

    expect(
      screen.queryByText(/Deprecated \/ no longer supports Zcash/)
    ).not.toBeInTheDocument();

    expect(screen.queryByText("Gone")).not.toBeInTheDocument();

    await user.click(
      within(sidebar).getByRole("checkbox", { name: "Mobile" })
    );
    await user.click(orchard);

    expect(
      screen.getByText(/Deprecated \/ no longer supports Zcash \(1\)/)
    ).toBeInTheDocument();
  });

  it("builds filters from active wallets only", async () => {
    render(<WalletList allWallets={wallets} />);

    await waitFor(() =>
      expect(screen.getAllByText("Mobile").length).toBeGreaterThan(1)
    );

    const sidebar = document.querySelector(".wl-sidebar") as HTMLElement;

    expect(
      within(sidebar).getByText("Mobile")
    ).toBeInTheDocument();

    expect(
      within(sidebar).queryByText("Desktop")
    ).not.toBeInTheDocument();
  });

  it("shows NU7 compatibility and the release stage", () => {
    render(<WalletList allWallets={wallets} />);

    expect(
      screen.getByText("NU7: Compatible")
    ).toBeInTheDocument();

    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("orders wallets by NU7 compatibility", () => {
    const list = parseMarkdown(`
## [NoStatus](https://a.example)
- Devices: Mobile

---
## [Late](https://b.example)
- Devices: Mobile
- NU7: Not Ready

---
## [Transp](https://c.example)
- Devices: Mobile
- NU7: Compatible for Transparent ZEC

---
## [Early](https://d.example)
- Devices: Mobile
- NU7: Compatible

---
## [Busy](https://e.example)
- Devices: Mobile
- NU7: In Progress

---
## [Unverified](https://f.example)
- Devices: Mobile
- NU7: Not Verified
`);

    render(<WalletList allWallets={list} />);

    const titles = screen
      .getAllByRole("heading", { level: 5 })
      .map((h) => h.textContent);

    expect(titles).toEqual([
      "Early",
      "Transp",
      "Busy",
      "Late",
      "Unverified",
      "NoStatus",
    ]);
  });

  it("filters by NU7 status", async () => {
    const user = userEvent.setup();

    render(<WalletList allWallets={wallets} />);

    const sidebar = document.querySelector(".wl-sidebar") as HTMLElement;

    const compatible = await within(sidebar).findByRole("checkbox", {
      name: "Compatible",
    });

    await user.click(compatible);

    expect(screen.getByText("Alive")).toBeInTheDocument();
    expect(screen.queryByText("Gone")).not.toBeInTheDocument();
  });
});

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
    <a href={href} {...rest}>
      {children}
    </a>
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
  global.fetch = jest.fn(async () => ({ ok: true, json: async () => ({}) })) as any;
});

describe("WalletList", () => {
  it("lists a deprecated wallet only in the bottom section, with its reason", async () => {
    render(<WalletList allWallets={wallets} />);

    expect(screen.getAllByText("1 wallet").length).toBeGreaterThan(0);
    const section = screen
      .getByText(/Deprecated \/ no longer supports Zcash \(1\)/)
      .closest("details") as HTMLElement;
    expect(section).toHaveAttribute("open");
    expect(within(section).getByText("Gone")).toBeInTheDocument();
    expect(within(section).getByText("End-of-life, no NU6.3 support")).toBeInTheDocument();
    expect(within(section).queryByText("Alive")).not.toBeInTheDocument();
    expect(within(section).queryByText(/^NU7: /)).not.toBeInTheDocument();
  });

  it("applies the filters to the deprecated section too, hiding it when nothing matches", async () => {
    const user = userEvent.setup();
    render(<WalletList allWallets={wallets} />);
    const sidebar = document.querySelector(".wl-sidebar") as HTMLElement;
    const deprecatedHeading = /Deprecated \/ no longer supports Zcash/;

    // Both wallets have Orchard: the deprecated one stays listed.
    const orchard = await within(sidebar).findByRole("checkbox", { name: "Orchard" });
    await user.click(orchard);
    expect(screen.getByText(/Deprecated \/ no longer supports Zcash \(1\)/)).toBeInTheDocument();

    // Only the active wallet is Mobile: the section disappears.
    await user.click(within(sidebar).getByRole("checkbox", { name: "Mobile" }));
    expect(screen.queryByText(deprecatedHeading)).not.toBeInTheDocument();
    expect(screen.queryByText("Gone")).not.toBeInTheDocument();

    // Clearing the filters brings it back.
    await user.click(within(sidebar).getByRole("checkbox", { name: "Mobile" }));
    await user.click(orchard);
    expect(screen.getByText(/Deprecated \/ no longer supports Zcash \(1\)/)).toBeInTheDocument();
  });

  it("builds the filters from active wallets only", async () => {
    render(<WalletList allWallets={wallets} />);

    // "Mobile" comes from the active wallet; "Desktop" only from the deprecated one.
    await waitFor(() => expect(screen.getAllByText("Mobile").length).toBeGreaterThan(1));
    const sidebar = document.querySelector(".wl-sidebar") as HTMLElement;
    expect(within(sidebar).getByText("Mobile")).toBeInTheDocument();
    expect(within(sidebar).queryByText("Desktop")).not.toBeInTheDocument();
  });

  it("shows the NU7 badge and the release stage on an active wallet", () => {
    render(<WalletList allWallets={wallets} />);

    expect(screen.getByText("NU7: Compatible")).toBeInTheDocument();
    expect(screen.getAllByText("Beta").length).toBeGreaterThan(0);
  });

  it("groups beta, transparent-only and Nym Mixnet wallets", async () => {
    const list = parseMarkdown(`
## [Regular](https://regular.example)
- Devices: Mobile
- Pools: Ironwood
- NU7: Compatible

---
## [Preview](https://preview.example)
- Devices: Mobile
- Pools: Ironwood
- NU7: Compatible
- Stage: Beta

---
## [Clear](https://clear.example)
- Devices: Mobile
- Pools: Transparent
- NU7: Compatible

---
## [Private](https://private.example)
- Devices: Mobile
- Pools: Ironwood
- NU7: Compatible
- Nym Mixnet: Supported
`);

    render(<WalletList allWallets={list} />);

    const beta = screen
      .getByText("Beta wallets (1)")
      .closest("section") as HTMLElement;
    const transparent = screen
      .getByText("Transparent-only wallets (1)")
      .closest("section") as HTMLElement;
    const nym = screen
      .getByText("Nym Mixnet support (1)")
      .closest("section") as HTMLElement;

    expect(within(beta).getByText("Preview")).toBeInTheDocument();
    expect(within(transparent).getByText("Clear")).toBeInTheDocument();
    expect(within(nym).getByText("Private")).toBeInTheDocument();
    expect(within(beta).queryByText("Regular")).not.toBeInTheDocument();
    expect(within(transparent).queryByText("Regular")).not.toBeInTheDocument();
  });

  it("filters by Nym Mixnet support", async () => {
    const user = userEvent.setup();
    const list = parseMarkdown(`
## [Regular](https://regular.example)
- Devices: Mobile
- Pools: Ironwood

---
## [Private](https://private.example)
- Devices: Mobile
- Pools: Ironwood
- Nym Mixnet: Supported
`);

    render(<WalletList allWallets={list} />);

    const sidebar = document.querySelector(".wl-sidebar") as HTMLElement;
    const supported = await within(sidebar).findByRole("checkbox", {
      name: "Supported",
    });

    await user.click(supported);

    expect(
      screen.queryByRole("heading", { name: "Regular" })
    ).not.toBeInTheDocument();
    expect(
      screen.getAllByRole("heading", { name: "Private" }).length
    ).toBeGreaterThan(0);
  });

  it("labels open and closed source wallets and filters by source", async () => {
    const user = userEvent.setup();
    const list = parseMarkdown(`
## [Open](https://open.example)
- Devices: Mobile
- Pools: Ironwood
- Source Code: https://github.com/example/open
- Source: Open Source

---
## [Closed](https://closed.example)
- Devices: Mobile
- Pools: Ironwood
- Source Code: https://github.com/example/closed
- Source: Closed Source
`);

    render(<WalletList allWallets={list} />);

    const openCard = screen
      .getByRole("heading", { name: "Open" })
      .closest(".wallet-item") as HTMLElement;
    const closedCard = screen
      .getByRole("heading", { name: "Closed" })
      .closest(".wallet-item") as HTMLElement;

    expect(
      within(openCard).getByText("Open Source")
    ).toHaveAttribute(
      "href",
      "https://github.com/example/open"
    );
    expect(within(closedCard).getByText("Closed Source")).toBeInTheDocument();

    const sidebar = document.querySelector(".wl-sidebar") as HTMLElement;
    const openSource = await within(sidebar).findByRole("checkbox", {
      name: "Open Source",
    });

    await user.click(openSource);

    expect(
      screen.getByRole("heading", { name: "Open" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Closed" })
    ).not.toBeInTheDocument();
  });

  it("shows explicitly open-source wallets without a repository URL in the source filter", async () => {
    const user = userEvent.setup();
    const list = parseMarkdown(`
## [OpenWithoutUrl](https://open.example)
- Devices: Mobile
- Pools: Ironwood
- Source: Open Source

---
## [Closed](https://closed.example)
- Devices: Mobile
- Pools: Ironwood
- Source: Closed Source
`);

    render(<WalletList allWallets={list} />);

    const openCard = screen
      .getByRole("heading", { name: "OpenWithoutUrl" })
      .closest(".wallet-item") as HTMLElement;
    expect(within(openCard).getByText("Open Source")).toBeInTheDocument();

    const sidebar = document.querySelector(".wl-sidebar") as HTMLElement;
    await user.click(
      await within(sidebar).findByRole("checkbox", { name: "Open Source" })
    );

    expect(
      screen.getByRole("heading", { name: "OpenWithoutUrl" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Closed" })
    ).not.toBeInTheDocument();
  });

  it("orders NU7-compatible wallets first, whatever their position in the file", () => {
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

    const titles = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
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

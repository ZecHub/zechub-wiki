import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import WalletList from "@/components/Wallet/WalletList";
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
- Ironwood: Ready
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

    expect(screen.getByText("1 wallet")).toBeInTheDocument();
    const section = screen
      .getByText(/Deprecated \/ no longer supports Zcash \(1\)/)
      .closest("details") as HTMLElement;
    expect(within(section).getByText("Gone")).toBeInTheDocument();
    expect(within(section).getByText("End-of-life, no NU6.3 support")).toBeInTheDocument();
    expect(within(section).queryByText("Alive")).not.toBeInTheDocument();
    expect(within(section).queryByText(/^Ironwood /)).not.toBeInTheDocument();
  });

  it("builds the filters from active wallets only", async () => {
    render(<WalletList allWallets={wallets} />);

    // "Mobile" comes from the active wallet; "Desktop" only from the deprecated one.
    await waitFor(() => expect(screen.getAllByText("Mobile").length).toBeGreaterThan(1));
    const sidebar = document.querySelector(".wl-sidebar") as HTMLElement;
    expect(within(sidebar).getByText("Mobile")).toBeInTheDocument();
    expect(within(sidebar).queryByText("Desktop")).not.toBeInTheDocument();
  });

  it("shows the Ironwood badge and the release stage on an active wallet", () => {
    render(<WalletList allWallets={wallets} />);

    expect(screen.getByText("Ironwood Ready")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("orders Ironwood-ready wallets first, whatever their position in the file", () => {
    const list = parseMarkdown(`
## [NoStatus](https://a.example)
- Devices: Mobile

---

## [Late](https://b.example)
- Devices: Mobile
- Ironwood: Not Ready

---

## [Transp](https://c.example)
- Devices: Mobile
- Ironwood: Transparent only

---

## [Early](https://d.example)
- Devices: Mobile
- Ironwood: Ready

---

## [Busy](https://e.example)
- Devices: Mobile
- Ironwood: In Progress
`);
    render(<WalletList allWallets={list} />);

    const titles = screen.getAllByRole("heading", { level: 5 }).map((h) => h.textContent);
    expect(titles).toEqual(["Early", "Busy", "Late", "Transp", "NoStatus"]);
  });
});

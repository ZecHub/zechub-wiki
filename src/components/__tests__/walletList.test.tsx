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

---
## [Closed](https://closed.example)
- Devices: Mobile
- Pools: Ironwood
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
- NU7: Compatible for transparent zec

---

## [Early](https://d.example)
- Devices: Mobile
- NU7: Compatible

---

## [Busy](https://e.example)
- Devices: Mobile
- NU7: In Progress
`);
    render(<WalletList allWallets={list} />);

    const titles = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(titles).toEqual(["Early", "Transp", "Busy", "Late", "NoStatus"]);
  });
});

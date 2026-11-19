import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FilterToggle from "@/components/FilterToggle";
import en from "../../../dictionaries/en.json";
import es from "../../../dictionaries/es.json";

let mockLanguage: any = { t: { wallets: en.wallets } };
jest.mock("@/context/LanguageContext", () => ({
  useLanguage: () => mockLanguage,
}));

jest.mock("react-markdown", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="markdown">{children}</div>
  ),
}));
jest.mock("remark-gfm", () => ({ __esModule: true, default: () => {} }));

const filters = {
  Features: new Set(["Automatic Shielding", "Fiat Off-ramp"]),
  Pools: new Set(["Orchard"]),
  Source: new Set(["Open Source"]),
};

beforeEach(() => {
  mockLanguage = { t: { wallets: en.wallets } };
});

describe("FilterToggle info dialog", () => {
  it("renders an info control for each category and keeps filter clicks working", async () => {
    const user = userEvent.setup();
    const toggleFilter = jest.fn();

    render(
      <FilterToggle
        filters={filters}
        activeFilters={[]}
        toggleFilter={toggleFilter}
        handleToggleFilter={jest.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: "About the Features filter" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "About the Source filter" }),
    ).toBeInTheDocument();

    const info = screen.getByRole("button", {
      name: "About the Features filter",
    });
    await user.click(info);

    expect(toggleFilter).not.toHaveBeenCalled();
    expect(info).toHaveAttribute("aria-expanded", "true");
    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    await waitFor(() => expect(info).toHaveFocus());

    await user.click(
      screen.getByRole("checkbox", { name: "Automatic Shielding" }),
    );
    expect(toggleFilter).toHaveBeenCalledWith(
      "Features",
      "Automatic Shielding",
    );
  });

  it("opens an info dialog for a filter item without toggling it", async () => {
    const user = userEvent.setup();
    const toggleFilter = jest.fn();
    mockLanguage = {
      t: {
        wallets: {
          ...en.wallets,
          filterInfo: {
            ...en.wallets.filterInfo,
            items: {
              ...en.wallets.filterInfo.items,
              Features: {
                "Automatic Shielding":
                  "**Automatic Shielding** is an item description.",
              },
            },
          },
        },
      },
    };

    render(
      <FilterToggle
        filters={filters}
        activeFilters={[]}
        toggleFilter={toggleFilter}
        handleToggleFilter={jest.fn()}
      />,
    );

    const info = screen.getByRole("button", {
      name: "About Automatic Shielding",
    });
    await user.click(info);

    expect(toggleFilter).not.toHaveBeenCalled();
    const dialog = await screen.findByRole("dialog", {
      name: "About Automatic Shielding",
    });
    expect(within(dialog).getByTestId("markdown")).toHaveTextContent(
      "**Automatic Shielding** is an item description.",
    );

    await user.keyboard("{Escape}");

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    await waitFor(() => expect(info).toHaveFocus());
  });

  it("uses the English item definition from the dictionary", async () => {
    const user = userEvent.setup();

    render(
      <FilterToggle
        filters={filters}
        activeFilters={[]}
        toggleFilter={jest.fn()}
        handleToggleFilter={jest.fn()}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "About Orchard" }),
    );

    const dialog = await screen.findByRole("dialog", { name: "About Orchard" });
    expect(within(dialog).getByTestId("markdown")).toHaveTextContent(
      "**Orchard** is Zcash's shielded pool introduced in NU5.",
    );
  });

  it("uses localized titles and definitions for the active locale", async () => {
    const user = userEvent.setup();
    mockLanguage = { t: { wallets: es.wallets } };

    render(
      <FilterToggle
        filters={filters}
        activeFilters={[]}
        toggleFilter={jest.fn()}
        handleToggleFilter={jest.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Acerca del filtro Features" }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Acerca de Orchard" }),
    );

    const dialog = await screen.findByRole("dialog", {
      name: "Acerca de Orchard",
    });
    expect(within(dialog).getByTestId("markdown")).toHaveTextContent(
      "**Orchard** es el pool blindado de Zcash introducido en NU5.",
    );
  });

  it("renders markdown in the dialog", async () => {
    const user = userEvent.setup();
    mockLanguage = {
      t: {
        wallets: {
          ...en.wallets,
          filterInfo: {
            ...en.wallets.filterInfo,
            categories: {
              Features:
                "**Shielded by default** with a [guide](https://example.com).\n\n- First point\n- Second point",
            },
          },
        },
      },
    };

    render(
      <FilterToggle
        filters={filters}
        activeFilters={[]}
        toggleFilter={jest.fn()}
        handleToggleFilter={jest.fn()}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "About the Features filter" }),
    );

    const dialog = await screen.findByRole("dialog");
    const markdown = within(dialog).getByTestId("markdown");
    expect(markdown).toHaveTextContent("**Shielded by default**");
    expect(markdown).toHaveTextContent("[guide](https://example.com)");
    expect(markdown).toHaveTextContent("First point");
    expect(markdown).toHaveTextContent("Second point");
  });

  it("falls back to generic guidance when no description is supplied", async () => {
    const user = userEvent.setup();

    render(
      <FilterToggle
        filters={filters}
        activeFilters={[]}
        toggleFilter={jest.fn()}
        handleToggleFilter={jest.fn()}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "About the Pools filter" }),
    );

    const dialog = await screen.findByRole("dialog");
    expect(
      within(dialog).getByText(/narrow the wallet list/),
    ).toBeInTheDocument();
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();

    render(
      <FilterToggle
        filters={filters}
        activeFilters={[]}
        toggleFilter={jest.fn()}
        handleToggleFilter={jest.fn()}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "About the Features filter" }),
    );
    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  });

  it("closes when the backdrop is clicked", async () => {
    const user = userEvent.setup();

    render(
      <FilterToggle
        filters={filters}
        activeFilters={[]}
        toggleFilter={jest.fn()}
        handleToggleFilter={jest.fn()}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "About the Features filter" }),
    );
    const dialog = await screen.findByRole("dialog");

    await user.click(dialog);

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  });
});

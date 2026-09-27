import { render, screen } from "@testing-library/react";
import SitemapPage from "../Sitemap/Sitemap";

jest.mock("@/i18n/navigation", () => ({
  Link: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

jest.mock("@/context/LanguageContext", () => ({
  useLanguage: () => ({ t: {} }),
}));

const enTitles = {
  "Zcash_Tech/Ironwood.md": "Ironwood",
  "Privacy_Tools/GrapheneOS.md": "Graphene OS",
  "Using_Zcash/Buying_ZEC.md": "Buying Zcash",
};

const linkTo = (href: string) =>
  screen
    .getAllByRole("link")
    .find((el) => el.getAttribute("href") === href);

describe("Sitemap page", () => {
  it("renders manifest pages the curated list never contained", () => {
    render(<SitemapPage titles={{}} enTitles={enTitles} />);

    expect(linkTo("/zcash-tech/ironwood")).toHaveTextContent("Ironwood");
    expect(linkTo("/privacy-tools/grapheneos")).toHaveTextContent("Graphene OS");
    expect(
      screen.getByRole("heading", { name: "Zcash Tech" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Privacy Tools" }),
    ).toBeInTheDocument();
  });

  it("prefers the localized title and falls back to English", () => {
    render(
      <SitemapPage
        titles={{ "Zcash_Tech/Ironwood.md": "Actualización Ironwood" }}
        enTitles={enTitles}
      />,
    );

    expect(linkTo("/zcash-tech/ironwood")).toHaveTextContent(
      "Actualización Ironwood",
    );
    // No Spanish entry for this key, so English is used.
    expect(linkTo("/privacy-tools/grapheneos")).toHaveTextContent("Graphene OS");
  });

  it("localizes curated links through their manifest key", () => {
    // /using-zcash/buying-zec is curated in SITE_LINKS as "Buying ZEC"; the
    // manifest key attached by the builder is what makes it translatable.
    render(
      <SitemapPage
        titles={{ "Using_Zcash/Buying_ZEC.md": "Comprar Zcash" }}
        enTitles={enTitles}
      />,
    );

    expect(linkTo("/using-zcash/buying-zec")).toHaveTextContent("Comprar Zcash");
  });

  it("keeps app routes and external links, and lists each route once", () => {
    render(<SitemapPage titles={{}} enTitles={enTitles} />);

    expect(linkTo("/dashboard")).toBeInTheDocument();
    expect(linkTo("/developers")).toBeInTheDocument();

    const bounties = linkTo("https://bounties.zechub.wiki/");
    expect(bounties).toBeInTheDocument();
    expect(bounties).toHaveAttribute("target", "_blank");

    const hrefs = screen
      .getAllByRole("link")
      .map((el) => el.getAttribute("href") ?? "");
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("still renders the curated navigation when the manifest fails to load", () => {
    // getMenuTitlesCached returns {} when GitHub credentials are missing or the
    // fetch fails; the page must degrade rather than render nothing.
    render(<SitemapPage titles={{}} enTitles={{}} />);

    expect(linkTo("/dashboard")).toBeInTheDocument();
    expect(linkTo("/using-zcash/buying-zec")).toHaveTextContent("Buying ZEC");
    expect(
      screen.queryByRole("heading", { name: "Zcash Tech" }),
    ).not.toBeInTheDocument();
  });
});

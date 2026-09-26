import Page from "@/app/[locale]/[...slug]/page";
import { getAllMarkdownRecursively, getFileContentCached, getRootCached } from "@/lib/authAndFetch";
import ResearchIndexGrid from "@/components/Research/ResearchIndexGrid";
import React from "react";
import { extractFirstContentImage, transformGithubFilePathToWikiLink } from "@/lib/helpers";

jest.mock("@/lib/authAndFetch", () => ({
  getAllMarkdownRecursively: jest.fn(),
  getRootCached: jest.fn(),
  getFileContentCached: jest.fn(),
  getMenuTitlesCached: jest.fn().mockResolvedValue({}),
}));
jest.mock("@/lib/getDictionary", () => ({ getDictionary: jest.fn().mockResolvedValue({}) }));
jest.mock("next/headers", () => ({ headers: jest.fn() }));
jest.mock("@/components/MdxContainer", () => ({ __esModule: true, default: () => null }));
jest.mock("@/components/Research/ResearchIndexGrid", () => ({ __esModule: true, default: () => null }));
jest.mock("@/components/SideMenu/SideMenu", () => ({ __esModule: true, default: () => null }));
jest.mock("@/i18n/navigation", () => ({ Link: () => null }));
jest.mock("@/lib/helpers", () => ({
  getDynamicRoute: () => "",
  getBanner: () => "",
  extractFirstContentImage: jest.fn(),
  transformGithubFilePathToWikiLink: jest.fn(),
}));
jest.mock("@/lib/localeCoverage", () => ({}));
jest.mock("next-mdx-remote/serialize", () => ({}));
jest.mock("remark-gfm", () => ({}));
jest.mock("rehype-raw", () => ({}));
jest.mock("unist-util-visit", () => ({}));

const params = (locale = "en") => Promise.resolve({ locale, slug: ["research", "zcash-foundations-series"] });
const listing = jest.mocked(getAllMarkdownRecursively);
const body = jest.mocked(getFileContentCached);
const rootListing = jest.mocked(getRootCached);
const image = jest.mocked(extractFirstContentImage);
const wikiLink = jest.mocked(transformGithubFilePathToWikiLink);
type GridProps = { roots: string[]; dynamicCovers: Record<string, { src: string; alt: string }> };

function findGrid(node: React.ReactNode): React.ReactElement<GridProps> | undefined {
  if (!React.isValidElement<{ children?: React.ReactNode }>(node)) return;
  if (node.type === ResearchIndexGrid) return node as React.ReactElement<GridProps>;
  for (const child of React.Children.toArray(node.props.children)) {
    const grid = findGrid(child);
    if (grid) return grid;
  }
}

beforeEach(() => {
  listing.mockReset();
  body.mockReset();
  rootListing.mockReset();
  image.mockReset();
  wikiLink.mockReset();
});

it("propagates series listing failures to the route error boundary", async () => {
  const error = new Error("GitHub unavailable");
  listing.mockRejectedValue(error);
  await expect(Page({ params: params() })).rejects.toBe(error);
});

it.each(["en", "it"])("renders the shared article listing for %s even when covers fail", async (locale) => {
  const files = ["site/Research/zcash-foundations-series/article-0/intro.md"];
  listing.mockResolvedValue(files);
  body.mockRejectedValue(new Error("optional cover unavailable"));
  const page = await Page({ params: params(locale) });
  expect(listing).toHaveBeenCalledWith("site/Research/zcash-foundations-series");
  expect(findGrid(page)?.props.roots).toEqual(files);
});


it("passes successful thumbnail extraction to the series grid", async () => {
  const file = "site/Research/zcash-foundations-series/article-0/intro.md";
  const slug = "research/zcash-foundations-series/article-0/intro";
  listing.mockResolvedValue([file]);
  body.mockResolvedValue("# Intro\n![Cover](cover.png)");
  image.mockReturnValue("https://example.com/cover.png");
  wikiLink.mockReturnValue(slug);
  const page = await Page({ params: params() });
  expect(image).toHaveBeenCalledWith("# Intro\n![Cover](cover.png)", file);
  expect(wikiLink).toHaveBeenCalledWith(file.replace(/\.md$/, ""));
  expect(findGrid(page)?.props.dynamicCovers).toEqual({
    [slug]: { src: "https://example.com/cover.png", alt: "Article thumbnail" },
  });
});

it("renders the research index without fetching unused series trees", async () => {
  const article = "site/Research/Intro.md";
  rootListing.mockResolvedValue([article]);
  listing.mockRejectedValue(new Error("series tree unavailable"));
  body.mockResolvedValue(null);
  const page = await Page({ params: Promise.resolve({ locale: "en", slug: ["research"] }) });
  expect(rootListing).toHaveBeenCalledWith("/site/research");
  expect(findGrid(page)?.props.roots).toEqual([article]);
  expect(listing).not.toHaveBeenCalled();
});

it("propagates research-index root listing failures", async () => {
  const error = new Error("GitHub unavailable");
  rootListing.mockRejectedValue(error);
  await expect(Page({ params: Promise.resolve({ locale: "en", slug: ["research"] }) })).rejects.toBe(error);
});

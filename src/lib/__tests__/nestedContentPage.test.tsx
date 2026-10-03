import React from "react";
import Page, { generateMetadata } from "@/app/[locale]/[...slug]/page";
import {
  getLocalizedFileContentCached,
  getMenuTitlesCached,
  getRootCached,
} from "@/lib/authAndFetch";
import { serialize } from "next-mdx-remote/serialize";

// Keep the route and path helpers real; replace remote content and Next's
// request context. A fixture body exists only at its exact content-repo path.
jest.mock("@/lib/authAndFetch", () => ({
  getLocalizedFileContentCached: jest.fn(),
  getMenuTitlesCached: jest.fn(),
  getRootCached: jest.fn(),
  getFileContentCached: jest.fn(),
  getAllMarkdownRecursively: jest.fn(),
}));
jest.mock("@/lib/getDictionary", () => ({
  getDictionary: jest.fn().mockResolvedValue({}),
}));
jest.mock("next/headers", () => ({ headers: jest.fn() }));
jest.mock("next/navigation", () => ({
  notFound: () => { throw new Error("NEXT_HTTP_ERROR_FALLBACK;404"); },
}));
jest.mock("@/components/MdxContainer", () => ({ __esModule: true, default: () => null }));
jest.mock("@/components/Research/ResearchIndexGrid", () => ({ __esModule: true, default: () => null }));
jest.mock("@/components/SideMenu/SideMenu", () => ({ __esModule: true, default: () => null }));
jest.mock("@/i18n/navigation", () => ({ Link: () => null }));
jest.mock("@/lib/localeCoverage", () => ({
  buildAlternates: () => ({}),
  localesForPath: jest.fn().mockResolvedValue(["en", "it"]),
}));
jest.mock("next-mdx-remote/serialize", () => ({ serialize: jest.fn() }));
jest.mock("remark-gfm", () => ({}));
jest.mock("rehype-raw", () => ({}));
jest.mock("unist-util-visit", () => ({}));

const fixtures = [
  ["guides/coinholder-log-parser/help", "guides/coinholder_log_parser/help.md", "Election Log Filter"],
  ["guides/multisigdemo/multisigdemo", "guides/multisigdemo/MultiSigDemo.md", "MultiSig Demo"],
  ["guides/workshops/zcashcontributorworkshopday3", "guides/workshops/zcashContributorWorkshopDay3.md", "Workshop Day 3"],
  ["tutorials/shieldednewsletter/readme", "tutorials/shieldedNewsletter/readme.md", "Shielded Newsletters"],
  ["tutorials/zenithserver/zenithbeta", "tutorials/zenithserver/zenithBeta.md", "Zenith 0.10 Beta"],
] as const;
const titles = Object.fromEntries(fixtures.map(([, key, title]) => [key, title]));
const params = (path: string, locale = "en") => Promise.resolve({ slug: path.split("/"), locale });
const body = jest.mocked(getLocalizedFileContentCached);
const manifest = jest.mocked(getMenuTitlesCached);
const roots = jest.mocked(getRootCached);
const serializeMarkdown = jest.mocked(serialize);

beforeEach(() => {
  jest.clearAllMocks();
  manifest.mockImplementation(async (locale) => locale === "en" ? titles : {});
  roots.mockResolvedValue(["site/guides/Zcash_Full_Node.md"]);
  body.mockResolvedValue(null);
  serializeMarkdown.mockImplementation(async (markdown) => ({
    compiledSource: String(markdown), scope: {}, frontmatter: {},
  }));
});

describe.each(["en", "it"])("nested content in %s", (locale) => {
  it.each(fixtures)("renders the article at /%s", async (path, key, title) => {
    const markdown = `# ${title}\n\n${locale}: The requested article has useful content for the reader.`;
    body.mockImplementation(async (contentPath, requestedLocale) =>
      contentPath === `/site/${key}` && requestedLocale === locale ? markdown : null,
    );

    await Page({ params: params(path, locale) });

    expect(serializeMarkdown).toHaveBeenCalledWith(markdown, expect.any(Object));
    expect(manifest.mock.calls.filter(([language]) => language === "en").length).toBe(locale === "en" ? 2 : 1);
  });

  it("uses the same article for page metadata", async () => {
    body.mockImplementation(async (contentPath, requestedLocale) =>
      contentPath === "/site/guides/coinholder_log_parser/help.md" && requestedLocale === locale
        ? "# Election Log Filter\n\nAn article about inspecting the election logs for your chosen election."
        : null,
    );

    const metadata = await generateMetadata({ params: params("guides/coinholder-log-parser/help", locale) });

    expect(metadata.title).toBe("Election Log Filter | ZecHub");
    expect(metadata.openGraph?.url).toBe(`https://zechub.wiki${locale === "en" ? "" : "/it"}/guides/coinholder-log-parser/help`);
  });
});

it("keeps section and known nested-folder URLs browsable", async () => {
  await expect(Page({ params: params("guides") })).resolves.toBeTruthy();
  await expect(Page({ params: params("guides/coinholder-log-parser") })).resolves.toBeTruthy();
  expect(serializeMarkdown).not.toHaveBeenCalled();
});

it("keeps an unknown article under a real section missing", async () => {
  await expect(Page({ params: params("guides/not-a-real-article") })).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
});

it("keeps the existing file-path fallback when the manifest is unavailable", async () => {
  manifest.mockResolvedValue({});
  body.mockImplementation(async (contentPath) => contentPath === "/site/Zcash_Tech/Halo.md" ? "# Halo" : null);

  await Page({ params: params("zcash-tech/halo") });

  expect(serializeMarkdown).toHaveBeenCalledWith("# Halo", expect.any(Object));
});

it("keeps the research filename fallback when a new article is not in the manifest", async () => {
  roots.mockResolvedValue(["site/Research/a-new-research-article.md"]);
  body.mockImplementation(async (contentPath) => contentPath === "site/Research/a-new-research-article.md" ? "# New Research" : null);

  await Page({ params: params("research/a-new-research-article") });

  expect(serializeMarkdown).toHaveBeenCalledWith("# New Research", expect.any(Object));
});

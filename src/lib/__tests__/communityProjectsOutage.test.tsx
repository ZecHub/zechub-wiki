/**
 * The Community Projects page must survive a GitHub outage.
 *
 * Its source Markdown is read from the ZecHub content repo. The page used a
 * raw fetch with no status check and no error handling, so a GitHub 404/429/500
 * body was parsed as content (silently emptying the list) and a network or
 * rate-limit failure threw, 500ing the page for every visitor. The fix reads
 * through getFileContentCached (returns null on failure) and degrades to an
 * empty project list. These tests pin that contract.
 */

import React from "react";
import Page from "@/app/[locale]/zcash-community/community-projects/page";
import { getFileContentCached } from "@/lib/authAndFetch";

jest.mock("@/lib/authAndFetch", () => ({
  getFileContentCached: jest.fn(),
}));
jest.mock("@/lib/getDictionary", () => ({
  getDictionary: jest.fn().mockResolvedValue({}),
}));
jest.mock("@/lib/communityProjectImages", () => ({
  attachImages: (p: unknown[]) => p,
}));
// The page imports these only for metadata; stub them so the test does not pull
// in next-intl's ESM routing module (which Jest cannot load as CommonJS).
jest.mock("@/i18n/routing", () => ({
  routing: { defaultLocale: "en", locales: ["en"] },
}));
jest.mock("@/lib/helpers", () => ({
  genMetadata: jest.fn(),
  getBanner: () => "",
}));
jest.mock("@/lib/localeCoverage", () => ({
  buildAlternatesAllLocales: () => ({}),
}));
jest.mock("@/app/[locale]/zcash-community/community-projects/ClientPage", () => ({
  __esModule: true,
  default: () => null,
}));

const body = jest.mocked(getFileContentCached);

// The page returns <Client projects={...} />; read the projects it passed.
function projectsFrom(
  element: React.ReactElement<{ projects: unknown[] }>,
): unknown[] {
  return element.props.projects;
}

beforeEach(() => {
  body.mockReset();
});

describe("Community Projects page under a GitHub outage", () => {
  it("renders an empty list instead of throwing when the read rejects", async () => {
    body.mockRejectedValue(new Error("GitHub 429"));
    const element = await Page();
    expect(projectsFrom(element)).toEqual([]);
  });

  it("renders an empty list when the read degrades to null", async () => {
    body.mockResolvedValue(null);
    const element = await Page();
    expect(projectsFrom(element)).toEqual([]);
  });

  it("parses projects normally when the read succeeds", async () => {
    body.mockResolvedValue(
      "## Wallets\n### Zashi\nA shielded mobile wallet.\n[Visit](https://example.com)\n",
    );
    const element = await Page();
    const projects = projectsFrom(element);
    expect(Array.isArray(projects)).toBe(true);
    expect(projects.length).toBe(1);
  });
});

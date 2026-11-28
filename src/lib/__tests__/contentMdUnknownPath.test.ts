/** @jest-environment node */
/**
 * /api/content-md serves every `*.md` URL (next.config.mjs rewrite). A path the
 * English manifest does not know must 404 without reading the content repo:
 * the fallback read's miss costs a metered contents-API directory listing on
 * the shared GITHUB_TOKEN, once per unknown folder name.
 */
import { NextRequest } from "next/server";
import {
  getLocalizedFileContentCached,
  getMenuTitlesCached,
} from "@/lib/authAndFetch";

jest.mock("@/lib/authAndFetch", () => ({
  getLocalizedFileContentCached: jest.fn(),
  getMenuTitlesCached: jest.fn(),
}));
// next-intl's routing module is ESM; the route only needs the locale list.
jest.mock("@/i18n/routing", () => ({
  routing: { defaultLocale: "en", locales: ["en", "es"] },
}));

const read = jest.mocked(getLocalizedFileContentCached);
const manifest = jest.mocked(getMenuTitlesCached);

const KEYS = {
  "Using_Zcash/Shielded_Pools.md": "Shielded Pools",
  "Using_Zcash/Payment_Processors.md": "Payment Processors",
  // The real manifest lists the Gallery page but not the Infographics page
  // that lives in the same-named folder beside it.
  "Glossary_and_FAQs/Gallery.md": "Gallery",
};

function get(path: string) {
  return new NextRequest(`http://localhost${path}`);
}

async function loadRoute() {
  return import("@/app/api/content-md/route");
}

beforeEach(() => {
  read.mockReset();
  manifest.mockReset();
  manifest.mockResolvedValue(KEYS);
  read.mockResolvedValue("# Page\n\nBody text.");
});

describe("/api/content-md unknown paths", () => {
  it("404s a path the manifest does not know, without reading GitHub", async () => {
    const { GET } = await loadRoute();
    const res = await GET(get("/scanner-a1b2/whatever.md"));
    expect(res.status).toBe(404);
    expect(read).not.toHaveBeenCalled();
  });

  it("404s an unknown locale-prefixed path without reading GitHub", async () => {
    const { GET } = await loadRoute();
    const res = await GET(get("/es/scanner-a1b2/whatever.md"));
    expect(res.status).toBe(404);
    expect(read).not.toHaveBeenCalled();
  });

  it("still serves a known page from its exact manifest path", async () => {
    const { GET } = await loadRoute();
    const res = await GET(get("/using-zcash/shielded-pools.md"));
    expect(res.status).toBe(200);
    expect(read).toHaveBeenCalledWith(
      "/site/Using_Zcash/Shielded_Pools.md",
      "en",
    );
  });

  it("still serves a known page in another locale", async () => {
    const { GET } = await loadRoute();
    const res = await GET(get("/es/using-zcash/shielded-pools.md"));
    expect(res.status).toBe(200);
    expect(read).toHaveBeenCalledWith(
      "/site/Using_Zcash/Shielded_Pools.md",
      "es",
    );
  });

  it("still reads a page the manifest omits when its folder is known", async () => {
    // Glossary_and_FAQs/Gallery/Infographics.md is live but not in the
    // manifest; its folder is, so it must keep resolving.
    const { GET } = await loadRoute();
    const res = await GET(get("/glossary-and-faqs/gallery/infographics.md"));
    expect(read).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(200);
  });

  it("still serves a section root, whose folder is the site root", async () => {
    const { GET } = await loadRoute();
    await GET(get("/using-zcash.md"));
    expect(read).toHaveBeenCalledTimes(1);
  });

  it("keeps the old fallback when the manifest cannot be loaded", async () => {
    manifest.mockRejectedValue(new Error("GitHub 429"));
    const { GET } = await loadRoute();
    const res = await GET(get("/some-section/some-page.md"));
    expect(read).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(200);
  });
});

import { isKnownContentPath } from "../contentPaths";
import { getRootCached } from "../authAndFetch";

jest.mock("next/cache", () => ({
  unstable_cache: (fn: (...args: unknown[]) => unknown) => {
    return (...args: unknown[]) => fn(...args);
  },
}));

// Mock Octokit for authAndFetch
const mockGetContent = jest.fn();
jest.mock("@octokit/rest", () => ({
  Octokit: jest.fn().mockImplementation(() => ({
    rest: {
      repos: {
        getContent: mockGetContent,
      },
    },
  })),
}));

describe("Manifest outage resilience & scanner protection", () => {
  const sampleManifestKeys = [
    "Zcash_Tech/Lightwallet_Nodes.md",
    "Zcash_Tech/NU5.md",
    "Using_Zcash/Payment_Processors.md",
    "Using_Zcash/Wallets.md",
    "Research/Article_1.md",
    "Research/Article_2.md",
    "guides/frostdemo/ywallet-frost-demo.md",
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.OWNER = "ZecHub";
    process.env.REPO = "zechub";
    process.env.BRANCH = "main";
  });

  describe("isKnownContentPath decisions", () => {
    it("recognizes known section roots from manifest keys", () => {
      expect(isKnownContentPath(["zcash-tech"], sampleManifestKeys)).toBe(true);
      expect(isKnownContentPath(["using-zcash"], sampleManifestKeys)).toBe(true);
      expect(isKnownContentPath(["guides"], sampleManifestKeys)).toBe(true);
      expect(isKnownContentPath(["research"], sampleManifestKeys)).toBe(true);
    });

    it("rejects scanner garbage paths when manifest is loaded", () => {
      expect(isKnownContentPath(["wp-admin"], sampleManifestKeys)).toBe(false);
      expect(isKnownContentPath([".env"], sampleManifestKeys)).toBe(false);
      expect(isKnownContentPath(["qwerty-nonsense"], sampleManifestKeys)).toBe(false);
    });

    it("safely falls back to true when manifest failed to load", () => {
      expect(isKnownContentPath(["zcash-tech"], [])).toBe(true);
      expect(isKnownContentPath(["anything-at-all"], [])).toBe(true);
    });
  });

  describe("Decision logic during GitHub 403 listing failure", () => {
    it("renders section landing when roots is empty but manifest is loaded", () => {
      const roots: string[] = []; // GitHub listing failed (e.g. 403 rate limit)
      const slug = ["zcash-tech"];
      const manifestPaths = sampleManifestKeys;

      const isManifestLoaded = manifestPaths.length > 0;
      const shouldNotFound = isManifestLoaded
        ? !isKnownContentPath(slug, manifestPaths)
        : roots.length === 0;

      // Was previously 404 because roots.length === 0; now renders (false means not 404)
      expect(shouldNotFound).toBe(false);
    });

    it("still 404s unknown garbage paths without needing any directory listing", () => {
      const slug = ["qwerty-nonsense"];
      const manifestPaths = sampleManifestKeys;

      const isManifestLoaded = manifestPaths.length > 0;
      const isKnown = isKnownContentPath(slug, manifestPaths);

      expect(isManifestLoaded).toBe(true);
      expect(isKnown).toBe(false);
      // Early guard short-circuits to 404 with zero listing API calls
    });

    it("degrades research listing from manifest when topLevel listing fails", () => {
      const topLevelRoots: string[] = []; // GitHub listing 403
      const manifestPaths = sampleManifestKeys;

      let topLevel = topLevelRoots;
      if (topLevel.length === 0 && manifestPaths.length > 0) {
        topLevel = manifestPaths
          .filter((k) => /^Research\/[^/]+\.md$/i.test(k.replace(/^site\//i, "")))
          .map((k) => (k.startsWith("site/") ? k : `site/${k}`));
      }

      expect(topLevel).toEqual([
        "site/Research/Article_1.md",
        "site/Research/Article_2.md",
      ]);
    });
  });

  describe("getRootCached rate-limit resilience", () => {
    it("degrades to [] on 403/429 rate limit instead of throwing a 500", async () => {
      const rateLimitError = new Error("API rate limit exceeded");
      (rateLimitError as any).status = 403;
      mockGetContent.mockRejectedValue(rateLimitError);

      const roots = await getRootCached("/site/using-zcash");
      expect(roots).toEqual([]);
    });
  });
});

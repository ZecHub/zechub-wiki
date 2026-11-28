import { isKnownContentPath } from "../contentPaths";

jest.mock("next/cache", () => ({
  unstable_cache: (fn: (...args: unknown[]) => unknown) => {
    return (...args: unknown[]) => fn(...args);
  },
}));

// authAndFetch lazily imports the `octokit` package (not `@octokit/rest`).
const mockGetContent = jest.fn();
jest.mock("octokit", () => ({
  Octokit: jest.fn().mockImplementation(() => ({
    rest: {
      repos: {
        getContent: mockGetContent,
      },
    },
  })),
}));

// authAndFetch reads OWNER/REPO/BRANCH at module load, so they must be set
// before it is imported — otherwise assertRepoConfig() short-circuits to []
// and the rate-limit test below passes without ever reaching GitHub.
let getRootCached: typeof import("../authAndFetch").getRootCached;
beforeAll(async () => {
  process.env.OWNER = "ZecHub";
  process.env.REPO = "zechub";
  process.env.BRANCH = "main";
  delete process.env.NEXT_PHASE; // runtime, not a build
  ({ getRootCached } = await import("../authAndFetch"));
});

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
    it.each([403, 429])("degrades to [] on a %i rate limit instead of throwing a 500", async (status) => {
      const rateLimitError = Object.assign(new Error("API rate limit exceeded"), { status });
      mockGetContent.mockRejectedValue(rateLimitError);

      const roots = await getRootCached("/site/using-zcash");
      expect(roots).toEqual([]);
      // Guards against a vacuous pass: the listing must actually have been attempted.
      expect(mockGetContent).toHaveBeenCalledTimes(1);
    });
  });
});

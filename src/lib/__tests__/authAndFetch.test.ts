/**
 * Regression tests for the silent-blank-page class of failure.
 *
 * The bug these guard against (#720): a transient GitHub failure resolved to
 * `null`, `unstable_cache` stored that `null` under the path, and
 * `[...slug]/page.tsx` rendered an empty article for it at HTTP 200. The
 * invariant is therefore narrow and load-bearing — **only a genuine 404 may
 * produce `null`**. Every other outcome must reject, so nothing is cached and
 * the next request retries.
 *
 * File bodies now come from raw.githubusercontent.com rather than the contents
 * API (the API's 5,000/hour budget cannot serve 220 pages × 18 locales), so
 * the 404-vs-transient decision moved into `fetch`. These tests moved with it:
 * the transport is stubbed at `global.fetch`, and the same invariant is
 * asserted against HTTP statuses instead of octokit error objects. Directory
 * listings still go through octokit, so both are stubbed.
 *
 * `unstable_cache` is stubbed to a RECORDER: it runs the wrapped function and
 * captures its key parts and call arguments, so a test can assert that the
 * content ref arrives as an argument (and so is part of the cache key).
 */

const mockGetContent = jest.fn();
const mockGetCommit = jest.fn();

jest.mock("octokit", () => ({
  Octokit: jest.fn().mockImplementation(() => ({
    rest: {
      repos: { getContent: mockGetContent, getCommit: mockGetCommit },
    },
  })),
}));

// Records every unstable_cache registration and the arguments each wrapped
// function is called with. A pass-through mock cannot see whether the content
// ref reaches the cache as an ARGUMENT (and therefore as part of the cache
// key) or is resolved inside the callback — and that distinction is the whole
// point of the wrapper layer, because Next bypasses a nested unstable_cache.
type CacheRec = { keyParts: string[]; calls: unknown[][] };
const cacheRecs: CacheRec[] = [];
(globalThis as unknown as { __caches: CacheRec[] }).__caches = cacheRecs;
(globalThis as unknown as { __cacheStore: Map<string, unknown> }).__cacheStore =
  new Map();

// The stub MEMOIZES rather than passing through. A pass-through cannot tell a
// cached reader from an uncached one, which is exactly the bug class here:
// fuzzyLocalizedFile's directory listing was uncached and cost a contents-API
// call on every request. Keyed like the real thing — key parts plus arguments —
// and cleared between tests.
jest.mock("next/cache", () => ({
  unstable_cache: (fn: (...a: unknown[]) => unknown, keyParts: string[]) => {
    const rec: { keyParts: string[]; calls: unknown[][] } = {
      keyParts: keyParts ?? [],
      calls: [],
    };
    (globalThis as unknown as { __caches: typeof rec[] }).__caches.push(rec);
    return (...args: unknown[]) => {
      rec.calls.push(args);
      const k = JSON.stringify([keyParts, args]);
      const store = (globalThis as unknown as { __cacheStore: Map<string, unknown> })
        .__cacheStore;
      if (store.has(k)) return store.get(k);
      // Evict on rejection. Real unstable_cache AWAITS the callback, so a
      // throw never reaches cacheNewResult and nothing is stored. A stub that
      // memoized the rejected promise would invert the invariant this file
      // exists to defend: a transient must be retried, not remembered.
      const out = Promise.resolve(fn(...args)).catch((e) => {
        store.delete(k);
        throw e;
      });
      store.set(k, out);
      return out;
    };
  },
  revalidateTag: jest.fn(),
}));

jest.mock("@/lib/helpers", () => ({
  getFiles: (data: unknown) =>
    Array.isArray(data) ? data.map((e: { path: string }) => e.path) : [],
  transformUri: (uri: string) => uri,
}));

type Mod = typeof import("../authAndFetch");
let mod: Mod;

const PATH = "site/Using_Zcash/zimppy.md";
const SHA = "c0184871514684ace7390691159ae2151aee0c65";

/** An octokit HTTP error carries the status on the error object. */
const httpError = (status: number, message = `HTTP ${status}`) =>
  Object.assign(new Error(message), { status });

/** Minimal stand-in for the parts of Response that fetchRawFile reads. */
const rawResponse = (status: number, body = "") =>
  ({
    status,
    ok: status >= 200 && status < 300,
    text: async () => body,
  }) as unknown as Response;

const mockFetch = jest.fn();

beforeAll(async () => {
  process.env.OWNER = "ZecHub";
  process.env.REPO = "zechub";
  process.env.BRANCH = "main";
  // A token MUST be present, or the "sends no Authorization" test below passes
  // vacuously: the header would be absent simply because there is nothing to
  // send, and a regression that always sent it would go undetected.
  process.env.GITHUB_TOKEN = "ghp_test_token_not_real";
  delete process.env.CONTENT_REPO_PRIVATE;
  delete process.env.NEXT_PHASE; // not a build: transients must throw
  global.fetch = mockFetch as unknown as typeof fetch;
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
  jest.spyOn(console, "log").mockImplementation(() => {});
  mod = await import("../authAndFetch");
});

beforeEach(() => {
  mockGetContent.mockReset();
  mockFetch.mockReset();
  mockGetCommit.mockReset();
  // The content ref resolves to a SHA unless a test says otherwise. The memo
  // is process-local and deliberately outlives a request, so each test must
  // start cold or it inherits the previous test's resolved ref.
  mockGetCommit.mockResolvedValue({ data: SHA });
  mod.__resetContentRefMemo();
  (globalThis as unknown as { __cacheStore: Map<string, unknown> }).__cacheStore.clear();
});

describe("getFileContentCached — only a 404 may yield null", () => {
  it("returns the file body on success", async () => {
    mockFetch.mockResolvedValueOnce(rawResponse(200, "# Zimppy\n\nBody."));
    await expect(mod.getFileContentCached(PATH)).resolves.toBe(
      "# Zimppy\n\nBody.",
    );
  });

  it("returns null when the file and its folder are both genuinely absent", async () => {
    mockFetch.mockResolvedValue(rawResponse(404));
    mockGetContent.mockRejectedValue(httpError(404));
    await expect(mod.getFileContentCached(PATH)).resolves.toBeNull();
  });

  // The core regression. Each of these once resolved to `null` and was cached,
  // blanking the page until a redeploy.
  it.each([
    [403, "secondary rate limit"],
    [429, "too many requests"],
    [500, "internal server error"],
    [502, "bad gateway"],
  ])("rejects on a transient %i so nothing is cached", async (status) => {
    mockFetch.mockResolvedValue(rawResponse(status));
    await expect(mod.getFileContentCached(PATH)).rejects.toMatchObject({
      status,
    });
  });

  it("rejects when the network itself fails, rather than reporting 'missing'", async () => {
    mockFetch.mockRejectedValue(new Error("ECONNRESET"));
    await expect(mod.getFileContentCached(PATH)).rejects.toMatchObject({
      status: 0,
    });
  });

  it("degrades a build-phase rate limit WITHOUT caching it as missing", async () => {
    // A 429 must not abort ~985 static pages, so during a build it degrades to
    // null. But if that null came from inside the cached reader it would be
    // stored for the hour TTL, turning a transient outage into a permanently
    // missing article — the silent-blank failure, in the exact scenario this
    // change is about. Degrade at the boundary; cache nothing.
    process.env.NEXT_PHASE = "phase-production-build";
    try {
      mockFetch.mockResolvedValueOnce(rawResponse(429));
      mockGetContent.mockResolvedValue({ data: [] });
      await expect(mod.getFileContentCached(PATH)).resolves.toBeNull();
      // The limit clears; the very next read must really fetch.
      mockFetch.mockResolvedValueOnce(rawResponse(200, "back online"));
      await expect(mod.getFileContentCached(PATH)).resolves.toBe("back online");
    } finally {
      delete process.env.NEXT_PHASE;
    }
  });

  it("does not cache the DIRECTORY LISTING when on the mutable branch ref", async () => {
    // Degraded mode bypasses the file cache, but the listing was still cached
    // under the branch name — a key no commit rotates. An empty listing there
    // would stop the case-insensitive fallback finding a folder once created.
    mockGetCommit.mockRejectedValue(httpError(500)); // no SHA -> branch ref
    mockFetch.mockResolvedValue(rawResponse(404)); // exact path always misses
    mockGetContent.mockResolvedValueOnce({ data: [] }); // folder empty for now
    await expect(
      mod.getFileContentCached("site/X/ai-tools.md"),
    ).resolves.toBeNull();
    // ...the file is added. A cached empty listing would hide it forever.
    mockGetContent.mockResolvedValue({
      data: [{ path: "site/X/AI_tools.md", type: "file", name: "AI_tools.md" }],
    });
    mockFetch
      .mockResolvedValueOnce(rawResponse(404)) // exact path still misses
      .mockResolvedValueOnce(rawResponse(200, "found via fallback"));
    await expect(mod.getFileContentCached("site/X/ai-tools.md")).resolves.toBe(
      "found via fallback",
    );
  });

  it("does not cache an empty menu manifest produced by a transient", async () => {
    // sitemap.ts relies on getMenuTitlesCached never throwing. That degradation
    // has to live OUTSIDE the cache: returning {} from inside it stores an
    // empty manifest for the TTL, which blanks the menu and shrinks the
    // sitemap long after GitHub recovers.
    mockFetch.mockResolvedValueOnce(rawResponse(500));
    await expect(mod.getMenuTitlesCached("en")).resolves.toEqual({});
    mockFetch.mockResolvedValueOnce(rawResponse(200, '{"A/B.md":"Title"}'));
    await expect(mod.getMenuTitlesCached("en")).resolves.toEqual({
      "A/B.md": "Title",
    });
  });

  it("does not cache a 404 when running on the mutable branch ref", async () => {
    // Degraded mode: the SHA could not be resolved, so `ref` is the branch
    // NAME. Caching a 404 under a mutable key outlives the page being created
    // — a commit does not change the key — so a real page would render empty
    // for the whole file TTL. Degraded mode must read straight through.
    mockGetCommit.mockRejectedValue(httpError(500)); // no SHA, and none known
    mockFetch.mockResolvedValue(rawResponse(404));
    mockGetContent.mockResolvedValue({ data: [] });
    await expect(mod.getFileContentCached(PATH)).resolves.toBeNull();
    // ...the page is then created.
    mockFetch.mockResolvedValue(rawResponse(200, "now it exists"));
    await expect(mod.getFileContentCached(PATH)).resolves.toBe("now it exists");
  });

  it("retries after a transient instead of remembering the failure", async () => {
    // #720's actual invariant: nothing is cached for a non-404, so the very
    // next request tries again. A cache that stored the rejection would serve
    // the failure for the whole TTL.
    mockFetch.mockResolvedValueOnce(rawResponse(500));
    await expect(mod.getFileContentCached(PATH)).rejects.toMatchObject({
      status: 500,
    });
    mockFetch.mockResolvedValueOnce(rawResponse(200, "recovered"));
    await expect(mod.getFileContentCached(PATH)).resolves.toBe("recovered");
  });

  it("rejects when the folder scan itself fails transiently", async () => {
    // Exact path is a clean 404, so the scan is reached; the scan then hits a
    // rate limit. That must not be read as "the page does not exist".
    mockFetch.mockResolvedValue(rawResponse(404));
    mockGetContent.mockRejectedValue(httpError(403));
    await expect(mod.getFileContentCached(PATH)).rejects.toMatchObject({
      status: 403,
    });
  });
});

describe("fetchRawFile — URL construction", () => {
  it("pins the read to a commit SHA, not the branch name", async () => {
    // A branch URL is served through a CDN with max-age=300, so a read taken
    // just after /api/revalidate can be five minutes stale — and would then be
    // re-cached for an hour. A SHA is immutable, so neither can happen.
    mockFetch.mockResolvedValueOnce(rawResponse(200, "body"));
    await mod.getFileContentCached(PATH);
    const url = String(mockFetch.mock.calls[0][0]);
    expect(url).toBe(
      `https://raw.githubusercontent.com/ZecHub/zechub/${SHA}/${PATH}`,
    );
    expect(url).not.toContain("/main/");
  });

  it("falls back to the branch ref when the SHA cannot be resolved", async () => {
    mockGetCommit.mockRejectedValueOnce(httpError(500));
    mockFetch.mockResolvedValueOnce(rawResponse(200, "body"));
    await mod.getFileContentCached(PATH);
    expect(String(mockFetch.mock.calls[0][0])).toContain("/main/");
  });

  it("resolves the content ref ONCE across many reads, not once per read", async () => {
    // This is the whole quota fix. Resolving the ref per read would issue a
    // contents-API getCommit for every file — measured at 25 getCommit calls
    // for 20 page renders when this relied on unstable_cache, which does not
    // hold the value across requests. A process-local memo makes it one.
    mockFetch.mockResolvedValue(rawResponse(200, "body"));
    for (let i = 0; i < 25; i++) {
      await mod.getFileContentCached(`site/Using_Zcash/page-${i}.md`);
    }
    expect(mockFetch).toHaveBeenCalledTimes(25);
    expect(mockGetCommit).toHaveBeenCalledTimes(1);
  });

  it("issues one getCommit for concurrent cold reads, not one each", async () => {
    mockFetch.mockResolvedValue(rawResponse(200, "body"));
    await Promise.all(
      Array.from({ length: 21 }, (_, i) =>
        mod.getFileContentCached(`site/Using_Zcash/concurrent-${i}.md`),
      ),
    );
    expect(mockGetCommit).toHaveBeenCalledTimes(1);
  });

  it("re-resolves the ref once the memo's TTL expires", async () => {
    // Without this, REF_TTL_MS = Infinity passes every other test — and a memo
    // that never expires freezes the site at the deploy-time commit until the
    // next redeploy, the worst failure this design can produce.
    mockFetch.mockResolvedValue(rawResponse(200, "body"));
    const realNow = Date.now;
    try {
      let t = 1_000_000;
      Date.now = () => t;
      await mod.getFileContentCached(PATH);
      expect(mockGetCommit).toHaveBeenCalledTimes(1);
      t += 150_000; // inside the 300s TTL
      await mod.getFileContentCached(PATH);
      expect(mockGetCommit).toHaveBeenCalledTimes(1);
      t += 200_000; // now past 300s
      await mod.getFileContentCached(PATH);
      expect(mockGetCommit).toHaveBeenCalledTimes(2);
    } finally {
      Date.now = realNow;
    }
  });

  it("keeps serving the last known SHA when a later getCommit fails", async () => {
    // The ref is part of every cache key, so dropping to the branch name on a
    // transient failure orphans every warm entry and re-reads the whole corpus
    // — during the quota exhaustion that usually caused the failure.
    mockFetch.mockResolvedValue(rawResponse(200, "body"));
    const realNow = Date.now;
    try {
      let t = 2_000_000;
      Date.now = () => t;
      await mod.getFileContentCached(PATH);
      mockFetch.mockClear();
      mockGetCommit.mockRejectedValue(httpError(403, "rate limit exceeded"));
      t += 310_000; // force a refresh, which now fails
      // A DIFFERENT path, so this is a cache miss and really fetches — the
      // point is which ref the URL carries, which a cache hit would hide.
      await mod.getFileContentCached("site/Using_Zcash/other.md");
      expect(String(mockFetch.mock.calls[0][0])).toContain(SHA);
      expect(String(mockFetch.mock.calls[0][0])).not.toContain("/main/");
    } finally {
      Date.now = realNow;
    }
  });

  it("percent-encodes each path segment so '#' and spaces survive", async () => {
    // site/zechubglobal/zcashitaly/#newsletter/… really exists; an unencoded
    // '#' truncates the URL at the fragment and raw answers 404.
    mockFetch.mockResolvedValueOnce(rawResponse(200, "body"));
    await mod.getFileContentCached("site/x/#news letter/a.md");
    const url = String(mockFetch.mock.calls[0][0]);
    expect(url).toContain("%23news%20letter");
    expect(url).not.toContain("/#");
  });

  it("passes the ref to the cached reader as an argument, not resolved inside it", async () => {
    // Next bypasses the cache of an unstable_cache called from inside another
    // one (`!isNestedUnstableCache` in unstable-cache.js). If the ref were
    // resolved inside the cached reader, that bypass would issue a contents-API
    // getCommit on EVERY file read — reinstating the exact quota drain this
    // change removes — and would still pass every other test here.
    mockFetch.mockResolvedValueOnce(rawResponse(200, "body"));
    await mod.getFileContentCached(PATH);
    const recs = (globalThis as unknown as { __caches: { keyParts: string[]; calls: unknown[][] }[] }).__caches;
    const fileCache = recs.find((r) => r.keyParts[0] === "github-file-content-cache");
    expect(fileCache).toBeDefined();
    const args = fileCache!.calls.at(-1)!;
    expect(args[0]).toBe(PATH);
    expect(args[1]).toBe(SHA); // the ref is in the cache key, not hidden inside
  });

  it("refuses dot segments instead of letting the URL parser climb out of the repo", async () => {
    // encodeURIComponent("..") is still "..", so an unguarded slug resolves to
    // raw.githubusercontent.com/other-owner/private-repo/... — with the token
    // attached when CONTENT_REPO_PRIVATE is set. Nothing may be requested.
    const evil = "site/../../../../other-owner/private-repo/main/secret.md";
    await expect(mod.getFileContentCached(evil)).resolves.toBeNull();
    await expect(mod.getLocalizedFileContentCached(evil, "it")).resolves.toBeNull();
    await expect(mod.getFileContentCached("site/./X/../a.md")).resolves.toBeNull();
    expect(mockFetch).not.toHaveBeenCalled();
    expect(mockGetContent).not.toHaveBeenCalled();
  });

  it("still reads a path whose segment merely contains dots", async () => {
    mockFetch.mockResolvedValueOnce(rawResponse(200, "body"));
    await expect(mod.getFileContentCached("site/X/v1..2/a.md")).resolves.toBe("body");
  });

  it("sends no Authorization header when the content repo is public", async () => {
    // raw answers a bad or unscoped token with 404, not 401. On a public repo
    // the header buys nothing and would convert an auth fault into a cached
    // "this page does not exist".
    mockFetch.mockResolvedValueOnce(rawResponse(200, "body"));
    await mod.getFileContentCached(PATH);
    expect(mockFetch.mock.calls[0][1]?.headers).toBeUndefined();
  });
});

describe("localized fallback — every read uses the resolved ref", () => {
  it("scans the English folder at the resolved SHA, not at the branch head", async () => {
    // This entry is KEYED under the ref, so reading at branch HEAD would store
    // a branch-HEAD answer under an immutable-SHA key — wrong exactly when the
    // memo is pinned to an older SHA, which is the quota-exhaustion path.
    // The translation must RESOLVE, or getEnglishSourceStatus is never
    // consulted and this test silently exercises the wrong code path.
    mockFetch
      .mockResolvedValueOnce(rawResponse(200, "TRADOTTO")) // translation probe
      .mockResolvedValue(rawResponse(404)); // English HEAD misses -> folder scan
    mockGetContent.mockResolvedValue({ data: [] });
    await mod.getLocalizedFileContentCached("site/X/some-page.md", "it");
    const refsUsed = mockGetContent.mock.calls.map((c) => c[0].ref);
    expect(refsUsed.length).toBeGreaterThan(0);
    expect(refsUsed).not.toContain("main");
    for (const r of refsUsed) expect(r).toBe(SHA);
  });
});

describe("localized fallback — the directory listing is cached", () => {
  it("lists a locale folder once across repeated views of the same page", async () => {
    // 37 of 216 routed pages reach this fallback (their slug transform does not
    // reproduce the real filename casing), which across 18 locales is 666 URLs.
    // [...slug]/page.tsx is force-dynamic, so before this listing was cached
    // each of those URLs cost a contents-API call on EVERY request — measured
    // at 100 calls for 100 repeat views, the last traffic-proportional drain.
    mockFetch.mockResolvedValue(rawResponse(404)); // exact probe always misses
    mockGetContent.mockResolvedValue({
      data: [{ path: "translations/it/site/X/AI_tools.md", type: "file", name: "AI_tools.md" }],
    });
    const view = () => mod.getLocalizedFileContentCached("site/X/ai-tools.md", "it");
    for (let i = 0; i < 10; i++) await view();
    const afterTen = mockGetContent.mock.calls.length;
    for (let i = 0; i < 40; i++) await view();
    // The count must not grow with traffic. It settles at two listings — the
    // locale folder for the fuzzy match, and the English folder that
    // readFileAtRef scans when the exact English path also misses — and stays
    // there. Uncached, 50 views cost 50+ calls.
    expect(afterTen).toBeLessThanOrEqual(2);
    expect(mockGetContent).toHaveBeenCalledTimes(afterTen);
  });
});

describe("localized fallback — degraded mode caches nothing", () => {
  it("does not cache the locale listing or probe miss on the mutable branch ref", async () => {
    // Same hazard as the English degraded path: `ref` is the branch NAME, so a
    // cached empty listing (or a cached probe miss) would hide a translation
    // created while getCommit is still failing, for the whole TTL.
    mockGetCommit.mockRejectedValue(httpError(500)); // no SHA -> branch ref
    mockFetch.mockResolvedValue(rawResponse(404));
    mockGetContent.mockResolvedValue({ data: [] }); // locale folder missing
    const view = () => mod.getLocalizedFileContentCached("site/X/ai-tools.md", "it");
    await expect(view()).resolves.toBeNull();
    // ...the translation is added under a differently-cased filename.
    mockGetContent.mockImplementation(async ({ path }: { path: string }) => ({
      data: path.startsWith("translations/it")
        ? [{ path: "translations/it/site/X/AI_tools.md", type: "file", name: "AI_tools.md" }]
        : [],
    }));
    mockFetch.mockImplementation(async (url: string) =>
      String(url).endsWith("translations/it/site/X/AI_tools.md")
        ? rawResponse(200, "TRADOTTO")
        : String(url).endsWith("site/X/ai-tools.md") && !String(url).includes("translations")
          ? rawResponse(200) // English source present (HEAD)
          : rawResponse(404),
    );
    await expect(view()).resolves.toBe("TRADOTTO");
  });
});

describe("localized fallback — degraded mode, exact path", () => {
  it("does not cache the exact-path probe miss on the mutable branch ref", async () => {
    mockGetCommit.mockRejectedValue(httpError(500)); // no SHA -> branch ref
    mockFetch.mockResolvedValue(rawResponse(404));
    mockGetContent.mockResolvedValue({ data: [] });
    const view = () => mod.getLocalizedFileContentCached("site/X/page.md", "it");
    await expect(view()).resolves.toBeNull();
    // ...the translation is created at exactly the requested path.
    mockFetch.mockImplementation(async (url: string) =>
      rawResponse(200, String(url).includes("translations/it/") ? "TRADOTTO" : "EN"),
    );
    await expect(view()).resolves.toBe("TRADOTTO");
  });
});

describe("getFileContentCached — case-insensitive folder fallback", () => {
  const REQUESTED = "site/ZFAV_Club/Guides_for_Creators/ai-tools.md";

  it("resolves a file whose real name differs only in case or separators", async () => {
    mockFetch
      .mockResolvedValueOnce(rawResponse(404)) // exact path misses
      .mockResolvedValueOnce(rawResponse(200, "# AI tools")); // matched name
    mockGetContent.mockResolvedValueOnce({
      data: [
        { path: "site/ZFAV_Club/Guides_for_Creators/AI_tools.md", type: "file", name: "AI_tools.md" },
        { path: "site/ZFAV_Club/Guides_for_Creators/AI_tools_for_offline.md", type: "file", name: "AI_tools_for_offline.md" },
      ],
    });
    await expect(mod.getFileContentCached(REQUESTED)).resolves.toBe(
      "# AI tools",
    );
  });

  // The scan once also accepted `normalize(file).includes(slug)`, so this
  // served a different article's body under the requested path.
  it("does not match a sibling that merely contains the slug", async () => {
    mockFetch.mockResolvedValue(rawResponse(404));
    mockGetContent.mockResolvedValueOnce({
      data: [
        { path: "site/ZFAV_Club/Guides_for_Creators/AI_tools_for_offline.md", type: "file", name: "AI_tools_for_offline.md" },
      ],
    });
    await expect(mod.getFileContentCached(REQUESTED)).resolves.toBeNull();
    // A second raw read would mean it fetched the wrong file.
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});

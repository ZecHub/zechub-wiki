/**
 * Regression tests for the silent-blank-page class of failure.
 *
 * The bug these guard against (#720): a transient GitHub contents-API failure
 * resolved to `null`, `unstable_cache` stored that `null` under the path, and
 * `[...slug]/page.tsx` rendered an empty article for it at HTTP 200. The
 * invariant is therefore narrow and load-bearing — **only a genuine 404 may
 * produce `null`**. Every other outcome must reject, so nothing is cached and
 * the next request retries.
 *
 * `unstable_cache` is stubbed to a pass-through: these assert the behaviour of
 * the wrapped function, which is what determines whether a bad value is
 * cacheable at all.
 */

const mockGetContent = jest.fn();

jest.mock("octokit", () => ({
  Octokit: jest.fn().mockImplementation(() => ({
    rest: { repos: { getContent: mockGetContent } },
  })),
}));

jest.mock("next/cache", () => ({
  unstable_cache: (fn: unknown) => fn,
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

/** An octokit HTTP error carries the status on the error object. */
const httpError = (status: number, message = `HTTP ${status}`) =>
  Object.assign(new Error(message), { status });

const fileResponse = (content: string) => ({
  data: {
    type: "file",
    encoding: "base64",
    content: Buffer.from(content, "utf-8").toString("base64"),
  },
});

beforeAll(async () => {
  process.env.OWNER = "ZecHub";
  process.env.REPO = "zechub";
  process.env.BRANCH = "main";
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "log").mockImplementation(() => {});
  mod = await import("../authAndFetch");
});

beforeEach(() => mockGetContent.mockReset());

describe("getFileContentCached — only a 404 may yield null", () => {
  it("returns the decoded file on success", async () => {
    mockGetContent.mockResolvedValueOnce(fileResponse("# Zimppy\n\nBody."));
    await expect(mod.getFileContentCached(PATH)).resolves.toBe(
      "# Zimppy\n\nBody.",
    );
  });

  it("returns null when the file and its folder are both genuinely absent", async () => {
    mockGetContent.mockRejectedValue(httpError(404));
    await expect(mod.getFileContentCached(PATH)).resolves.toBeNull();
  });

  // The core regression. Before the fix each of these resolved to `null` and
  // was cached forever, blanking the page until a redeploy.
  it.each([
    [403, "secondary rate limit"],
    [429, "too many requests"],
    [500, "internal server error"],
    [502, "bad gateway"],
  ])("rejects on a transient %i so nothing is cached", async (status) => {
    mockGetContent.mockRejectedValue(httpError(status));
    await expect(mod.getFileContentCached(PATH)).rejects.toMatchObject({
      status,
    });
  });

  it("rejects when the folder scan itself fails transiently", async () => {
    // Exact path is a clean 404, so the scan is reached; the scan then hits a
    // rate limit. That must not be read as "the page does not exist".
    mockGetContent
      .mockRejectedValueOnce(httpError(404))
      .mockRejectedValueOnce(httpError(403));
    await expect(mod.getFileContentCached(PATH)).rejects.toMatchObject({
      status: 403,
    });
  });
});

describe("getFileContentCached — responses that are not a readable file", () => {
  it("rejects a directory response instead of decoding it to an empty body", async () => {
    mockGetContent.mockResolvedValueOnce({
      data: [{ path: "site/Using_Zcash/a.md", type: "file" }],
    });
    await expect(mod.getFileContentCached(PATH)).rejects.toThrow(
      /is a directory/,
    );
  });

  it("rejects a blob too large to inline (>1 MB) instead of returning an empty body", async () => {
    mockGetContent.mockResolvedValueOnce({
      data: { type: "file", encoding: "none", content: "", size: 1_400_000 },
    });
    await expect(mod.getFileContentCached(PATH)).rejects.toThrow(
      /no inline content/,
    );
  });

  it("rejects a submodule or symlink entry", async () => {
    mockGetContent.mockResolvedValueOnce({
      data: { type: "symlink", target: "../elsewhere.md" },
    });
    await expect(mod.getFileContentCached(PATH)).rejects.toThrow(
      /is not a file/,
    );
  });
});

describe("getFileContentCached — case-insensitive folder fallback", () => {
  const REQUESTED = "site/ZFAV_Club/Guides_for_Creators/ai-tools.md";

  it("resolves a file whose real name differs only in case or separators", async () => {
    mockGetContent
      .mockRejectedValueOnce(httpError(404))
      .mockResolvedValueOnce({
        data: [
          { path: "site/ZFAV_Club/Guides_for_Creators/AI_tools.md" },
          { path: "site/ZFAV_Club/Guides_for_Creators/AI_tools_for_offline.md" },
        ],
      })
      .mockResolvedValueOnce(fileResponse("# AI tools"));
    await expect(mod.getFileContentCached(REQUESTED)).resolves.toBe(
      "# AI tools",
    );
  });

  // Before the fix the scan also accepted `normalize(file).includes(slug)`, so
  // this served a different article's body under the requested path.
  it("does not match a sibling that merely contains the slug", async () => {
    mockGetContent.mockRejectedValueOnce(httpError(404)).mockResolvedValueOnce({
      data: [
        { path: "site/ZFAV_Club/Guides_for_Creators/AI_tools_for_offline.md" },
      ],
    });
    await expect(mod.getFileContentCached(REQUESTED)).resolves.toBeNull();
    // three calls would mean it fetched the wrong file
    expect(mockGetContent).toHaveBeenCalledTimes(2);
  });
});

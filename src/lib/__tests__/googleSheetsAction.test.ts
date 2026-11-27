/**
 * Tests for ZCG Sheets Server Action caching and rate-limit guard.
 *
 * Verifies that getZCGrantsData is protected by unstable_cache with a 3600s TTL:
 * - Sequential calls reuse cache and trigger only 1 upstream read.
 * - Rapid/concurrent calls (e.g. 50 rapid invocations) trigger only 1 upstream read.
 * - Upstream failures do not cache bad results, allowing retries.
 */

type CacheRec = {
  keyParts: string[];
  calls: unknown[][];
  options?: { revalidate?: number | false; tags?: string[] };
};

const cacheRecs: CacheRec[] = [];
let cacheStore = new Map<string, Promise<unknown>>();

jest.mock("next/cache", () => ({
  unstable_cache: (
    fn: (...a: unknown[]) => unknown,
    keyParts: string[],
    options: CacheRec["options"],
  ) => {
    const rec: CacheRec = {
      keyParts: keyParts ?? [],
      calls: [],
      options,
    };
    cacheRecs.push(rec);

    return async (...args: unknown[]) => {
      rec.calls.push(args);
      const k = JSON.stringify([keyParts, args]);
      if (cacheStore.has(k)) {
        return cacheStore.get(k);
      }

      const promise = (async () => fn(...args))();
      const cachedPromise = promise.catch((err) => {
        cacheStore.delete(k);
        throw err;
      });
      cacheStore.set(k, cachedPromise);

      return cachedPromise;
    };
  },
}));

const mockSpreadsheetsGet = jest.fn();

jest.mock("googleapis", () => ({
  google: {
    sheets: jest.fn(() => ({
      spreadsheets: {
        get: mockSpreadsheetsGet,
      },
    })),
  },
}));

// Loaded in beforeAll, not with a top-level import: imports are hoisted above
// `const cacheRecs`, and the action calls unstable_cache at module load, so a
// static import reaches the mock while cacheRecs is still uninitialized.
let getZCGrantsData: typeof import("@/app/[locale]/actions/google-sheets.action").getZCGrantsData;

beforeAll(async () => {
  ({ getZCGrantsData } = await import("@/app/[locale]/actions/google-sheets.action"));
});

describe("getZCGrantsData caching and quota protection", () => {
  const sampleSheetResponse = {
    data: {
      sheets: [
        {
          data: [
            {
              rowData: [
                {
                  values: [
                    { formattedValue: "Project" },
                    { formattedValue: "Grantee" },
                    { formattedValue: "Amount (USD)" },
                    { formattedValue: "Paid Out" },
                    { formattedValue: "Grant Status" },
                  ],
                },
                {
                  values: [
                    { formattedValue: "ZecHub Wiki Project" },
                    { formattedValue: "ZecHub Team" },
                    { formattedValue: "$10,000.00" },
                    { formattedValue: "Jan 1, 2024" },
                    { formattedValue: "Completed" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  };

  beforeEach(() => {
    cacheStore.clear();
    mockSpreadsheetsGet.mockReset();
    mockSpreadsheetsGet.mockResolvedValue(sampleSheetResponse);
  });

  it("registers unstable_cache with a 1-hour revalidation TTL and zcg-grants tag", () => {
    const zcgCache = cacheRecs.find((c) =>
      c.keyParts.includes("zcg-grants-sheets-data"),
    );
    expect(zcgCache).toBeDefined();
    expect(zcgCache?.options?.revalidate).toBe(3600);
    expect(zcgCache?.options?.tags).toContain("zcg-grants");
  });

  it("triggers exactly one upstream read for sequential invocations", async () => {
    const first = await getZCGrantsData();
    const second = await getZCGrantsData();

    expect(first).toBeDefined();
    expect(second).toBeDefined();
    expect(first).toEqual(second);
    expect(mockSpreadsheetsGet).toHaveBeenCalledTimes(1);
  });

  it("triggers exactly one upstream read for 50 rapid concurrent invocations", async () => {
    const requests = Array.from({ length: 50 }, () => getZCGrantsData());
    const results = await Promise.all(requests);

    expect(results).toHaveLength(50);
    expect(mockSpreadsheetsGet).toHaveBeenCalledTimes(1);
    for (const res of results) {
      expect(res).toEqual(results[0]);
    }
  });

  it("gracefully catches upstream failure without throwing, returning undefined", async () => {
    mockSpreadsheetsGet.mockRejectedValueOnce(
      new Error("Google Sheets API 429: Rate limit exceeded"),
    );

    const result = await getZCGrantsData();
    expect(result).toBeUndefined();
  });

  it("does not cache upstream errors, allowing subsequent requests to retry", async () => {
    mockSpreadsheetsGet.mockRejectedValueOnce(
      new Error("Temporary network glitch"),
    );

    const first = await getZCGrantsData();
    expect(first).toBeUndefined();
    expect(mockSpreadsheetsGet).toHaveBeenCalledTimes(1);

    // Second call should retry upstream rather than returning cached undefined
    mockSpreadsheetsGet.mockResolvedValueOnce(sampleSheetResponse);
    const second = await getZCGrantsData();
    expect(second).toBeDefined();
    expect(mockSpreadsheetsGet).toHaveBeenCalledTimes(2);
  });
});

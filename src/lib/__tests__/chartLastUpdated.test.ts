import { getLatestDataDateForTab } from "@/lib/chart/helpers";

const DAY = 24 * 60 * 60 * 1000;
const isoDay = (t: number) => new Date(t).toISOString().slice(0, 10);

// issuance.json writes "2031-07-02 00:00:00"; difficulty.json writes "11/14/2026".
const issuanceDate = (t: number) => `${isoDay(t)} 00:00:00`;
const mdy = (t: number) => {
  const [y, m, d] = isoDay(t).split("-");
  return `${m}/${d}/${y}`;
};

const serve = (rows: unknown[]) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => rows,
  }) as unknown as typeof fetch;
};

describe("getLatestDataDateForTab", () => {
  const realFetch = global.fetch;

  afterEach(() => {
    global.fetch = realFetch;
  });

  it("does not report the projected schedule in issuance.json as its last update", async () => {
    // Daily rows from a month ago to five years ahead, like the real file.
    const start = Date.now() - 30 * DAY;
    serve(
      Array.from({ length: 5 * 365 }, (_, i) => ({
        Date: issuanceDate(start + i * DAY),
        "ZEC Issuance": "1800",
      })),
    );

    // null makes the footer fall back to the file's commit date.
    await expect(getLatestDataDateForTab("issuance")).resolves.toBeNull();
    expect(global.fetch).toHaveBeenCalledWith("/data/zcash/issuance.json", expect.anything());
  });

  it("ignores a row dated in the future and keeps the latest past one", async () => {
    const last = Date.now() - 2 * DAY;
    serve([
      { Date: mdy(last - DAY), Difficulty: "1" },
      { Date: mdy(last), Difficulty: "2" },
      { Date: mdy(Date.now() + 400 * DAY), Difficulty: "3" },
    ]);

    await expect(getLatestDataDateForTab("difficulty")).resolves.toBe(
      `${isoDay(last)}T00:00:00.000Z`,
    );
  });

  it("returns the newest date of a file that ends in the past", async () => {
    const last = Date.now() - 3 * DAY;
    serve([
      { Date: mdy(last - 7 * DAY), Difficulty: "1" },
      { Date: mdy(last), Difficulty: "2" },
    ]);

    await expect(getLatestDataDateForTab("difficulty")).resolves.toBe(
      `${isoDay(last)}T00:00:00.000Z`,
    );
  });
});

import { parseSnapshot } from "../snapshot";

const good = {
  v: 1,
  generatedAt: "2026-11-15T11:15:30.204Z",
  tipHeight: 3575575,
  windowDays: 30,
  baseTime: 1792149733,
  pools: ["sprout", "sapling", "orchard", "ironwood"],
  rows: [
    [0, 971043, 3, "0ed186997a78"],
    [120, 750030000, 1, "34b49d754229"],
  ],
  stats: { anything: "the tool does not need" },
};

describe("parseSnapshot", () => {
  it("keeps the rows and drops fields the tool does not use", () => {
    const s = parseSnapshot(good);
    expect(s?.rows).toEqual(good.rows);
    expect(s).not.toHaveProperty("stats");
    expect(s?.tipHeight).toBe(3575575);
  });

  it("rejects the wrong version, unknown pools and malformed rows", () => {
    expect(parseSnapshot({ ...good, v: 2 })).toBeNull();
    expect(parseSnapshot({ ...good, pools: ["sapling", "transparent"] })).toBeNull();
    expect(parseSnapshot({ ...good, rows: [[0, 971043, 7, "0ed186997a78"]] })).toBeNull();
    expect(parseSnapshot({ ...good, rows: [[0, -5, 1, "0ed186997a78"]] })).toBeNull();
    expect(parseSnapshot({ ...good, rows: [[0, 5, 1, "<script>alert"]] })).toBeNull();
    expect(parseSnapshot({ ...good, rows: [[0, 5, 1]] })).toBeNull();
    expect(parseSnapshot({ ...good, baseTime: "soon" })).toBeNull();
    expect(parseSnapshot(null)).toBeNull();
  });
});

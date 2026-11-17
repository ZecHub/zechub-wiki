/**
 * @jest-environment node
 */
import { GET } from "../shields/route";

const snapshot = {
  v: 1,
  generatedAt: "2026-11-15T11:15:30.204Z",
  tipHeight: 3575575,
  windowDays: 30,
  baseTime: 1792149733,
  pools: ["sprout", "sapling", "orchard", "ironwood"],
  rows: [[0, 971043, 3, "0ed186997a78"]],
};

const fetchMock = jest.fn();
beforeEach(() => {
  fetchMock.mockReset();
  global.fetch = fetchMock as unknown as typeof fetch;
});

describe("GET /api/amilinkable/shields", () => {
  it("serves the validated snapshot from Am I Linkable", async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify(snapshot), { status: 200 }));
    const res = await GET();
    expect(fetchMock.mock.calls[0][0]).toBe("https://am-i-linkable.vercel.app/api/v1/shields");
    expect(res.status).toBe(200);
    expect((await res.json()).rows).toEqual(snapshot.rows);
  });

  it("answers 502 when the upstream fails or sends something unexpected", async () => {
    fetchMock.mockRejectedValueOnce(new Error("timeout"));
    expect((await GET()).status).toBe(502);
    fetchMock.mockResolvedValueOnce(new Response("down", { status: 503 }));
    expect((await GET()).status).toBe(502);
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ ...snapshot, v: 9 }), { status: 200 }));
    expect((await GET()).status).toBe(502);
  });
});

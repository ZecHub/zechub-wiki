/** @jest-environment node */
import { GET } from "./route";
import { getTreasurySheetGvizUrl } from "@/lib/parseTreasurySheet";

afterEach(() => jest.restoreAllMocks());

it("returns the parsed public treasury snapshot through the wiki origin", async () => {
  const payload = {
    status: "ok",
    table: {
      rows: [
        { c: [{ v: "Last Updated:" }, { v: 46343, f: "11/17/2026" }] },
        { c: [{ v: "Zcash Price" }, { v: 927 }] },
      ],
    },
  };
  const upstream = jest.spyOn(globalThis, "fetch").mockResolvedValue(
    new Response(`/*O_o*/\ngoogle.visualization.Query.setResponse(${JSON.stringify(payload)});`),
  );
  const res = await GET();

  expect(res.status).toBe(200);
  expect(res.headers.get("Cache-Control")).toContain("s-maxage=300");
  expect(await res.json()).toEqual({ rows: [{ "Last Updated": "2026-11-17", "Zcash Price": "927" }] });
  expect(upstream).toHaveBeenCalledTimes(1);
  expect(upstream).toHaveBeenCalledWith(getTreasurySheetGvizUrl(), expect.objectContaining({
    signal: expect.any(AbortSignal),
  }));
});

it("returns a non-cacheable 502 when an upstream success does not contain data", async () => {
  jest.spyOn(globalThis, "fetch").mockResolvedValue(
    new Response('google.visualization.Query.setResponse({"status":"error"});'),
  );
  const res = await GET();

  expect(res.status).toBe(502);
  expect(res.headers.get("Cache-Control")).toBe("no-store");
  expect(await res.json()).toEqual({ error: "Treasury sheet is unavailable." });
});

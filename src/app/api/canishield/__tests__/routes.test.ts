/**
 * @jest-environment node
 */
import { GET as getList } from "../services/route";
import { GET as getOne } from "../services/[slug]/route";

const record = {
  format: "canishield-service/1",
  service: { slug: "binance", name: "Binance" },
  deposit: { result: "credited", label: "Credited", to: "a TEX", date: "2026-11-07", credit: "about 10 min", ok: true },
  outcomes: { total: 2, trouble: 2, latest: { result: "rejected", label: "Refused", week: "week of 14 Sep 2026" } },
};

const params = (slug: string) => ({ params: Promise.resolve({ slug }) });
const fetchMock = jest.fn();
beforeEach(() => {
  fetchMock.mockReset();
  global.fetch = fetchMock as unknown as typeof fetch;
});

describe("GET /api/canishield/services/[slug]", () => {
  it("returns the cleaned record", async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify(record), { status: 200 }));
    const res = await getOne({} as never, params("binance"));
    expect(res.status).toBe(200);
    expect(fetchMock.mock.calls[0][0]).toBe("https://canishield.vercel.app/api/services/binance");
    const body = await res.json();
    expect(body.deposit.credit).toBe("about 10 min");
    expect(body.url).toBe("https://canishield.vercel.app/services/binance");
  });

  it("refuses a bad slug without calling upstream", async () => {
    const res = await getOne({} as never, params("../../etc/passwd"));
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("passes on a 404 and reports other upstream failures as 502", async () => {
    fetchMock.mockResolvedValueOnce(new Response("{}", { status: 404 }));
    expect((await getOne({} as never, params("zingo"))).status).toBe(404);
    fetchMock.mockResolvedValueOnce(new Response("oops", { status: 500 }));
    expect((await getOne({} as never, params("binance"))).status).toBe(502);
    fetchMock.mockRejectedValueOnce(new Error("timeout"));
    expect((await getOne({} as never, params("binance"))).status).toBe(502);
    fetchMock.mockResolvedValueOnce(new Response("<html>", { status: 200 }));
    expect((await getOne({} as never, params("binance"))).status).toBe(502);
  });
});

describe("GET /api/canishield/services", () => {
  it("lists exchanges and swaps", async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({ services: [{ slug: "binance", name: "Binance", kind: "exchange" }, { slug: "zingo", name: "Zingo", kind: "wallet" }] }),
        { status: 200 },
      ),
    );
    const res = await getList();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ services: [{ slug: "binance", name: "Binance", kind: "exchange", hasRecord: false }] });
  });

  it("reports an empty or broken list as 502", async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ services: [] }), { status: 200 }));
    expect((await getList()).status).toBe(502);
  });
});

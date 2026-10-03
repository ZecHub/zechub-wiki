/** @jest-environment node */
import { NextRequest } from "next/server";

// Deployments that don't set BASE_URL_ZCASH_PRICE_FEED used to fetch the URL
// "undefined" (String(undefined)), fail, and answer every request with 503.

const DIA =
  "https://api.diadata.org/v1/assetQuotation/Zcash/0x0000000000000000000000000000000000000000";

async function getWithEnv(value: string | undefined) {
  jest.resetModules();
  if (value === undefined) delete process.env.BASE_URL_ZCASH_PRICE_FEED;
  else process.env.BASE_URL_ZCASH_PRICE_FEED = value;

  const fetchMock = jest.fn(async (input: RequestInfo | URL) =>
    String(input).startsWith("https://")
      ? new Response(JSON.stringify({ Price: 40, Source: "diadata.org" }), { status: 200 })
      : Promise.reject(new TypeError(`Failed to parse URL from ${String(input)}`)),
  );
  (global as unknown as { fetch: jest.Mock }).fetch = fetchMock;

  const { GET } = await import("@/app/api/payment-request-uri/zcash-price-feed/route");
  const res = await GET(new NextRequest("http://localhost/api/payment-request-uri/zcash-price-feed"));
  return { res, fetchMock };
}

describe("zcash-price-feed upstream", () => {
  const saved = process.env.BASE_URL_ZCASH_PRICE_FEED;
  let errorSpy: jest.SpyInstance;
  beforeEach(() => {
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    errorSpy.mockRestore();
    if (saved === undefined) delete process.env.BASE_URL_ZCASH_PRICE_FEED;
    else process.env.BASE_URL_ZCASH_PRICE_FEED = saved;
  });

  it.each([
    ["unset", undefined],
    ["empty", ""],
    ["the string 'undefined'", "undefined"],
  ])("uses the documented DIA feed when the variable is %s", async (_, value) => {
    const { res, fetchMock } = await getWithEnv(value);

    expect(fetchMock.mock.calls[0][0]).toBe(DIA);
    expect(res.status).toBe(200);
    expect((await res.json()).data.rate).toBe(40);
  });

  it("uses the configured feed when one is set", async () => {
    const { res, fetchMock } = await getWithEnv("https://prices.example.org/zec");

    expect(fetchMock.mock.calls[0][0]).toBe("https://prices.example.org/zec");
    expect(res.status).toBe(200);
  });
});

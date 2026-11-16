/** @jest-environment node */
import { NextRequest } from "next/server";

function postRequest(body: string) {
  return new NextRequest(
    "http://localhost/api/payment-request-uri/zcash-price-feed",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
    },
  );
}

function getRequest() {
  return new NextRequest(
    "http://localhost/api/payment-request-uri/zcash-price-feed",
  );
}

function mockFetchOnce(impl: () => Promise<Response> | Response) {
  (global as unknown as { fetch: jest.Mock }).fetch = jest.fn(impl);
}

describe("/api/payment-request-uri/zcash-price-feed", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.useRealTimers();
  });

  it("GET returns the price on a healthy upstream", async () => {
    mockFetchOnce(
      () =>
        new Response(JSON.stringify({ Price: 30, Source: "test" }), {
          status: 200,
        }),
    );
    const { GET } = await import(
      "@/app/api/payment-request-uri/zcash-price-feed/route"
    );
    const res = await GET(getRequest());
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.data.rate).toBe(30);
    expect(data.data.source).toBe("test");
  });

  it("GET returns 503 when the upstream is unreachable and there is no cached price", async () => {
    mockFetchOnce(() => Promise.reject(new Error("network down")));
    const { GET } = await import(
      "@/app/api/payment-request-uri/zcash-price-feed/route"
    );
    const res = await GET(getRequest());
    expect(res.status).toBe(503);
  });

  it("GET returns 503 when the upstream responds non-2xx", async () => {
    mockFetchOnce(() => new Response("nope", { status: 500 }));
    const { GET } = await import(
      "@/app/api/payment-request-uri/zcash-price-feed/route"
    );
    const res = await GET(getRequest());
    expect(res.status).toBe(503);
  });

  it("GET returns 503 when the upstream price is not a finite positive number", async () => {
    mockFetchOnce(
      () =>
        new Response(JSON.stringify({ Price: "not-a-number" }), {
          status: 200,
        }),
    );
    const { GET } = await import(
      "@/app/api/payment-request-uri/zcash-price-feed/route"
    );
    const res = await GET(getRequest());
    expect(res.status).toBe(503);
  });

  it("POST converts usd->zec using a healthy upstream price", async () => {
    mockFetchOnce(
      () =>
        new Response(JSON.stringify({ Price: 25, Source: "test" }), {
          status: 200,
        }),
    );
    const { POST } = await import(
      "@/app/api/payment-request-uri/zcash-price-feed/route"
    );
    const res = await POST(
      postRequest(JSON.stringify({ amount: 50, from: "usd", to: "zec" })),
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.data.amount).toBe(2);
    expect(data.data.rate).toBe(25);
  });

  it("POST rejects malformed JSON as 400", async () => {
    const { POST } = await import(
      "@/app/api/payment-request-uri/zcash-price-feed/route"
    );
    const res = await POST(postRequest("{bad"));
    expect(res.status).toBe(400);
  });

  it("POST rejects a schema violation as 400 instead of 500", async () => {
    const { POST } = await import(
      "@/app/api/payment-request-uri/zcash-price-feed/route"
    );
    const res = await POST(
      postRequest(JSON.stringify({ amount: -5, from: "usd", to: "zec" })),
    );
    expect(res.status).toBe(400);
  });

  it("POST rejects an amount above the maximum as 400", async () => {
    const { POST } = await import(
      "@/app/api/payment-request-uri/zcash-price-feed/route"
    );
    const res = await POST(
      postRequest(
        JSON.stringify({ amount: 2_000_000_000, from: "usd", to: "zec" }),
      ),
    );
    expect(res.status).toBe(400);
  });

  it("POST rejects a non-finite-producing amount (e.g. huge exponent) as 400", async () => {
    const { POST } = await import(
      "@/app/api/payment-request-uri/zcash-price-feed/route"
    );
    const res = await POST(
      postRequest(JSON.stringify({ amount: 1e308, from: "usd", to: "zec" })),
    );
    expect(res.status).toBe(400);
  });

  it("POST returns 503 (not a misleading 200) when upstream price is unavailable", async () => {
    mockFetchOnce(() => Promise.reject(new Error("timeout")));
    const { POST } = await import(
      "@/app/api/payment-request-uri/zcash-price-feed/route"
    );
    const res = await POST(
      postRequest(JSON.stringify({ amount: 10, from: "usd", to: "zec" })),
    );
    expect(res.status).toBe(503);
  });

  describe("upstream URL", () => {
    const DIA =
      "https://api.diadata.org/v1/assetQuotation/Zcash/0x0000000000000000000000000000000000000000";
    const saved = process.env.BASE_URL_ZCASH_PRICE_FEED;
    afterEach(() => {
      if (saved === undefined) delete process.env.BASE_URL_ZCASH_PRICE_FEED;
      else process.env.BASE_URL_ZCASH_PRICE_FEED = saved;
    });

    async function upstreamUrlFor(env: string | undefined) {
      if (env === undefined) delete process.env.BASE_URL_ZCASH_PRICE_FEED;
      else process.env.BASE_URL_ZCASH_PRICE_FEED = env;
      mockFetchOnce(
        () =>
          new Response(JSON.stringify({ Price: 30, Source: "test" }), {
            status: 200,
          }),
      );
      const { GET } = await import(
        "@/app/api/payment-request-uri/zcash-price-feed/route"
      );
      const res = await GET(getRequest());
      expect(res.status).toBe(200);
      const fetchMock = (global as unknown as { fetch: jest.Mock }).fetch;
      return String(fetchMock.mock.calls[0][0]);
    }

    it("falls back to the DIA feed when BASE_URL_ZCASH_PRICE_FEED is unset (never fetches 'undefined')", async () => {
      expect(await upstreamUrlFor(undefined)).toBe(DIA);
    });

    it("falls back to the DIA feed when BASE_URL_ZCASH_PRICE_FEED is blank", async () => {
      expect(await upstreamUrlFor("   ")).toBe(DIA);
    });

    it("uses BASE_URL_ZCASH_PRICE_FEED when it is set", async () => {
      expect(await upstreamUrlFor("https://feed.example/zec")).toBe(
        "https://feed.example/zec",
      );
    });
  });

  it("POST rounds usd->zec to zatoshi precision so the result is a valid ZIP 321 amount", async () => {
    // Live DIA quote on 2026-11-16: 10 USD / 898.0630032340022 USD/ZEC
    // = 0.011135076229606541 ZEC unrounded, which the QR endpoint rejects with
    // "exceeds maximum 8 decimal places".
    mockFetchOnce(
      () =>
        new Response(
          JSON.stringify({ Price: 898.0630032340022, Source: "diadata.org" }),
          { status: 200 },
        ),
    );
    const { POST } = await import(
      "@/app/api/payment-request-uri/zcash-price-feed/route"
    );
    const { formatZecAmount, validateZip321Payment } = await import(
      "@/lib/zip321"
    );
    const res = await POST(
      postRequest(JSON.stringify({ amount: 10, from: "usd", to: "zec" })),
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.data.amount).toBe(0.01113508);
    expect(formatZecAmount(data.data.amount)).toBe("0.01113508");
    expect(
      validateZip321Payment({
        address: "t1Hsc1LR8yKnbbe3twRp88p6vFfC5t7DLbs",
        amount: data.data.amount,
      }).valid,
    ).toBe(true);
  });

  it("POST usd->zec output is always accepted by formatZecAmount (price/amount sweep)", async () => {
    const { formatZecAmount } = await import("@/lib/zip321");
    const prices = [0.37, 3.3, 25, 37.12, 41.07, 898.0630032340022, 1398.43];
    const amounts = [0.01, 0.99, 1, 7, 9.99, 10, 33.33, 100, 12345.67];
    for (const price of prices) {
      for (const amount of amounts) {
        jest.resetModules();
        mockFetchOnce(
          () =>
            new Response(JSON.stringify({ Price: price, Source: "t" }), {
              status: 200,
            }),
        );
        const { POST } = await import(
          "@/app/api/payment-request-uri/zcash-price-feed/route"
        );
        const res = await POST(
          postRequest(JSON.stringify({ amount, from: "usd", to: "zec" })),
        );
        expect(res.status).toBe(200);
        const { data } = await res.json();
        expect(() => formatZecAmount(data.amount)).not.toThrow();
        expect(Math.abs(data.amount - amount / price)).toBeLessThanOrEqual(
          0.000000005 + 1e-15,
        );
      }
    }
  });

  it("POST rejects a usd amount worth less than 1 zatoshi as 400", async () => {
    mockFetchOnce(
      () =>
        new Response(JSON.stringify({ Price: 1_000_000, Source: "t" }), {
          status: 200,
        }),
    );
    const { POST } = await import(
      "@/app/api/payment-request-uri/zcash-price-feed/route"
    );
    const res = await POST(
      postRequest(JSON.stringify({ amount: 0.001, from: "usd", to: "zec" })),
    );
    expect(res.status).toBe(400);
  });

  it("POST rejects an oversized body as 413", async () => {
    const { POST } = await import(
      "@/app/api/payment-request-uri/zcash-price-feed/route"
    );
    const req = new NextRequest(
      "http://localhost/api/payment-request-uri/zcash-price-feed",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "content-length": "20000",
        },
        body: JSON.stringify({ amount: 1, from: "usd", to: "zec" }),
      },
    );
    const res = await POST(req);
    expect(res.status).toBe(413);
  });
});

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

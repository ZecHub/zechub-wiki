/** @jest-environment node */
import { NextRequest } from "next/server";

// The embedded widget runs on merchants' own sites, so the endpoints it calls
// are requested cross-origin and must send a usable Access-Control-Allow-Origin.

const SHORTEN = "http://localhost/api/payment-request-uri/shorten";
const FEED = "http://localhost/api/payment-request-uri/zcash-price-feed";

async function loadShorten(allowOrigin: string | undefined) {
  jest.resetModules();
  if (allowOrigin === undefined) delete process.env.ACCESS_CONTROL_ALLOW_ORIGIN;
  else process.env.ACCESS_CONTROL_ALLOW_ORIGIN = allowOrigin;
  return import("@/app/api/payment-request-uri/shorten/route");
}

describe("widget endpoint CORS", () => {
  const saved = process.env.ACCESS_CONTROL_ALLOW_ORIGIN;
  afterEach(() => {
    if (saved === undefined) delete process.env.ACCESS_CONTROL_ALLOW_ORIGIN;
    else process.env.ACCESS_CONTROL_ALLOW_ORIGIN = saved;
  });

  it("shorten allows any origin when ACCESS_CONTROL_ALLOW_ORIGIN is unset", async () => {
    const { OPTIONS, POST } = await loadShorten(undefined);

    const preflight = await OPTIONS(new NextRequest(SHORTEN, { method: "OPTIONS" }));
    expect(preflight.headers.get("access-control-allow-origin")).toBe("*");

    const res = await POST(
      new NextRequest(SHORTEN, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ uri: "zcash:t1abc?amount=1" }),
      }),
    );
    expect(res.headers.get("access-control-allow-origin")).toBe("*");
  });

  it("shorten keeps a configured origin", async () => {
    const { OPTIONS } = await loadShorten("https://shop.example");
    const preflight = await OPTIONS(new NextRequest(SHORTEN, { method: "OPTIONS" }));
    expect(preflight.headers.get("access-control-allow-origin")).toBe("https://shop.example");
  });

  it("the price feed can be read cross-origin, including its 503", async () => {
    jest.resetModules();
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    (global as unknown as { fetch: jest.Mock }).fetch = jest.fn(async () =>
      new Response(JSON.stringify({ Price: 40, Source: "test" }), { status: 200 }),
    );
    const feed = await import("@/app/api/payment-request-uri/zcash-price-feed/route");

    const ok = await feed.GET(new NextRequest(FEED));
    expect(ok.status).toBe(200);
    expect(ok.headers.get("access-control-allow-origin")).toBe("*");

    jest.resetModules();
    (global as unknown as { fetch: jest.Mock }).fetch = jest.fn(async () =>
      new Response("down", { status: 500 }),
    );
    const down = await import("@/app/api/payment-request-uri/zcash-price-feed/route");
    const unavailable = await down.GET(new NextRequest(FEED));
    expect(unavailable.status).toBe(503);
    expect(unavailable.headers.get("access-control-allow-origin")).toBe("*");
    errorSpy.mockRestore();
  });
});

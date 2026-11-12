/** @jest-environment node */
import { NextRequest } from "next/server";

function postRequest(
  body: string,
  { contentLength }: { contentLength?: number } = {},
) {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (contentLength !== undefined) {
    headers["content-length"] = String(contentLength);
  }
  return new NextRequest("http://localhost/api/payment-request-uri/shorten", {
    method: "POST",
    headers,
    body,
  });
}

function getRequest(shortId: string) {
  const req = new NextRequest(
    `http://localhost/api/payment-request-uri/shorten/${shortId}`,
  );
  const ctx = { params: Promise.resolve({ shortId }) };
  return { req, ctx } as const;
}

function shortIdFromUrl(shortUrl: string): string {
  const marker = "/payment-request-uri/shorten/";
  const idx = shortUrl.indexOf(marker);
  return idx === -1 ? "" : shortUrl.slice(idx + marker.length);
}

describe("POST /api/payment-request-uri/shorten", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("shortens a valid uri and returns CORS headers", async () => {
    const { POST } = await import("@/app/api/payment-request-uri/shorten/route");
    const res = await POST(postRequest(JSON.stringify({ uri: "zcash:t1abc?amount=1" })));

    expect(res.status).toBe(200);
    expect(res.headers.get("Access-Control-Allow-Origin")).not.toBeNull();
    const data = await res.json();
    expect(typeof data.shortUrl).toBe("string");
    expect(data.shortUrl).toContain("/payment-request-uri/shorten/");
  });

  it("does not duplicate the /api segment in the short url", async () => {
    const { POST } = await import("@/app/api/payment-request-uri/shorten/route");
    const res = await POST(postRequest(JSON.stringify({ uri: "zcash:t1abc" })));
    const { shortUrl } = await res.json();
    expect(shortUrl).not.toContain("/api/api/");
  });

  it("rejects malformed JSON as 400", async () => {
    const { POST } = await import("@/app/api/payment-request-uri/shorten/route");
    const res = await POST(postRequest("{not json"));
    expect(res.status).toBe(400);
    expect(res.headers.get("Access-Control-Allow-Origin")).not.toBeNull();
  });

  it("rejects a missing uri as 400", async () => {
    const { POST } = await import("@/app/api/payment-request-uri/shorten/route");
    const res = await POST(postRequest(JSON.stringify({})));
    expect(res.status).toBe(400);
  });

  it("rejects a non-string uri as 400", async () => {
    const { POST } = await import("@/app/api/payment-request-uri/shorten/route");
    const res = await POST(postRequest(JSON.stringify({ uri: 12345 })));
    expect(res.status).toBe(400);
  });

  it("rejects an empty-string uri as 400", async () => {
    const { POST } = await import("@/app/api/payment-request-uri/shorten/route");
    const res = await POST(postRequest(JSON.stringify({ uri: "" })));
    expect(res.status).toBe(400);
  });

  it("rejects a uri over the length limit as 413", async () => {
    const { POST } = await import("@/app/api/payment-request-uri/shorten/route");
    const uri = "zcash:t1abc?amount=1&memo=" + "a".repeat(4100);
    const res = await POST(postRequest(JSON.stringify({ uri })));
    expect(res.status).toBe(413);
  });

  it("rejects an oversized body as 413 before parsing", async () => {
    const { POST } = await import("@/app/api/payment-request-uri/shorten/route");
    const res = await POST(
      postRequest(JSON.stringify({ uri: "zcash:t1abc" }), { contentLength: 20000 }),
    );
    expect(res.status).toBe(413);
  });

  it("caps the in-memory fallback store with FIFO eviction", async () => {
    const { storeUri, __clearMemoryStore, __memoryStoreSize, MAX_STORE_ENTRIES } =
      await import("@/app/api/payment-request-uri/shorten/store");

    __clearMemoryStore();

    for (let i = 0; i < MAX_STORE_ENTRIES; i++) {
      await storeUri(`seed-${i}`, `zcash:seed-${i}`);
    }
    expect(__memoryStoreSize()).toBe(MAX_STORE_ENTRIES);

    await storeUri("overflow", "zcash:overflow");

    // The store stays capped; the oldest entry is evicted, not the new one.
    expect(__memoryStoreSize()).toBe(MAX_STORE_ENTRIES);
  }, 20000);
});

describe("GET /api/payment-request-uri/shorten/[shortId]", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("round-trips: a created link resolves with a 302 to the stored uri", async () => {
    const { POST } = await import("@/app/api/payment-request-uri/shorten/route");
    const { GET } = await import(
      "@/app/api/payment-request-uri/shorten/[shortId]/route"
    );

    const uri = "zcash:t1abc?amount=1.5&memo=hello";
    const createRes = await POST(postRequest(JSON.stringify({ uri })));
    expect(createRes.status).toBe(200);
    const { shortUrl } = await createRes.json();
    const shortId = shortIdFromUrl(shortUrl);
    expect(shortId.length).toBeGreaterThan(0);

    const { req, ctx } = getRequest(shortId);
    const resolveRes = await GET(req, ctx);

    expect(resolveRes.status).toBe(302);
    expect(resolveRes.headers.get("location")).toBe(uri);
  });

  it("returns 404 for an unknown short id", async () => {
    const { GET } = await import(
      "@/app/api/payment-request-uri/shorten/[shortId]/route"
    );
    const { req, ctx } = getRequest("does-not-exist");
    const res = await GET(req, ctx);
    expect(res.status).toBe(404);
  });

  it("returns 404 for a malformed short id", async () => {
    const { GET } = await import(
      "@/app/api/payment-request-uri/shorten/[shortId]/route"
    );
    const { req, ctx } = getRequest("bad id with spaces");
    const res = await GET(req, ctx);
    expect(res.status).toBe(404);
  });

  it("returns 404 when the stored value is not a zcash uri", async () => {
    const { storeUri } = await import(
      "@/app/api/payment-request-uri/shorten/store"
    );
    const { GET } = await import(
      "@/app/api/payment-request-uri/shorten/[shortId]/route"
    );

    await storeUri("evilredirect", "https://evil.example.com");
    const { req, ctx } = getRequest("evilredirect");
    const res = await GET(req, ctx);
    expect(res.status).toBe(404);
  });
});

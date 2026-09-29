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
    expect(data.shortUrl).toContain("/api/payment-request-uri/shorten/");
  });

  it("returns an absolute short link with a single /api segment", async () => {
    const { POST } = await import("@/app/api/payment-request-uri/shorten/route");
    const res = await POST(postRequest(JSON.stringify({ uri: "zcash:t1abc?amount=1" })));
    const { shortUrl } = await res.json();

    // The widget runs on merchants' sites, so a relative link would point at
    // the merchant's domain.
    expect(shortUrl).toMatch(
      /^http:\/\/localhost\/api\/payment-request-uri\/shorten\/[A-Za-z0-9_-]{8}$/,
    );
  });

  it("rejects a uri that is not a zcash: payment URI as 400", async () => {
    const { POST } = await import("@/app/api/payment-request-uri/shorten/route");
    for (const uri of ["https://example.com/", "javascript:alert(1)", "t1abc"]) {
      const res = await POST(postRequest(JSON.stringify({ uri })));
      expect(res.status).toBe(400);
    }
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

  it("caps the in-memory store at MAX_STORE_ENTRIES with FIFO eviction", async () => {
    const { POST, urlStore, MAX_STORE_ENTRIES } = await import(
      "@/app/api/payment-request-uri/shorten/route"
    );

    urlStore.clear();

    // Fill to exactly the cap.
    for (let i = 0; i < MAX_STORE_ENTRIES; i++) {
      const res = await POST(postRequest(JSON.stringify({ uri: `zcash:seed-${i}` })));
      expect(res.status).toBe(200);
    }
    expect(urlStore.size).toBe(MAX_STORE_ENTRIES);

    const oldestKeyBeforeOverflow = urlStore.keys().next().value;
    expect(oldestKeyBeforeOverflow).toBeDefined();

    // One more insert should evict exactly the oldest entry, not grow the store.
    const res = await POST(postRequest(JSON.stringify({ uri: "zcash:overflow" })));
    expect(res.status).toBe(200);

    expect(urlStore.size).toBe(MAX_STORE_ENTRIES);
    expect(urlStore.has(oldestKeyBeforeOverflow as string)).toBe(false);
  }, 20000);
});

describe("GET /api/payment-request-uri/shorten/[id]", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  const get = async (id: string) => {
    const { GET } = await import(
      "@/app/api/payment-request-uri/shorten/[id]/route"
    );
    return GET(
      new NextRequest(`http://localhost/api/payment-request-uri/shorten/${id}`),
      { params: Promise.resolve({ id }) },
    );
  };

  it("redirects a short link from POST to the original payment URI", async () => {
    const { POST } = await import("@/app/api/payment-request-uri/shorten/route");
    const uri = "zcash:t1abc?amount=1.5&label=Coffee%20shop";
    const { shortUrl } = await (
      await POST(postRequest(JSON.stringify({ uri })))
    ).json();

    const res = await get(new URL(shortUrl).pathname.split("/").pop()!);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe(uri);
    expect(res.headers.get("cache-control")).toBe("no-store");
  });

  it("returns 404 for an unknown or malformed id", async () => {
    expect((await get("AAAAAAAA")).status).toBe(404);
    expect((await get("../route")).status).toBe(404);
  });
});

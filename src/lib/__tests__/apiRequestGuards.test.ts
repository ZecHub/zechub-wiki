/** @jest-environment node */
import {
  MAX_JSON_BODY_BYTES,
  readBoundedJsonBody,
} from "../apiRequestGuards";

function makeRequest(
  body: string,
  { contentLength }: { contentLength?: number } = {},
) {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (contentLength !== undefined) {
    headers["content-length"] = String(contentLength);
  }
  return new Request("http://localhost/api/test", {
    method: "POST",
    headers,
    body,
  });
}

describe("readBoundedJsonBody", () => {
  it("parses a normal, well within-limit JSON body", async () => {
    const result = await readBoundedJsonBody(makeRequest('{"a":1,"b":"x"}'));
    expect(result).toEqual({ ok: true, body: { a: 1, b: "x" } });
  });

  it("rejects a body declared oversized via Content-Length as 413, without reading it", async () => {
    const result = await readBoundedJsonBody(
      makeRequest("{}", { contentLength: MAX_JSON_BODY_BYTES + 1 }),
    );
    expect(result).toEqual({
      ok: false,
      status: 413,
      error: expect.any(String),
    });
  });

  it("rejects a body that exceeds the limit even without a Content-Length header", async () => {
    const oversized = JSON.stringify({ data: "a".repeat(MAX_JSON_BODY_BYTES) });
    const result = await readBoundedJsonBody(makeRequest(oversized));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.status).toBe(413);
  });

  it("accepts a body exactly at the limit", async () => {
    const padding = "a".repeat(
      MAX_JSON_BODY_BYTES - JSON.stringify({ data: "" }).length,
    );
    const atLimit = JSON.stringify({ data: padding });
    expect(Buffer.byteLength(atLimit, "utf8")).toBe(MAX_JSON_BODY_BYTES);

    const result = await readBoundedJsonBody(makeRequest(atLimit));
    expect(result.ok).toBe(true);
  });

  it("rejects malformed JSON as 400", async () => {
    const result = await readBoundedJsonBody(makeRequest("{not valid json"));
    expect(result).toEqual({
      ok: false,
      status: 400,
      error: expect.any(String),
    });
  });

  it("rejects an empty body as 400", async () => {
    const result = await readBoundedJsonBody(makeRequest(""));
    expect(result).toEqual({
      ok: false,
      status: 400,
      error: expect.any(String),
    });
  });

  it("honors a custom maxBytes argument", async () => {
    const result = await readBoundedJsonBody(makeRequest('{"a":1}'), 4);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.status).toBe(413);
  });
});

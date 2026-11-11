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
  return new NextRequest(
    "http://localhost/api/payment-request-uri/widget-telemetry",
    { method: "POST", headers, body },
  );
}

describe("POST /api/payment-request-uri/widget-telemetry", () => {
  it("returns 204 for a valid JSON body", async () => {
    const { POST } = await import(
      "@/app/api/payment-request-uri/widget-telemetry/route"
    );
    const res = await POST(postRequest(JSON.stringify({ event: "open" })));
    expect(res.status).toBe(204);
  });

  it("returns 400 for malformed JSON", async () => {
    const { POST } = await import(
      "@/app/api/payment-request-uri/widget-telemetry/route"
    );
    const res = await POST(postRequest("{not json"));
    expect(res.status).toBe(400);
  });

  it("returns 413 for an oversized body", async () => {
    const { POST } = await import(
      "@/app/api/payment-request-uri/widget-telemetry/route"
    );
    const res = await POST(
      postRequest(JSON.stringify({ event: "open" }), { contentLength: 20000 }),
    );
    expect(res.status).toBe(413);
  });

  it("does not log the raw request body", async () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    const { POST } = await import(
      "@/app/api/payment-request-uri/widget-telemetry/route"
    );
    await POST(postRequest(JSON.stringify({ secret: "should-not-be-logged" })));
    const loggedSomethingWithSecret = logSpy.mock.calls.some((call) =>
      call.some(
        (arg) => typeof arg === "string" && arg.includes("should-not-be-logged"),
      ),
    );
    expect(loggedSomethingWithSecret).toBe(false);
    logSpy.mockRestore();
  });
});

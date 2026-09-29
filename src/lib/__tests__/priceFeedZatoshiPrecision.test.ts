/** @jest-environment node */
import fs from "fs";
import path from "path";
import { JSDOM } from "jsdom";
import { NextRequest } from "next/server";

// The widget configurator converts a USD price with this route and writes the
// result verbatim into the snippet merchants paste: data-amount="${amount}".
// The embed accepts at most 8 decimal places (ZIP 321), so the route must not
// hand back a float like 0.26939655172413796.

const EMBED_SOURCE = fs.readFileSync(
  path.join(process.cwd(), "public", "zcash-payment-request-widget.embed.v2.js"),
  "utf8",
);
const ADDRESS = "t1VpMigELggqi6TBghQNehqspAcBBDYvRQC";

async function convertUsd(usd: number, price: number): Promise<number> {
  (global as unknown as { fetch: jest.Mock }).fetch = jest.fn(
    async () =>
      new Response(JSON.stringify({ Price: price, Source: "test" }), { status: 200 }),
  );
  const { POST } = await import("@/app/api/payment-request-uri/zcash-price-feed/route");
  const res = await POST(
    new NextRequest("http://localhost/api/payment-request-uri/zcash-price-feed", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ amount: usd, from: "usd", to: "zec" }),
    }),
  );
  expect(res.status).toBe(200);
  return (await res.json()).data.amount;
}

/** Renders the real embed the way a pasted snippet does, with a string amount. */
async function embedRendersButton(dataAmount: string): Promise<boolean> {
  const dom = new JSDOM(`<!doctype html><body><div id="t"></div></body>`, {
    runScripts: "outside-only",
    url: "https://merchant.example/",
  });
  const w = dom.window as unknown as Window & {
    renderZcashButton: (s: string, o: Record<string, unknown>) => Promise<unknown>;
    eval: (src: string) => unknown;
  };
  (w as unknown as { TextEncoder: unknown }).TextEncoder = TextEncoder;
  w.eval(EMBED_SOURCE);
  const inst = await w.renderZcashButton("#t", {
    address: ADDRESS,
    amount: dataAmount,
    zecUsdRate: "1",
  });
  return Boolean(inst) && w.document.querySelector(".zwg-btn") !== null;
}

describe("usd->zec conversion precision", () => {
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.resetModules();
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => errorSpy.mockRestore());

  it.each([
    [10, 37.12, 0.26939655],
    [19.99, 41.37, 0.48320039],
    [1, 3, 0.33333333],
    [250, 29.4, 8.50340136],
  ])("converts $%p at $%p/ZEC to %p ZEC, rounded to zatoshis", async (usd, price, zec) => {
    const amount = await convertUsd(usd, price);
    expect(amount).toBe(zec);
    expect(String(amount)).toMatch(/^\d+(\.\d{1,8})?$/);
  });

  it("produces an amount the embedded widget accepts from data-amount", async () => {
    const amount = await convertUsd(10, 37.12);
    expect(await embedRendersButton(`${amount}`)).toBe(true);
  });
});

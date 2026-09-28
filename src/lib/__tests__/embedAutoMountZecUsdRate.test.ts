/** @jest-environment node */
import fs from "fs";
import path from "path";
import { JSDOM } from "jsdom";

/**
 * Regression tests for a bug in the standalone embed's auto-mount path
 * (public/zcash-payment-request-widget.embed.v2.js): it referenced a bare,
 * undeclared `zecUsdRate` identifier (`zecUsdRate || script.dataset.
 * zecUsdRate`) instead of just reading `script.dataset.zecUsdRate`, as
 * every other auto-mount field does. Evaluating that undeclared reference
 * throws a ReferenceError while building renderZcashButton's arguments, so
 * renderZcashButton() is never called and the widget never mounts -- with
 * no artificial global `zecUsdRate` defined anywhere, which is the normal
 * condition for every real page embedding this script.
 *
 * This is a reliability/checkout bug, not a security issue.
 */

const EMBED_SCRIPT_PATH = path.join(
  process.cwd(),
  "public",
  "zcash-payment-request-widget.embed.v2.js",
);
const EMBED_SOURCE = fs.readFileSync(EMBED_SCRIPT_PATH, "utf8");

const ADDRESS = "zs1znewaqucqpc372x6ajmfnmkmxsafnc3fuxmg6g5kq3mkvkv8ufx9hgx9vgcrqncqm3umz56a7pd";

type FetchMock = jest.Mock<Promise<{ json: () => Promise<unknown> }>>;

function mountAutoMount(dataAttrs: Record<string, string>, fetchImpl?: FetchMock) {
  const attrs = Object.entries(dataAttrs)
    .map(([k, v]) => `data-${k}="${v}"`)
    .join(" ");

  const dom = new JSDOM(
    `<!doctype html><body>
      <div id="auto-target"></div>
      <script id="w" ${attrs}></script>
    </body></html>`,
    { runScripts: "dangerously", url: "https://merchant.example/" },
  );
  const w = dom.window as unknown as Window & {
    renderZcashButton?: (selector: string, opts: Record<string, unknown>) => Promise<unknown>;
    __zcash_paymet_uri_widget_autoinstance?: unknown;
  };

  const rejections: unknown[] = [];
  (w as unknown as { addEventListener: Function }).addEventListener(
    "unhandledrejection",
    (e: { reason: unknown }) => rejections.push(e.reason),
  );

  (w as unknown as { fetch: unknown }).fetch =
    fetchImpl ?? jest.fn().mockResolvedValue({ json: async () => ({}) });

  const scriptEl = w.document.getElementById("w") as HTMLScriptElement;
  const evaluated = new (w as unknown as { Function: FunctionConstructor }).Function(EMBED_SOURCE);
  Object.defineProperty(w.document, "currentScript", { value: scriptEl, configurable: true });

  evaluated.call(w);

  return { w, rejections };
}

async function flush() {
  await new Promise((r) => setTimeout(r, 0));
  await new Promise((r) => setTimeout(r, 0));
}

describe("embed auto-mount: zecUsdRate reference", () => {
  it("1 & 3. mounts successfully with no global zecUsdRate defined anywhere", async () => {
    const { w, rejections } = mountAutoMount({
      target: "#auto-target",
      address: ADDRESS,
      amount: "1",
    });
    await flush();

    expect(rejections).toEqual([]); // no ReferenceError
    expect(w.document.querySelector("#auto-target .zwg-btn")).not.toBeNull();
    expect(w.__zcash_paymet_uri_widget_autoinstance).toBeTruthy();
  });

  it("2 & 4. reads data-zec-usd-rate and the rate reaches the rendered widget's USD conversion", async () => {
    const { w } = mountAutoMount({
      target: "#auto-target",
      address: ADDRESS,
      amount: "2",
      "zec-usd-rate": "50",
    });
    await flush();

    const inst = (await w.__zcash_paymet_uri_widget_autoinstance) as { open: () => void };
    inst.open();

    const amtVal = w.document.querySelector(".zwg-amt-val")!.textContent!;
    // amount 2 * rate 50 = $100.00, per the widget's own usdValue calc.
    expect(w.document.querySelector(".zwg-amt")!.textContent).toContain("$100.00 USD");
    expect(amtVal).toContain("2.000");
  });

  it("5. falls back to the price-feed endpoint when data-zec-usd-rate is not supplied", async () => {
    const fetchImpl: FetchMock = jest.fn().mockResolvedValue({
      json: async () => ({ rate: 30 }),
    });
    const { w } = mountAutoMount(
      { target: "#auto-target", address: ADDRESS, amount: "1" },
      fetchImpl,
    );
    await flush();

    expect(fetchImpl).toHaveBeenCalledWith(
      expect.stringContaining("/payment-request-uri/zcash-price-feed"),
    );

    const inst = (await w.__zcash_paymet_uri_widget_autoinstance) as { open: () => void };
    inst.open();
    expect(w.document.querySelector(".zwg-amt")!.textContent).toContain("$30.00 USD");
  });

  it("6 & 7. manual/programmatic renderZcashButton() usage is unaffected and needs no new global", async () => {
    const dom = new JSDOM(`<!doctype html><body><div id="t"></div></body>`, {
      runScripts: "outside-only",
      url: "https://merchant.example/",
    });
    const w = dom.window as unknown as Window & {
      renderZcashButton: (selector: string, opts: Record<string, unknown>) => Promise<unknown>;
    };
    (w as unknown as { fetch: unknown }).fetch = jest.fn().mockResolvedValue({ json: async () => ({}) });
    w.eval(EMBED_SOURCE);

    // No document.currentScript context at all here (no auto-mount path
    // involved) and no zecUsdRate global defined anywhere.
    const inst = await w.renderZcashButton("#t", {
      address: ADDRESS,
      amount: 1,
      zecUsdRate: 42,
    }) as { open: () => void };

    expect(inst).toBeTruthy();
    expect(w.document.querySelector(".zwg-btn")).not.toBeNull();
    inst.open();
    expect(w.document.querySelector(".zwg-amt")!.textContent).toContain("$42.00 USD");
  });

  it("8. normal widget behavior (address/amount/label/memo) is otherwise unchanged", async () => {
    const { w } = mountAutoMount({
      target: "#auto-target",
      address: ADDRESS,
      amount: "1.5",
      label: "Coffee",
      memo: "Thanks!",
    });
    await flush();

    const inst = (await w.__zcash_paymet_uri_widget_autoinstance) as { open: () => void };
    inst.open();

    expect(w.document.querySelector(".zwg-title")!.textContent).toBe("Coffee");
    expect(w.document.querySelector(".zwg-fld-txt")!.textContent).toBe(ADDRESS);
    const uriInput = w.document.querySelector<HTMLInputElement>(".zwg-fld-inp")!;
    expect(uriInput.value).toContain(`zcash:${ADDRESS}?amount=1.5`);
  });
});

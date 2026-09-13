/** @jest-environment node */
import fs from "fs";
import path from "path";
import { JSDOM } from "jsdom";

/**
 * End-to-end tests for the ZIP-321 validation added to the standalone embed,
 * run against the real public/zcash-payment-request-widget.embed.v2.js.
 *
 * Every public entry point into the widget -- the direct `window.
 * renderZcashButton(...)` API, the auto-mount `<script data-*>` path, and
 * (structurally, see the note below) the React/Next.js adapters -- calls
 * the same `renderZcashButton` function, so validating inside it protects
 * all of them at once.
 *
 * Note on the React/Next.js adapters (src/app/[locale]/tools/zcash-payment-
 * widget/adapters/*): on this branch (based on current main, pre-#823) the
 * Next.js adapter still drops `memo`/`zecUsdRate` before #823 fixes that,
 * so it can't carry a hostile memo to the embed at all yet. The React
 * adapter already forwards `memo` and calls `window.renderZcashButton`
 * with the exact opts shape simulated below, so protection there is
 * already real. Re-run this suite after the branch is rebased onto the
 * merged #823 to confirm the Next.js adapter path too.
 *
 * Also note: this branch is based on pre-#817 main, so `open()` still
 * builds its modal via `innerHTML` (the HTML-injection issue #817 fixes
 * separately). This suite does not assert XSS-safety of that markup --
 * that is #817's responsibility -- only that this PR's own additions
 * (encodeZip321MemoLocal, openError) never interpolate attacker-controlled
 * text unsafely. Re-verify end-to-end once rebased onto merged #817.
 */

const EMBED_SCRIPT_PATH = path.join(
  process.cwd(),
  "public",
  "zcash-payment-request-widget.embed.v2.js",
);
const EMBED_SOURCE = fs.readFileSync(EMBED_SCRIPT_PATH, "utf8");

const SHIELDED = "zs1znewaqucqpc372x6ajmfnmkmxsafnc3fuxmg6g5kq3mkvkv8ufx9hgx9vgcrqncqm3umz56a7pd";
const TRANSPARENT = "t1VpMigELggqi6TBghQNehqspAcBBDYvRQC";

function makeWindow() {
  const dom = new JSDOM(`<!doctype html><body><div id="t"></div></body>`, {
    runScripts: "outside-only",
    url: "https://merchant.example/",
  });
  const w = dom.window as unknown as Window & {
    renderZcashButton: (selector: string, opts: Record<string, unknown>) => Promise<unknown>;
  };
  (w as unknown as { fetch: unknown }).fetch = jest.fn().mockResolvedValue({
    json: async () => ({}),
  });
  // jsdom's window does not itself provide TextEncoder/TextDecoder; forward
  // the real ones from this (Node) test environment.
  (w as unknown as { TextEncoder: unknown }).TextEncoder = TextEncoder;
  (w as unknown as { TextDecoder: unknown }).TextDecoder = TextDecoder;
  w.eval(EMBED_SOURCE);
  return { dom, w };
}

describe("standalone embed: ZIP-321 validation at every entry point", () => {
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    errorSpy.mockRestore();
  });

  it("12. direct window.renderZcashButton(...) rejects an oversized memo and renders no button", async () => {
    const { w } = makeWindow();
    const inst = await w.renderZcashButton("#t", {
      address: SHIELDED,
      amount: 1,
      memo: "a".repeat(600),
    });
    expect(inst).toBeFalsy();
    expect(w.document.querySelector(".zwg-btn")).toBeNull();
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining("Invalid memo"),
      expect.stringContaining("512-byte limit"),
    );
  });

  it("12b. direct call rejects a memo on a transparent address", async () => {
    const { w } = makeWindow();
    const inst = await w.renderZcashButton("#t", {
      address: TRANSPARENT,
      amount: 1,
      memo: "order #123",
    });
    expect(inst).toBeFalsy();
    expect(w.document.querySelector(".zwg-btn")).toBeNull();
  });

  it("12c. direct call rejects an invalid amount", async () => {
    const { w } = makeWindow();
    const inst = await w.renderZcashButton("#t", { address: SHIELDED, amount: "not-a-number" });
    expect(inst).toBeFalsy();
    expect(w.document.querySelector(".zwg-btn")).toBeNull();
  });

  it("17. a fully valid request still renders and produces a correct, base64url-memo ZIP-321 URI", async () => {
    const { w } = makeWindow();
    const inst = await w.renderZcashButton("#t", {
      address: SHIELDED,
      amount: 1.5,
      zecUsdRate: 1,
      memo: "Thanks for your order!",
    }) as { open: () => void };

    expect(w.document.querySelector(".zwg-btn")).not.toBeNull();
    inst.open();

    const uriInput = w.document.querySelector<HTMLInputElement>(".zwg-fld-inp")!;
    const uri = uriInput.value;
    expect(uri).toBe(`zcash:${SHIELDED}?amount=1.5&memo=VGhhbmtzIGZvciB5b3VyIG9yZGVyIQ`);
    expect(uri).not.toContain("%20"); // not percent-encoded
    expect(uri.split("memo=")[1]).toMatch(/^[A-Za-z0-9_-]+$/); // valid base64url alphabet
  });

  it("13. auto-mount data-memo is rejected the same way as the programmatic path", async () => {
    const dom = new JSDOM(
      `<!doctype html><body>
        <div id="auto-target"></div>
        <script id="w" data-target="#auto-target" data-address="${SHIELDED}" data-amount="1" data-memo="${"a".repeat(600)}"></script>
      </body></html>`,
      { runScripts: "dangerously", url: "https://merchant.example/" },
    );
    const w = dom.window as unknown as Window;
    (w as unknown as { fetch: unknown }).fetch = jest.fn().mockResolvedValue({ json: async () => ({}) });
    (w as unknown as { TextEncoder: unknown }).TextEncoder = TextEncoder;
    (w as unknown as { TextDecoder: unknown }).TextDecoder = TextDecoder;
    // Pre-existing, separate bug on main (unrelated to this change): the
    // auto-mount block references a bare, undeclared `zecUsdRate` global
    // (`zecUsdRate || script.dataset.zecUsdRate`), which throws a
    // ReferenceError before reaching any of this PR's validation. Declare
    // it here only so the auto-mount path can be exercised in isolation;
    // this does not paper over the bug in production code.
    (w as unknown as { zecUsdRate: unknown }).zecUsdRate = undefined;

    const scriptEl = w.document.getElementById("w") as HTMLScriptElement;
    scriptEl.textContent = EMBED_SOURCE;
    // Re-execute the now-populated inline script as jsdom would for a real
    // <script src> tag, with document.currentScript correctly set.
    const evaluated = new (w as unknown as { Function: FunctionConstructor }).Function(EMBED_SOURCE);
    Object.defineProperty(w.document, "currentScript", { value: scriptEl, configurable: true });
    evaluated.call(w);

    await new Promise((r) => setTimeout(r, 0));
    expect(w.document.querySelector("#auto-target .zwg-btn")).toBeNull();
  });

  it("13b. auto-mount data-memo within limits still renders", async () => {
    const dom = new JSDOM(
      `<!doctype html><body>
        <div id="auto-target"></div>
        <script id="w" data-target="#auto-target" data-address="${SHIELDED}" data-amount="1" data-memo="short note"></script>
      </body></html>`,
      { runScripts: "dangerously", url: "https://merchant.example/" },
    );
    const w = dom.window as unknown as Window;
    (w as unknown as { fetch: unknown }).fetch = jest.fn().mockResolvedValue({ json: async () => ({}) });
    (w as unknown as { TextEncoder: unknown }).TextEncoder = TextEncoder;
    (w as unknown as { TextDecoder: unknown }).TextDecoder = TextDecoder;
    // See the note in the previous test: pre-existing, unrelated bug.
    (w as unknown as { zecUsdRate: unknown }).zecUsdRate = undefined;

    const scriptEl = w.document.getElementById("w") as HTMLScriptElement;
    const evaluated = new (w as unknown as { Function: FunctionConstructor }).Function(EMBED_SOURCE);
    Object.defineProperty(w.document, "currentScript", { value: scriptEl, configurable: true });
    evaluated.call(w);

    await new Promise((r) => setTimeout(r, 0));
    expect(w.document.querySelector("#auto-target .zwg-btn")).not.toBeNull();
  });

  it("14/15. an adapter-shaped opts object (matching what ZcashPaymentURI / ZcashPaymentURINextJs pass through) is validated identically", async () => {
    const { w } = makeWindow();
    // This is exactly the opts shape adapters/react/index.tsx builds:
    // { address, amount, zecUsdRate, label, theme, memo, apiBase, disabled, target }
    const adapterOpts = {
      address: SHIELDED,
      amount: 1,
      zecUsdRate: undefined,
      label: "Coffee",
      theme: "light",
      memo: "a".repeat(600),
      apiBase: "https://x",
      disabled: false,
      target: "#t",
    };
    const inst = await w.renderZcashButton("#t", adapterOpts);
    expect(inst).toBeFalsy();
    expect(w.document.querySelector(".zwg-btn")).toBeNull();
  });

  it("gracefully handles a synchronous failure while opening the modal instead of throwing to the caller", async () => {
    const { w } = makeWindow();
    const inst = await w.renderZcashButton("#t", {
      address: SHIELDED,
      amount: 1,
      memo: "hi",
    }) as { open: () => void; close: () => void };

    // jsdom's window has its own realm/intrinsics, so both the Date to
    // patch and the RangeError thrown must be w's own (not the outer Node
    // test environment's), or isQrCapacityError's `instanceof` check
    // (evaluated inside w's realm) would not recognize it.
    const windowDate = (w as unknown as { Date: typeof Date }).Date;
    const WindowRangeError = (w as unknown as { RangeError: typeof RangeError }).RangeError;
    const originalGetFullYear = windowDate.prototype.getFullYear;
    // Simulate an unexpected failure while building the modal (standing in
    // for the vendored QR encoder's RangeError once client-side QR lands).
    windowDate.prototype.getFullYear = () => {
      throw new WindowRangeError("Data too long");
    };

    try {
      expect(() => inst.open()).not.toThrow();
    } finally {
      windowDate.prototype.getFullYear = originalGetFullYear;
    }

    const overlay = w.document.querySelector(".zwg-overlay");
    expect(overlay).not.toBeNull();
    // The failure message is always one of our own static strings, never
    // interpolated attacker-controlled content (e.g. the "hi" memo above).
    expect(overlay!.querySelector(".zwg-label")!.textContent).toBe(
      "This payment request is too large to display as a QR code. Try a shorter memo.",
    );

    inst.close();
    expect(w.document.querySelector(".zwg-overlay")).toBeNull();

    // A subsequent successful open (no injected failure) still works.
    inst.open();
    expect(w.document.querySelector(".zwg-fld-inp")).not.toBeNull();
  });
});

import fs from "fs";
import path from "path";

/**
 * Regression tests for HTML injection in the embeddable payment widget.
 * Loads the real public/zcash-payment-request-widget.embed.v2.js into jsdom
 * and feeds it hostile host-supplied values and API responses, asserting
 * they are rendered strictly as data (text nodes / properties) and never
 * parsed as markup.
 */

const EMBED_SCRIPT_PATH = path.join(
  process.cwd(),
  "public",
  "zcash-payment-request-widget.embed.v2.js",
);

const HOSTILE_SELECTOR =
  "[onerror],[onmouseover],[onload],[onclick],script,#injected";

type WidgetInstance = {
  open: () => void;
  close: () => void;
  destroy: () => void;
};

type RenderFn = (
  selector: string,
  opts: Record<string, unknown>,
) => Promise<WidgetInstance | null | undefined>;

function renderZcashButton(): RenderFn {
  return (window as unknown as { renderZcashButton: RenderFn })
    .renderZcashButton;
}

async function render(opts: Record<string, unknown>) {
  document.body.innerHTML = '<div id="target"></div>';
  const inst = await renderZcashButton()("#target", {
    amount: 1,
    zecUsdRate: 1,
    apiBase: "https://zechub.wiki/api",
    ...opts,
  });
  if (!inst) throw new Error("widget did not render");
  return inst;
}

function overlay(): HTMLElement {
  const node = document.querySelector<HTMLElement>(".zwg-overlay");
  if (!node) throw new Error("overlay not open");
  return node;
}

const flush = () => new Promise((r) => setTimeout(r, 0));

beforeAll(() => {
  const source = fs.readFileSync(EMBED_SCRIPT_PATH, "utf8");
  // eslint-disable-next-line no-new-func
  new Function(source)();
});

beforeEach(() => {
  (global as unknown as { fetch: unknown }).fetch = jest.fn();
});

describe("zcash-payment-request-widget.embed.v2.js DOM construction", () => {
  it("renders a label containing markup as text on the trigger button and modal title", async () => {
    const label = 'Pay <img src=x onerror=alert(1)> <script id="injected"></script>';
    const inst = await render({ address: "t1VpMigELggqi6TBghQNehqspAcBBDYvRQC", label });

    const btn = document.querySelector<HTMLElement>(".zwg-btn")!;
    expect(btn.querySelector("span")!.textContent).toBe(label);
    expect(btn.querySelector(HOSTILE_SELECTOR)).toBeNull();
    expect(btn.querySelector("svg")).not.toBeNull();

    inst.open();
    expect(overlay().querySelector(".zwg-title")!.textContent).toBe(label);
    expect(overlay().querySelector(HOSTILE_SELECTOR)).toBeNull();
  });

  it("renders a memo containing markup as text", async () => {
    const memo = 'note <b id="injected">bold</b><img src=x onerror=alert(2)>';
    const inst = await render({
      address: "zs1znewaqucqpc372x6ajmfnmkmxsafnc3fuxmg6g5kq3mkvkv8ufx9hgx9vgcrqncqm3umz56a7pd",
      memo,
    });
    inst.open();

    expect(overlay().querySelector(".zwg-memo")!.textContent).toBe(memo);
    expect(overlay().querySelector(HOSTILE_SELECTOR)).toBeNull();
    expect(overlay().querySelectorAll("img")).toHaveLength(1); // only the QR image
  });

  it("keeps an address with quotes intact and blocks attribute injection", async () => {
    const address = 't1abc" onmouseover="alert(1)';
    const inst = await render({ address });
    inst.open();

    const uri = `zcash:${address}?amount=1`;
    const copyButtons = overlay().querySelectorAll<HTMLElement>(".zwg-copy");

    expect(overlay().querySelector(".zwg-fld-txt")!.textContent).toBe(address);
    expect(copyButtons[0].dataset.c).toBe(address);
    expect(copyButtons[1].dataset.c).toBe(uri);
    expect(overlay().querySelector<HTMLInputElement>(".zwg-fld-inp")!.value).toBe(uri);
    expect(overlay().querySelector(".zwg-link")!.getAttribute("href")).toBe(uri);
    expect(overlay().querySelector(HOSTILE_SELECTOR)).toBeNull();
  });

  it("treats a hostile shortUrl API response as data", async () => {
    const shortUrl = '"><img src=x onerror=alert(1)><b id="injected">x</b>';
    (global as unknown as { fetch: jest.Mock }).fetch.mockResolvedValue({
      json: async () => ({ shortUrl }),
    });

    const inst = await render({ address: "t1VpMigELggqi6TBghQNehqspAcBBDYvRQC" });
    inst.open();
    overlay().querySelector<HTMLButtonElement>(".zwg-short")!.click();
    await flush();
    await flush();

    const inputs = overlay().querySelectorAll<HTMLInputElement>(".zwg-fld-inp");
    const copyButtons = overlay().querySelectorAll<HTMLElement>(".zwg-copy");
    expect(inputs).toHaveLength(2);
    expect(inputs[1].value).toBe(shortUrl);
    expect(copyButtons[copyButtons.length - 1].dataset.c).toBe(shortUrl);
    expect(overlay().querySelector(HOSTILE_SELECTOR)).toBeNull();
    expect(overlay().querySelectorAll("img")).toHaveLength(1);
  });

  it("still renders and behaves normally for legitimate values", async () => {
    const address = "t1VpMigELggqi6TBghQNehqspAcBBDYvRQC";
    const inst = await render({
      address,
      amount: 1.5,
      zecUsdRate: 2,
      label: "Coffee",
      memo: "Thanks!",
      theme: "dark",
    });

    expect(document.querySelector(".zwg-btn span")!.textContent).toBe("Coffee");

    inst.open();
    const modal = overlay().querySelector(".zwg-modal")!;
    expect(modal.classList.contains("zwg-dark")).toBe(true);
    expect(modal.querySelector(".zwg-x")!.getAttribute("aria-label")).toBe("Close");
    expect(modal.querySelector(".zwg-amt-val b")!.textContent).toBe("1.500");
    expect(modal.querySelector(".zwg-amt-val small")!.textContent).toBe("ZEC");
    expect(modal.querySelector(".zwg-amt")!.textContent).toContain("≈ $3.00 USD");
    expect(modal.querySelector(".zwg-fld-txt")!.textContent).toBe(address);
    expect(modal.querySelector(".zwg-memo")!.textContent).toBe("Thanks!");
    expect(modal.querySelector<HTMLInputElement>(".zwg-fld-inp")!.readOnly).toBe(true);
    expect(modal.querySelector<HTMLInputElement>(".zwg-fld-inp")!.value).toBe(
      `zcash:${address}?amount=1.5&memo=Thanks!`,
    );
    expect(modal.querySelector<HTMLImageElement>(".zwg-qr img")!.getAttribute("src")).toContain(
      "/payment-request-uri/qrcode?data=",
    );
    expect(modal.querySelector(".zwg-footer")!.textContent).toContain("Pay with Zcash");

    modal.querySelector<HTMLButtonElement>(".zwg-close")!.click();
    expect(document.querySelector(".zwg-overlay")).toBeNull();

    inst.open();
    expect(document.querySelector(".zwg-overlay")).not.toBeNull();
    overlay().querySelector<HTMLButtonElement>(".zwg-x")!.click();
    expect(document.querySelector(".zwg-overlay")).toBeNull();

    inst.destroy();
    expect(document.querySelector(".zwg-btn")).toBeNull();
  });

  it("omits the memo block when no memo is given", async () => {
    const inst = await render({ address: "t1VpMigELggqi6TBghQNehqspAcBBDYvRQC" });
    inst.open();
    expect(overlay().querySelector(".zwg-memo")).toBeNull();
  });
});

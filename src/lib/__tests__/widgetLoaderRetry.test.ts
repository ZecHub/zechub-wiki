/**
 * @jest-environment jsdom
 */
// loadZcashPaymentUriWidget backs the React adapter and the configurator
// preview. After one failed script load it used to keep the rejected promise,
// so the automatic retries and the adapter's Retry button could never succeed.

const SRC = "https://zechub.wiki/zcash-payment-request-widget.embed.v2.js";

type Loader = typeof import("@/app/[locale]/tools/zcash-payment-widget/adapters/helpers");

async function freshLoader(): Promise<Loader> {
  jest.resetModules();
  return import("@/app/[locale]/tools/zcash-payment-widget/adapters/helpers");
}

const scripts = () =>
  Array.from(document.querySelectorAll<HTMLScriptElement>("script")).filter((s) => s.src === SRC);

describe("widget script loader", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    delete (window as unknown as { renderZcashButton?: unknown }).renderZcashButton;
  });

  it("tries again after a failed load instead of repeating the old failure", async () => {
    const { loadZcashPaymentUriWidget } = await freshLoader();

    const first = loadZcashPaymentUriWidget(SRC);
    expect(scripts()).toHaveLength(1);
    scripts()[0].dispatchEvent(new Event("error"));
    await expect(first).rejects.toBeTruthy();

    // The failed tag is gone, and a retry inserts a new one.
    const second = loadZcashPaymentUriWidget(SRC);
    expect(scripts()).toHaveLength(1);
    (window as unknown as { renderZcashButton: () => void }).renderZcashButton = () => {};
    scripts()[0].dispatchEvent(new Event("load"));
    await expect(second).resolves.toBeUndefined();
  });

  it("shares one pending load between concurrent callers", async () => {
    const { loadZcashPaymentUriWidget } = await freshLoader();

    const a = loadZcashPaymentUriWidget(SRC);
    const b = loadZcashPaymentUriWidget(SRC);
    expect(scripts()).toHaveLength(1);
    scripts()[0].dispatchEvent(new Event("load"));
    await expect(Promise.all([a, b])).resolves.toEqual([undefined, undefined]);
  });

  it("reuses a matching <script> already on the page", async () => {
    const tag = document.createElement("script");
    tag.src = SRC;
    document.body.appendChild(tag);
    const { loadZcashPaymentUriWidget } = await freshLoader();

    const load = loadZcashPaymentUriWidget(SRC);
    expect(scripts()).toHaveLength(1);
    tag.dispatchEvent(new Event("load"));
    await expect(load).resolves.toBeUndefined();
  });
});

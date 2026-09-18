import fs from "fs";
import path from "path";

/**
 * Accessibility regression tests for the embeddable payment widget's
 * modal, run against the real public/zcash-payment-request-widget.embed.v2.js
 * in jsdom. jsdom has no native sequential focus navigation, so Tab
 * handling is verified by dispatching keydown events and asserting the
 * widget's handler moved focus (which is exactly what it does in browsers).
 */

const EMBED_SCRIPT_PATH = path.join(
  process.cwd(),
  "public",
  "zcash-payment-request-widget.embed.v2.js",
);

type WidgetInstance = {
  open: () => void;
  close: () => void;
  destroy: () => void;
};

type RenderFn = (
  selector: string,
  opts: Record<string, unknown>,
) => Promise<WidgetInstance | null | undefined>;

async function render(opts: Record<string, unknown> = {}) {
  document.body.innerHTML =
    '<button id="before">before</button><div id="target"></div><button id="after">after</button>';
  const fn = (window as unknown as { renderZcashButton: RenderFn })
    .renderZcashButton;
  const inst = await fn("#target", {
    address: "t1VpMigELggqi6TBghQNehqspAcBBDYvRQC",
    amount: 1,
    zecUsdRate: 1,
    label: "Coffee",
    apiBase: "https://zechub.wiki/api",
    ...opts,
  });
  if (!inst) throw new Error("widget did not render");
  return inst;
}

const overlay = () => document.querySelector<HTMLElement>(".zwg-overlay");
const modal = () => document.querySelector<HTMLElement>(".zwg-modal")!;
const trigger = () => document.querySelector<HTMLButtonElement>(".zwg-btn")!;

function key(name: string, opts: KeyboardEventInit = {}) {
  const e = new KeyboardEvent("keydown", {
    key: name,
    bubbles: true,
    cancelable: true,
    ...opts,
  });
  (document.activeElement || document.body).dispatchEvent(e);
  return e;
}

const focusablesInDialog = () =>
  Array.from(
    overlay()!.querySelectorAll<HTMLElement>(
      'a[href],button,input,[tabindex]:not([tabindex="-1"])',
    ),
  );

beforeAll(() => {
  const source = fs.readFileSync(EMBED_SCRIPT_PATH, "utf8");
  // eslint-disable-next-line no-new-func
  new Function(source)();
});

beforeEach(() => {
  (global as unknown as { fetch: unknown }).fetch = jest.fn();
});

describe("embed widget dialog accessibility", () => {
  it("exposes dialog semantics with an accessible name from the title", async () => {
    const inst = await render();
    expect(trigger().getAttribute("aria-haspopup")).toBe("dialog");
    expect(trigger().querySelector("svg")!.getAttribute("aria-hidden")).toBe("true");

    inst.open();
    const m = modal();
    expect(m.getAttribute("role")).toBe("dialog");
    expect(m.getAttribute("aria-modal")).toBe("true");
    expect(m.tabIndex).toBe(-1);

    const titleId = m.getAttribute("aria-labelledby");
    expect(titleId).toBeTruthy();
    expect(document.getElementById(titleId!)!.textContent).toBe("Coffee");
    inst.close();
  });

  it("uses unique title ids across multiple widget instances", async () => {
    const a = await render();
    a.open();
    const idA = modal().getAttribute("aria-labelledby");
    a.close();

    document.body.insertAdjacentHTML("beforeend", '<div id="target2"></div>');
    const fn = (window as unknown as { renderZcashButton: RenderFn })
      .renderZcashButton;
    const b = (await fn("#target2", {
      address: "t1VpMigELggqi6TBghQNehqspAcBBDYvRQC",
      amount: 1,
      zecUsdRate: 1,
      label: "Tea",
    }))!;
    b.open();
    expect(modal().getAttribute("aria-labelledby")).not.toBe(idA);
    b.close();
  });

  it("labels the copy buttons and hides decorative icons", async () => {
    const inst = await render();
    inst.open();
    const copies = overlay()!.querySelectorAll(".zwg-copy");
    expect(copies[0].getAttribute("aria-label")).toBe("Copy address");
    expect(copies[1].getAttribute("aria-label")).toBe("Copy payment URI");
    overlay()!
      .querySelectorAll("svg")
      .forEach((s) => expect(s.getAttribute("aria-hidden")).toBe("true"));
    inst.close();
  });

  it("labels the dynamically created short-URL copy button", async () => {
    (global as unknown as { fetch: jest.Mock }).fetch.mockResolvedValue({
      json: async () => ({ shortUrl: "https://zechub.wiki/s/abc" }),
    });
    const inst = await render();
    inst.open();
    overlay()!.querySelector<HTMLButtonElement>(".zwg-short")!.click();
    await new Promise((r) => setTimeout(r, 0));
    await new Promise((r) => setTimeout(r, 0));

    const copies = overlay()!.querySelectorAll(".zwg-copy");
    expect(copies[copies.length - 1].getAttribute("aria-label")).toBe(
      "Copy short URL",
    );
    inst.close();
  });

  it("moves focus into the dialog on open and restores it to the trigger on close", async () => {
    const inst = await render();
    trigger().focus();
    trigger().click();

    expect(overlay()).not.toBeNull();
    expect(overlay()!.contains(document.activeElement)).toBe(true);
    expect(document.activeElement).toBe(modal());

    key("Escape");
    expect(overlay()).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });

  it("restores focus to whatever element opened it programmatically", async () => {
    const inst = await render();
    const before = document.getElementById("before")!;
    before.focus();
    inst.open();
    expect(document.activeElement).toBe(modal());
    inst.close();
    expect(document.activeElement).toBe(before);
  });

  it("restores focus when closed via the × button and via backdrop click", async () => {
    const inst = await render();
    trigger().focus();
    inst.open();
    overlay()!.querySelector<HTMLButtonElement>(".zwg-x")!.click();
    expect(overlay()).toBeNull();
    expect(document.activeElement).toBe(trigger());

    inst.open();
    overlay()!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(overlay()).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });

  it("traps Tab and Shift+Tab inside the dialog", async () => {
    const inst = await render();
    inst.open();
    const items = focusablesInDialog();
    const first = items[0];
    const last = items[items.length - 1];
    expect(items.length).toBeGreaterThan(2);

    // Forward Tab from the container goes to the first focusable.
    let e = key("Tab");
    expect(e.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(first);

    // Tab from the last element wraps to the first.
    last.focus();
    e = key("Tab");
    expect(e.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(first);

    // Shift+Tab from the first element wraps to the last.
    e = key("Tab", { shiftKey: true });
    expect(e.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(last);

    // Tab in the middle is left to the browser.
    items[1].focus();
    e = key("Tab");
    expect(e.defaultPrevented).toBe(false);

    inst.close();
  });

  it("pulls focus back when it lands outside the dialog", async () => {
    const inst = await render();
    inst.open();
    const after = document.getElementById("after")!;
    after.focus();
    expect(overlay()!.contains(document.activeElement)).toBe(true);
    inst.close();
  });

  it("keeps focus on the container when there are no focusable descendants", async () => {
    const inst = await render();
    inst.open();
    focusablesInDialog().forEach((n) => n.setAttribute("disabled", ""));
    modal().focus();
    const e = key("Tab");
    expect(e.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(modal());
    inst.close();
  });

  it("removes document listeners on close so the host page is not trapped", async () => {
    const inst = await render();
    inst.open();
    inst.close();

    const after = document.getElementById("after")!;
    after.focus();
    expect(document.activeElement).toBe(after);

    const tab = key("Tab");
    expect(tab.defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(after);
    const esc = key("Escape");
    expect(esc.defaultPrevented).toBe(false);
  });

  it("handles repeated open/close cycles and destroy while open", async () => {
    const inst = await render();
    for (let i = 0; i < 3; i++) {
      trigger().focus();
      inst.open();
      expect(document.activeElement).toBe(modal());
      key("Escape");
      expect(overlay()).toBeNull();
      expect(document.activeElement).toBe(trigger());
    }

    inst.open();
    expect(() => inst.destroy()).not.toThrow();
    expect(overlay()).toBeNull();
    expect(document.querySelector(".zwg-btn")).toBeNull();

    const after = document.getElementById("after")!;
    after.focus();
    expect(key("Tab").defaultPrevented).toBe(false);
  });

  it("still closes on backdrop click but not on clicks inside the panel", async () => {
    const inst = await render();
    inst.open();
    modal().dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(overlay()).not.toBeNull();
    overlay()!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(overlay()).toBeNull();
  });
});

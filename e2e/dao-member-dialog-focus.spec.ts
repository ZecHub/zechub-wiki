import { ElementHandle, expect, Locator, Page, test } from "@playwright/test";

// The site removes focus outlines (globals.css), so the DAO member dialog draws
// its own focus ring on the controls that have no other focus style: the
// close icon on both faces and the Close and Message buttons. This opens
// Blakiat's Read More dialog from the keyboard and, for each of those controls,
// compares the page as rendered while the control is focused and after it is
// blurred. The ring must change at least a one-pixel band around the whole
// control by 3:1 or more, in both appearances. Nothing is restyled to measure.
//
// In WebKit only the computed ring is checked: WebKit paints screenshots
// separately from the window and skips backface-visibility there, so they show
// the dialog's turned-away face over the shown one, which the window does not.
// Uses the configured baseURL (`yarn dev`, or `yarn build && yarn start`).

// Instant transitions, so the ring is measured at full strength.
test.use({ reducedMotion: "reduce" });

/** Let the dialog's animations (entrance, flip, ring) finish. */
async function settle(dialog: Locator) {
  await dialog.evaluate((el) =>
    Promise.all(el.getAnimations({ subtree: true }).map((a) => a.finished)),
  );
}

/** Pixels around the control whose colour changes by 3:1 or more on blur. */
async function ringPixels(
  page: Page,
  dialog: Locator,
  control: ElementHandle<HTMLElement>,
) {
  const box = (await control.boundingBox())!;
  const pad = 4;
  const clip = {
    x: box.x - pad,
    y: box.y - pad,
    width: box.width + 2 * pad,
    height: box.height + 2 * pad,
  };
  const shot = () =>
    page.screenshot({ clip, scale: "css", animations: "disabled" });
  const focused = await shot();
  await control.evaluate((el) => el.blur());
  await settle(dialog);
  const blurred = await shot();
  await control.focus();

  const changed = await page.evaluate(
    async ([a, b]) => {
      const pixels = async (src: string) => {
        const image = new Image();
        image.src = src;
        await image.decode();
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
        ctx.drawImage(image, 0, 0);
        return ctx.getImageData(0, 0, image.width, image.height).data;
      };
      const [on, off] = await Promise.all([pixels(a), pixels(b)]);
      const channel = (v: number) => {
        const c = v / 255;
        return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
      };
      const luminance = (d: Uint8ClampedArray, i: number) =>
        0.2126 * channel(d[i]) +
        0.7152 * channel(d[i + 1]) +
        0.0722 * channel(d[i + 2]);
      let count = 0;
      for (let i = 0; i < on.length; i += 4) {
        const l1 = luminance(on, i);
        const l2 = luminance(off, i);
        if ((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05) >= 3) count++;
      }
      return count;
    },
    [focused, blurred].map(
      (png) => `data:image/png;base64,${png.toString("base64")}`,
    ),
  );
  return { changed, perimeter: Math.round(2 * (box.width + box.height)) };
}

/** Whether a computed box-shadow holds a visible ring (a spread-only shadow). */
const hasRing = (shadow: string) =>
  (shadow.match(/[a-z]+\([^)]*\) 0px 0px 0px [1-9]\d*(\.\d+)?px/g) ?? []).some(
    (ring) => !/^rgba\([^)]*,\s*0\)/.test(ring),
  );

async function expectRing(
  page: Page,
  dialog: Locator,
  label: string,
  browserName: string,
) {
  await settle(dialog);
  await expect(page.locator(":focus")).toHaveCount(1);
  // A fixed handle: once blurred, the control no longer matches :focus.
  const control = (await page
    .locator(":focus")
    .elementHandle()) as ElementHandle<HTMLElement>;
  expect(await control.evaluate((el) => el.matches(":focus-visible"))).toBe(
    true,
  );
  if (browserName === "webkit") {
    const shadow = (el: HTMLElement) => getComputedStyle(el).boxShadow;
    expect(hasRing(await control.evaluate(shadow)), `${label}: ring`).toBe(
      true,
    );
    await control.evaluate((el) => el.blur());
    await settle(dialog);
    expect(
      hasRing(await control.evaluate(shadow)),
      `${label}: no ring once blurred`,
    ).toBe(false);
    await control.focus();
    return;
  }
  const { changed, perimeter } = await ringPixels(page, dialog, control);
  expect(
    changed,
    `${label}: the ring changes ${changed} pixels by 3:1, needs ${perimeter}`,
  ).toBeGreaterThanOrEqual(perimeter);
}

for (const appearance of ["light", "dark"] as const) {
  test(`dialog controls show a focus ring in ${appearance} appearance`, async ({
    page,
    browserName,
  }) => {
    // next-themes keeps the choice in localStorage and sets the class on <html>.
    await page.addInitScript((theme) => {
      localStorage.setItem("theme", theme);
    }, appearance);
    await page.goto("/dao");
    await expect(page.locator("html")).toHaveClass(
      new RegExp(`\\b${appearance}\\b`),
    );

    const card = page
      .locator("h3", { hasText: /^Blakiat$/ })
      .first()
      .locator("xpath=ancestor::div[contains(@class,'min-h-[400px]')][1]");
    await card.getByRole("button", { name: "Read More" }).focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog", { name: "Blakiat" });
    await expect(dialog).toBeVisible();

    // Radix moves focus to the close icon when the dialog opens.
    const closeIcon = dialog.getByRole("button", { name: "Close modal" });
    await expect(closeIcon).toBeFocused();
    await expectRing(page, dialog, "close icon", browserName);
    // Move on with focus() rather than Tab: WebKit's default Tab skips buttons.
    // After a key press, focus moved by script still counts as :focus-visible.
    for (const name of ["Close", "Message"]) {
      await dialog.getByRole("button", { name, exact: true }).focus();
      await expectRing(page, dialog, name, browserName);
    }

    // Enter on Message turns to the message face and focuses the message box;
    // the face turned away is hidden, so closeIcon is now this face's icon.
    await page.keyboard.press("Enter");
    await expect(dialog.getByPlaceholder("Type your message...")).toBeFocused();
    await closeIcon.focus();
    await expectRing(page, dialog, "message-face close icon", browserName);
  });
}

import { expect, Locator, Page, test } from "@playwright/test";

// In the dark theme the archive's text is light, and a row turns yellow under
// the pointer. Light text on that yellow is unreadable (the date measured
// 1.36:1), so a hovered row has to switch to dark text. This reads the colours
// the browser renders, at rest, with the pointer on a row and with the pointer
// on each of its links, and checks WCAG AA: 4.5:1, as all of it is small text.
// A class name check cannot see this: it depends on which hover rule wins.

type Reading = { label: string; ratio: number };

/**
 * Contrast of the element's text colour against what is painted behind it: the
 * background colours of the element and its ancestors, composited onto the
 * first opaque one. A canvas does the colour conversion and compositing.
 */
async function measure(target: Locator, label: string): Promise<Reading> {
  const ratio = await target.evaluate((el) => {
    const ctx = document
      .createElement("canvas")
      .getContext("2d", { willReadFrequently: true })!;
    const pixel = (colours: string[]) => {
      ctx.clearRect(0, 0, 1, 1);
      for (const colour of colours) {
        ctx.fillStyle = colour;
        ctx.fillRect(0, 0, 1, 1);
      }
      return Array.from(ctx.getImageData(0, 0, 1, 1).data);
    };
    const layers: string[] = [];
    for (let node: Element | null = el; node; node = node.parentElement) {
      const background = getComputedStyle(node).backgroundColor;
      const alpha = pixel([background])[3];
      if (alpha > 0) layers.unshift(background);
      if (alpha === 255) break;
    }
    const luminance = (colours: string[]) => {
      const [r, g, b] = pixel(["#fff", ...colours])
        .slice(0, 3)
        .map((v) => {
          const c = v / 255;
          return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
        });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const back = luminance(layers);
    const front = luminance([...layers, getComputedStyle(el).color]);
    return (Math.max(back, front) + 0.05) / (Math.min(back, front) + 0.05);
  });
  return { label, ratio: Math.round(ratio * 100) / 100 };
}

function expectReadable(readings: Reading[]) {
  const failing = readings
    .filter((r) => r.ratio < 4.5)
    .map((r) => `${r.label}: ${r.ratio}:1, needs 4.5:1`);
  expect(failing).toEqual([]);
}

// The row and its links fade between colours; measure once they have settled.
async function settle(row: Locator) {
  await row.evaluate((el) =>
    Promise.all(
      el
        .getAnimations({ subtree: true })
        .map((animation) => animation.finished.catch(() => undefined)),
    ),
  );
}

async function readRow(page: Page, row: Locator) {
  await row.scrollIntoViewIfNeeded();
  const cells = row.locator("td");
  const texts: [string, Locator][] = [
    ["call number", cells.nth(0)],
    ["date", cells.nth(1)],
    ["status", cells.nth(2).locator("[data-slot=badge]")],
  ];
  const links = await cells.nth(3).getByRole("button").all();
  for (const link of links) texts.push([(await link.innerText()).trim(), link]);

  const readings: Reading[] = [];
  await page.mouse.move(0, 0);
  await settle(row);
  for (const [name, text] of texts)
    readings.push(await measure(text, `${name} at rest`));

  await cells.nth(1).hover();
  await settle(row);
  for (const [name, text] of texts)
    readings.push(await measure(text, `${name} in the hovered row`));

  for (const link of links) {
    await link.hover();
    await settle(row);
    const name = (await link.innerText()).trim();
    readings.push(await measure(link, `${name} hovered`));
  }
  return readings;
}

test.describe("Arborist call archive in the dark theme", () => {
  test.beforeEach(async ({ page }) => {
    // next-themes keeps the choice in localStorage and sets the class on <html>.
    await page.addInitScript(() => localStorage.setItem("theme", "dark"));
    await page.goto("/arborist-calls");
    await expect(page.locator("html")).toHaveClass(/\bdark\b/);
  });

  test("the newest call stays readable when hovered", async ({ page }) => {
    const row = page.locator("tbody tr").first();
    await expect(row).toBeVisible();

    expectReadable(await readRow(page, row));
  });

  test("a call with every kind of link stays readable when hovered", async ({
    page,
  }) => {
    let row = page.locator("tbody tr");
    for (const name of ["Notes", "Video", "Twitter", "Agenda"])
      row = row.filter({
        has: page.getByRole("button", { name, exact: true }),
      });
    await expect(row.first()).toBeVisible();

    expectReadable(await readRow(page, row.first()));
  });
});

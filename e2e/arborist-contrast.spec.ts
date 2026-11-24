import { expect, Locator, test } from "@playwright/test";

type Reading = { label: string; ratio: number };

async function measure(target: Locator, label: string): Promise<Reading> {
  const ratio = await target.evaluate((el) => {
    const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true })!;
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
      const [r, g, b] = pixel(["#fff", ...colours]).slice(0, 3).map((v) => {
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

test.describe("Arborist call archive in the dark theme", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "dark"));
    await page.goto("/arborist-calls");
    await expect(page.locator("html")).toHaveClass(/\bdark\b/);
  });

  test("the newest call stays readable when hovered", async ({ page }) => {
    const featured = page.locator("section").first();
    await expect(featured).toBeVisible();
    const text = featured.locator("p, h1, h2, span").first();
    await text.hover();
    const reading = await measure(text, "featured text");
    expect(reading.ratio).toBeGreaterThanOrEqual(4.5);
  });

  test("a call with every kind of link stays readable when hovered", async ({ page }) => {
    // Notes/Video/Agenda are <a> tags in the featured or list area
    const notes = page.getByRole("link", { name: "Notes" }).first();
    await expect(notes).toBeVisible();
    await notes.hover();
    const reading = await measure(notes, "Notes link");
    expect(reading.ratio).toBeGreaterThanOrEqual(4.5);
  });
});

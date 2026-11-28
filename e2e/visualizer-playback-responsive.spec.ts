import { expect, test } from "@playwright/test";

const route = "/visualizer?module=privacy-use-cases";

for (const { locale, width } of [
  { locale: "/es", width: 320 },
  { locale: "/ar", width: 390 },
  { locale: "/es", width: 1200 },
]) {
  test(`playback controls fit the lesson at ${width}px ${locale}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${locale}${route}`, { waitUntil: "domcontentloaded" });

    const controls = page
      .getByRole("button", { name: "Restart visualizer", exact: true })
      .locator("..");
    await expect(controls).toBeVisible();
    const start = controls.getByRole("button", { name: "Restart visualizer", exact: true });
    const previous = controls.getByRole("button", { name: "Previous step", exact: true });
    const next = controls.getByRole("button", { name: "Next step", exact: true });
    const play = controls.getByRole("button", { name: "Play visualizer", exact: true });
    await expect(controls.getByText("1 / 5")).toBeVisible();

    const strip = await controls.boundingBox();
    if (!strip) throw new Error("Playback strip is missing");
    for (const button of [start, previous, next, play]) {
      const box = await button.boundingBox();
      if (!box) throw new Error("Playback button is missing");
      expect(box.x).toBeGreaterThanOrEqual(strip.x);
      expect(box.x + box.width).toBeLessThanOrEqual(strip.x + strip.width + 1);
    }

    await expect(previous).toBeDisabled();
    await expect(async () => {
      await next.click();
      await expect(controls.getByText("2 / 5")).toBeVisible({ timeout: 1000 });
    }).toPass({ timeout: 15_000 });
    await previous.click();
    await expect(controls.getByText("1 / 5")).toBeVisible();
    await play.click();
    await controls.getByRole("button", { name: "Pause visualizer", exact: true }).click();
    await next.click();
    await start.click();
    await expect(controls.getByText("1 / 5")).toBeVisible();
  });
}

import { expect, test } from "@playwright/test";

for (const desktopWidth of [1280, 1281, 1530]) {
  test(`mobile drawer releases the page at ${desktopWidth}px`, async ({ page }) => {
    await page.setViewportSize({ width: 1278, height: 900 });
    await page.goto("/");
    const trigger = page.locator('header button[aria-haspopup="dialog"]');
    const dialog = page.getByRole("dialog");
    const bodyStyles = await page.locator("body").evaluate((body) => ({
      pointerEvents: getComputedStyle(body).pointerEvents,
      overflow: getComputedStyle(body).overflow,
    }));

    await trigger.click();
    await expect(dialog).toBeVisible();
    await page.setViewportSize({ width: 1279, height: 900 });
    await expect(dialog).toBeVisible();

    await page.setViewportSize({ width: desktopWidth, height: 900 });
    await expect(trigger).toBeHidden();
    await expect(page.locator("header nav")).toBeVisible();
    await expect(dialog).toHaveCount(0);
    await expect(page.locator("body")).toHaveCSS(
      "pointer-events",
      bodyStyles.pointerEvents,
    );
    await expect(page.locator("body")).toHaveCSS("overflow", bodyStyles.overflow);
    const desktopLink = page.locator("header nav a").first();
    await desktopLink.focus();
    await expect(desktopLink).toBeFocused();
    const more = page.getByRole("button", { name: "More", exact: true });
    await more.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#nav-more-row")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("#nav-more-row")).toBeHidden();

    await page.setViewportSize({ width: 390, height: 900 });
    await expect(trigger).toBeVisible();
    await expect(dialog).toHaveCount(0);
    await trigger.click();
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);

    await trigger.click();
    await expect(dialog).toBeVisible();
    // Keep this check on the same page so navigation cannot hide a stale drawer.
    await page.evaluate(() => {
      document.addEventListener(
        "click",
        (event) => {
          if (
            event.target instanceof Element &&
            event.target.closest('a[href="/dashboard"]')
          ) {
            event.preventDefault();
          }
        },
        { capture: true, once: true },
      );
    });
    await dialog.locator('a[href="/dashboard"]').click();
    await expect(dialog).toHaveCount(0);
  });
}

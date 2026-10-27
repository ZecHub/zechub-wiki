import { expect, test } from "@playwright/test";

for (const desktopWidth of [1280, 1281, 1530]) {
  test(`mobile drawer releases the page at ${desktopWidth}px`, async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 900 });
    await page.goto("/");
    const trigger = page.locator("header button[data-nav-menu-button]");
    const dialog = page.getByRole("dialog");
    const bodyStyles = await page.locator("body").evaluate((body) => ({
      pointerEvents: getComputedStyle(body).pointerEvents,
      overflow: getComputedStyle(body).overflow,
    }));

    await trigger.click();
    await expect(dialog).toBeVisible();
    await page.setViewportSize({ width: 420, height: 900 });
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

test("the drawer stays open while a long language still needs the menu button", async ({ page }) => {
  await page.setViewportSize({ width: 400, height: 900 });
  await page.goto("/ru");
  const trigger = page.locator("header button[data-nav-menu-button]");
  const dialog = page.getByRole("dialog");
  await trigger.click();
  await expect(dialog).toBeVisible();

  // 520px: the bar is allowed, but the Russian labels do not fit even at the
  // smallest level, so the menu button (and its open drawer) must stay.
  await page.setViewportSize({ width: 520, height: 900 });
  // Longer than the drawer's closing animation.
  await page.waitForTimeout(1500);
  await expect(trigger).toBeVisible();
  await expect(dialog).toBeVisible();

  // Wide enough for the bar: the drawer closes.
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(page.locator("header nav")).toBeVisible();
  await expect(dialog).toHaveCount(0);
});

test("on a narrow window the bar shrinks and moved menus stay usable", async ({ page }) => {
  await page.setViewportSize({ width: 600, height: 900 });
  await page.goto("/it");
  const nav = page.locator("header nav");
  await expect(nav).toBeVisible();
  await expect(page.locator("header button[data-nav-menu-button]")).toBeHidden();
  await expect
    .poll(async () => Number(await nav.getAttribute("data-nav-level")))
    .toBeGreaterThanOrEqual(3);
  // Menus moved into "More" open with the keyboard and stay on screen.
  await page.locator("header nav button[aria-expanded]").filter({ hasText: "Altro" }).click();
  // Below md the Bounties / Dashboard buttons are offered in the More row.
  await expect(page.locator("#nav-more-row").getByRole("link", { name: "Bounties" })).toBeVisible();
  const moved = page.locator("#nav-more-row [data-nav-moved] button").first();
  await moved.focus();
  await page.keyboard.press("Enter");
  const panel = page.locator("#nav-more-row [data-nav-moved] [id]").first();
  await expect(panel).toBeVisible();
  const box = await panel.boundingBox();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(600);
  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
  await expect(moved).toBeFocused();
});

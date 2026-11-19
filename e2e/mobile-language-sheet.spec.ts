import { test, expect, devices } from "@playwright/test";

test.use({ ...devices["Pixel 7"] });

test("language sheet remains interactive inside the mobile navigation drawer", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "The touch swipe uses Chromium's CDP input API");
  await page.goto("/");
  const drawer = page.getByRole("dialog").first();
  // The SSR fallback lacks this hook; wait for the interactive mounted trigger.
  await page.locator("[data-nav-menu-button]").click();
  await expect(drawer).toBeVisible();
  await drawer.evaluate((element) => { element.scrollTop = element.scrollHeight; });
  await drawer.getByRole("button", { name: "Select language" }).click();

  const sheet = page.getByRole("dialog", { name: "Language" });
  const search = sheet.getByPlaceholder("Search languages");
  await expect(search).toBeVisible();
  await expect(search).toHaveCSS("pointer-events", "auto");
  await search.tap();
  await search.fill("Italiano");
  await expect(search).toHaveValue("Italiano");
  await expect(sheet.getByRole("option")).toHaveCount(1);

  await search.fill("");
  const list = sheet.getByRole("listbox");
  const box = await list.boundingBox();
  expect(box).not.toBeNull();
  const x = box!.x + box!.width / 2;
  const startY = Math.min(box!.y + box!.height - 60, box!.y + 350);
  const client = await page.context().newCDPSession(page);
  await client.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y: startY, id: 1 }] });
  for (let step = 1; step <= 8; step++) {
    await client.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y: startY - step * 25, id: 1 }] });
  }
  await client.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect.poll(() => list.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  await search.press("Escape");
  await expect(sheet).toHaveCount(0);
  await expect(drawer).toBeVisible();
  await drawer.getByRole("button", { name: "Select language" }).click();
  await sheet.getByRole("option", { name: /Italiano/ }).tap();
  await expect(page).toHaveURL(/\/it(?:\/|$)/);
});

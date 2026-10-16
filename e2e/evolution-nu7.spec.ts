import { expect, test } from "@playwright/test";

test("collapsed NU7 distinguishes activated Testnet from upcoming Mainnet", async ({ page }) => {
  await page.goto("/en/zcash-evolution");
  const nu7 = page.locator("#nu7");
  await expect(nu7.getByRole("heading", { name: "NU7 — Shorter block intervals and network sustainability" })).toBeVisible();
  await expect(nu7.getByText("Mainnet upcoming", { exact: true })).toBeVisible();
  await expect(nu7.getByText("Testnet — Activated October 4, 2026 · Height 4,465,026", { exact: true })).toBeVisible();
  await expect(nu7.getByText("Mainnet — Tentative target November 5, 2026 · Height pending", { exact: true })).toBeVisible();
  await expect(nu7.getByRole("button")).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByText("We are in the")).toContainText("NU6.3 / Ironwood");
  await expect(page.locator("#nu7")).toHaveCount(1);
  await expect(page.locator('[title^="NU7 —"]')).toHaveCount(1);
});

test("NU7 exposes its proposal and linked deployment scope without nesting links in the toggle", async ({ page }) => {
  await page.goto("/en/zcash-evolution");
  const nu7 = page.locator("#nu7");
  await expect(nu7.getByText("The current NU7 proposal reduces target block spacing to 25 seconds, adds shielded action limits and the Network Sustainability Mechanism, removes 60% of transaction fees from circulation, and disables v4 transactions.", { exact: true })).toBeVisible();
  const toggle = nu7.getByRole("button");
  await toggle.click();
  await expect(nu7.getByRole("heading", { name: "Key Features" })).toBeVisible();
  for (const feature of ["Shielded action limits", "Network Sustainability Mechanism", "60% of transaction fees", "v4 transactions", "ZIP 2008"]) {
    await expect(nu7.getByRole("listitem").filter({ hasText: feature }).first()).toBeVisible();
  }
  for (const number of [259, 200, 201, 207, 214, 218, 235, 237, 2003, 2008]) {
    const link = nu7.getByRole("link", { name: new RegExp(`^ZIP ${number}:`) });
    await expect(link).toHaveAttribute("href", `https://zips.z.cash/zip-${String(number).padStart(4, "0")}`);
  }
  await expect(nu7.getByRole("link", { name: /Zcash Foundation NU7 rollout update/ })).toHaveAttribute("href", "https://forum.zcashcommunity.com/t/zf-engineering-update-21-september-5-october-2026/58059");
  await expect(toggle.getByRole("link")).toHaveCount(0);
  await expect(nu7).not.toContainText(/ZIP 233|ZIP 234|Feb 2031|3× faster|No new transaction format/);
});

test("NU7 deep link opens and keyboard users can toggle then reach each source", async ({ page }) => {
  await page.goto("/en/zcash-evolution#nu7");
  const nu7 = page.locator("#nu7");
  const toggle = nu7.getByRole("button");
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(toggle).toBeInViewport();
  for (let i = 0; i < 100 && !(await toggle.evaluate((element) => element === document.activeElement)); i++) {
    await page.keyboard.press("Tab");
  }
  await expect(toggle).toBeFocused();
  expect(await toggle.evaluate((element) => getComputedStyle(element).boxShadow)).not.toBe("none");
  await page.keyboard.press("Enter");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(nu7.getByText("Mainnet — Tentative target November 5, 2026 · Height pending", { exact: true })).toBeVisible();
  await page.keyboard.press("Space");
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  const links = nu7.getByRole("link");
  for (let i = 0; i < await links.count(); i++) {
    await page.keyboard.press("Tab");
    await expect(links.nth(i)).toBeFocused();
    expect(await links.nth(i).evaluate((element) => getComputedStyle(element).boxShadow)).not.toBe("none");
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
  }
});

for (const width of [1440, 390, 320]) {
  test(`shared NU7 content fits ${width}px and historical cards still work`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/en/zcash-evolution#nu7");
    const nu7 = page.locator("#nu7");
    await expect(nu7.getByRole("heading", { name: "Official sources" })).toBeVisible();
    await expect(nu7.getByText("Testnet — Activated October 4, 2026 · Height 4,465,026", { exact: true })).toBeVisible();
    const bounds = await nu7.boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    // The existing site navigation extends to 323px at a 320px viewport,
    // including with NU7 removed. Evolution must not add to that overflow.
    const existingPageWidth = width === 320 ? 323 : width;
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(existingPageWidth);
    expect(await nu7.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(false);
    for (const id of ["genesis", "sapling", "nu6_3"]) {
      const card = page.locator(`#${id}`);
      await card.getByRole("button").click();
      await expect(card.getByRole("heading", { name: "Key Features" })).toBeVisible();
      await card.getByRole("button").press("Space");
      await expect(card.getByRole("heading", { name: "Key Features" })).toBeHidden();
    }
  });
}


test("Italian navigation retains the shared NU7 content", async ({ page }) => {
  await page.goto("/it/zcash-evolution#nu7");
  await expect(page.locator("#nu7").getByRole("heading", { name: "Official sources" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Select language" })).toContainText("Italiano");
});

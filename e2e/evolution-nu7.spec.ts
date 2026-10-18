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

for (const expanded of [false, true]) {
test(`Sprout guidance stays visible and its links navigate independently while ${expanded ? "expanded" : "collapsed"}`, async ({ page }) => {
  await page.goto("/en/zcash-evolution");
  const nu7 = page.locator("#nu7");
  const toggle = nu7.getByRole("button");
  const notice = nu7.getByText("Sprout holders: NU7 disables v4 transactions, which current Sprout transfers require. Review migration options before Mainnet activation.", { exact: true });
  const guide = nu7.getByRole("link", { name: "ZecHub wallet recovery guide", exact: true });
  const source = nu7.getByRole("link", { name: "ZIP 2003 v4 transaction retirement", exact: true });
  await expect(notice).toBeVisible();
  await expect(nu7.getByText("Community-maintained guidance for supported wallets and recovery material; recovery is not guaranteed.", { exact: true })).toBeVisible();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(guide).toHaveAttribute("href", "https://zechub.wiki/using-zcash/recovering-funds");
  await expect(source).toHaveAttribute("href", "https://zips.z.cash/zip-2003");
  await toggle.press("Enter");
  await expect(notice).toBeVisible();
  await toggle.press("Space");
  await expect(notice).toBeVisible();
  // Observe actual keyboard navigation without depending on external servers.
  // Intercept only destination documents, leaving the rendered page seam intact.
  let expandedWhenLeaving: string | null = null;
  await page.exposeFunction("recordExpandedWhenLeaving", (value: string | null) => { expandedWhenLeaving = value; });
  for (const [link, destination] of [
    [guide, "https://zechub.wiki/using-zcash/recovering-funds"],
    [source, "https://zips.z.cash/zip-2003"],
  ] as const) {
    if (expanded) await toggle.press("Enter");
    await toggle.focus();
    await page.keyboard.press("Tab");
    if (link === source) await page.keyboard.press("Tab");
    await expect(link).toBeFocused();
    expect(await link.evaluate((element) => getComputedStyle(element).boxShadow)).not.toBe("none");
    expandedWhenLeaving = null;
    await page.evaluate(() => {
      document.addEventListener("click", () => {
        const state = document.querySelector("#nu7 button")?.getAttribute("aria-expanded") ?? null;
        (window as Window & { recordExpandedWhenLeaving?: (value: string | null) => void }).recordExpandedWhenLeaving?.(state);
      }, { once: true });
    });
    await page.route(destination, (route) => route.fulfill({ contentType: "text/html", body: "<title>Guidance destination</title>" }));
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(destination);
    expect(expandedWhenLeaving).toBe(String(expanded));
    await page.goBack();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
  }
});

}

test("NU7 compares target spacing and explains scheduled issuance only when expanded", async ({ page }) => {
  await page.goto("/en/zcash-evolution");
  const nu7 = page.locator("#nu7");
  const heading = nu7.getByRole("heading", { name: "Target block spacing", exact: true });
  const comparison = nu7.getByText("75 seconds → 25 seconds", { exact: true });
  const issuance = nu7.getByText("Scheduled issuance over time is preserved by lowering each block subsidy and lengthening the halving interval.", { exact: true });
  await expect(heading).toBeHidden();
  const toggle = nu7.getByRole("button");
  await toggle.press("Enter");
  await expect(heading).toBeVisible();
  await expect(comparison).toBeVisible();
  await expect(issuance).toBeVisible();
  await toggle.press("Space");
  await expect(comparison).toBeHidden();
  await expect(issuance).toBeHidden();
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
    const comparison = nu7.getByText("75 seconds → 25 seconds", { exact: true });
    await expect(comparison).toBeVisible();
    await expect(nu7.getByText("Scheduled issuance over time is preserved by lowering each block subsidy and lengthening the halving interval.", { exact: true })).toBeVisible();
    const notice = nu7.getByText("Sprout holders: NU7 disables v4 transactions, which current Sprout transfers require. Review migration options before Mainnet activation.", { exact: true });
    await expect(notice).toBeVisible();
    const guide = nu7.getByRole("link", { name: "ZecHub wallet recovery guide", exact: true });
    await expect(guide).toBeVisible();
    for (const content of [notice, guide]) {
      const contentBounds = await content.boundingBox();
      expect(contentBounds!.x).toBeGreaterThanOrEqual(0);
      expect(contentBounds!.x + contentBounds!.width).toBeLessThanOrEqual(width);
      expect(await content.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(false);
    }
    const comparisonBounds = await comparison.boundingBox();
    expect(comparisonBounds!.x).toBeGreaterThanOrEqual(0);
    expect(comparisonBounds!.x + comparisonBounds!.width).toBeLessThanOrEqual(width);
    expect(await comparison.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(false);
    const bounds = await nu7.boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    // The existing site navigation extends to 323px at a 320px viewport,
    // including with NU7 removed. Evolution must not add to that overflow.
    const existingPageWidth = width === 320 ? 323 : width;
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(existingPageWidth);
    expect(await nu7.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(false);
    await nu7.getByRole("button").press("Space");
    await expect(notice).toBeVisible();
    await expect(guide).toBeVisible();
    for (const id of ["genesis", "sapling", "nu6_3"]) {
      const card = page.locator(`#${id}`);
      await card.getByRole("button").click();
      await expect(card.getByRole("heading", { name: "Key Features" })).toBeVisible();
      await expect(card.getByRole("heading", { name: "Target block spacing", exact: true })).toHaveCount(0);
      await expect(card.getByRole("link", { name: "ZecHub wallet recovery guide", exact: true })).toHaveCount(0);
      await card.getByRole("button").press("Space");
      await expect(card.getByRole("heading", { name: "Key Features" })).toBeHidden();
    }
  });
}


for (const width of [1440, 390, 320]) {
  test(`privacy meter tooltips appear on hover and fit ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/en/zcash-evolution");
    const meter = page.locator("section", { has: page.getByRole("heading", { name: "Privacy Evolution" }) });
    const segments = meter.locator("[title]");
    const count = await segments.count();
    expect(count).toBeGreaterThan(1);
    for (let i = 0; i < count; i++) {
      const segment = segments.nth(i);
      const tooltip = segment.locator(":scope > div");
      await expect(tooltip).toBeHidden();
      await segment.hover();
      await expect(tooltip).toBeVisible();
      const bounds = await tooltip.boundingBox();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    }
  });
}


test("Italian navigation retains the shared NU7 content", async ({ page }) => {
  await page.goto("/it/zcash-evolution#nu7");
  await expect(page.locator("#nu7").getByRole("heading", { name: "Official sources" })).toBeVisible();
  await expect(page.locator("#nu7").getByText("75 seconds → 25 seconds", { exact: true })).toBeVisible();
  await expect(page.locator("#nu7").getByText("Scheduled issuance over time is preserved by lowering each block subsidy and lengthening the halving interval.", { exact: true })).toBeVisible();
  await expect(page.locator("#nu7").getByRole("link", { name: "ZecHub wallet recovery guide", exact: true })).toBeVisible();
  await page.locator("#nu7").getByRole("button").press("Space");
  await expect(page.locator("#nu7").getByRole("link", { name: "ZecHub wallet recovery guide", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Select language" })).toContainText("Italiano");
});

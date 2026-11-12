import { expect, type Locator, type Page, test } from "@playwright/test";

// Structural and accessibility coverage for the NU7 card on /zcash-evolution.
// Content (status, dates, heights, prose) lives in networkUpgrade.ts and is
// expected to change; this file does not pin exact wording. It checks that
// the card exists, its links point at the right places, the toggle is
// keyboard-operable, and the layout does not overflow.

const RECOVERY_HREF = "https://zechub.wiki/using-zcash/recovering-funds";
const ZIP_2003_HREF = "https://zips.z.cash/zip-2003";

const nu7Of = (page: Page) => page.locator("#nu7");

const recoveryGuide = (nu7: Locator) =>
  nu7.getByRole("link", { name: "ZecHub wallet recovery guide", exact: true });

const zip2003 = (nu7: Locator) =>
  nu7.getByRole("link", { name: "ZIP 2003 v4 transaction retirement", exact: true });

test("NU7 card is present, unique, and collapsed", async ({ page }) => {
  await page.goto("/en/zcash-evolution");
  const nu7 = nu7Of(page);

  await expect(nu7.getByRole("heading", { name: /NU7/ })).toBeVisible();
  await expect(nu7.getByRole("button")).toHaveAttribute("aria-expanded", "false");
  // One card, one privacy-meter segment.
  await expect(page.locator("#nu7")).toHaveCount(1);
  await expect(page.locator('[title^="NU7 —"]')).toHaveCount(1);
  // Rollout lists both networks without pinning status or height.
  await expect(nu7.getByText(/^Testnet —/)).toBeVisible();
  await expect(nu7.getByText(/^Mainnet —/)).toBeVisible();
  // Some era is marked current; which one is data, not structure.
  await expect(page.getByText("We are in the")).toBeVisible();
});

test("NU7 links its ZIPs and sources without nesting links in the toggle", async ({ page }) => {
  await page.goto("/en/zcash-evolution");
  const nu7 = nu7Of(page);
  const toggle = nu7.getByRole("button");

  await toggle.click();
  await expect(nu7.getByRole("heading", { name: "Key Features" })).toBeVisible();

  for (const number of [259, 200, 201, 207, 214, 218, 235, 237, 2003, 2008]) {
    const link = nu7.getByRole("link", { name: new RegExp(`^ZIP ${number}:`) });
    await expect(link).toHaveAttribute(
      "href",
      `https://zips.z.cash/zip-${String(number).padStart(4, "0")}`,
    );
  }

  // The toggle is a button; links must not live inside it.
  await expect(toggle.getByRole("link")).toHaveCount(0);
  // Guard against known-stale claims that have no place on this card.
  await expect(nu7).not.toContainText(/ZIP 233|ZIP 234|Feb 2031|3× faster|No new transaction format/);
});

for (const expanded of [false, true]) {
  test(`Sprout guidance links stay reachable and navigate independently while ${expanded ? "expanded" : "collapsed"}`, async ({ page }) => {
    await page.goto("/en/zcash-evolution");
    const nu7 = nu7Of(page);
    const toggle = nu7.getByRole("button");
    const guide = recoveryGuide(nu7);
    const source = zip2003(nu7);

    await expect(guide).toBeVisible();
    await expect(source).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(guide).toHaveAttribute("href", RECOVERY_HREF);
    await expect(source).toHaveAttribute("href", ZIP_2003_HREF);

    await toggle.press("Enter");
    await expect(guide).toBeVisible();
    await toggle.press("Space");
    await expect(guide).toBeVisible();

    // Observe actual keyboard navigation without depending on external servers.
    let expandedWhenLeaving: string | null = null;
    await page.exposeFunction("recordExpandedWhenLeaving", (value: string | null) => {
      expandedWhenLeaving = value;
    });

    for (const [link, destination] of [
      [guide, RECOVERY_HREF],
      [source, ZIP_2003_HREF],
    ] as const) {
      if (expanded) await toggle.press("Enter");
      await toggle.focus();
      await page.keyboard.press("Tab");
      if (link === source) await page.keyboard.press("Tab");
      await expect(link).toBeFocused();
      expect(await link.evaluate((el) => getComputedStyle(el).boxShadow)).not.toBe("none");

      expandedWhenLeaving = null;
      await page.evaluate(() => {
        document.addEventListener(
          "click",
          () => {
            const state = document.querySelector("#nu7 button")?.getAttribute("aria-expanded") ?? null;
            (window as Window & { recordExpandedWhenLeaving?: (v: string | null) => void })
              .recordExpandedWhenLeaving?.(state);
          },
          { once: true },
        );
      });

      await page.route(destination, (route) =>
        route.fulfill({ contentType: "text/html", body: "<title>Guidance destination</title>" }),
      );
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(destination);
      expect(expandedWhenLeaving).toBe(String(expanded));
      await page.goBack();
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
    }
  });
}

test("NU7 comparison is only visible when expanded", async ({ page }) => {
  await page.goto("/en/zcash-evolution");
  const nu7 = nu7Of(page);
  const heading = nu7.getByRole("heading", { name: "Target block spacing", exact: true });
  const toggle = nu7.getByRole("button");

  await expect(heading).toBeHidden();
  await toggle.press("Enter");
  await expect(heading).toBeVisible();
  await toggle.press("Space");
  await expect(heading).toBeHidden();
});

test("NU7 deep link opens expanded and keyboard users can reach each link", async ({ page }) => {
  await page.goto("/en/zcash-evolution#nu7");
  const nu7 = nu7Of(page);
  const toggle = nu7.getByRole("button");

  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(toggle).toBeInViewport();

  for (let i = 0; i < 100 && !(await toggle.evaluate((el) => el === document.activeElement)); i++) {
    await page.keyboard.press("Tab");
  }
  await expect(toggle).toBeFocused();
  expect(await toggle.evaluate((el) => getComputedStyle(el).boxShadow)).not.toBe("none");

  await page.keyboard.press("Enter");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await page.keyboard.press("Space");
  await expect(toggle).toHaveAttribute("aria-expanded", "true");

  const links = nu7.getByRole("link");
  const count = await links.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i++) {
    await page.keyboard.press("Tab");
    await expect(links.nth(i)).toBeFocused();
    expect(await links.nth(i).evaluate((el) => getComputedStyle(el).boxShadow)).not.toBe("none");
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
  }
});

for (const width of [1440, 390, 320]) {
  test(`NU7 content fits ${width}px and historical cards still work`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/en/zcash-evolution#nu7");
    const nu7 = nu7Of(page);
    const guide = recoveryGuide(nu7);

    await expect(nu7.getByRole("heading", { name: "Official sources" })).toBeVisible();
    await expect(guide).toBeVisible();

    const guideBounds = await guide.boundingBox();
    expect(guideBounds!.x).toBeGreaterThanOrEqual(0);
    expect(guideBounds!.x + guideBounds!.width).toBeLessThanOrEqual(width);
    expect(await guide.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(false);

    const bounds = await nu7.boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);

    // The site header can already overflow a 320px viewport by a few pixels.
    // Measure that overflow with the NU7 card hidden: the card must not add to it.
    const pageWidth = () => page.evaluate(() => document.documentElement.scrollWidth);
    const withCard = await pageWidth();
    await nu7.evaluate((el) => { el.style.display = "none"; });
    const withoutCard = await pageWidth();
    await nu7.evaluate((el) => { el.style.display = ""; });
    expect(withCard).toBeLessThanOrEqual(Math.max(width, withoutCard));
    expect(await nu7.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(false);

    await nu7.getByRole("button").press("Space");
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
    const meter = page.locator("section", {
      has: page.getByRole("heading", { name: "Privacy Evolution" }),
    });
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
  const nu7 = nu7Of(page);

  await expect(nu7.getByRole("heading", { name: "Official sources" })).toBeVisible();
  await expect(nu7.getByRole("heading", { name: "Target block spacing", exact: true })).toBeVisible();
  await expect(recoveryGuide(nu7)).toBeVisible();
  await nu7.getByRole("button").press("Space");
  await expect(recoveryGuide(nu7)).toBeVisible();
  await expect(page.getByRole("button", { name: "Select language" })).toContainText("Italiano");
});

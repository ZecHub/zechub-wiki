import { expect, test } from "@playwright/test";

// Keep these UI checks independent of changing pool totals and GitHub API limits.
const amounts = { sprout: 101, sapling: 202, orchard: 303, ironwood: 404 };

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    for (const [pool, supply] of Object.entries(amounts)) {
      await page.route(`**/data/zcash/${pool}_supply.json`, (route) =>
        route.fulfill({
          json: [
            { close: "09/01/2026", supply: supply - 1 },
            { close: "09/02/2026", supply },
          ],
        }),
      );
    }
    await page.route("**/api/data-updated?*", (route) =>
      route.fulfill({
        json: [{ commit: { committer: { date: "2026-09-02T00:00:00Z" } } }],
      }),
    );
    // These tests cover the dashboard, not the changing global navigation menu.
    await page.goto("/dashboard");
  });

  test("has export button", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: "Export PNG", exact: true }),
    ).toBeVisible();
  });

  for (const pool of ["sprout", "sapling", "orchard"] as const) {
    const label = pool.charAt(0).toUpperCase() + pool.slice(1);
    test(`has name of ${label} pool plus amount of zec`, async ({ page }) => {
      // The current UI uses a native pool select, separate from the year select.
      const poolSelect = page.getByRole("combobox").filter({
        has: page.getByRole("option", { name: "All Pools", exact: true }),
      });
      await poolSelect.selectOption(pool);
      const amount = page.getByText(
        `${label} Shielded: ${amounts[pool]} ZEC`,
        { exact: true },
      );
      await expect(amount).toBeVisible();
      await page.getByRole("button", { name: "Export PNG", exact: true }).click();
      await expect(amount).toBeVisible();
    });
  }
});

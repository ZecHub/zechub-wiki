import { expect, test } from "@playwright/test";

const devURL = "http://localhost:3000/";

test.describe("Dashboard", () => {
  test("has export button", async ({ page }) => {
    await page.goto(devURL);

    await page.getByRole("link", { name: /dashboard/i }).click();
    await expect(
      page.getByRole("button", { name: "Export (PNG)" })
    ).toBeVisible();
  });

  test("has name of Sprout pool plus amount of zec", async ({ page }) => {
    await page.goto(devURL);

    await page.getByRole("link", { name: /dashboard/i }).click();

    await page.getByRole("button", { name: "Sprout Pool" }).click();

    await page.getByRole("button", { name: "Export (PNG)" }).click();

    await expect(page.getByText(/ZEC in Sprout Pool/i)).toBeVisible();
  });
  
  test("has name of Sapling pool plus amount of zec", async ({ page }) => {
    await page.goto(devURL);

    await page.getByRole("link", { name: /dashboard/i }).click();

    await page.getByRole("button", { name: "Sapling Pool" }).click();

    await page.getByRole("button", { name: "Export (PNG)" }).click();

    await expect(page.getByText(/ZEC in Sapling Pool/i)).toBeVisible();
  });

  test("has name of Orchard pool plus amount of zec", async ({ page }) => {
    await page.goto(devURL);

    await page.getByRole("link", { name: /dashboard/i }).click();

    await page.getByRole("button", { name: "Orchard Pool" }).click();

    await page.getByRole("button", { name: "Export (PNG)" }).click();

    await expect(page.getByText(/ZEC in Orchard Pool/i)).toBeVisible();
  });
});

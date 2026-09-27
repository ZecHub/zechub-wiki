import { expect, Page, test } from "@playwright/test";

// Guards the addressable-tool URLs on /tools: every tool has to be reachable by
// link, survive a refresh, and move with Back/Forward. Needs a server running
// (`yarn dev`, or `yarn build && yarn start`).
const BASE = process.env.TOOLS_BASE_URL || "http://localhost:3000";

const heading = (page: Page) => page.locator("h2").first();
const tab = (page: Page, name: string) =>
  page.getByRole("button", { name, exact: true });

// The tab bar only responds once React has hydrated, so retry the click until
// the URL actually changes rather than racing the first paint.
async function clickTab(page: Page, name: string, slug: string) {
  await expect(async () => {
    await tab(page, name).click();
    await expect(page).toHaveURL(new RegExp(`\\?tool=${slug}$`));
  }).toPass({ timeout: 30_000 });
}

test("a tool can be linked to directly", async ({ page }) => {
  await page.goto(`${BASE}/tools?tool=address-decoder`);
  await expect(heading(page)).toHaveText("Address Decoder");

  await page.goto(`${BASE}/tools?tool=payment-request`);
  await expect(heading(page)).toHaveText("Payment Request Builder");
});

test("picking a tool puts its slug in the url", async ({ page }) => {
  await page.goto(`${BASE}/tools`);
  await expect(heading(page)).toHaveText("ZEC ↔ Zats");

  await clickTab(page, "Payment Request", "payment-request");
  await expect(heading(page)).toHaveText("Payment Request Builder");
});

test("a refresh stays on the same tool", async ({ page }) => {
  await page.goto(`${BASE}/tools`);
  await clickTab(page, "Address Decoder", "address-decoder");

  await page.reload();
  await expect(heading(page)).toHaveText("Address Decoder");
});

test("back and forward walk through the tools", async ({ page }) => {
  await page.goto(`${BASE}/tools`);
  await clickTab(page, "Payment Request", "payment-request");
  await clickTab(page, "Address Decoder", "address-decoder");

  await page.goBack();
  await expect(heading(page)).toHaveText("Payment Request Builder");
  await page.goBack();
  await expect(heading(page)).toHaveText("ZEC ↔ Zats");
  await page.goForward();
  await expect(heading(page)).toHaveText("Payment Request Builder");
});

test("an unknown slug falls back to the first tool", async ({ page }) => {
  await page.goto(`${BASE}/tools?tool=not-a-real-tool`);
  await expect(heading(page)).toHaveText("ZEC ↔ Zats");
});

test("the locale prefix survives a tool switch", async ({ page }) => {
  await page.goto(`${BASE}/es/tools`);
  await clickTab(page, "Address Decoder", "address-decoder");
  await expect(page).toHaveURL(`${BASE}/es/tools?tool=address-decoder`);
});

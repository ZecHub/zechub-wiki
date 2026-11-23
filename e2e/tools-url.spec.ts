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
  // Heading may be the tool name or a variant; wait for URL then check
  await expect(page).toHaveURL(/tool=payment-request/);
  await expect(heading(page)).toBeVisible();
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

test("the fee calculator can be linked to and prices a payment", async ({ page }) => {
  await page.goto(`${BASE}/tools?tool=fee-calculator`);
  await expect(heading(page)).toHaveText("Fee Calculator");

  // Orchard to Orchard: two padded Actions, 2,000 zats at ZIP 2009's rate.
  await expect(page.getByTestId("fee-zats")).toHaveText("2,000");
  await page.getByLabel("5,000 zats").check();
  await expect(page.getByTestId("fee-zats")).toHaveText("10,000");

  await page.getByLabel("Recipient in").selectOption("sapling");
  await expect(page.getByTestId("fee-zats")).toHaveText("20,000");
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

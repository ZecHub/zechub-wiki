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

test("an unknown slug falls back to the first tool", async ({ page }) => {
  await page.goto(`${BASE}/tools?tool=not-a-real-tool`);
  await expect(heading(page)).toHaveText("ZEC ↔ Zats");
});

test("the locale prefix survives a tool switch", async ({ page }) => {
  await page.goto(`${BASE}/es/tools`);
  await clickTab(page, "Address Decoder", "address-decoder");
  await expect(page).toHaveURL(`${BASE}/es/tools?tool=address-decoder`);
});

test("the URI inspector reads a payment link from the url", async ({ page }) => {
  const uri =
    "zcash:?address=tmEZhbWHTpdKMw5it8YDspUXSMGQyFwovpU&amount=123.456&address.1=ztestsapling10yy2ex5dcqkclhc7z7yrnjq2z6feyjad56ptwlfgmy77dmaqqrl9gyhprdx59qgmsnyfska2kez&amount.1=0.789";
  await page.goto(`${BASE}/tools?tool=uri-inspector&uri=${encodeURIComponent(uri)}`);
  await expect(heading(page)).toHaveText("Payment URI Inspector");
  await expect(page.getByTestId("zip321-status")).toHaveText("Valid ZIP 321 request");
  await expect(page.getByTestId("zip321-payment")).toHaveCount(2);
  await expect(page.getByText("total 124.245 ZEC")).toBeVisible();
});

test("the URI inspector names every problem in a broken link", async ({ page }) => {
  await page.goto(`${BASE}/tools?tool=uri-inspector`);
  const box = page.getByLabel("Payment URI");
  await expect(async () => {
    await box.fill("zcash:tmEZhbWHTpdKMw5it8YDspUXSMGQyFwovpU?amount=1,5&memo=SGk");
    await expect(page.getByTestId("zip321-status")).toHaveText("Invalid: 2 problems");
  }).toPass({ timeout: 30_000 });
  await expect(page.getByText(/uses a comma/)).toBeVisible();
  await expect(page.getByText(/transparent address, which cannot carry one/)).toBeVisible();
});

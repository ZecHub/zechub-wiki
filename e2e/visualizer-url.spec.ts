import { expect, Page, test } from "@playwright/test";

// Guards the addressable visualizer modules on /visualizer: every module has to
// be reachable by link, survive a refresh, and move with Back/Forward, and an
// unknown id has to land on the hub rather than an empty screen. Needs a server
// running (`yarn dev`, or `yarn build && yarn start`).
// Mirrors e2e/tools-url.spec.ts, which covers the same behaviour on /tools.
const BASE = process.env.VISUALIZER_BASE_URL || "http://localhost:3000";

const heading = (page: Page) => page.locator("h1, h2").first();
const hubMarker = (page: Page) => page.getByText(/Play All/i).first();

// The hub only responds once React has hydrated, so retry the click until the
// URL actually changes rather than racing the first paint.
async function openModule(page: Page, cardText: string, id: string) {
  await expect(async () => {
    await page
      .getByText(cardText, { exact: false })
      .first()
      .click({ force: true });
    await expect(page).toHaveURL(new RegExp(`\\?module=${id}$`));
  }).toPass({ timeout: 30_000 });
}

test("a module can be linked to directly", async ({ page }) => {
  // The modules the hub previously had no way of linking to.
  await page.goto(`${BASE}/visualizer?module=frost-multisig`);
  await expect(heading(page)).toContainText(/FROST/i);

  await page.goto(`${BASE}/visualizer?module=zechub-bounties`);
  await expect(heading(page)).toContainText(/Bounties/i);

  await page.goto(`${BASE}/visualizer?module=dao-proposal`);
  await expect(heading(page)).toContainText(/DAO/i);

  await page.goto(`${BASE}/visualizer?module=privacy-use-cases`);
  await expect(heading(page)).toContainText(/Privacy/i);
});

test("opening a module from the hub puts its id in the url", async ({
  page,
}) => {
  await page.goto(`${BASE}/visualizer`);
  await expect(hubMarker(page)).toBeVisible();

  await openModule(page, "FROST", "frost-multisig");
  await expect(heading(page)).toContainText(/FROST/i);
});

test("a refresh stays on the same module", async ({ page }) => {
  await page.goto(`${BASE}/visualizer?module=governance`);
  await expect(heading(page)).toContainText(/Governance/i);

  await page.reload();
  await expect(page).toHaveURL(/\?module=governance$/);
  await expect(heading(page)).toContainText(/Governance/i);
});

test("back and forward walk through the visualizers", async ({ page }) => {
  await page.goto(`${BASE}/visualizer?module=frost-multisig`);
  // The hub's next-visualizer button, whose label ends in "Next". Not the
  // visualizer's own "Next stage" control, which steps within a module.
  await page
    .locator("button")
    .filter({ hasText: /Next$/ })
    .first()
    .click({ force: true });
  await expect(page).toHaveURL(/\?module=zechub-bounties$/);

  await page.goBack();
  await expect(page).toHaveURL(/\?module=frost-multisig$/);
  await expect(heading(page)).toContainText(/FROST/i);

  await page.goForward();
  await expect(page).toHaveURL(/\?module=zechub-bounties$/);
});

test("returning to the hub clears the module, and back re-enters it", async ({
  page,
}) => {
  await page.goto(`${BASE}/visualizer?module=governance`);
  await page
    .getByRole("button", { name: "Back to Visualizer Hub" })
    .click({ force: true });

  await expect(page).toHaveURL(`${BASE}/visualizer`);
  await expect(hubMarker(page)).toBeVisible();

  await page.goBack();
  await expect(page).toHaveURL(/\?module=governance$/);
  await expect(heading(page)).toContainText(/Governance/i);
});

test("an unknown module id falls back to the hub and drops the id", async ({
  page,
}) => {
  await page.goto(`${BASE}/visualizer?module=not-a-real-visualizer`);

  await expect(hubMarker(page)).toBeVisible();
  // The dead id is not left in the address bar to be copied again.
  await expect(page).toHaveURL(`${BASE}/visualizer`);
});

test("a quiz can be linked to, and back closes it", async ({ page }) => {
  await page.goto(`${BASE}/visualizer?quiz=advanced`);
  await expect(page).toHaveURL(/\?quiz=advanced$/);

  await page.goto(`${BASE}/visualizer?quiz=not-a-quiz`);
  await expect(page).toHaveURL(`${BASE}/visualizer`);
});

test("the locale prefix survives opening and leaving a module", async ({
  page,
}) => {
  await page.goto(`${BASE}/es/visualizer?module=governance`);
  await expect(page).toHaveURL(`${BASE}/es/visualizer?module=governance`);

  await page
    .getByRole("button", { name: "Back to Visualizer Hub" })
    .click({ force: true });
  await expect(page).toHaveURL(`${BASE}/es/visualizer`);
});

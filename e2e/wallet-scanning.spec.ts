import { expect, Page, test } from "@playwright/test";

// The wallet scanning visualizer. The scanning rules themselves are unit tested
// in src/lib/__tests__/walletScanSimulation.test.ts; this checks that the
// controls drive them, that the module fits a phone, and that the transaction
// visualizer links to it. Needs a server running (`yarn dev`, or
// `yarn build && yarn start`).
const BASE = process.env.VISUALIZER_BASE_URL || "http://localhost:3000";
const MODULE_URL = `${BASE}/visualizer?module=wallet-scanning`;

const stepButton = (page: Page) =>
  page.getByRole("button", { name: "Scan next block" });
const balance = (page: Page) =>
  page.getByText("Balance shown to you").locator("xpath=following-sibling::p[1]");
const scanLog = (page: Page) =>
  page.getByRole("list", { name: "Scan log, newest first" });

/** Opens the module and waits for React, since the controls do nothing before it hydrates. */
async function openModule(page: Page) {
  await page.goto(MODULE_URL);
  await expect(stepButton(page)).toBeVisible();
  await page.waitForFunction(() => {
    const button = [...document.querySelectorAll("button")].find((el) =>
      el.textContent?.includes("Scan next block"),
    );
    return !!button && Object.keys(button).some((key) => key.startsWith("__reactProps"));
  });
}

async function pickExample(page: Page, name: string) {
  const chip = page
    .getByRole("navigation", { name: "Guided examples" })
    .getByRole("button", { name });
  await chip.click();
  await expect(chip).toHaveAttribute("aria-current", "step");
}

async function scanToTip(page: Page) {
  for (let i = 0; i < 20 && (await stepButton(page).isEnabled()); i++) {
    await stepButton(page).click();
  }
  await expect(stepButton(page)).toBeDisabled();
}

test("scanning block by block finds the payment", async ({ page }) => {
  await openModule(page);

  await stepButton(page).click();
  await stepButton(page).click();
  await expect(balance(page)).toHaveText("0.00 ZEC");

  // Alice's payment is in block 103.
  await stepButton(page).click();
  await expect(balance(page)).toHaveText("0.25 ZEC");
  await expect(scanLog(page)).toContainText("Note A, 0.25 ZEC from Alice");
});

test("a spend is recognised by its nullifier", async ({ page }) => {
  await openModule(page);
  await pickExample(page, "2. Discovering a spend");

  await scanToTip(page);
  await expect(page.getByText("Spent in block 105")).toBeVisible();
  await expect(balance(page)).toHaveText("0.2999 ZEC");
});

test("a birthday after the payment misses it, and an earlier one finds it", async ({
  page,
}) => {
  await openModule(page);
  await pickExample(page, "4. Birthday too late");

  await scanToTip(page);
  await expect(balance(page)).toHaveText("0.10 ZEC");

  // From block 105 back to 103, where Alice paid.
  const birthday = page.getByLabel("Wallet birthday");
  await birthday.focus();
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowLeft");
  await expect(birthday).toHaveValue("103");

  await scanToTip(page);
  await expect(balance(page)).toHaveText("0.50 ZEC");
});

test("a reorg rewinds the wallet before it scans the new blocks", async ({
  page,
}) => {
  await openModule(page);
  await pickExample(page, "6. A chain reorg");

  await scanToTip(page);
  await expect(balance(page)).toHaveText("0.50 ZEC");

  await page.getByRole("button", { name: "Simulate a reorg" }).click();
  await stepButton(page).click();
  await expect(scanLog(page)).toContainText("Rewound to block 108. Forgot note C.");
  await expect(balance(page)).toHaveText("0.30 ZEC");

  await scanToTip(page);
  await expect(balance(page)).toHaveText("0.50 ZEC");
});

test("the module fits a phone screen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openModule(page);
  await pickExample(page, "6. A chain reorg");
  await scanToTip(page);
  await page.getByRole("button", { name: "Simulate a reorg" }).click();

  // The canvas clips sideways overflow instead of scrolling, so measure the
  // content against it rather than the page.
  const overflowing = await page.evaluate(() => {
    const area = document.querySelector("main section");
    if (!area) return ["no canvas"];
    const right = area.getBoundingClientRect().right;
    return [...area.querySelectorAll("*")]
      .filter((el) => {
        const box = el.getBoundingClientRect();
        return box.width > 0 && box.right > right + 1;
      })
      .map((el) => `${el.tagName} ${el.textContent?.trim().slice(0, 30)}`);
  });
  expect(overflowing).toEqual([]);
});

test("the shielded transaction visualizer links here, and back returns", async ({
  page,
}) => {
  await page.goto(`${BASE}/visualizer?module=build-shielded-transaction`);
  const link = page.getByRole("link", { name: "See how a wallet finds its money" });

  // The link sits in the output description stage.
  await expect(async () => {
    if (!(await link.isVisible())) {
      await page.getByRole("button", { name: "Next step" }).click();
    }
    await expect(link).toBeVisible({ timeout: 1_000 });
  }).toPass({ timeout: 30_000 });

  await link.click();
  await expect(page).toHaveURL(/\?module=wallet-scanning$/);
  await expect(page.locator("h1").first()).toContainText(
    "How Your Zcash Wallet Finds Your Money",
  );

  await page.goBack();
  await expect(page).toHaveURL(/\?module=build-shielded-transaction$/);
});

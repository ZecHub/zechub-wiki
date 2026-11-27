import { expect, Page, test } from "@playwright/test";

// The wallet birthday tool. The search itself is unit tested in
// src/lib/__tests__/walletBirthday.test.ts; this checks that the form drives
// it. Block lookups are answered by a fake chain, so no CipherScan calls.
// Needs a server running (`yarn dev`, or `yarn build && yarn start`).
const BASE = process.env.TOOLS_BASE_URL || "http://localhost:3000";

// A chain on schedule: 150 s blocks up to Blossom activation, 75 s after it.
const BLOSSOM = { height: 653_600, time: 1_576_101_005 };
const TIP = 3_000_000;
const timeOf = (height: number) =>
  height >= BLOSSOM.height ? BLOSSOM.time + (height - BLOSSOM.height) * 75 : BLOSSOM.time - (BLOSSOM.height - height) * 150;

async function fakeChain(page: Page) {
  await page.route("**/api/cipherscan/block/*", (route) => {
    const height = Number(new URL(route.request().url()).pathname.split("/").pop());
    if (height > TIP) return route.fulfill({ status: 404, json: { error: "Block not found." } });
    return route.fulfill({
      json: {
        height,
        hash: height.toString(16).padStart(64, "0"),
        timestamp: timeOf(height),
        confirmations: TIP - height + 1,
      },
    });
  });
}

/** Opens the tool and waits for React, since the form does nothing before it hydrates. */
async function openTool(page: Page) {
  await page.goto(`${BASE}/tools?tool=wallet-birthday`);
  await expect(page.locator("h2").first()).toHaveText("Wallet Birthday");
  await page.waitForFunction(() => {
    const input = document.getElementById("birthday-date");
    return !!input && Object.keys(input).some((key) => key.startsWith("__reactProps"));
  });
}

test("turns a date into a birthday height with a safety margin", async ({ page }) => {
  await fakeChain(page);
  await openTool(page);

  await page.getByLabel("Timezone").selectOption("utc");
  await page.getByLabel("Date", { exact: true }).fill("2024-03-15");
  await page.getByRole("button", { name: "Find birthday height" }).click();

  // 2024-03-15 00:00 UTC falls between blocks 2,445,063 and 2,445,064.
  await expect(page.getByTestId("birthday-height")).toHaveText("2,443,911");
  await expect(page.getByText(/^2,445,063, mined /)).toBeVisible();
  await expect(page.getByText("1,152 blocks earlier, about 1 day")).toBeVisible();

  await page.getByLabel("Safety margin").selectOption("none");
  await expect(page.getByTestId("birthday-height")).toHaveText("2,445,063");
  await page.getByLabel("Safety margin").selectOption("week");
  await expect(page.getByTestId("birthday-height")).toHaveText("2,436,999");
});

test("warns when the birthday lands before Sapling", async ({ page }) => {
  await fakeChain(page);
  await openTool(page);

  await page.getByLabel("Timezone").selectOption("utc");
  await page.getByLabel("Date", { exact: true }).fill("2018-11-01");
  await page.getByLabel("Safety margin").selectOption("week");
  await page.getByRole("button", { name: "Find birthday height" }).click();

  // Block 419,795 is the last before the date; a week of 150 s blocks is 4,032.
  await expect(page.getByTestId("birthday-height")).toHaveText("415,763");
  await expect(page.getByText(/Light wallets such as ZODL don.t accept a lower birthday/)).toBeVisible();
});

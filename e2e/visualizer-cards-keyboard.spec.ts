import { expect, Page, test } from "@playwright/test";

// The visualizer hub cards used to be clickable divs, so a keyboard user could
// not reach or open them. They are buttons now. This walks the hub the way a
// keyboard user does: Tab until the card has focus, then Enter or Space.
// Needs a server running (`yarn dev`, or `yarn build && yarn start`).
const BASE = process.env.VISUALIZER_BASE_URL || "http://localhost:3000";

const HUB_MARKER = /Play All/i;

/**
 * Press Tab until the card whose label matches lands on focus, and return how
 * many presses it took. Deliberately drives the real tab order rather than
 * calling focus(), which would not prove the card is reachable.
 */
async function tabToCard(page: Page, label: RegExp): Promise<number> {
  for (let i = 1; i <= 90; i++) {
    await page.keyboard.press("Tab");
    const onCard = await page.evaluate((source) => {
      const el = document.activeElement;
      return (
        !!el &&
        el.tagName === "BUTTON" &&
        new RegExp(source, "i").test(el.textContent || "")
      );
    }, label.source);
    if (onCard) return i;
  }
  throw new Error(`never reached a card matching ${label} by tabbing`);
}

async function openHub(page: Page) {
  await page.goto(`${BASE}/visualizer`);
  await expect(page.getByText(HUB_MARKER).first()).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 0));
}

test("a Basic card opens with Enter", async ({ page }) => {
  await openHub(page);

  await tabToCard(page, /Introduction to Zcash Wallets/);
  await page.keyboard.press("Enter");

  await expect(page.locator("h1, h2").first()).toContainText(/Wallet/i);
  await expect(page.getByText(HUB_MARKER).first()).toBeHidden();
});

test("an Advanced card opens with Space", async ({ page }) => {
  await openHub(page);

  await tabToCard(page, /FROST/);
  // Space has to work as well as Enter; a native button gives both.
  await page.keyboard.press("Space");

  await expect(page.locator("h1, h2").first()).toContainText(/FROST/i);
});

test("a Contributor card opens with Enter", async ({ page }) => {
  await openHub(page);

  await tabToCard(page, /ZecHub Bounties/);
  await page.keyboard.press("Enter");

  await expect(page.locator("h1, h2").first()).toContainText(/Bounties/i);
});

test("Back to Visualizer Hub returns to the card grid", async ({ page }) => {
  await openHub(page);
  await tabToCard(page, /Introduction to Zcash Wallets/);
  await page.keyboard.press("Enter");
  await expect(page.getByText(HUB_MARKER).first()).toBeHidden();

  await page
    .getByRole("button", { name: "Back to Visualizer Hub" })
    .click({ force: true });

  // The grid is back, with every card still present.
  await expect(page.getByText(HUB_MARKER).first()).toBeVisible();
  await expect(
    page.locator("button.cursor-pointer.group"),
  ).toHaveCount(23);
});

test("every card is a real button, reachable and focusable", async ({
  page,
}) => {
  await openHub(page);

  const cards = page.locator("button.cursor-pointer.group");
  await expect(cards).toHaveCount(23);

  const tabs = await tabToCard(page, /Introduction to Zcash Wallets/);
  expect(tabs).toBeGreaterThan(0);

  const focus = await page.evaluate(() => {
    const el = document.activeElement as HTMLElement;
    return {
      tag: el.tagName,
      tabIndex: el.tabIndex,
      focusVisible: el.matches(":focus-visible"),
      // globals.css clears outline everywhere with !important, so the focus
      // affordance has to be a box-shadow ring; assert it actually paints.
      shadow: getComputedStyle(el).boxShadow,
    };
  });

  expect(focus.tag).toBe("BUTTON");
  expect(focus.tabIndex).toBe(0);
  expect(focus.focusVisible).toBe(true);
  expect(focus.shadow).not.toBe("none");
});

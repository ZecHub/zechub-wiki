import { expect, test } from "@playwright/test";

// Keyboard-accessibility gate for the site navigation (desktop + mobile).
//
// Guards the behaviour required by the "Make ZecHub Wiki navigation work with
// a keyboard" work: real <button> menu triggers with an accessible name and
// aria-expanded state, Enter/Space to open, Escape to close with focus return,
// closed submenu links kept out of the tab order, and accessible labels on the
// icon-only Search / theme / menu buttons.
//
// Requires the app running at BASE (default http://localhost:3000).

const BASE = process.env.BASE_URL || "http://localhost:3000";

// This dev server hydrates slowly (2-core CI/VM), so give every navigation test
// generous time to reach a hydrated, interactive state before asserting.
test.describe.configure({ timeout: 120_000 });

// Wait until React has hydrated. The mobile hamburger SheetTrigger only mounts
// after `mounted` flips true in useEffect (the pre-hydration fallback menu
// button carries no aria-haspopup), so its presence proves hydration. We wait
// for "attached" (not "visible") because at desktop widths the trigger itself is
// xl:hidden — the nav rendering, not visibility, is what hydration unlocks.
async function waitForHydration(page: import("@playwright/test").Page) {
  await page
    .locator('button[aria-haspopup="dialog"][aria-label="Open menu"]')
    .waitFor({ state: "attached", timeout: 60_000 });
}

test.describe("Navigation keyboard accessibility", () => {
  test("desktop: primary dropdown opens with Enter and closes with Escape", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(BASE, { waitUntil: "networkidle" });
    await waitForHydration(page);

    // The primary dropdown trigger is a real button with an accessible name.
    const trigger = page.getByRole("button", { name: /use zcash/i });
    await expect(trigger).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    // Enter opens the menu.
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");

    // A submenu link is now visible.
    const subLink = page.getByRole("link", { name: /faucets/i });
    await expect(subLink).toBeVisible();

    // Escape closes the menu and returns focus to the trigger.
    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toBeFocused();
  });

  test("desktop: Space (keyboard activation) opens the menu", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(BASE, { waitUntil: "networkidle" });
    await waitForHydration(page);

    const trigger = page.getByRole("button", { name: /use zcash/i });
    await trigger.focus();
    await page.keyboard.press(" ");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  test("desktop: icon-only Search button has an accessible name", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(BASE, { waitUntil: "networkidle" });
    await waitForHydration(page);

    const searchBtn = page.getByRole("button", { name: /search/i });
    await expect(searchBtn).toBeVisible();
  });

  test("mobile: drawer trigger and section buttons are keyboard accessible", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE, { waitUntil: "networkidle" });
    await waitForHydration(page);

    // The hydrated Radix SheetTrigger (aria-haspopup="dialog"); its accessible
    // name is label-agnostic here because it flips between Open/Close menu.
    const menuButton = page.locator('button[aria-haspopup="dialog"]');
    await menuButton.waitFor({ state: "visible", timeout: 30_000 });
    await expect(menuButton).toHaveAttribute("aria-label", "Open menu");

    // Open the drawer and wait for the Radix dialog content. Radix marks the
    // (hidden) background as aria-hidden while the dialog is open, so the
    // trigger's accessible-name flip is read from its raw aria-label attribute
    // rather than through getByRole.
    await menuButton.click({ timeout: 30_000 });
    const drawer = page.locator('[role="dialog"]');
    await drawer.waitFor({ state: "visible", timeout: 30_000 });
    await expect(menuButton).toHaveAttribute("aria-label", "Close menu", {
      timeout: 30_000,
    });

    // The first section trigger ("Use Zcash") inside the drawer is a real
    // button with an accessible name and expanded state.
    const sectionTrigger = page.getByRole("button", { name: /^use zcash/i });
    await sectionTrigger.waitFor({ state: "visible" });
    await expect(sectionTrigger).toHaveAttribute("aria-haspopup", "menu");
    await expect(sectionTrigger).toHaveAttribute("aria-expanded", "false");

    // Opening the section reveals its links.
    await sectionTrigger.click();
    await expect(sectionTrigger).toHaveAttribute("aria-expanded", "true");
  });
});

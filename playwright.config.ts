import { defineConfig, devices } from "@playwright/test";

// egress-check.yml already starts and checks its own server.
const externalBaseURL = process.env.EGRESS_BASE_URL || process.env.TOOLS_BASE_URL;
const baseURL = externalBaseURL || "http://localhost:3000";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // CI builds first; Playwright owns the process and fails if it is not ready.
  // Explicit external URLs preserve workflows that manage their own server.
  webServer: externalBaseURL
    ? undefined
    : {
        command: process.env.CI ? "yarn start" : "yarn dev",
        url: baseURL,
        timeout: 120_000,
        reuseExistingServer: !process.env.CI,
      },
});

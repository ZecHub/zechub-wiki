import { expect, test } from "@playwright/test";

// Egress-assertion gate: on initial page load (no click-to-load interaction),
// the browser must contact ONLY this origin plus a short, documented allow-list
// of hosts that legitimately load immediately. Structural regression guard for
// the image self-hosting + CSP work — a reintroduced third-party asset fails
// loudly instead of silently phoning home.
//
// Asserts the FINISHED state, so it is expected to be red until the self-hosting
// PRs (wiki #656, content #1888) are merged. Make it a required check only then.

// Retries would mask a timing-dependent offender (a late beacon that fails once
// then "passes"), so force a single deterministic run for this gate.
test.describe.configure({ retries: 0 });

const BASE = process.env.EGRESS_BASE_URL || "http://localhost:3000";

// Hosts allowed on INITIAL load. These are the CSP img/connect exceptions that
// legitimately fire on load (privacy-respecting, or existing egresses slated to
// be proxied). Deliberately EXCLUDES the consent-/interaction-gated hosts
// (CARTO tiles, YouTube frames, free2z/jsdelivr video) — those must NOT be
// contacted before the user clicks, so seeing them on load is the regression to
// catch, not something to allow.
const ALLOW_HOSTS = new Set([
  "img.shields.io", // live badges (privacy-respecting + dynamic)
  "upload.wikimedia.org", // a few logos (privacy-respecting)
  "i.ytimg.com", // YouTube thumbnails — residual to placeholder later
  "i.postimg.cc", // images in generated DAO-proposal text
  "ipfs.daodao.zone", // DAO logos (plain <img>) — proxy candidate
  "raw.githubusercontent.com", // Namada params client fetch — proxy candidate
]);

// /privacy = always-clean baseline; /using-zcash/wallets = a content page heavy
// with (formerly third-party) markdown images; /dao = DAO logos (ipfs, allowed);
// /start-here/new-user-guide = a page with a YouTube embed, to prove it stays
// click-to-load. Component pages (home/dashboard) already proxy via next/image
// (/_next/image), so they don't exercise the leak.
// NOTE: the YouTube route only stays green once the content <iframe> facade
// (wiki #656) is merged — before that, raw content YouTube iframes load Google
// (doubleclick/ggpht/gstatic) on view. Same "red until the finished state is
// merged" property as the image routes.
const ROUTES = [
  "/privacy",
  "/using-zcash/wallets",
  "/dao",
  "/start-here/new-user-guide",
];

// NOTE: page.on("request") does not observe service-worker-initiated fetches;
// if a caching SW is added later, extend this to inspect SW traffic too.
async function scrollToBottom(page: import("@playwright/test").Page) {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let y = 0;
      const step = () => {
        window.scrollBy(0, window.innerHeight);
        y += window.innerHeight;
        if (y >= document.body.scrollHeight) return resolve();
        setTimeout(step, 150);
      };
      step();
    });
  });
}

for (const route of ROUTES) {
  test(`@egress ${route} makes no undocumented third-party requests`, async ({ page }) => {
    const selfHost = new URL(BASE).host;
    const offenders = new Map<string, string>();

    page.on("request", (req) => {
      let u: URL;
      try {
        u = new URL(req.url());
      } catch {
        return;
      }
      if (u.protocol !== "http:" && u.protocol !== "https:") return; // data:/blob:/about:
      if (u.host === selfHost) return; // same-origin
      if (ALLOW_HOSTS.has(u.host)) return; // documented immediate-load exception
      if (!offenders.has(u.host)) offenders.set(u.host, req.resourceType());
    });

    // Navigate and REQUIRE the document to load — otherwise a route that 500s
    // fires no requests and the offenders check would pass vacuously. A failed
    // navigation (throw or non-ok document status) must fail the test.
    const resp = await page.goto(`${BASE}${route}`, {
      waitUntil: "load",
      timeout: 45_000,
    });
    expect(
      resp && resp.ok(),
      `${route} did not load (status ${resp?.status()}) — egress not exercised`,
    ).toBeTruthy();
    await scrollToBottom(page); // trigger lazy (loading="lazy") images
    await page.waitForTimeout(2500);

    const found = [...offenders].map(([host, type]) => `${host} (${type})`);
    expect(
      found,
      `Unexpected third-party requests on ${route}:\n  ${found.join("\n  ")}`,
    ).toEqual([]);
  });
}

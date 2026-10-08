/** @jest-environment node */
import fs from "fs";
import path from "path";

// A route-level loading.tsx wraps the page in a Suspense fallback, and Next
// commits "200 OK" when that fallback streams. The notFound() in
// [...slug]/page.tsx then can't change the status, so every dead wiki URL was
// served as a 200 "soft 404" (see Next's streaming guide, "The HTTP contract").
it("the wiki catch-all route has no loading.tsx, so notFound() can send a real 404", () => {
  const dir = path.join(process.cwd(), "src/app/[locale]/[...slug]");
  expect(fs.existsSync(path.join(dir, "page.tsx"))).toBe(true);
  expect(fs.existsSync(path.join(dir, "not-found.tsx"))).toBe(true);
  expect(fs.existsSync(path.join(dir, "loading.tsx"))).toBe(false);
});

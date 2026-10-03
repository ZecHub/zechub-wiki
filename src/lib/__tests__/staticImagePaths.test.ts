import { existsSync, readdirSync, readFileSync } from "fs";
import { join } from "path";
import { blockchainExplorers } from "@/constants/blockchainExplorers";
import { blockchainExplorersIt } from "@/constants/blockchainExplorers.it";

// Production serves public/ case-sensitively, so a path that differs from the
// file only in case (Zexplorer.png vs zexplorer.png) is a 404 there even when
// it resolves on a macOS checkout. Compare against the directory listing.
const publicDir = join(process.cwd(), "public");
const existsExactly = (webPath: string) => {
  const parts = webPath.replace(/^\//, "").split("/");
  let dir = publicDir;
  for (const part of parts) {
    if (!existsSync(dir)) return false;
    const entries = readdirSync(dir);
    if (!entries.includes(part)) return false;
    dir = join(dir, part);
  }
  return true;
};

describe("static image paths", () => {
  it.each([
    ...blockchainExplorers.map((e) => ["en", e.title, e.thumbnailImage] as const),
    ...blockchainExplorersIt.map((e) => ["it", e.title, e.thumbnailImage] as const),
  ])("%s explorer %s thumbnail exists: %s", (_l, _t, path) => {
    expect(existsExactly(path)).toBe(true);
  });

  it("every donation image exists", () => {
    const src = readFileSync(join(process.cwd(), "src/components/Donation/Donation.tsx"), "utf8");
    const block = src.slice(src.indexOf("const images = {"), src.indexOf("};", src.indexOf("const images = {")));
    const paths = [...block.matchAll(/"(\/[^"]+)"/g)].map((m) => m[1]);
    expect(paths.length).toBeGreaterThanOrEqual(5);
    for (const p of paths) expect([p, existsExactly(p)]).toEqual([p, true]);
  });
});

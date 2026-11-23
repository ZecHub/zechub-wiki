import { mirroredContentImage } from "@/lib/mirroredContentImage";

const RAW = "https://raw.githubusercontent.com/ZecHub/zechub/main/site/";

// Images these pages link straight from GitHub, which the site's CSP blocks: the first two articles of the
// formal verification series and the ZIP 218 article. Each needs a local copy in public/content-images.
const PAGE_IMAGES = [
  ...[1, 2, 3, 4, 5].map((n) => `Research/zcash-formal-verification-series/article-0/image-${n}.png`),
  ...[1, 2, 3].map((n) => `Research/zcash-formal-verification-series/article-1/image-${n}.png`),
  "Zcash_Tech/assets/nu7-block-timing.png",
];

describe("mirroredContentImage", () => {
  it.each(PAGE_IMAGES)("serves %s from the site itself", (file) => {
    const local = mirroredContentImage(RAW + file);
    expect(local).toBe(`/content-images/${file.slice(0, -4).toLowerCase().replace(/[^a-z0-9]+/g, "-")}.webp`);
  });

  it("returns nothing for an image without a local copy, or from another host", () => {
    expect(mirroredContentImage(`${RAW}Research/no-such-article/image-1.png`)).toBe("");
    expect(mirroredContentImage("https://example.com/site/Research/image-1.png")).toBe("");
    expect(mirroredContentImage(undefined)).toBe("");
  });
});

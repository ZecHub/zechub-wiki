import { stripFrontmatter } from "@/lib/stripFrontmatter";

describe("stripFrontmatter", () => {
  it("drops a CRLF front-matter block (the content repo's research pages)", () => {
    const md = "---\r\npublished: 2024-01-12 \r\n---\r\n\r\n# Title\r\n";
    expect(stripFrontmatter(md)).toBe("\r\n# Title\r\n");
  });

  it("drops an LF block with several keys, quoted values and a list", () => {
    const md = '---\npublished: "2026-04-14"\ntags:\n  - zcash\n  - dash\nimage: /x.png\n---\nBody';
    expect(stripFrontmatter(md)).toBe("Body");
  });

  it("drops a block after a byte-order mark", () => {
    expect(stripFrontmatter("\uFEFF---\ndate: 2026-01-01\n---\nBody")).toBe("Body");
  });

  it("keeps a page that opens with a horizontal rule and prose", () => {
    const md = "---\nThis page opens with a rule.\n---\nBody";
    expect(stripFrontmatter(md)).toBe(md);
  });

  it("keeps a page without front matter, and front matter that is not at the start", () => {
    expect(stripFrontmatter("# Title\n\nText")).toBe("# Title\n\nText");
    const late = "# Title\n---\npublished: 2026-01-01\n---\n";
    expect(stripFrontmatter(late)).toBe(late);
  });

  it("keeps an empty block (two rules) untouched", () => {
    expect(stripFrontmatter("---\n\n---\nBody")).toBe("---\n\n---\nBody");
  });
});

import { isAllowedUrl, isScriptUrl, normalizeUrl } from "@/lib/urlAllowlist";

describe("urlAllowlist", () => {
  it("rejects control-character javascript schemes", () => {
    expect(isScriptUrl("java\tscript:alert(1)")).toBe(true);
    expect(isScriptUrl("java\nscript:alert(1)")).toBe(true);
    expect(isScriptUrl("java\rscript:alert(1)")).toBe(true);
    expect(isScriptUrl("javascript:alert(1)")).toBe(true);
    expect(isScriptUrl("  javascript:alert(1)")).toBe(true);
    expect(isScriptUrl("JAVASCRIPT:alert(1)")).toBe(true);
    expect(isAllowedUrl("java\tscript:alert(1)")).toBe(false);
    expect(isAllowedUrl("javascript:alert(1)")).toBe(false);
    expect(isAllowedUrl("vbscript:msgbox(1)")).toBe(false);
  });

  it("allows normal links", () => {
    expect(isAllowedUrl("https://zechub.wiki")).toBe(true);
    expect(isAllowedUrl("http://example.com")).toBe(true);
    expect(isAllowedUrl("mailto:hello@example.com")).toBe(true);
    expect(isAllowedUrl("/site/foo")).toBe(true);
    expect(isAllowedUrl("#heading")).toBe(true);
    expect(isAllowedUrl("./relative")).toBe(true);
    expect(isAllowedUrl("../up")).toBe(true);
  });

  it("normalizes controls before matching", () => {
    expect(normalizeUrl("java\tscript:alert(1)")).toBe("javascript:alert(1)");
    expect(normalizeUrl("  https://ok  ")).toBe("https://ok");
  });

  it("rejects empty and non-strings", () => {
    expect(isAllowedUrl("")).toBe(false);
    expect(isAllowedUrl(null)).toBe(false);
    expect(isAllowedUrl(undefined)).toBe(false);
    expect(isScriptUrl(1)).toBe(false);
  });
});

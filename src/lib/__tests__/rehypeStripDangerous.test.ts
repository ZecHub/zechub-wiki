import { rehypeStripDangerous, isScriptUrl } from "@/lib/rehypeStripDangerous";

// Apply the rehype plugin to a hand-built tree (no MDX compile stack needed).
function run(tree: any) {
  rehypeStripDangerous()(tree);
  return tree;
}

const root = (...children: any[]) => ({ type: "root", children });
const el = (tagName: string, properties: any = {}, children: any[] = []) => ({
  type: "element",
  tagName,
  properties,
  children,
});
const jsx = (name: string, attributes: any[] = [], children: any[] = []) => ({
  type: "mdxJsxFlowElement",
  name,
  attributes,
  children,
});

describe("isScriptUrl", () => {
  it("flags plain and whitespace-padded script schemes", () => {
    expect(isScriptUrl("javascript:alert(1)")).toBe(true);
    expect(isScriptUrl("  javascript:alert(1)")).toBe(true);
    expect(isScriptUrl("JavaScript:alert(1)")).toBe(true);
    expect(isScriptUrl("vbscript:msgbox(1)")).toBe(true);
  });

  it("flags control-character-obfuscated schemes (the reported bypass)", () => {
    expect(isScriptUrl("java\tscript:alert(document.domain)")).toBe(true);
    expect(isScriptUrl("java\nscript:alert(1)")).toBe(true);
    expect(isScriptUrl("java\rscript:alert(1)")).toBe(true);
    expect(isScriptUrl("\u0000javascript:alert(1)")).toBe(true);
  });

  it("leaves safe URLs alone", () => {
    expect(isScriptUrl("https://zechub.wiki/x")).toBe(false);
    expect(isScriptUrl("/using-zcash/wallets")).toBe(false);
    expect(isScriptUrl("mailto:a@b.co")).toBe(false);
    expect(isScriptUrl("#section")).toBe(false);
    expect(isScriptUrl("data:image/png;base64,AAAA")).toBe(false);
    expect(isScriptUrl(undefined)).toBe(false);
  });
});

describe("rehypeStripDangerous — elements and attributes", () => {
  it("removes <script> and <style> elements", () => {
    const tree = run(
      root(el("p", {}, [el("script", {}, []), el("style", {}, []), el("b")])),
    );
    const kinds = tree.children[0].children.map((n: any) => n.tagName);
    expect(kinds).toEqual(["b"]);
  });

  it("strips on* / srcdoc / formaction properties", () => {
    const img = el("img", { src: "x", onError: "alert(1)", onLoad: "x()" });
    const iframe = el("iframe", { srcDoc: "<script>1</script>" });
    const btn = el("button", { formAction: "javascript:alert(1)" });
    run(root(img, iframe, btn));
    expect(img.properties).toEqual({ src: "x" });
    expect(iframe.properties).toEqual({});
    expect(btn.properties).toEqual({});
  });

  it("strips script-scheme URLs, including the tab-obfuscated bypass", () => {
    const a1 = el("a", { href: "javascript:alert(1)" });
    const a2 = el("a", { href: "java\tscript:alert(document.domain)" });
    const a3 = el("a", { href: "https://zechub.wiki/ok" });
    run(root(a1, a2, a3));
    expect(a1.properties.href).toBeUndefined();
    expect(a2.properties.href).toBeUndefined();
    expect(a3.properties.href).toBe("https://zechub.wiki/ok");
  });
});

describe("rehypeStripDangerous — MDX expressions", () => {
  it("removes standalone {expression} and ESM nodes (flow, text, mdxjsEsm)", () => {
    const tree = run(
      root(
        { type: "mdxjsEsm", value: "import x from 'evil'" },
        { type: "mdxFlowExpression", value: "globalThis.x=1" },
        el("p", {}, [
          { type: "text", value: "hi " },
          { type: "mdxTextExpression", value: "alert(1)" },
        ]),
      ),
    );
    expect(tree.children.map((n: any) => n.type)).toEqual(["element"]);
    expect(tree.children[0].children.map((n: any) => n.type)).toEqual(["text"]);
  });

  it("drops expression-valued and spread JSX attributes but keeps string ones", () => {
    const node = jsx("Gallery", [
      { type: "mdxJsxAttribute", name: "title", value: "Hello" },
      {
        type: "mdxJsxAttribute",
        name: "images",
        value: { type: "mdxJsxAttributeValueExpression", value: 'fetch("x")' },
      },
      { type: "mdxJsxExpressionAttribute", value: "...props" },
      { type: "mdxJsxAttribute", name: "onClick", value: "steal()" },
    ]);
    run(root(node));
    expect(node.attributes).toEqual([
      { type: "mdxJsxAttribute", name: "title", value: "Hello" },
    ]);
  });

  it("keeps a benign component and a normal link untouched", () => {
    const gallery = jsx("Gallery", []);
    const link = el("a", { href: "/using-zcash/wallets" }, [
      { type: "text", value: "Wallets" },
    ]);
    run(root(gallery, link));
    expect(gallery.attributes).toEqual([]);
    expect(link.properties.href).toBe("/using-zcash/wallets");
  });
});

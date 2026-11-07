import { rehypeStripDangerous } from "@/lib/rehypeStripDangerous";

type El = {
  type: "element";
  tagName: string;
  properties: Record<string, unknown>;
  children: El[];
};

function el(tagName: string, properties: Record<string, unknown> = {}): El {
  return { type: "element", tagName, properties, children: [] };
}

function run(children: El[]) {
  const tree = { type: "root", children };
  rehypeStripDangerous()(tree as any);
  return tree.children as El[];
}

function tags(children: El[]) {
  return children.map((c) => c.tagName);
}

describe("rehypeStripDangerous", () => {
  it("drops script and style elements", () => {
    const out = run([el("p"), el("script"), el("style"), el("p")]);
    expect(tags(out)).toEqual(["p", "p"]);
  });

  it("drops embedded-content elements that bypass the URL allow-list", () => {
    // <base> rewrites every relative URL on the page; object/embed pull in a
    // third-party browsing context even with an http(s) URL.
    const out = run([
      el("base", { href: "https://evil.example/" }),
      el("object", { data: "https://evil.example/x.html" }),
      el("object", { data: "data:text/html,payload" }),
      el("embed", { src: "https://evil.example/x.swf" }),
      el("p"),
    ]);
    expect(tags(out)).toEqual(["p"]);
  });

  it("keeps YouTube iframes but strips their srcdoc and script URLs", () => {
    const out = run([
      el("iframe", { src: "https://www.youtube.com/embed/abc123" }),
      el("iframe", { src: "javascript:alert(1)", srcdoc: "<script>x</script>" }),
    ]);
    expect(tags(out)).toEqual(["iframe", "iframe"]);
    expect(out[0].properties).toEqual({ src: "https://www.youtube.com/embed/abc123" });
    expect(out[1].properties).toEqual({});
  });

  it("removes dangerous elements nested inside allowed ones", () => {
    const wrapper = el("div");
    wrapper.children = [el("embed", { src: "https://evil.example/" }), el("span")];
    const out = run([wrapper]);
    expect(tags(out)).toEqual(["div"]);
    expect(tags(out[0].children)).toEqual(["span"]);
  });

  it("strips event handlers, srcdoc and formaction", () => {
    const out = run([
      el("img", { src: "/ok.png", onerror: "alert(1)" }),
      el("div", { srcdoc: "<x>", formaction: "https://evil.example/" }),
    ]);
    expect(out[0].properties).toEqual({ src: "/ok.png" });
    expect(out[1].properties).toEqual({});
  });

  it("removes javascript: and other non-allow-listed URL schemes", () => {
    const out = run([
      el("a", { href: "javascript:alert(1)" }),
      el("a", { href: "https://zechub.wiki" }),
      el("div", { data: "javascript:alert(1)" }),
    ]);
    expect(out[0].properties).toEqual({});
    expect(out[1].properties).toEqual({ href: "https://zechub.wiki" });
    expect(out[2].properties).toEqual({});
  });
});

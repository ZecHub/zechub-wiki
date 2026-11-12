import { rehypeJsxYouTubeFacade } from "@/lib/rehypeJsxYouTubeFacade";

// The shape MDX gives `<iframe src="..." title="..." allowFullScreen />`
// written as JSX in a content page, including the flag MDX uses to compile
// literal JSX to the bare tag instead of `components.iframe`.
const jsxIframe = (
  attributes: Record<string, unknown>,
  type = "mdxJsxFlowElement",
) => ({
  type,
  name: "iframe",
  attributes: Object.entries(attributes).map(([name, value]) => ({
    type: "mdxJsxAttribute",
    name,
    value,
  })),
  children: [],
  data: { _mdxExplicitJsx: true },
});

// New_User_Guide.md wraps each video in a sizing <div>.
const wrapped = (child: object) => ({
  type: "root",
  children: [
    {
      type: "mdxJsxFlowElement",
      name: "div",
      attributes: [
        { type: "mdxJsxAttribute", name: "className", value: "aspect-video" },
      ],
      children: [child],
    },
  ],
});

const run = (tree: any) => {
  rehypeJsxYouTubeFacade()(tree);
  return tree;
};

describe("rehypeJsxYouTubeFacade", () => {
  it("turns a JSX YouTube iframe into a hast element so components.iframe renders it", () => {
    const tree = run(
      wrapped(
        jsxIframe({
          className: "w-full h-full",
          src: "https://www.youtube.com/embed/6IIRRZ17Q74",
          title: "Zcash Shielded Wallets Explained",
          allowFullScreen: null,
          loading: "lazy",
        }),
      ),
    );

    expect(tree.children[0].children[0]).toEqual({
      type: "element",
      tagName: "iframe",
      properties: {
        src: "https://www.youtube.com/embed/6IIRRZ17Q74",
        title: "Zcash Shielded Wallets Explained",
      },
      children: [],
    });
  });

  it("handles inline JSX, nocookie and youtu.be forms, and a missing title", () => {
    for (const src of [
      "https://www.youtube-nocookie.com/embed/Avweu5V9QRc",
      "https://youtu.be/tEfQaYPV0UE",
    ]) {
      const tree = run(wrapped(jsxIframe({ src }, "mdxJsxTextElement")));
      expect(tree.children[0].children[0]).toEqual({
        type: "element",
        tagName: "iframe",
        properties: { src },
        children: [],
      });
    }
  });

  it("leaves non-YouTube JSX iframes as they are", () => {
    const iframe = jsxIframe({ src: "https://example.org/embed/widget" });
    const tree = run(wrapped(iframe));
    expect(tree.children[0].children[0]).toBe(iframe);
    expect(iframe.type).toBe("mdxJsxFlowElement");
  });

  it("does not match a src given as an expression", () => {
    const iframe = jsxIframe({
      src: { type: "mdxJsxAttributeValueExpression", value: "videoUrl" },
    });
    const tree = run(wrapped(iframe));
    expect(tree.children[0].children[0].type).toBe("mdxJsxFlowElement");
  });

  it("leaves other JSX elements with a YouTube src alone", () => {
    const link = {
      type: "mdxJsxTextElement",
      name: "a",
      attributes: [
        {
          type: "mdxJsxAttribute",
          name: "href",
          value: "https://www.youtube.com/watch?v=6IIRRZ17Q74",
        },
      ],
      children: [],
    };
    const tree = run(wrapped(link));
    expect(tree.children[0].children[0]).toBe(link);
    expect(link.type).toBe("mdxJsxTextElement");
  });
});

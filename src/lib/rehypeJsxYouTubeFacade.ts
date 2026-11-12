import { youTubeId } from "@/lib/youtube";

// Content pages often embed YouTube as MDX JSX:
//
//   <div className="aspect-video ...">
//     <iframe src="https://www.youtube.com/embed/..." title="..." />
//   </div>
//
// MDX does not route literal JSX tags through the `components` mapping; only
// elements that came from markdown or raw HTML are. So these iframes skipped the
// click-to-load facade in MdxComponent's `iframe` override and contacted
// YouTube/Google on page load, contrary to the privacy page. This plugin turns
// every JSX <iframe> whose src is a YouTube embed into a plain hast element,
// which MDX renders through `components.iframe` like any markdown iframe.
// Non-YouTube JSX iframes are left untouched.

type JsxAttribute = { type: string; name?: string; value?: unknown };
type Node = {
  type: string;
  name?: string | null;
  attributes?: JsxAttribute[];
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: Node[];
  data?: Record<string, unknown>;
};

const isJsxElement = (node: Node) =>
  node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement";

// A literal string attribute (`src="..."`). Expression values (`src={x}`) are
// not static, so they are never matched.
function stringAttribute(node: Node, name: string): string | undefined {
  const attribute = node.attributes?.find(
    (a) => a.type === "mdxJsxAttribute" && a.name === name,
  );
  return typeof attribute?.value === "string" ? attribute.value : undefined;
}

function rewrite(node: Node): void {
  if (isJsxElement(node) && node.name === "iframe") {
    const src = stringAttribute(node, "src");
    if (src && youTubeId(src)) {
      const title = stringAttribute(node, "title");
      node.type = "element";
      node.tagName = "iframe";
      node.properties = title === undefined ? { src } : { src, title };
      node.children = [];
      delete node.name;
      delete node.attributes;
      // MDX flags literal JSX with `data._mdxExplicitJsx` and compiles flagged
      // nodes to the bare tag, bypassing `components`. Drop the flag with the
      // JSX shape.
      delete node.data;
      return;
    }
  }
  node.children?.forEach(rewrite);
}

export function rehypeJsxYouTubeFacade() {
  return (tree: Node) => rewrite(tree);
}

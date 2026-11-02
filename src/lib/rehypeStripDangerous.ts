import { visit, SKIP } from "unist-util-visit";
import { isAllowedUrl, isScriptUrl } from "@/lib/urlAllowlist";

export { isAllowedUrl, isScriptUrl } from "@/lib/urlAllowlist";

/**
 * Defense-in-depth sanitizer for content markdown rendered via rehypeRaw.
 * Strips script/style, on* / srcdoc / formaction, and non-allow-listed URL schemes.
 * Does not visit MDX expression nodes — pair with blockJS: true on serialize.
 */
export function rehypeStripDangerous() {
  return (tree: any) => {
    (visit as any)(
      tree,
      ["element", "mdxJsxFlowElement", "mdxJsxTextElement"],
      (node: any, index: number | undefined, parent: any) => {
        const tag = String(node.tagName || node.name || "").toLowerCase();
        if (
          (tag === "script" || tag === "style") &&
          parent &&
          typeof index === "number"
        ) {
          parent.children.splice(index, 1);
          return [SKIP, index];
        }

        const props = node.properties || {};
        for (const key of Object.keys(props)) {
          const k = key.toLowerCase();
          if (k.startsWith("on") || k === "srcdoc" || k === "formaction") {
            delete props[key];
            continue;
          }
          if (["href", "src", "xlinkhref", "action", "poster"].includes(k)) {
            if (isScriptUrl(props[key]) || !isAllowedUrl(props[key])) {
              delete props[key];
            }
          }
        }

        if (Array.isArray(node.attributes)) {
          node.attributes = node.attributes.filter((attr: any) => {
            const name = String(attr?.name || "").toLowerCase();
            if (!name) return true;
            if (name.startsWith("on") || name === "srcdoc" || name === "formaction") {
              return false;
            }
            const value =
              typeof attr.value === "string" ? attr.value : attr.value?.value;
            if (["href", "src", "xlinkhref", "action", "poster"].includes(name)) {
              if (isScriptUrl(value) || !isAllowedUrl(value)) {
                return false;
              }
            }
            return true;
          });
        }
      },
    );
  };
}

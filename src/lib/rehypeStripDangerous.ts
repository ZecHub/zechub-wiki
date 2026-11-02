import { visit, SKIP } from "unist-util-visit";
import { isAllowedUrl, isScriptUrl } from "@/lib/urlAllowlist";

export { isAllowedUrl, isScriptUrl } from "@/lib/urlAllowlist";

/**
 * Elements that never belong in rendered content markdown and are dropped
 * whole, with their subtree. `script`/`style` run or inject code; `base`
 * rewrites the document's base URI so every relative URL on the page
 * (links, images, form targets) resolves against an attacker origin;
 * `iframe`/`object`/`embed` pull in a third-party browsing context, which is
 * active content even when its URL is on the http(s) allow-list. These match
 * the elements DOMPurify and rehype-sanitize forbid by default.
 */
const DANGEROUS_TAGS = new Set([
  "script",
  "style",
  "base",
  "iframe",
  "object",
  "embed",
]);

/** URL-bearing attributes whose scheme must pass the allow-list. `data` is
 * the resource of an `<object>`; it is checked here as defence in depth even
 * though `<object>` itself is dropped above. */
const URL_ATTRS = ["href", "src", "xlinkhref", "action", "poster", "data"];

/**
 * Defense-in-depth sanitizer for content markdown rendered via rehypeRaw.
 * Drops dangerous elements whole, strips on* / srcdoc / formaction, and
 * removes non-allow-listed URL schemes from URL-bearing attributes.
 * Does not visit MDX expression nodes — pair with blockJS: true on serialize.
 */
export function rehypeStripDangerous() {
  return (tree: any) => {
    (visit as any)(
      tree,
      ["element", "mdxJsxFlowElement", "mdxJsxTextElement"],
      (node: any, index: number | undefined, parent: any) => {
        const tag = String(node.tagName || node.name || "").toLowerCase();
        if (DANGEROUS_TAGS.has(tag) && parent && typeof index === "number") {
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
          if (URL_ATTRS.includes(k)) {
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
            if (URL_ATTRS.includes(name)) {
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

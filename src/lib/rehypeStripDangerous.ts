// Defense-in-depth sanitizer for the content render pipeline. Content markdown is
// rendered via rehypeRaw (raw-HTML passthrough) and compiled as MDX, then
// evaluated client-side by <MDXRemote>, so a malicious content-repo change could
// otherwise inject executable markup OR an evaluated JavaScript expression. This
// closes both: it strips <script>/<style> elements, on* / srcdoc / formaction
// attributes, script-scheme URLs, MDX expression nodes ({ ... }) and top-level
// ESM, and spread / expression-valued JSX attributes. MDX parses literal HTML
// such as <iframe srcDoc> as mdxJsx* nodes, which rehypeRaw passes through, so the
// attribute rules run on those too.
//
// The tree is walked with a small local recursion rather than unist-util-visit on
// purpose: this module is imported by MdxComponents (for isScriptUrl), and
// unist-util-visit is ESM-only, which the Jest (CommonJS) setup cannot load
// without extra transform config. Keeping the walk dependency-free keeps every
// consumer testable. Do not reintroduce unist-util-visit here.
//
// This is NOT a full allow-list sanitizer. It is paired with the content coming
// from a trusted repository and a (currently report-only) CSP; the correct
// long-term fix remains an allow-list sanitizer plus a nonce-based enforcing CSP.

// A URL whose scheme executes script. Browsers strip ASCII whitespace and
// control characters (tab 0x09, LF 0x0A, CR 0x0D, NUL, ...) from a URL scheme
// before acting on it, so a control-character-split `javascript:` is still live
// to a browser. An anchored "^\s*javascript:" test only skips leading whitespace,
// not control characters embedded inside the token, so strip those first, THEN
// test the scheme.
export function isScriptUrl(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const scheme = value.replace(/[\x00-\x20\x7f]+/g, "").toLowerCase();
  return /^(javascript|vbscript):/.test(scheme);
}

// MDX nodes that carry evaluated JavaScript: standalone `{ ... }` expressions
// (flow and text) and top-level ESM (`import ... ` / `export ...`). None is
// legitimate in wiki prose, and every one is executed by <MDXRemote>, so all are
// removed.
const EVALUATED_NODE_TYPES = new Set([
  "mdxFlowExpression",
  "mdxTextExpression",
  "mdxjsEsm",
]);

const URL_ATTRS = ["href", "src", "xlinkhref", "action", "poster"];

// A JSX attribute that carries arbitrary evaluated JavaScript: a spread
// (`{...x}`) or a value expression (`name={expr}`). No first-party content
// component needs either — Gallery takes no props, and the YouTube facade matches
// only literal string attributes — so both are dropped.
function isExpressionAttribute(attr: any): boolean {
  if (!attr || typeof attr !== "object") return false;
  if (attr.type === "mdxJsxExpressionAttribute") return true;
  const value = attr.value;
  return (
    !!value &&
    typeof value === "object" &&
    value.type === "mdxJsxAttributeValueExpression"
  );
}

// Strip dangerous attributes from a single element / JSX node, in place.
function cleanAttributes(node: any): void {
  const props = node.properties;
  if (props && typeof props === "object") {
    for (const key of Object.keys(props)) {
      const k = key.toLowerCase();
      // Event handlers, and attributes that can carry an executable document
      // (srcdoc) or override a form's action to a script URL (formaction).
      if (k.startsWith("on") || k === "srcdoc" || k === "formaction") {
        delete props[key];
        continue;
      }
      // Script-executing URL schemes on any URL-bearing attribute.
      if (URL_ATTRS.includes(k) && isScriptUrl(props[key])) {
        delete props[key];
      }
    }
  }

  // JSX attributes are { name, value } (or a spread), not a properties map.
  if (Array.isArray(node.attributes)) {
    node.attributes = node.attributes.filter((attr: any) => {
      // Drop spread and expression-valued attributes outright.
      if (isExpressionAttribute(attr)) return false;
      const name = String(attr?.name || "").toLowerCase();
      if (!name) return true;
      if (name.startsWith("on") || name === "srcdoc" || name === "formaction") {
        return false;
      }
      const value =
        typeof attr.value === "string" ? attr.value : attr.value?.value;
      if (URL_ATTRS.includes(name) && isScriptUrl(value)) {
        return false;
      }
      return true;
    });
  }
}

// Remove dangerous children of `parent`, clean survivors, and recurse. Removing a
// node (vs. visiting-then-skipping) means we never descend into it, which matches
// the previous SKIP behaviour.
function stripChildren(parent: any): void {
  if (!parent || !Array.isArray(parent.children)) return;
  parent.children = parent.children.filter((node: any) => {
    if (!node || typeof node !== "object") return true;
    // Expressions / ESM are compiled to executable JS and run by <MDXRemote> in
    // the browser. An attribute-level sanitizer cannot neutralize evaluated code,
    // so remove the node entirely.
    if (EVALUATED_NODE_TYPES.has(node.type)) return false;
    const tag = String(node.tagName || node.name || "").toLowerCase();
    if (tag === "script" || tag === "style") return false;
    cleanAttributes(node);
    stripChildren(node);
    return true;
  });
}

export function rehypeStripDangerous() {
  return (tree: any) => {
    stripChildren(tree);
  };
}

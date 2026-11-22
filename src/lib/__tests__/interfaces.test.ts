import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  DATA_ATTRIBUTE,
  DEFAULT_INTERFACE,
  INTERFACES,
  INTERFACE_KEY,
  applyInterface,
  isInterfaceId,
  saveInterface,
  savedInterface,
} from "@/lib/interfaces";

const DIR = join(process.cwd(), "src/components/Interfaces");

function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (k: string) => (data.has(k) ? data.get(k)! : null),
    setItem: (k: string, v: string) => void data.set(k, v),
    data,
  };
}

/** Splits a selector list on top-level commas (not the ones inside :is(...) or :not(...)). */
function splitSelectors(prelude: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = "";
  for (const ch of prelude) {
    if (ch === "(" || ch === "[") depth++;
    if (ch === ")" || ch === "]") depth--;
    if (ch === "," && depth === 0) {
      out.push(cur.trim());
      cur = "";
    } else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

/** [prelude, body] for every plain rule in a stylesheet without nesting. */
function rules(css: string): Array<[string, string]> {
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const found: Array<[string, string]> = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(clean))) found.push([m[1].trim(), m[2]]);
  return found;
}

describe("interfaces registry", () => {
  it("starts with Classic, the default, and has unique ids", () => {
    expect(INTERFACES[0].id).toBe("classic");
    expect(DEFAULT_INTERFACE).toBe("classic");
    const ids = INTERFACES.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const i of INTERFACES) {
      expect(i.id).toMatch(/^[a-z][a-z0-9-]*$/);
      expect(i.name.trim()).not.toBe("");
      expect(i.hint.length).toBeLessThanOrEqual(48);
    }
  });

  it("accepts only listed ids", () => {
    expect(isInterfaceId("reader")).toBe(true);
    expect(isInterfaceId("classic")).toBe(true);
    expect(isInterfaceId("desktop")).toBe(true);
    expect(isInterfaceId("text")).toBe(true);
    expect(isInterfaceId("nope")).toBe(false);
    expect(isInterfaceId(null)).toBe(false);
    expect(isInterfaceId(1)).toBe(false);
  });

  it("lists Desktop as an embedded interface", () => {
    const desktop = INTERFACES.find((i) => i.id === "desktop");
    expect(desktop?.embedUrl).toMatch(/^https:\/\//);
    expect(desktop?.embedUrl).not.toContain(" ");
  });

  it("sets the attribute for a non-default interface and clears it for Classic or unknown ids", () => {
    const root = document.createElement("html");
    applyInterface("reader", root);
    expect(root.getAttribute(DATA_ATTRIBUTE)).toBe("reader");
    applyInterface("desktop", root);
    expect(root.getAttribute(DATA_ATTRIBUTE)).toBe("desktop");
    applyInterface("text", root);
    expect(root.getAttribute(DATA_ATTRIBUTE)).toBe("text");
    applyInterface("classic", root);
    expect(root.hasAttribute(DATA_ATTRIBUTE)).toBe(false);
    applyInterface("reader", root);
    applyInterface("<script>", root);
    expect(root.hasAttribute(DATA_ATTRIBUTE)).toBe(false);
  });

  it("saves and restores only valid choices", () => {
    const store = memoryStorage();
    expect(savedInterface(store)).toBe("classic");
    saveInterface("reader", store);
    expect(store.data.get(INTERFACE_KEY)).toBe("reader");
    expect(savedInterface(store)).toBe("reader");
    saveInterface("desktop", store);
    expect(store.data.get(INTERFACE_KEY)).toBe("desktop");
    expect(savedInterface(store)).toBe("desktop");
    saveInterface("bogus", store);
    expect(store.data.get(INTERFACE_KEY)).toBe("desktop");
    expect(savedInterface(memoryStorage({ [INTERFACE_KEY]: "bogus" }))).toBe("classic");
  });

  it("falls back to Classic when storage throws or is missing", () => {
    const broken = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    };
    expect(savedInterface(broken)).toBe("classic");
    expect(() => saveInterface("reader", broken)).not.toThrow();
    expect(savedInterface(null)).toBe("classic");
  });
});

describe("interface stylesheets", () => {
  const index = readFileSync(join(DIR, "index.css"), "utf8");
  const styleInterfaces = INTERFACES.filter(
    (i) => i.id !== DEFAULT_INTERFACE && !i.embedUrl,
  );

  it.each(styleInterfaces.map((i) => i.id))("%s has a stylesheet imported in index.css", (id) => {
    expect(index).toContain(`@import "./${id}.css";`);
    expect(() => readFileSync(join(DIR, `${id}.css`), "utf8")).not.toThrow();
  });

  it.each(styleInterfaces.map((i) => i.id))("%s scopes every rule to its data-interface value", (id) => {
    const css = readFileSync(join(DIR, `${id}.css`), "utf8");
    const found = rules(css);
    expect(found.length).toBeGreaterThan(0);
    for (const [prelude] of found) {
      expect(prelude.startsWith("@")).toBe(false);
      for (const selector of splitSelectors(prelude)) {
        expect(selector.startsWith(`:root[data-interface="${id}"]`)).toBe(true);
      }
    }
  });

  /* The one exception, asked for by ZecHub: Text paints the page itself pure
     white (light) or pure black (dark), like a terminal. Nothing else. */
  const TERMINAL_PAGE = (id: string, prop: string, value: string): boolean =>
    id === "text" &&
    ((prop === "--color-page" && value === "#ffffff") ||
      (prop === "--color-surface" && value === "#000000") ||
      (prop === "background-color" && /^#(ffffff|000000)$/.test(value)));

  it.each(styleInterfaces.map((i) => i.id))("%s never sets colours (colour themes own them), apart from the Text page", (id) => {
    const css = readFileSync(join(DIR, `${id}.css`), "utf8");
    for (const [, body] of rules(css)) {
      // "inherit" and "currentColor" only pass along the theme's own colour.
      const colourProps = /^(color|background|background-color|border-color|fill|stroke|outline-color)$/;
      for (const decl of body.split(";")) {
        const at = decl.indexOf(":");
        if (at < 0) continue;
        const prop = decl.slice(0, at).trim();
        const value = decl.slice(at + 1).replace(/!important/, "").trim();
        if (colourProps.test(prop) && !TERMINAL_PAGE(id, prop, value)) {
          expect(value).toMatch(/^(inherit|currentColor)$/);
        }
      }
      const tokens = [...body.matchAll(/(--color-[\w-]+)\s*:\s*([^;]+)/g)];
      for (const [, token, value] of tokens) {
        expect(TERMINAL_PAGE(id, token, value.trim())).toBe(true);
      }
    }
  });

  it("index.css imports nothing but interface stylesheets that exist in the registry", () => {
    const imports = [...index.matchAll(/@import "\.\/([a-z0-9-]+)\.css";/g)].map((m) => m[1]);
    expect(imports.sort()).toEqual(styleInterfaces.map((i) => i.id).sort());
  });
});

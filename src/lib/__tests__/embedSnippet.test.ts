/** @jest-environment node */
import fs from "fs";
import path from "path";
import { JSDOM } from "jsdom";
import {
  buildEmbedSnippet,
  type EmbedSnippetConfig,
} from "@/app/[locale]/tools/zcash-payment-widget/embedSnippet";

const ORIGIN = "https://zechub.wiki";

const base: EmbedSnippetConfig = {
  address: "t1VpMigELggqi6TBghQNehqspAcBBDYvRQC",
  amount: 0.5,
  zecUsdRate: 30,
  label: "Pay with Zcash",
  theme: "light",
  target: "#zcash-payment-widget-target",
  disabled: false,
  apiBase: "/api",
};

/** Parses the snippet as a merchant's page would and returns the script tag. */
function pasted(snippet: string): HTMLScriptElement {
  const dom = new JSDOM(`<!doctype html><body>${snippet}</body>`, {
    url: "https://merchant.example/shop",
  });
  const script = dom.window.document.querySelector("script");
  if (!script) throw new Error("snippet did not produce a <script>");
  return script;
}

describe("embed snippet", () => {
  it("points a merchant's page at zechub.wiki, not at the merchant's own domain", () => {
    const script = pasted(
      buildEmbedSnippet(base, "/zcash-payment-request-widget.embed.v2.js", ORIGIN),
    );

    // Resolved by the merchant's browser, as it would load them.
    expect(script.src).toBe("https://zechub.wiki/zcash-payment-request-widget.embed.v2.js");
    expect(script.dataset.apiBase).toBe("https://zechub.wiki/api");
  });

  it("keeps absolute URLs that were configured explicitly", () => {
    const script = pasted(
      buildEmbedSnippet(
        { ...base, apiBase: "https://api.example.org/api" },
        "https://cdn.example.org/embed.v2.js",
        ORIGIN,
      ),
    );

    expect(script.src).toBe("https://cdn.example.org/embed.v2.js");
    expect(script.dataset.apiBase).toBe("https://api.example.org/api");
  });

  it("keeps every attribute intact, even with quotes and markup in the label", () => {
    const label = `Tom's "Café" <b>shop</b> & co`;
    const script = pasted(
      buildEmbedSnippet({ ...base, label }, "/zcash-payment-request-widget.embed.v2.js", ORIGIN),
    );

    expect(script.dataset.label).toBe(label);
    expect(script.dataset.address).toBe(base.address);
    expect(script.dataset.amount).toBe("0.5");
    expect(script.dataset.zecUsdRate).toBe("30");
    expect(script.dataset.target).toBe(base.target);
    expect(script.dataset.disabled).toBe("false");
  });
});

describe("widget config", () => {
  // Next.js only inlines NEXT_PUBLIC_* where the source says
  // process.env.NEXT_PUBLIC_...; a computed process.env[name] is undefined in
  // the browser, so the configurator silently used the relative fallbacks.
  it("reads its public env vars with static references", () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), "src/app/[locale]/tools/zcash-payment-widget/config.ts"),
      "utf8",
    );
    expect(source).not.toMatch(/process\.env\[/);
    expect(source).toMatch(/process\.env\.NEXT_PUBLIC_WIDGET_API_BASE_URL\b/);
    expect(source).toMatch(/process\.env\.NEXT_PUBLIC_API_BASE_URL_EMBED_CODE\b/);
  });
});

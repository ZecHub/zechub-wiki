import React from "react";

// The demo page passes its API base to the widget, which fetches the ZEC/USD
// price from `${apiBase}/payment-request-uri/zcash-price-feed`. A production
// build must not point it at localhost.
const captured: { apiBase?: string } = {};

jest.mock("../../app/[locale]/tools/zcash-payment-widget/adapters/nextjs", () => ({
  ZcashPaymentURINextJs: (props: { apiBase: string }) => {
    captured.apiBase = props.apiBase;
    return null;
  },
}));
jest.mock("@/lib/helpers", () => ({ genMetadata: jest.fn(), getBanner: () => "" }));
jest.mock("@/lib/localeCoverage", () => ({ buildAlternatesAllLocales: jest.fn() }));
jest.mock("@/i18n/routing", () => ({ routing: { defaultLocale: "en", locales: ["en"] } }));

function findApiBase(node: React.ReactNode): string | undefined {
  if (!React.isValidElement(node)) return undefined;
  const props = node.props as { apiBase?: string; children?: React.ReactNode };
  if (typeof props.apiBase === "string") return props.apiBase;
  for (const child of React.Children.toArray(props.children)) {
    const found = findApiBase(child);
    if (found) return found;
  }
  return undefined;
}

describe("/zcash-payment-uri API base", () => {
  const original = process.env.NODE_ENV;
  afterEach(() => {
    (process.env as Record<string, string>).NODE_ENV = original as string;
  });

  it("uses zechub.wiki in a production build, not localhost", () => {
    (process.env as Record<string, string>).NODE_ENV = "production";
    jest.isolateModules(() => {
      const Page = require("../../app/[locale]/zcash-payment-uri/page").default;
      expect(findApiBase(Page())).toBe("https://zechub.wiki/api");
    });
  });

  it("keeps localhost for local development", () => {
    (process.env as Record<string, string>).NODE_ENV = "development";
    jest.isolateModules(() => {
      const Page = require("../../app/[locale]/zcash-payment-uri/page").default;
      expect(findApiBase(Page())).toBe("http://localhost:3000/api");
    });
  });
});

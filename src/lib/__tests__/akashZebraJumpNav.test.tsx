/**
 * The "Zebra on Akash" guide opens with a "Jump to" list. Each entry has to
 * point at a heading on the page: an entry that names an id no heading has is
 * a link that does nothing when it is clicked.
 */

import Page from "@/app/[locale]/[...slug]/page";
import MdxComponents from "@/components/MdxComponents/MdxComponent";
import { MDXRemote } from "next-mdx-remote/rsc";
import React from "react";

jest.mock("@/lib/authAndFetch", () => ({
  getAllMarkdownRecursively: jest.fn(),
  getFileContentCached: jest.fn(),
  getLocalizedFileContentCached: jest.fn().mockResolvedValue("# How to run Zebra on Akash Network\n"),
  getMenuTitlesCached: jest.fn().mockResolvedValue({}),
  getRootCached: jest.fn().mockResolvedValue(["site/guides/Akash_Network_Zebra.md"]),
}));
jest.mock("@/lib/getDictionary", () => ({ getDictionary: jest.fn().mockResolvedValue({}) }));
jest.mock("next/headers", () => ({ headers: jest.fn() }));
jest.mock("@/i18n/navigation", () => ({ Link: () => null }));
jest.mock("@/i18n/routing", () => ({ routing: { defaultLocale: "en", locales: ["en"] } }));
jest.mock("@/lib/localeCoverage", () => ({}));
jest.mock("@/components/MdxContainer", () => ({ __esModule: true, default: () => null }));
jest.mock("@/components/MdxReady", () => ({ __esModule: true, default: () => null }));
jest.mock("@/components/SideMenu/SideMenu", () => ({ __esModule: true, default: () => null }));
jest.mock("next-mdx-remote/serialize", () => ({}));
jest.mock("next-mdx-remote/rsc", () => ({ MDXRemote: () => null }));
jest.mock("remark-gfm", () => ({}));
jest.mock("rehype-raw", () => ({}));
jest.mock("unist-util-visit", () => ({}));

type Node = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: Node[];
};

const el = (tagName: string, value: string): Node => ({
  type: "element",
  tagName,
  properties: {},
  children: [{ type: "text", value }],
});

const textOf = (node: Node): string =>
  node.type === "text" ? String(node.value) : (node.children ?? []).map(textOf).join("");

/** The guide's outline as the content repo has it: sections are H3, steps are H4. */
const guide = (): Node => ({
  type: "root",
  children: [
    el("h1", "How to run Zebra on Akash Network"),
    el("p", "This guide walks you through deploying a Zebra node on Akash."),
    el("h3", "Prerequisites"),
    el("h4", "Step 1: Connect"),
    el("h4", "Step 2: Create Deployment"),
    el("h3", "Configuration Options"),
    el("h3", "Troubleshooting"),
    el("h3", "Cost Management"),
  ],
});

function find(node: React.ReactNode, type: unknown): React.ReactElement<any> | undefined {
  if (!React.isValidElement<{ children?: React.ReactNode }>(node)) return undefined;
  if (node.type === type) return node;
  for (const child of React.Children.toArray(node.props.children)) {
    const hit = find(child, type);
    if (hit) return hit;
  }
  return undefined;
}

/** The page's own transform for this guide, with the options the route gives it. */
async function guideTransform(): Promise<(tree: Node) => void> {
  const page = await Page({
    params: Promise.resolve({ locale: "en", slug: ["guides", "akash-network-zebra"] }),
  });
  const plugins: unknown[] = find(page, MDXRemote)?.props.options.mdxOptions.rehypePlugins;
  const [plugin, options] = plugins.find(
    (p) => Array.isArray(p) && p[0].name === "rehypeWikiPatterns",
  ) as [(o: unknown) => (tree: Node) => void, unknown];
  return plugin(options);
}

/** The id the page gives a heading, taken from the heading component itself. */
const Heading = MdxComponents.h2 as (props: { children: string }) => React.ReactElement<{ id: string }>;
const idOf = (heading: Node): string => Heading({ children: textOf(heading) }).props.id;

describe("Zebra on Akash guide: Jump to list", () => {
  it("points every entry at a heading on the page", async () => {
    const tree = guide();
    (await guideTransform())(tree);

    const rows = tree.children ?? [];
    const jump = rows.find((n) => n.tagName === "jumpnav");
    const entries: { label: string; href: string }[] = JSON.parse(String(jump?.properties?.items));
    const ids = rows.filter((n) => /^h[1-6]$/.test(n.tagName ?? "")).map((n) => `#${idOf(n)}`);

    expect(entries.map((e) => e.label)).toEqual([
      "Prerequisites",
      "Deploy",
      "Configuration",
      "Troubleshooting",
      "Costs",
    ]);
    for (const entry of entries) expect(ids).toContain(entry.href);
  });

  it("sends Deploy to the first step", async () => {
    const tree = guide();
    (await guideTransform())(tree);

    const rows = tree.children ?? [];
    const jump = rows.find((n) => n.tagName === "jumpnav");
    const entries: { label: string; href: string }[] = JSON.parse(String(jump?.properties?.items));
    const firstStep = rows.find((n) => n.properties?.dataStep === "1");

    expect(firstStep && textOf(firstStep)).toBe("Connect");
    expect(entries.find((e) => e.label === "Deploy")?.href).toBe(`#${idOf(firstStep as Node)}`);
  });
});

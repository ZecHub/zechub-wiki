import React, { ComponentType, HTMLProps } from "react";
import { render, screen } from "@testing-library/react";
import MdxComponents from "@/components/MdxComponents/MdxComponent";

// Link tests do not need the routing, content-fetching or video runtimes.
jest.mock("@/i18n/navigation", () => ({ Link: () => null }));
jest.mock("@/lib/helpers", () => ({
  transformGithubFilePathToWikiLink: jest.fn(),
}));
jest.mock("@/components/LiteYouTube", () => () => null);

const A = MdxComponents.a as ComponentType<HTMLProps<HTMLAnchorElement>>;

// A table of contents written for GitHub can use anchors that differ from the ids the wiki gives
// its headings: GitHub calls "Examples & Demos" #examples--demos, the wiki calls it examples-demos.
// The link's own address is what a reader copies, shares or opens in a new tab, so it must be the id.
describe("MDX in-page links", () => {
  it.each([
    ["#examples--demos", "#examples-demos"],
    ["#Use-Cases--Examples", "#use-cases-examples"],
    ["#examples-demos", "#examples-demos"],
  ])("renders %s with the heading id %s", (href, want) => {
    render(<A href={href}>Examples</A>);
    expect(screen.getByRole("link", { name: "Examples" })).toHaveAttribute("href", want);
  });
});

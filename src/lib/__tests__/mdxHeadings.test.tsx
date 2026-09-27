import React, { ComponentType, HTMLProps, ReactNode } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import MdxComponents from "@/components/MdxComponents/MdxComponent";

// Heading tests do not need the routing, content-fetching or video runtimes.
jest.mock("@/i18n/navigation", () => ({ Link: () => null }));
jest.mock("@/lib/helpers", () => ({
  transformGithubFilePathToWikiLink: jest.fn(),
}));
jest.mock("@/components/LiteYouTube", () => () => null);

const fixtures: {
  name: string;
  children: ReactNode;
  text: string;
  id: string;
}[] = [
  {
    name: "emphasis from the Italian Raspberry Pi guide",
    children: ["Installazione di ", <em key="zcashd">zcashd</em>],
    text: "Installazione di zcashd",
    id: "installazione-di-zcashd",
  },
  {
    name: "strong text",
    children: ["The ", <strong key="network">Zcash Network</strong>],
    text: "The Zcash Network",
    id: "the-zcash-network",
  },
  {
    name: "inline code",
    children: ["Using ", <code key="zcashd">zcashd</code>],
    text: "Using zcashd",
    id: "using-zcashd",
  },
  {
    name: "nested inline elements and fragments",
    children: (
      <>
        Run <strong><em>zcashd</em></strong>
        <> on <code>Raspberry Pi</code> {4}</>
      </>
    ),
    text: "Run zcashd on Raspberry Pi 4",
    id: "run-zcashd-on-raspberry-pi-4",
  },
  {
    name: "existing plain-text punctuation rules",
    children: " Zcash (Mainnet) + test_net ",
    text: "Zcash (Mainnet) + test_net",
    id: "zcash-mainnet-and-test-net",
  },
  {
    name: "numbers including zero and empty nodes",
    children: ["Section ", 0, null, false, undefined, " + ", 2],
    text: "Section 0 + 2",
    id: "section-0-and-2",
  },
  {
    name: "bigint text",
    children: ["Block ", BigInt("9007199254740993")],
    text: "Block 9007199254740993",
    id: "block-9007199254740993",
  },
];

describe.each(["h1", "h2", "h3"] as const)("MDX %s anchors", (tag) => {
  const Heading = MdxComponents[tag] as ComponentType<HTMLProps<HTMLHeadingElement>>;

  it.each(fixtures)("uses heading text for $name", ({ children, text, id }) => {
    render(<Heading>{children}</Heading>);

    const heading = screen.getByRole("heading", { name: text });
    expect(heading.tagName.toLowerCase()).toBe(tag);
    expect(heading).toHaveAttribute("id", id);
    expect(heading).toHaveTextContent(text);
  });

  it.each(["custom-anchor", ""])("preserves an explicit id %j", (id) => {
    render(<Heading id={id}>Using <em>zcashd</em></Heading>);

    expect(screen.getByRole("heading")).toHaveAttribute("id", id);
  });
});

it("lets a table-of-contents link find and scroll to an emphasized heading", () => {
  const Heading = MdxComponents.h3 as ComponentType<HTMLProps<HTMLHeadingElement>>;
  const Anchor = MdxComponents.a as ComponentType<HTMLProps<HTMLAnchorElement>>;
  render(
    <>
      <Anchor href="#installazione-di-zcashd">Installazione</Anchor>
      <Heading>Installazione di <em>zcashd</em></Heading>
    </>,
  );
  const heading = screen.getByRole("heading", { name: "Installazione di zcashd" });
  const link = screen.getByRole("link", { name: "Installazione" });
  const scrollIntoView = jest.fn();
  heading.scrollIntoView = scrollIntoView;

  expect(document.getElementById(link.getAttribute("href")!.slice(1))).toBe(heading);
  fireEvent.click(link);

  expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
});

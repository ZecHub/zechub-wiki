import React, { ComponentType } from "react";
import { render, screen } from "@testing-library/react";
import MdxComponents from "@/components/MdxComponents/MdxComponent";

jest.mock("@/i18n/navigation", () => ({ Link: () => null }));
jest.mock("@/lib/helpers", () => ({ transformGithubFilePathToWikiLink: jest.fn() }));
jest.mock("@/components/LiteYouTube", () => () => null);

const Pre = MdxComponents.pre as ComponentType<React.HTMLProps<HTMLPreElement>>;
const Code = MdxComponents.code as ComponentType<React.HTMLProps<HTMLElement>>;

// Arabic pages set dir="rtl" on <html>; code must not inherit it.
describe("MDX code direction", () => {
  it("renders code blocks left to right", () => {
    render(
      <div dir="rtl">
        <Pre>
          <Code className="language-text">hA = 559aead08264...</Code>
        </Pre>
      </div>,
    );
    expect(screen.getByText("hA = 559aead08264...").closest("pre")).toHaveAttribute("dir", "ltr");
  });

  it("isolates inline code in right-to-left prose", () => {
    render(
      <p dir="rtl">
        <Code>H(hA, hB)</Code>
      </p>,
    );
    expect(screen.getByText("H(hA, hB)")).toHaveAttribute("dir", "ltr");
  });
});

import React from "react";
import { render, screen } from "@testing-library/react";
import ProjectCards from "@/components/PrivacySet/ProjectCards/ProjectCards";
import Grid from "@/components/Grid/Grid";

// Keep the real Next Image implementation; only routing is outside this test.
jest.mock("@/i18n/navigation", () => ({
  Link: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props} />,
}));

describe("Project card images", () => {
  it("renders a string image source while preserving the card content and link", () => {
    render(
      <ProjectCards
        title="Example project"
        description="Project description"
        imageSrc="/content-banners/bannertech.png"
        link="https://example.com/project"
      >
        <span>Additional project detail</span>
      </ProjectCards>,
    );

    const image = screen.getByRole("img", { name: "Example project" });
    const optimized = new URL(image.getAttribute("src")!, "https://example.com");
    expect(optimized.searchParams.get("url")).toBe("/content-banners/bannertech.png");
    expect(image).toHaveAttribute("sizes");
    expect(image.getAttribute("srcset")).toMatch(/\d+w/);
    expect(screen.getByRole("heading", { name: "Example project" })).toBeInTheDocument();
    expect(screen.getByText("Project description")).toBeInTheDocument();
    expect(screen.getByText("Additional project detail")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Read more" })).toHaveAttribute(
      "href", "https://example.com/project",
    );
  });

  it("renders the current project grid with locally sourced optimized images", () => {
    render(<Grid />);

    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(11);
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(images.length);
    expect(screen.getAllByRole("link", { name: "Read more" })).toHaveLength(images.length);
    for (const image of images) {
      const optimized = new URL(image.getAttribute("src")!, "https://example.com");
      expect(optimized.searchParams.get("url")).toMatch(/^\/content-(images|banners)\//);
      expect(image).toHaveAttribute("sizes");
    }
    const zaino = screen.getByRole("img", { name: "Zaino Indexer" });
    const optimized = new URL(zaino.getAttribute("src")!, "https://example.com");
    expect(optimized.searchParams.get("url")).toBe("/content-banners/bannertech.png");
  });
});

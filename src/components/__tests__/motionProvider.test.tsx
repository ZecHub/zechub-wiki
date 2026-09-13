import fs from "fs";
import path from "path";
import { useContext } from "react";
import { render, screen } from "@testing-library/react";
import { MotionConfigContext } from "framer-motion";
import MotionProvider from "../MotionProvider";

function ReadConfig() {
  const { reducedMotion } = useContext(MotionConfigContext);
  return <span data-testid="cfg">{String(reducedMotion)}</span>;
}

describe("MotionProvider", () => {
  it("puts every motion component under the user's system preference", () => {
    render(
      <MotionProvider>
        <ReadConfig />
      </MotionProvider>,
    );

    // "user" rather than "always": motion-dom only replaces the transition for
    // positional keys (transforms, width/height/top/left/right/bottom) with
    // { type: false }. Opacity keeps animating, which is what stops the
    // hundreds of `initial={{ opacity: 0 }}` entrances from stranding their
    // content invisible.
    expect(screen.getByTestId("cfg")).toHaveTextContent("user");
  });

  it("defaults to never without the provider, so the wrapper is load-bearing", () => {
    render(<ReadConfig />);

    expect(screen.getByTestId("cfg")).toHaveTextContent("never");
  });

  it("renders its children unchanged", () => {
    render(
      <MotionProvider>
        <p>Visualizer content</p>
      </MotionProvider>,
    );

    expect(screen.getByText("Visualizer content")).toBeInTheDocument();
  });
});

describe("reduced-motion stylesheet", () => {
  const css = fs.readFileSync(
    path.join(process.cwd(), "src/app/[locale]/globals.css"),
    "utf8",
  );
  const block =
    css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)")) || "";

  it("collapses CSS transitions and animations", () => {
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(block).toContain("transition-duration: 0.01ms !important");
    expect(block).toContain("animation-duration: 0.01ms !important");
    // Durations collapse rather than `animation: none`, so a CSS fade-in still
    // ends with the element visible instead of stuck at its start frame.
    expect(block).not.toContain("animation: none");
    expect(block).not.toContain("opacity: 1 !important");
  });

  it("turns off the smooth scrolling set on html", () => {
    // globals.css sets `scroll-behavior: smooth` on html; that is motion too.
    expect(css).toContain("scroll-behavior: smooth");
    expect(block).toContain("scroll-behavior: auto !important");
  });

  it("exempts busy spinners so they do not freeze part-rotated", () => {
    expect(block).toContain(":not(.animate-spin)");
  });
});

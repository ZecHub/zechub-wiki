import { render, screen } from "@testing-library/react";
import { CollisionContent } from "../CollisionContent";

describe("SHA-256 collision strength", () => {
  it("distinguishes generic classical collision work from the output count", () => {
    render(<CollisionContent />);

    expect(screen.getByText(/possible outputs/)).toHaveTextContent(
      "2²⁵⁶ possible outputs",
    );
    expect(
      screen.getByText(/hash evaluations for a generic classical collision search/),
    ).toHaveTextContent("Approximately 2¹²⁸ hash evaluations");
    expect(screen.getByText(/birthday bound/)).toHaveTextContent(
      "128-bit collision resistance",
    );
    expect(screen.getByRole("link", { name: "NIST" })).toHaveAttribute(
      "href",
      "https://csrc.nist.gov/Projects/Hash-Functions",
    );
  });

  it("explains the output count using the 256-bit digest size", () => {
    render(<CollisionContent />);

    expect(screen.getByText(/Each output is 256 bits/)).toHaveTextContent(
      "Each output is 256 bits, with two possible values for each bit.",
    );
  });
});

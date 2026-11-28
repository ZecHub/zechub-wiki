import { render, screen } from "@testing-library/react";
import { StageContent, STAGES } from "../PrivacyUsecasesContent";

it("separates the network block target from end-to-end remittance timing and cost", () => {
  render(<StageContent stage={STAGES.find(({ type }) => type === "remittances")!} isAnimating={false} />);

  expect(screen.getByRole("link", { name: "25-second target per block" })).toHaveAttribute(
    "href",
    "https://zips.z.cash/zip-0218",
  );
  expect(screen.getByText(/conversion and local payout/)).toBeInTheDocument();
  expect(screen.queryByText(/~75 seconds|\$0\.01 fees|Full privacy/)).not.toBeInTheDocument();
});

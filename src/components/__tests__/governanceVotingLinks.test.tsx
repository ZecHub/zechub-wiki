import { fireEvent, render, screen } from "@testing-library/react";
import GovernanceHowtoClient from "@/app/[locale]/governance-howto/GovernanceHowtoClient";

jest.mock("@/i18n/navigation", () => ({
  Link: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

jest.mock("@/context/LanguageContext", () => ({
  useLanguage: () => ({ t: {} }),
}));

function expectStandaloneLink(name: RegExp) {
  const link = screen.getByRole("link", { name });
  expect(link).toHaveAttribute("href", "https://vote.zechub.xyz");
  expect(link).toHaveAttribute("target", "_blank");
  // The visible button is the link itself: nothing wraps it, so the whole
  // control opens the portal and the keyboard reaches it in one Tab.
  expect(link.closest("button")).toBeNull();
  expect(screen.queryByRole("button", { name })).toBeNull();
}

describe("governance how-to voting portal controls", () => {
  it("makes Visit Voting Portal a single link", () => {
    render(<GovernanceHowtoClient />);
    expectStandaloneLink(/Visit Voting Portal/);
  });

  it("makes Submit Now a single link", () => {
    render(<GovernanceHowtoClient />);
    fireEvent.click(screen.getByRole("button", { name: /Next/ }));
    fireEvent.click(screen.getByRole("button", { name: /Next/ }));
    expectStandaloneLink(/Submit Now/);
  });
});

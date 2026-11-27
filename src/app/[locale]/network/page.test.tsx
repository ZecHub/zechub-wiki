import type { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import NetworkPage from "./page";

jest.mock("@/i18n/navigation", () => ({
  Link: (props: ComponentProps<"a">) => <a {...props} />,
}));

jest.mock("@/lib/helpers", () => ({ genMetadata: jest.fn(), getBanner: jest.fn() }));
jest.mock("@/i18n/routing", () => ({ routing: { defaultLocale: "en", locales: ["en"] } }));
jest.mock("@/lib/localeCoverage", () => ({ buildAlternatesAllLocales: jest.fn() }));

jest.mock("./NetworkStats", () => ({
  __esModule: true,
  default: () => null,
}));

it("takes Zcash network readers to the official Zcash protocol specification", () => {
  render(<NetworkPage />);

  const link = screen.getByRole("link", { name: /Zcash Protocol Specification/i });
  expect(link).toHaveAttribute("href", "https://zips.z.cash/protocol/protocol.pdf");
  expect(link).toHaveAttribute("target", "_blank");
  expect(link).toHaveAttribute("rel", "noopener noreferrer");
  expect(screen.getByRole("link", { name: /Network Upgrades/i })).toHaveAttribute(
    "href",
    "/start-here/network-upgrades",
  );
});

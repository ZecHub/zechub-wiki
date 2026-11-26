import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WalletItem from "@/components/Wallet/WalletItem";

jest.mock("@/i18n/navigation", () => ({
  Link: ({ children, href, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt }: { alt: string }) => <span>{alt}</span>,
}));

const props = {
  title: "SSP Wallet",
  link: "https://ssp.example",
  logo: "/wallet.png",
  tags: [
    { category: "Devices", values: ["Mobile"] },
    { category: "Pools", values: ["Ironwood"] },
    { category: "Features", values: ["Shielded", "Memos", "Multisig"] },
  ],
  likes: 3,
  syncSpeed: "",
  onLike: () => {},
  onDislike: () => {},
  error: "",
  success: "",
};

describe("WalletItem controls", () => {
  it("names the rating buttons after the wallet and exposes which one is pressed", async () => {
    const user = userEvent.setup();
    const onLike = jest.fn();
    const onDislike = jest.fn();
    render(<WalletItem {...props} onLike={onLike} onDislike={onDislike} />);

    const like = screen.getByRole("button", { name: "Like SSP Wallet" });
    const dislike = screen.getByRole("button", { name: "Dislike SSP Wallet" });
    expect(like).toHaveAttribute("aria-pressed", "false");
    expect(dislike).toHaveAttribute("aria-pressed", "false");

    await user.click(like);
    expect(onLike).toHaveBeenCalledTimes(1);
    expect(like).toHaveAttribute("aria-pressed", "true");
    expect(dislike).toHaveAttribute("aria-pressed", "false");

    await user.click(dislike);
    expect(onDislike).toHaveBeenCalledTimes(1);
    expect(like).toHaveAttribute("aria-pressed", "false");
    expect(dislike).toHaveAttribute("aria-pressed", "true");
  });

  it("points the features toggle at the list it expands when the name has a space", async () => {
    const user = userEvent.setup();
    render(<WalletItem {...props} />);

    const toggle = screen.getByRole("button", { name: "Show all" });
    const controls = toggle.getAttribute("aria-controls") ?? "";
    expect(controls).not.toBe("");
    expect(controls).not.toMatch(/\s/);
    const list = document.getElementById(controls) as HTMLElement;
    expect(list).toBeInTheDocument();

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(list).toHaveTextContent("Multisig");
  });

  it("announces the outcome of a vote", () => {
    const { rerender } = render(<WalletItem {...props} />);

    rerender(<WalletItem {...props} success="We saved your review!" />);
    expect(screen.getByText("We saved your review!")).toHaveAttribute("role", "status");

    rerender(<WalletItem {...props} error="Too many requests" />);
    expect(screen.getByText("Too many requests")).toHaveAttribute("role", "status");
  });
});

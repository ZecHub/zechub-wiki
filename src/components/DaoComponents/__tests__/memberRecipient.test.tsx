import React from "react";
import { TextEncoder } from "util";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import MemberCard from "@/components/DaoComponents/member-card";
import MemberModal from "@/components/DaoComponents/member-modal";
import { openPaymentUri } from "@/lib/openPaymentUri";

jest.mock("@/i18n/navigation", () => ({
  Link: ({
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props}>{children}</a>,
}));

jest.mock("@/lib/openPaymentUri", () => ({
  openPaymentUri: jest.fn(),
}));

const member = {
  name: "Example contributor",
  description: "Community contributor",
  imgUrl: "/placeholder.svg",
  social: [],
  role: "Member",
};

const originalTextEncoder = Object.getOwnPropertyDescriptor(
  globalThis,
  "TextEncoder",
);

beforeAll(() => {
  Object.defineProperty(globalThis, "TextEncoder", {
    configurable: true,
    value: TextEncoder,
  });
});

beforeEach(() => {
  jest.mocked(openPaymentUri).mockClear();
});

afterEach(() => {
  cleanup();
});

afterAll(() => {
  if (originalTextEncoder) {
    Object.defineProperty(globalThis, "TextEncoder", originalTextEncoder);
  } else {
    delete (globalThis as { TextEncoder?: unknown }).TextEncoder;
  }
});

describe.each(["card", "modal"])("DAO member %s recipient", (variant) => {
  function renderMember(zcashAddress: string) {
    render(
      variant === "card" ? (
        <MemberCard member={{ ...member, zcashAddress }} />
      ) : (
        <MemberModal
          member={{ ...member, social: "", zcashAddress }}
          isOpen
          onClose={jest.fn()}
        />
      ),
    );
  }

  it.each([
    ["the placeholder u", "u"],
    ["empty", ""],
  ])("does not offer messaging when the address is %s", (_label, address) => {
    renderMember(address);
    const messageButton = screen.getByRole("button", { name: "Message" });
    expect(messageButton).toBeDisabled();
    expect(messageButton).toHaveAccessibleDescription(
      /messaging unavailable/i,
    );

    // The message face stays in the DOM (turned away); text typed there must
    // still not be sendable.
    fireEvent.change(screen.getByPlaceholderText("Type your message..."), {
      target: { value: "Hello" },
    });
    const send = screen.getByText("Send", { selector: "button" });
    expect(send).toBeDisabled();
    fireEvent.click(send);
    expect(openPaymentUri).not.toHaveBeenCalled();
  });

  it("keeps messaging for a supplied shielded address", () => {
    renderMember("u1testrecipient");
    const messageButton = screen.getByRole("button", { name: "Message" });
    expect(messageButton).toBeEnabled();
    expect(messageButton).not.toHaveAccessibleDescription();
    fireEvent.click(messageButton);
    fireEvent.change(screen.getByPlaceholderText("Type your message..."), {
      target: { value: "Hello" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(openPaymentUri).toHaveBeenCalledWith(
      "zcash:u1testrecipient?amount=0.01&memo=SGVsbG8",
    );
  });
});

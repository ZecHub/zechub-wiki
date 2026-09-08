import React from "react";
import { TextEncoder } from "util";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import MemberCard from "@/components/DaoComponents/member-card";
import MemberModal from "@/components/DaoComponents/member-modal";

jest.mock("@/i18n/navigation", () => ({
  Link: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...props}>{children}</a>
  ),
}));

const member = {
  name: "Example contributor",
  description: "Community contributor",
  imgUrl: "/placeholder.svg",
  social: [],
  role: "Member",
  zcashAddress: "test-recipient",
};

const originalLocation = Object.getOwnPropertyDescriptor(window, "location")!;
const originalTextEncoder = Object.getOwnPropertyDescriptor(globalThis, "TextEncoder");
let requestedUris: string[] = [];

beforeAll(() => {
  Object.defineProperty(globalThis, "TextEncoder", { configurable: true, value: TextEncoder });
});

beforeEach(() => {
  requestedUris = [];
  // Capture the requested URI without navigating or opening a wallet.
  Object.defineProperty(window, "location", {
    configurable: true,
    value: {
      get href() { return "http://localhost/"; },
      set href(uri: string) { requestedUris.push(uri); },
      origin: "http://localhost",
    },
  });
});

afterEach(() => {
  cleanup();
  Object.defineProperty(window, "location", originalLocation);
});

afterAll(() => {
  if (originalTextEncoder) {
    Object.defineProperty(globalThis, "TextEncoder", originalTextEncoder);
  } else {
    delete (globalThis as { TextEncoder?: unknown }).TextEncoder;
  }
});

describe.each(["card", "modal"])("DAO member %s message", (variant) => {
  function compose(message: string) {
    render(variant === "card" ? <MemberCard member={member} /> : (
      <MemberModal member={{ ...member, social: "" }} isOpen onClose={jest.fn()} />
    ));
    fireEvent.click(screen.getByRole("button", { name: "Message" }));
    fireEvent.change(screen.getByPlaceholderText("Type your message..."), {
      target: { value: message },
    });
  }

  it.each(["Hello!", "Café", "こんにちは 👋"])("preserves the UTF-8 message %s", (message) => {
    compose(message);
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    const encoded = Buffer.from(message, "utf8").toString("base64url");
    expect(requestedUris).toEqual([`zcash:test-recipient?amount=0.01&memo=${encoded}`]);
  });

  it("accepts exactly 512 UTF-8 bytes", () => {
    const message = "é".repeat(256);
    compose(message);
    expect(screen.getByText("512/512 bytes")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send" })).toBeEnabled();
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(requestedUris).toHaveLength(1);
    const encoded = requestedUris[0].split("memo=")[1];
    expect(Buffer.from(encoded, "base64url").equals(Buffer.from(message, "utf8"))).toBe(true);
  });

  it("keeps an over-limit draft and allows sending after shortening it", () => {
    const message = "🙂".repeat(129);
    compose(message);
    expect(screen.getByText("516/512 bytes")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("Shorten your message");
    const send = screen.getByRole("button", { name: "Send" });
    expect(send).toBeDisabled();
    fireEvent.click(send);
    expect(requestedUris).toEqual([]);
    const input = screen.getByPlaceholderText("Type your message...");
    expect(input).toHaveValue(message);
    fireEvent.change(input, { target: { value: "🙂".repeat(128) } });
    expect(send).toBeEnabled();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    fireEvent.click(send);
    expect(requestedUris).toHaveLength(1);
    expect(Buffer.from(requestedUris[0].split("memo=")[1], "base64url").length).toBe(512);
  });
});

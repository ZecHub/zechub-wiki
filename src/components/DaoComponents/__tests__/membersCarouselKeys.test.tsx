import React from "react";
import { TextEncoder } from "util";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MembersCarousel from "@/components/DaoComponents/members-carousel";

jest.mock("@/i18n/navigation", () => ({
  Link: ({
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props}>{children}</a>,
}));

jest.mock("@/lib/openPaymentUri", () => ({
  openPaymentUri: jest.fn(),
}));

jest.mock("@/constants/membersDao", () => ({
  daoMembers: ["Alpha", "Bravo", "Charlie", "Delta"].map((name) => ({
    name,
    description: `${name} description`,
    imgUrl: "/placeholder.svg",
    social: [],
    role: "Member",
    zcashAddress: "u1testrecipient",
  })),
}));

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

afterAll(() => {
  if (originalTextEncoder) {
    Object.defineProperty(globalThis, "TextEncoder", originalTextEncoder);
  } else {
    delete (globalThis as { TextEncoder?: unknown }).TextEncoder;
  }
});

describe("MembersCarousel arrow keys", () => {
  it("moves between members with the arrow keys on the page", () => {
    render(<MembersCarousel />);
    expect(screen.getByText(/1 of 4/)).toBeInTheDocument();

    act(() => {
      fireEvent.keyDown(document.body, { key: "ArrowRight" });
    });
    expect(screen.getByText(/2 of 4/)).toBeInTheDocument();

    act(() => {
      fireEvent.keyDown(document.body, { key: "ArrowLeft" });
    });
    expect(screen.getByText(/1 of 4/)).toBeInTheDocument();
  });

  it("leaves the carousel alone while a member dialog is open", async () => {
    const user = userEvent.setup();
    render(<MembersCarousel />);

    // Only the centre card takes pointer input; it is the first member.
    const readMore = screen
      .getAllByRole("button", { name: "Read More" })
      .find((b) => b.closest("[style*='pointer-events: auto']"))!;
    await user.click(readMore);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Arrow keys pressed inside the dialog (focus is on one of its buttons)
    // must not move the carousel: two steps unmount the card that owns the
    // dialog, which closes it under the visitor.
    await user.keyboard("{ArrowRight}{ArrowRight}");

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/1 of 4/)).toBeInTheDocument();
  });

  it("ignores arrow keys with a modifier, such as Alt+Left for Back", () => {
    render(<MembersCarousel />);

    act(() => {
      fireEvent.keyDown(document.body, { key: "ArrowLeft", altKey: true });
    });
    expect(screen.getByText(/1 of 4/)).toBeInTheDocument();
  });

  it("ignores arrow keys in a select or an editable region", () => {
    render(
      <>
        <select aria-label="Sort">
          <option>One</option>
          <option>Two</option>
        </select>
        <div contentEditable data-testid="editor" />
        <MembersCarousel />
      </>,
    );

    act(() => {
      fireEvent.keyDown(screen.getByLabelText("Sort"), { key: "ArrowRight" });
    });
    const editor = screen.getByTestId("editor");
    // jsdom does not implement isContentEditable, so mirror the browser.
    Object.defineProperty(editor, "isContentEditable", { value: true });
    act(() => {
      fireEvent.keyDown(editor, { key: "ArrowRight" });
    });
    expect(screen.getByText(/1 of 4/)).toBeInTheDocument();
  });
});

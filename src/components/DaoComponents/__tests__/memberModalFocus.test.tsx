import React from "react";
import { TextEncoder } from "util";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MemberCard from "@/components/DaoComponents/member-card";

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
  zcashAddress: "u1testrecipient",
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

afterAll(() => {
  if (originalTextEncoder) {
    Object.defineProperty(globalThis, "TextEncoder", originalTextEncoder);
  } else {
    delete (globalThis as { TextEncoder?: unknown }).TextEncoder;
  }
});

/**
 * Open Read More on a member card. The modal box is found from its two
 * "Close modal" buttons (one per face), so the checks below also run, and
 * fail for the right reason, against a modal without dialog semantics.
 */
async function openModal() {
  const user = userEvent.setup();
  render(<MemberCard member={member} />);
  const readMore = screen.getByRole("button", { name: "Read More" });
  await user.click(readMore);
  const [frontClose, backClose] = screen.getAllByLabelText("Close modal");
  let modal = frontClose.parentElement!;
  while (!modal.contains(backClose)) modal = modal.parentElement!;
  return { user, readMore, modal, frontClose, backClose };
}

/** Focus stays in the modal and never lands on the face turned away. */
function expectFocusOnShownFace(modal: HTMLElement) {
  const focused = document.activeElement as HTMLElement;
  expect(modal).toContainElement(focused);
  expect(focused.closest("[aria-hidden='true']")).toBeNull();
}

describe("DAO member Read More dialog", () => {
  it("opens as a dialog named after the member and moves focus into it", async () => {
    const { readMore, frontClose } = await openModal();
    expect(
      screen.getByRole("dialog", { name: member.name }),
    ).toHaveAccessibleDescription(member.description);
    expect(frontClose).toHaveFocus();
    // The page behind is hidden from assistive technology while it is open.
    expect(readMore.closest("[aria-hidden='true']")).not.toBeNull();
  });

  it("keeps Tab and Shift+Tab inside the dialog, on the face shown", async () => {
    const { user, modal } = await openModal();
    for (const shift of [false, true]) {
      for (let i = 0; i < 20; i++) {
        await user.tab({ shift });
        expectFocusOnShownFace(modal);
      }
    }
  });

  it.each(["Escape", "Close modal", "Close"])(
    "closes with %s and returns focus to Read More",
    async (how) => {
      const { user, readMore } = await openModal();
      if (how === "Escape") {
        await user.keyboard("{Escape}");
      } else {
        await user.click(screen.getAllByRole("button", { name: how })[0]);
      }
      await waitFor(() =>
        expect(screen.queryAllByLabelText("Close modal")).toHaveLength(0),
      );
      await waitFor(() => expect(readMore).toHaveFocus());
    },
  );

  it.each(["Cancel", "Send"])(
    "moves focus to the message face, keeps Tab on it, and comes back after %s",
    async (button) => {
      const { user, modal } = await openModal();
      const dialog = within(modal);
      const message = dialog.getByRole("button", { name: "Message" });
      await user.click(message);

      const textarea = dialog.getByPlaceholderText("Type your message...");
      expect(textarea).toHaveFocus();
      expect(message.closest("[aria-hidden='true']")).not.toBeNull();
      await user.keyboard("Hello");
      for (let i = 0; i < 10; i++) {
        await user.tab();
        expectFocusOnShownFace(modal);
      }

      await user.click(dialog.getByRole("button", { name: button }));
      expect(message).toHaveFocus();
      expect(textarea.closest("[aria-hidden='true']")).not.toBeNull();
    },
  );

  it("closes from the message face with Escape and reopens on the profile", async () => {
    const { user, readMore, modal } = await openModal();
    await user.click(within(modal).getByRole("button", { name: "Message" }));
    await user.keyboard("Draft{Escape}");
    await waitFor(() => expect(readMore).toHaveFocus());

    await user.click(readMore);
    const [frontClose] = screen.getAllByLabelText("Close modal");
    expect(frontClose).toHaveFocus();
    expect(
      within(screen.getByRole("dialog"))
        .getByPlaceholderText("Type your message...")
        .closest("[aria-hidden='true']"),
    ).not.toBeNull();
  });
});

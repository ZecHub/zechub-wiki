import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { Modal } from "@/app/[locale]/tools/zcash-payment-widget/PaymentRequestWidgetCodeSnippet";

function Harness() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button aria-haspopup="dialog" onClick={() => setOpen(true)}>
        Open
      </button>
      <Modal isOpen={open} onClose={() => setOpen(false)} label="Embed Code">
        <button>First</button>
        <input aria-label="Field" />
        <button>Last</button>
      </Modal>
    </>
  );
}

describe("payment widget code-snippet Modal", () => {
  const user = userEvent.setup();

  it("renders with dialog semantics and an accessible name", async () => {
    render(<Harness />);
    await user.click(screen.getByRole("button", { name: "Open" }));

    const dialog = screen.getByRole("dialog", { name: "Embed Code" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("tabindex", "-1");
    expect(screen.getByRole("button", { name: "Close" })).toHaveAttribute(
      "type",
      "button",
    );
  });

  it("moves focus into the panel on open and restores it to the opener on close", async () => {
    render(<Harness />);
    const opener = screen.getByRole("button", { name: "Open" });
    await user.click(opener);

    expect(screen.getByRole("dialog")).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });

  it("traps Tab and Shift+Tab inside the panel", async () => {
    render(<Harness />);
    await user.click(screen.getByRole("button", { name: "Open" }));

    const close = screen.getByRole("button", { name: "Close" });
    const last = screen.getByRole("button", { name: "Last" });

    await user.tab();
    expect(close).toHaveFocus();

    last.focus();
    await user.tab();
    expect(close).toHaveFocus();

    await user.tab({ shift: true });
    expect(last).toHaveFocus();
  });

  it("closes via the × button and restores focus", async () => {
    render(<Harness />);
    const opener = screen.getByRole("button", { name: "Open" });
    await user.click(opener);
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });

  it("does not intercept keys once closed", async () => {
    render(<Harness />);
    const opener = screen.getByRole("button", { name: "Open" });
    await user.click(opener);
    await user.keyboard("{Escape}");

    opener.focus();
    await user.tab();
    expect(opener).not.toHaveFocus();
  });
});

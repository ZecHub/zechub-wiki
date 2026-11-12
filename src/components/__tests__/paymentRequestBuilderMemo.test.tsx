import { act, fireEvent, render, screen } from "@testing-library/react";
import { TextEncoder } from "util";
import PaymentRequestBuilder from "@/app/[locale]/tools/PaymentRequestBuilder";

// Address decoding is outside these UI-state tests; keep the ref stable just
// like useWasm does after loading the parser.
jest.mock("@/app/[locale]/tools/hooks/useWasm", () => {
  const ref = { current: { isZcashAddressValid: () => true } };
  return { useWasm: () => ({ wasmReady: true, wasmMmoduleRef: ref }) };
});
jest.mock("qrcode.react", () => ({
  QRCodeSVG: ({ value }: { value: string }) => (
    <svg data-testid="payment-qr" data-value={value} />
  ),
}));

const shielded = "zs1znewaqucqpc372x6ajmfnmkmxsafnc3fuxmg6g5kq3mkvkv8ufx9hgx9vgcrqncqm3umz56a7pd";
const transparent = "t1VpMigELggqi6TBghQNehqspAcBBDYvRQC";
const memoPlaceholder = "Private memo — only the recipient reads this";

function changeAddress(value: string) {
  fireEvent.change(screen.getByPlaceholderText(/t1\.\.\., zs1/), {
    target: { value },
  });
  act(() => { jest.advanceTimersByTime(200); });
}

function enterMemo(value: string) {
  fireEvent.change(screen.getByPlaceholderText(memoPlaceholder), {
    target: { value },
  });
}

beforeEach(() => {
  jest.useFakeTimers();
  globalThis.TextEncoder = TextEncoder as typeof globalThis.TextEncoder;
  Element.prototype.scrollIntoView = jest.fn();
});
afterEach(() => { jest.useRealTimers(); });

it("lets a user clear a hidden memo while preserving the other payment fields", () => {
  render(<PaymentRequestBuilder />);
  changeAddress(shielded);
  enterMemo("Private note");
  fireEvent.change(screen.getByPlaceholderText("0.00"), { target: { value: "1.25" } });
  fireEvent.change(screen.getByPlaceholderText("Recipient name"), { target: { value: "Alice" } });
  fireEvent.change(screen.getByPlaceholderText("What's this payment for?"), { target: { value: "Invoice" } });
  changeAddress(transparent);

  expect(screen.queryByPlaceholderText(memoPlaceholder)).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Enter an address to continue" })).toBeDisabled();
  expect(screen.queryByTestId("payment-qr")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Clear memo" }));

  expect(screen.getByRole("button", { name: "Copy Payment URI" })).toBeEnabled();
  expect(screen.getByTestId("payment-qr")).toHaveAttribute(
    "data-value", `zcash:${transparent}?amount=1.25&label=Alice&message=Invoice`,
  );
  expect(screen.queryByText(/Memos are not supported/)).not.toBeInTheDocument();
});

it("preserves the memo when switching back to a shielded address without clearing", () => {
  render(<PaymentRequestBuilder />);
  changeAddress(shielded);
  enterMemo("Keep this note");
  changeAddress(transparent);
  changeAddress(shielded);
  expect(screen.getByPlaceholderText(memoPlaceholder)).toHaveValue("Keep this note");
  expect(screen.queryByRole("button", { name: "Clear memo" })).not.toBeInTheDocument();
});

it("clears only the selected recipient's memo", () => {
  render(<PaymentRequestBuilder />);
  changeAddress(shielded);
  enterMemo("Keep");
  fireEvent.click(screen.getByRole("button", { name: "+ Add recipient" }));
  changeAddress(shielded);
  enterMemo("Remove");
  changeAddress(transparent);
  fireEvent.click(screen.getByRole("button", { name: "Clear memo" }));
  expect(screen.getByTestId("payment-qr")).toHaveAttribute(
    "data-value", `zcash:?address=${shielded}&memo=S2VlcA&address.1=${transparent}`,
  );
});

it("does not offer to clear an empty memo for a transparent recipient", () => {
  render(<PaymentRequestBuilder />);
  changeAddress(transparent);
  expect(screen.queryByRole("button", { name: "Clear memo" })).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Copy Payment URI" })).toBeEnabled();
});

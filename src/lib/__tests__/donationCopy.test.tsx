import React from "react";
import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DonationComp from "@/components/Donation/Donation";
import ZcashUAZArt from "@/components/ZcashUAZArt";
import DonationClientWrapper from "@/components/DonationClientWrapper";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt }: { alt: string }) => <span role="img" aria-label={alt} />,
}));
jest.mock("qrcode.react", () => ({
  __esModule: true,
  default: ({ value }: { value: string }) => (
    <div data-testid="donation-qr" data-address={value} />
  ),
}), { virtual: true });
jest.mock("react-icons/bs", () => ({ BsQrCodeScan: () => null }), { virtual: true });
jest.mock("react-icons/md", () => ({ MdOutlineCopyAll: () => null }), { virtual: true });
jest.mock("@/components/Penumbra/PenumbraWalletConnect", () => ({
  __esModule: true,
  default: () => null,
}));

const zcashAddress =
  "u1rl2zw85dmjc8m4dmqvtstcyvdjn23n0ad53u5533c97affg9jq208du0vf787vfx4vkd6cd0ma4pxkkuc6xe6ue4dlgjvn9dhzacgk9peejwxdn0ksw3v3yf0dy47znruqftfqgf6xpuelle29g2qxquudxsnnen3dvdx8az6w3tggalc4pla3n4jcs8vf4h29ach3zd8enxulush89";
const ycashAddress =
  "ys1t2e77wawylp8zky7wq3gzky2j4w6rpgd8632vmvqqj370thgpls8t973qutj4gn5wsc3qmcy56y";
const failureMessage = "Could not copy. Select and copy the address manually.";
const originalClipboard = Object.getOwnPropertyDescriptor(navigator, "clipboard");

function deferredWrite() {
  let resolve!: () => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<void>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

function setupClipboard() {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
  const writeText = jest.fn<Promise<void>, [string]>().mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
  return { user, writeText };
}

async function click(user: ReturnType<typeof userEvent.setup>, element: Element) {
  await user.click(element);
  // Flush promise-driven updates without advancing the feedback clock.
  await act(async () => {
    await jest.advanceTimersByTimeAsync(0);
  });
}

beforeEach(() => jest.useFakeTimers());

afterEach(() => {
  cleanup();
  jest.clearAllTimers();
  jest.useRealTimers();
  if (originalClipboard) {
    Object.defineProperty(navigator, "clipboard", originalClipboard);
  } else {
    Reflect.deleteProperty(navigator, "clipboard");
  }
});

const views = [
  { name: "v1", Component: DonationComp, copyName: /^Copy address$/, addressName: "Donation address" },
  { name: "v0", Component: ZcashUAZArt, copyName: /Copy Full Unified Address/, addressName: "Full unified address" },
];

describe.each(views)("$name donation copy", ({ name, Component, copyName, addressName }) => {
  it("waits for clipboard completion and prevents duplicate pending writes", async () => {
    const { user, writeText } = setupClipboard();
    const pending = deferredWrite();
    writeText.mockReturnValueOnce(pending.promise);
    render(<Component />);
    const button = screen.getByRole("button", { name: copyName });
    expect(screen.getByTestId("donation-qr")).toHaveAttribute("data-address", zcashAddress);
    if (name === "v1") expect(screen.getByText(zcashAddress)).toBeInTheDocument();

    await click(user, button);
    expect(screen.queryByText(/Copied to clipboard|✅ Copied!/)).not.toBeInTheDocument();
    expect(button).toBeDisabled();
    expect(screen.getByRole("status")).toHaveTextContent("Copying…");
    await click(user, button);
    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText).toHaveBeenCalledWith(zcashAddress);

    await act(async () => pending.resolve());
    expect(screen.getByRole("status")).toHaveTextContent("Copied to clipboard");
    expect(button).toBeEnabled();
  });

  it.each(["rejected", "unavailable"])("provides keyboard manual copying when the API is %s", async (mode) => {
    const { user, writeText } = setupClipboard();
    if (mode === "rejected") {
      writeText.mockRejectedValueOnce(new Error("Clipboard permission denied"));
    } else {
      Object.defineProperty(navigator, "clipboard", { configurable: true, value: undefined });
    }
    render(<Component />);
    const button = screen.getByRole("button", { name: copyName });
    const status = screen.getByRole("status");
    expect(status).toBeEmptyDOMElement();

    await click(user, button);

    expect(status).toHaveTextContent(failureMessage);
    expect(status).not.toHaveTextContent(/Copied to clipboard/);
    const address = screen.getByRole("textbox", { name: addressName }) as HTMLTextAreaElement;
    expect(address).toHaveAttribute("readonly");
    expect(address).toHaveValue(zcashAddress);
    await user.tab({ shift: name === "v1" });
    expect(address).toHaveFocus();
    expect(address.selectionStart).toBe(0);
    expect(address.selectionEnd).toBe(zcashAddress.length);
    expect(writeText).toHaveBeenCalledTimes(mode === "rejected" ? 1 : 0);

    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    await click(user, button);
    expect(status).toHaveTextContent("Copied to clipboard");
    expect(screen.queryByRole("textbox", { name: addressName })).not.toBeInTheDocument();
  });

  it("gives repeated successful copies a fresh feedback duration", async () => {
    const { user, writeText } = setupClipboard();
    render(<Component />);
    const button = screen.getByRole("button", { name: copyName });
    await click(user, button);
    act(() => jest.advanceTimersByTime(1500));
    await click(user, button);

    act(() => jest.advanceTimersByTime(500));
    expect(screen.getByRole("status")).toHaveTextContent("Copied to clipboard");
    act(() => jest.advanceTimersByTime(1499));
    expect(screen.getByRole("status")).toHaveTextContent("Copied to clipboard");
    act(() => jest.advanceTimersByTime(1));
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
    expect(writeText).toHaveBeenCalledTimes(2);
  });

  it("clears the feedback timer when unmounted", async () => {
    const { user } = setupClipboard();
    const { unmount } = render(<Component />);
    await click(user, screen.getByRole("button", { name: copyName }));
    expect(screen.getByRole("status")).toHaveTextContent("Copied to clipboard");
    const timersBeforeUnmount = jest.getTimerCount();
    expect(timersBeforeUnmount).toBeGreaterThan(0);

    unmount();

    expect(jest.getTimerCount()).toBe(timersBeforeUnmount - 1);
  });
});

describe("donation copy navigation", () => {
  it("clears previous feedback and blocks copying during the currency transition", async () => {
    const { user, writeText } = setupClipboard();
    render(<DonationComp />);
    const button = screen.getByRole("button", { name: "Copy address" });
    await click(user, button);
    expect(screen.getByRole("status")).toHaveTextContent("Copied to clipboard");

    await click(user, screen.getByRole("button", { name: /Ycash/ }));
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
    expect(button).toBeDisabled();
    await click(user, button);
    act(() => jest.advanceTimersByTime(399));
    expect(button).toBeDisabled();
    expect(writeText).toHaveBeenCalledTimes(1);
    act(() => jest.advanceTimersByTime(1));

    expect(button).toBeEnabled();
    expect(screen.getByText(ycashAddress)).toBeInTheDocument();
    expect(screen.getByTestId("donation-qr")).toHaveAttribute("data-address", ycashAddress);
    await click(user, button);
    expect(writeText).toHaveBeenLastCalledWith(ycashAddress);
  });

  it.each(["resolved", "rejected"])("ignores a %s old copy after changing currency", async (outcome) => {
    const { user, writeText } = setupClipboard();
    const pending = deferredWrite();
    writeText.mockReturnValueOnce(pending.promise);
    render(<DonationComp />);
    const button = screen.getByRole("button", { name: "Copy address" });
    await click(user, button);
    await click(user, screen.getByRole("button", { name: /Ycash/ }));
    act(() => jest.advanceTimersByTime(400));
    expect(screen.getByText(ycashAddress)).toBeInTheDocument();
    expect(button).toBeDisabled();
    await click(user, button);
    expect(writeText).toHaveBeenCalledTimes(1);

    await act(async () => {
      if (outcome === "resolved") pending.resolve();
      else pending.reject(new Error("Clipboard permission denied"));
    });

    expect(screen.getByRole("status")).toBeEmptyDOMElement();
    expect(button).toBeEnabled();
    await click(user, button);
    expect(writeText).toHaveBeenLastCalledWith(ycashAddress);
    expect(screen.getByRole("status")).toHaveTextContent("Copied to clipboard");
  });

  it("keeps a newly mounted donation view neutral after the old copy rejects", async () => {
    const { user, writeText } = setupClipboard();
    const pending = deferredWrite();
    writeText.mockReturnValueOnce(pending.promise);
    render(<DonationClientWrapper />);
    await click(user, screen.getByRole("button", { name: "Copy address" }));
    await click(user, screen.getByRole("tab", { name: "v0" }));
    const button = screen.getByRole("button", { name: /Copy Full Unified Address/ });
    expect(screen.getByRole("status")).toBeEmptyDOMElement();

    await act(async () => pending.reject(new Error("Clipboard permission denied")));

    expect(screen.getByRole("status")).toBeEmptyDOMElement();
    expect(button).toBeEnabled();
    expect(screen.queryByRole("textbox", { name: "Full unified address" })).not.toBeInTheDocument();
    await click(user, button);
    expect(writeText).toHaveBeenCalledTimes(2);
    expect(writeText).toHaveBeenLastCalledWith(zcashAddress);
    expect(screen.getByRole("status")).toHaveTextContent("Copied to clipboard");
  });
});

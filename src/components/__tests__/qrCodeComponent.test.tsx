import { TextDecoder, TextEncoder } from "util";
import { fireEvent, render, screen } from "@testing-library/react";
import NewsLetter from "../NewsLetter/NewsLetter";
import QRCodeComponent, {
  buildNewsletterPaymentUri,
} from "../QRComponent/QRCodeComponent";
import { parseZip321Uri } from "@/lib/zip321";

if (typeof globalThis.TextEncoder === "undefined") {
  globalThis.TextEncoder = TextEncoder as typeof globalThis.TextEncoder;
}
if (typeof globalThis.TextDecoder === "undefined") {
  globalThis.TextDecoder = TextDecoder as typeof globalThis.TextDecoder;
}

jest.mock("@/context/LanguageContext", () => ({
  useLanguage: () => ({ t: {} }),
}));

describe("QRCodeComponent ZIP-321 payment URI generation", () => {
  beforeEach(() => {
    jest.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
      scale: jest.fn(),
      fillRect: jest.fn(),
    } as unknown as CanvasRenderingContext2D);
  });

  afterEach(() => jest.restoreAllMocks());

  it("uses the caller's exact amount (0.0001 ZEC) and omits undefined prefix for newsletter unsubscribe", () => {
    const openSpy = jest.spyOn(window, "open").mockImplementation(() => null);
    render(<NewsLetter />);

    fireEvent.click(screen.getByRole("button", { name: "Unsubscribe" }));
    fireEvent.change(
      screen.getByPlaceholderText("Enter your Unified Address to unsubscribe"),
      { target: { value: "u1syntheticunsubscribeaddress" } },
    );
    fireEvent.click(screen.getByRole("button", { name: "Confirm Unsubscribe" }));

    fireEvent.click(screen.getByText("Tap QR to send payment"));

    expect(openSpy).toHaveBeenCalledTimes(1);
    const uri = openSpy.mock.calls[0][0] as string;
    const [payment] = parseZip321Uri(uri);

    expect(payment.amount).toBe("0.0001");
    expect(payment.memo).toBe(
      "e0 f0 | UNSUBSCRIBE | Address: u1syntheticunsubscribeaddress",
    );
    expect(payment.memo).not.toContain("undefined");
  });

  it("uses 0.05 ZEC and clean memo formatting for newsletter subscription", () => {
    const openSpy = jest.spyOn(window, "open").mockImplementation(() => null);
    render(<NewsLetter />);

    fireEvent.change(
      screen.getByPlaceholderText("Enter your Zcash Unified Address"),
      { target: { value: "u1syntheticsubscribeaddress" } },
    );
    fireEvent.click(screen.getByRole("button", { name: "Subscribe" }));

    fireEvent.click(screen.getByText("Tap QR to send payment"));

    expect(openSpy).toHaveBeenCalledTimes(1);
    const uri = openSpy.mock.calls[0][0] as string;
    const [payment] = parseZip321Uri(uri);

    expect(payment.amount).toBe("0.05");
    expect(payment.memo).toBe(
      "e0 f0 | Subscription: Ecosystem News | Address: u1syntheticsubscribeaddress",
    );
    expect(payment.memo).not.toContain("undefined");
  });

  it("includes explicit prefix and option fees without floating-point drift", () => {
    const uri = buildNewsletterPaymentUri({
      amount: 0.05,
      prefix: "ZEC",
      memo: "hello",
      encrypt: true,
      fec: true,
    });
    const [payment] = parseZip321Uri(uri);

    expect(payment.amount).toBe("0.15");
    expect(payment.memo).toBe("ZEC e1 f1 | hello");
  });

  it("defaults amount to 0.05 ZEC when omitted and omits trailing className undefined", () => {
    const openSpy = jest.spyOn(window, "open").mockImplementation(() => null);
    const { container } = render(<QRCodeComponent memo="default check" />);
    const card = container.firstElementChild as HTMLElement;

    expect(card.className).not.toContain("undefined");

    fireEvent.click(card);
    const uri = openSpy.mock.calls[0][0] as string;
    const [payment] = parseZip321Uri(uri);

    expect(payment.amount).toBe("0.05");
    expect(payment.memo).toBe("e0 f0 | default check");
  });
});

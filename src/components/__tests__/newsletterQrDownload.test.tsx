import { fireEvent, render, screen } from "@testing-library/react";
import NewsLetter from "../NewsLetter/NewsLetter";
import QRCodeComponent from "../QRComponent/QRCodeComponent";

jest.mock("@/context/LanguageContext", () => ({
  useLanguage: () => ({ t: {} }),
}));

describe("newsletter QR downloads", () => {
  let toDataURL: jest.SpyInstance;
  let click: jest.SpyInstance;
  let downloads: { href: string; filename: string }[];

  beforeEach(() => {
    downloads = [];
    // Keep the real QR renderer; jsdom does not implement canvas drawing.
    jest.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
      scale: jest.fn(),
      fillRect: jest.fn(),
    } as unknown as CanvasRenderingContext2D);
    toDataURL = jest.spyOn(HTMLCanvasElement.prototype, "toDataURL")
      .mockReturnValue("data:image/png;base64,c3ludGhldGlj");
    click = jest.spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(function (this: HTMLAnchorElement) {
        downloads.push({ href: this.href, filename: this.download });
      });
  });

  afterEach(() => jest.restoreAllMocks());

  it("keeps SVG rendering for callers that do not request a PNG canvas", () => {
    const { container } = render(<QRCodeComponent memo="synthetic memo" />);
    expect(container.querySelector("svg")).not.toBeNull();
    expect(container.querySelector("canvas")).toBeNull();
  });

  function subscribe() {
    fireEvent.change(screen.getByPlaceholderText("Enter your Zcash Unified Address"), {
      target: { value: "u-synthetic-subscription" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Subscribe" }));
  }

  function unsubscribe() {
    fireEvent.click(screen.getByRole("button", { name: "Unsubscribe" }));
    fireEvent.change(screen.getByPlaceholderText("Enter your Unified Address to unsubscribe"), {
      target: { value: "u-synthetic-unsubscribe" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Confirm Unsubscribe" }));
  }

  it("downloads the subscription QR as a PNG", () => {
    const { container } = render(<NewsLetter />);
    subscribe();
    fireEvent.click(screen.getByRole("button", { name: "Download QR Code" }));

    expect(downloads).toEqual([{
      href: "data:image/png;base64,c3ludGhldGlj", filename: "subscription_qr.png",
    }]);
    expect(container.querySelectorAll("canvas")).toHaveLength(1);
    expect(toDataURL).toHaveBeenCalledWith("image/png");
    expect(toDataURL.mock.contexts[0]).toBe(container.querySelector("canvas"));
    expect(click).toHaveBeenCalledTimes(1);
  });

  it("downloads the unsubscribe QR when no subscription QR exists", () => {
    const { container } = render(<NewsLetter />);
    unsubscribe();
    fireEvent.click(screen.getByRole("button", { name: "Download QR Code" }));

    expect(downloads[0]?.filename).toBe("unsubscribe_qr.png");
    expect(container.querySelectorAll("canvas")).toHaveLength(1);
    expect(toDataURL.mock.contexts[0]).toBe(container.querySelector("canvas"));
  });

  it("exports each matching QR when both are visible and another canvas exists", () => {
    const { container } = render(<><canvas data-testid="unrelated" /><NewsLetter /></>);
    subscribe();
    unsubscribe();
    const canvases = container.querySelectorAll("canvas");
    const buttons = screen.getAllByRole("button", { name: "Download QR Code" });
    fireEvent.click(buttons[1]);
    fireEvent.click(buttons[0]);

    expect(canvases).toHaveLength(3);
    expect(toDataURL.mock.contexts).toEqual([canvases[2], canvases[1]]);
    expect(downloads.map(({ filename }) => filename))
      .toEqual(["unsubscribe_qr.png", "subscription_qr.png"]);
  });
});

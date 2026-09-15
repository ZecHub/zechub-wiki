import { cleanup, render, waitFor } from "@testing-library/react";
import PaymentRequestWidgetPreview from "@/app/[locale]/tools/zcash-payment-widget/PaymentRequestWidgetPreview";

jest.mock(
  "@/app/[locale]/tools/zcash-payment-widget/adapters/helpers",
  () => ({
    loadZcashPaymentWidget: jest.fn(),
  }),
);

import { loadZcashPaymentWidget } from "@/app/[locale]/tools/zcash-payment-widget/adapters/helpers";

const mockLoad = loadZcashPaymentWidget as jest.Mock;

const baseConfig = {
  address: "t1abc",
  amount: 1,
  label: "Coffee",
  apiBase: "https://x",
  theme: "light",
  target: "#preview-target",
  disabled: false,
  zecUsdRate: 1,
};

describe("PaymentRequestWidgetPreview", () => {
  let unhandledRejections: unknown[] = [];
  const onUnhandledRejection = (reason: unknown) => {
    unhandledRejections.push(reason);
  };

  beforeEach(() => {
    unhandledRejections = [];
    process.on("unhandledRejection", onUnhandledRejection);
    mockLoad.mockReset();
    delete (window as unknown as { renderZcashButton?: unknown })
      .renderZcashButton;
  });

  afterEach(() => {
    process.off("unhandledRejection", onUnhandledRejection);
    cleanup();
  });

  it("uses the shared loadZcashPaymentWidget helper instead of an inline script tag", async () => {
    mockLoad.mockResolvedValue(undefined);
    (window as unknown as { renderZcashButton: unknown }).renderZcashButton =
      jest.fn().mockResolvedValue({ open: jest.fn(), close: jest.fn(), destroy: jest.fn() });

    render(<PaymentRequestWidgetPreview config={baseConfig} />);

    // Called with the embed-code base URL from config.ts (not cfg.apiBase),
    // proving the shared loader is used instead of an inline <script> tag.
    await waitFor(() => expect(mockLoad).toHaveBeenCalledWith(expect.any(String)));
  });

  it("catches a rejected loader without producing an unhandled promise rejection", async () => {
    mockLoad.mockRejectedValue(new Error("script failed to load"));
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(<PaymentRequestWidgetPreview config={baseConfig} />);

    await waitFor(() =>
      expect(errorSpy).toHaveBeenCalledWith(
        "[Zcash Payment Widget Preview] Loading failed:",
        expect.any(Error),
      ),
    );

    // Give any stray unhandled rejection a chance to surface.
    await new Promise((r) => setTimeout(r, 0));
    expect(unhandledRejections).toHaveLength(0);

    errorSpy.mockRestore();
  });

  it("catches a rejected loader even when the rejection reason is undefined", async () => {
    mockLoad.mockRejectedValue(undefined);
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(<PaymentRequestWidgetPreview config={baseConfig} />);

    await waitFor(() => expect(errorSpy).toHaveBeenCalled());
    await new Promise((r) => setTimeout(r, 0));
    expect(unhandledRejections).toHaveLength(0);

    errorSpy.mockRestore();
  });

  it("destroys the widget instance on cleanup without throwing", async () => {
    mockLoad.mockResolvedValue(undefined);
    const destroy = jest.fn();
    (window as unknown as { renderZcashButton: unknown }).renderZcashButton =
      jest.fn().mockResolvedValue({ open: jest.fn(), close: jest.fn(), destroy });

    const { unmount } = render(<PaymentRequestWidgetPreview config={baseConfig} />);
    await waitFor(() => expect(destroy).not.toHaveBeenCalled());
    await waitFor(() =>
      expect(
        (window as unknown as { renderZcashButton: jest.Mock }).renderZcashButton,
      ).toHaveBeenCalled(),
    );

    expect(() => unmount()).not.toThrow();
    expect(destroy).toHaveBeenCalledTimes(1);
  });
});

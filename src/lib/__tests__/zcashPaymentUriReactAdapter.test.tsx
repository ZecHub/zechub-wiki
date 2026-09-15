import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { ZcashPaymentURI } from "@/app/[locale]/tools/zcash-payment-widget/adapters/react";

jest.mock(
  "@/app/[locale]/tools/zcash-payment-widget/adapters/helpers",
  () => ({
    loadZcashPaymentWidget: jest.fn(),
    logZcashPaymentWidgetEvent: jest.fn(),
  }),
);

import {
  loadZcashPaymentWidget,
  logZcashPaymentWidgetEvent,
} from "@/app/[locale]/tools/zcash-payment-widget/adapters/helpers";

const mockLoad = loadZcashPaymentWidget as jest.Mock;
const mockLog = logZcashPaymentWidgetEvent as jest.Mock;

describe("ZcashPaymentURI (React adapter)", () => {
  beforeEach(() => {
    mockLoad.mockReset().mockResolvedValue(undefined);
    mockLog.mockReset();
    delete (window as unknown as { renderZcashButton?: unknown })
      .renderZcashButton;
  });

  afterEach(() => {
    cleanup();
  });

  it("awaits renderZcashButton and calls the real destroy() on unmount without throwing", async () => {
    const destroy = jest.fn();
    const renderZcashButton = jest.fn().mockResolvedValue({
      open: jest.fn(),
      close: jest.fn(),
      destroy,
    });
    (window as unknown as { renderZcashButton: unknown }).renderZcashButton =
      renderZcashButton;

    const { unmount } = render(
      <ZcashPaymentURI address="t1abc" amount={1} apiBase="https://x" />,
    );

    await waitFor(() => expect(renderZcashButton).toHaveBeenCalled());

    expect(() => unmount()).not.toThrow();
    expect(destroy).toHaveBeenCalledTimes(1);
  });

  it("reaches the error state when the loader rejects with undefined (no Error object)", async () => {
    mockLoad.mockReset().mockRejectedValue(undefined);

    render(<ZcashPaymentURI address="t1abc" amount={1} apiBase="https://x" />);

    expect(
      await screen.findByText("Zcash payment widget not available."),
    ).toBeInTheDocument();
  });

  it("reaches the error state even if the failure-telemetry call itself throws", async () => {
    mockLoad.mockReset().mockRejectedValue(new Error("network down"));
    mockLog.mockImplementation((event: string) => {
      if (event === "zcash_payment_widget_load_failed") {
        throw new Error("telemetry endpoint down");
      }
    });

    render(<ZcashPaymentURI address="t1abc" amount={1} apiBase="https://x" />);

    expect(
      await screen.findByText("Zcash payment widget not available."),
    ).toBeInTheDocument();
  });

  it("does not tear down and reinitialize when props identity changes but values do not", async () => {
    const renderZcashButton = jest.fn().mockResolvedValue({
      open: jest.fn(),
      close: jest.fn(),
      destroy: jest.fn(),
    });
    (window as unknown as { renderZcashButton: unknown }).renderZcashButton =
      renderZcashButton;

    const { rerender } = render(
      <ZcashPaymentURI address="t1abc" amount={1} apiBase="https://x" />,
    );
    await waitFor(() => expect(renderZcashButton).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(mockLoad).toHaveBeenCalledTimes(1));

    // A fresh object with identical primitive values (e.g. a parent
    // re-render passing a new inline object) must not re-trigger init.
    rerender(<ZcashPaymentURI address="t1abc" amount={1} apiBase="https://x" />);

    expect(mockLoad).toHaveBeenCalledTimes(1);
    expect(renderZcashButton).toHaveBeenCalledTimes(1);

    // Changing an actual value must still re-trigger init.
    rerender(<ZcashPaymentURI address="t1abc" amount={2} apiBase="https://x" />);
    await waitFor(() => expect(renderZcashButton).toHaveBeenCalledTimes(2));
  });
});

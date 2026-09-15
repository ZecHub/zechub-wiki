import { render } from "@testing-library/react";
import { ZcashPaymentURINextJs } from "@/app/[locale]/tools/zcash-payment-widget/adapters/nextjs";

const mockZcashPaymentURI = jest.fn((_props: unknown) => null);

jest.mock("@/app/[locale]/tools/zcash-payment-widget/adapters/react", () => ({
  ZcashPaymentURI: (props: unknown) => mockZcashPaymentURI(props),
}));

describe("ZcashPaymentURINextJs", () => {
  beforeEach(() => {
    mockZcashPaymentURI.mockClear();
  });

  it("forwards memo and zecUsdRate (previously silently dropped) to the React adapter", () => {
    render(
      <ZcashPaymentURINextJs
        address="t1abc"
        amount={1}
        apiBase="https://x"
        memo="hello"
        zecUsdRate={42}
        label="Coffee"
        theme="dark"
        disabled={false}
      />,
    );

    expect(mockZcashPaymentURI).toHaveBeenCalledWith(
      expect.objectContaining({
        address: "t1abc",
        amount: 1,
        apiBase: "https://x",
        memo: "hello",
        zecUsdRate: 42,
        label: "Coffee",
        theme: "dark",
        disabled: false,
      }),
    );
  });

  it("still forwards the previously-supported props unchanged", () => {
    render(
      <ZcashPaymentURINextJs
        address="t1abc"
        amount={1}
        apiBase="https://x"
        disabled
        label="Coffee"
        theme="light"
      />,
    );

    expect(mockZcashPaymentURI).toHaveBeenCalledWith(
      expect.objectContaining({
        address: "t1abc",
        amount: 1,
        apiBase: "https://x",
        disabled: true,
        label: "Coffee",
        theme: "light",
      }),
    );
  });
});

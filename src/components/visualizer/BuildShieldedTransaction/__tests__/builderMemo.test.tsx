import { TextEncoder } from "util";
import { fireEvent, render, screen } from "@testing-library/react";
import { BuilderStage } from "../BuildShieldedTransactionContent";

const originalTextEncoder = Object.getOwnPropertyDescriptor(globalThis, "TextEncoder");
const originalFetch = global.fetch;

beforeAll(() => {
  // jsdom does not provide the browser's TextEncoder API.
  Object.defineProperty(globalThis, "TextEncoder", {
    configurable: true,
    value: TextEncoder,
  });
  global.fetch = jest.fn().mockResolvedValue({ json: async () => ({}) });
});

afterAll(() => {
  global.fetch = originalFetch;
  if (originalTextEncoder) {
    Object.defineProperty(globalThis, "TextEncoder", originalTextEncoder);
  } else {
    delete (globalThis as { TextEncoder?: unknown }).TextEncoder;
  }
});

describe("builder memo UTF-8 limit", () => {
  it.each([
    ["512 ASCII characters", "a".repeat(512), "a".repeat(512), 512],
    ["513 ASCII characters", "a".repeat(513), "a".repeat(512), 512],
    ["300 accented characters", "é".repeat(300), "é".repeat(256), 512],
    ["128 emoji", "🙂".repeat(128), "🙂".repeat(128), 512],
    ["129 emoji", "🙂".repeat(129), "🙂".repeat(128), 512],
    ["a whole emoji at the boundary", "a".repeat(508) + "🙂", "a".repeat(508) + "🙂", 512],
    ["an emoji crossing the boundary", "a".repeat(511) + "🙂", "a".repeat(511), 511],
    ["three-byte characters", "界".repeat(171), "界".repeat(170), 510],
    ["an empty memo", "", "", 0],
  ])("limits %s without splitting a code point", (_name, input, expected, bytes) => {
    render(<BuilderStage />);
    const memo = screen.getByRole("textbox");

    fireEvent.change(memo, { target: { value: input } });

    expect(memo).toHaveValue(expected);
    expect(screen.getByText(`${bytes}/512 bytes`)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Simulate Broadcast" })).toBeEnabled();
  });

  it("keeps the memo disabled for a transparent destination", () => {
    render(<BuilderStage />);
    const memo = screen.getByRole("textbox");
    fireEvent.change(memo, { target: { value: "é".repeat(300) } });

    // The first pool selector is the source; the second is the destination.
    fireEvent.click(screen.getAllByRole("button", { name: "Transparent" })[1]);

    expect(memo).toBeDisabled();
    expect(screen.queryByText(/\/512 bytes/)).not.toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: "Ironwood" })[1]);

    expect(memo).toBeEnabled();
    expect(memo).toHaveValue("é".repeat(256));
    expect(screen.getByText("512/512 bytes")).toBeInTheDocument();
  });
});

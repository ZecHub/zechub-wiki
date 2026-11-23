import { qrCodeBodySchema } from "../qrcode.schema";

describe("qrCodeBodySchema", () => {
  const validAddress = "u1" + "a".repeat(100);

  it("accepts a normal payment request", () => {
    const r = qrCodeBodySchema.safeParse({
      address: validAddress,
      amount: "1.5",
      label: "Coffee",
      message: "Thanks",
      memo: "Order #42",
    });
    expect(r.success).toBe(true);
  });

  it("requires a non-empty address", () => {
    expect(qrCodeBodySchema.safeParse({ address: "" }).success).toBe(false);
  });

  it("rejects over-long fields (input-size bound)", () => {
    expect(qrCodeBodySchema.safeParse({ address: "u".repeat(1025) }).success).toBe(false);
    expect(
      qrCodeBodySchema.safeParse({ address: validAddress, label: "x".repeat(257) }).success,
    ).toBe(false);
    expect(
      qrCodeBodySchema.safeParse({ address: validAddress, message: "x".repeat(513) }).success,
    ).toBe(false);
    expect(
      qrCodeBodySchema.safeParse({ address: validAddress, memo: "x".repeat(1025) }).success,
    ).toBe(false);
    expect(
      qrCodeBodySchema.safeParse({ address: validAddress, amount: "9".repeat(65) }).success,
    ).toBe(false);
  });
});

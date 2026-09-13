import { detectZcashNetwork } from ".";

describe("detectZcashNetwork", () => {
  it.each([
    ["t1-mainnet", "t1example", "mainnet"],
    ["t3-mainnet", "t3example", "mainnet"],
    ["sapling-mainnet", "zs1example", "mainnet"],
    ["unified-mainnet", "u1example", "mainnet"],
    ["tex-mainnet", "tex1example", "mainnet"],
    ["transparent-testnet", "tmexample", "testnet"],
    ["p2sh-testnet", "t2example", "testnet"],
    ["sapling-testnet", "ztestsaplingexample", "testnet"],
    ["unified-testnet", "utest1example", "testnet"],
    ["tex-testnet", "textest1example", "testnet"],
  ])("detects %s", (_name, address, expected) => {
    expect(detectZcashNetwork(address)).toBe(expected);
  });

  it("does not guess a network for malformed input", () => {
    expect(detectZcashNetwork("garbage")).toBe("unknown");
    expect(detectZcashNetwork("")).toBe("unknown");
  });
});

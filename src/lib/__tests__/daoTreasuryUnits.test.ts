import { decimalsFor, formatUnits, toUnits, tokenName } from "@/lib/daoTreasuryUnits";

// Balances straight from public/data/juno/ZecHub_Treasury.json.
describe("DAO treasury units", () => {
  it("reads the base unit from the ticker", () => {
    expect(decimalsFor("JUNO")).toBe(6);
    expect(decimalsFor("OSMO")).toBe(6);
    expect(decimalsFor("PENUMBRA")).toBe(6);
    expect(decimalsFor("WETH-WEI")).toBe(18);
    expect(decimalsFor("WAVAX-WEI")).toBe(18);
    expect(decimalsFor("AEVMOS")).toBe(18);
    expect(decimalsFor("DOT-PLANCK")).toBe(10);
    expect(decimalsFor("WBTC-SATOSHI")).toBe(8);
  });

  it("converts treasury balances to whole tokens", () => {
    expect(toUnits("JUNO", "1288342459")).toBeCloseTo(1288.342459, 6);
    expect(toUnits("AEVMOS", "3650769862342461707435")).toBeCloseTo(3650.77, 2);
    expect(toUnits("WETH-WEI", "104768686933639")).toBeCloseTo(0.000104768686933639, 15);
    expect(toUnits("WAVAX-WEI", "9686748194467294")).toBeCloseTo(0.009686748194467294, 12);
    expect(toUnits("DOT-PLANCK", "47594753078")).toBeCloseTo(4.7594753078, 9);
    expect(toUnits("WBTC-SATOSHI", "82")).toBeCloseTo(0.00000082, 12);
    expect(toUnits("JUNO", "not a number")).toBe(0);
  });

  it("formats large and small amounts readably", () => {
    expect(formatUnits(3650.769862342461)).toBe((3650.77).toLocaleString(undefined, { maximumFractionDigits: 2 }));
    expect(formatUnits(0.000104768686933639)).toBe((0.000105).toLocaleString(undefined, { maximumSignificantDigits: 3 }));
    expect(formatUnits(0)).toBe("0");
  });

  it("names the token, not its base unit", () => {
    expect(tokenName("WETH-WEI")).toBe("WETH");
    expect(tokenName("DOT-PLANCK")).toBe("DOT");
    expect(tokenName("WBTC-SATOSHI")).toBe("WBTC");
    expect(tokenName("AEVMOS")).toBe("EVMOS");
    expect(tokenName("JUNO")).toBe("JUNO");
  });
});

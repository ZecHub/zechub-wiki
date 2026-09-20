import { parseVenueMarkdown } from "../parseVenueMarkdown";

const custodialSample = `
# Custodial Exchanges

Intro text that is not a venue.

### [Backpack](https://backpack.exchange)

<a href="https://backpack.exchange">
    <img src="/content-images/_unavailable.svg" alt="Backpack Logo" width="200" height="100"/>
</a>

- Website: [Backpack](https://backpack.exchange)
- Pairs: ZEC/USDC | ZEC-PERP
- Supports: Deposits and withdrawals enabled. Address types not stated
- Deposit Time: Not stated
- Ironwood: Not stated
___

## [OKEx](https://okex.com)

- Website: [OKEx](https://okex.com)
- Pairs: ALL/ZEC
- Supports: Transparent
- Deposit Time: 25 Minutes
- Ironwood: Not applicable, transparent addresses only
`;

const dexSample = `
# Decentralised Exchanges

Do your own research.

### Near-intents
- Website: https://app.near-intents.org/
- Description: Fast exchange with the support of NEAR.
- Logo: /nearintents.png
`;

describe("parseVenueMarkdown", () => {
  it("parses custodial heading links, images, and field list", () => {
    const venues = parseVenueMarkdown(custodialSample);
    expect(venues).toHaveLength(2);
    expect(venues[0]).toMatchObject({
      name: "Backpack",
      url: "https://backpack.exchange",
      pairs: "ZEC/USDC | ZEC-PERP",
      support: "Deposits and withdrawals enabled. Address types not stated",
      depositTime: "Not stated",
      ironwood: "Not stated",
      logo: "/content-images/_unavailable.svg",
      altText: "Backpack Logo",
    });
    expect(venues[1].name).toBe("OKEx");
    expect(venues[1].url).toBe("https://okex.com");
  });

  it("parses DEX description/logo blocks", () => {
    const [venue] = parseVenueMarkdown(dexSample);
    expect(venue).toMatchObject({
      name: "Near-intents",
      url: "https://app.near-intents.org/",
      description: "Fast exchange with the support of NEAR.",
      logo: "/nearintents.png",
    });
  });

  it("returns [] for empty input", () => {
    expect(parseVenueMarkdown("")).toEqual([]);
  });
});

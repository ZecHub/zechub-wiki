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

// Localized bullet labels.
//
// The venue pages ship in 18 locales and their bullet LABELS are translated
// too. Lookup used to be English-only, which failed in three different ways
// depending on the locale: fr worked by luck (its translation kept the word
// "Description"), de rendered cards with no description, and it/es/pt/ar/zh/hi
// and the rest parsed to zero venues — so the caller fell back to a hardcoded
// English list and served English cards under every locale prefix.
describe("parseVenueMarkdown — localized labels", () => {
  const venue = (labels: Record<string, string>) => `
### [LetsExchange](https://letsexchange.io)

${Object.entries(labels).map(([k, v]) => `- ${k}: ${v}`).join("\n")}
___
`;

  it("parses Italian labels", () => {
    const [v] = parseVenueMarkdown(venue({
      "Sito web": "[LetsExchange](https://letsexchange.io)",
      Coppie: "ZEC/BTC",
      Descrizione: "Un hub di exchange crypto.",
    }));
    expect(v.description).toBe("Un hub di exchange crypto.");
    expect(v.pairs).toBe("ZEC/BTC");
  });

  it("parses German labels — the case that rendered empty cards", () => {
    const [v] = parseVenueMarkdown(venue({
      Website: "[LetsExchange](https://letsexchange.io)",
      Beschreibung: "Eine Krypto-Börse.",
      Handelspaare: "ZEC/BTC",
    }));
    expect(v.description).toBe("Eine Krypto-Börse.");
    expect(v.pairs).toBe("ZEC/BTC");
  });

  it("parses a full-width colon, which Chinese uses", () => {
    const md = `
### [LetsExchange](https://letsexchange.io)

- 网站：[LetsExchange](https://letsexchange.io)
- 描述：一个加密货币交易平台。
___
`;
    const [v] = parseVenueMarkdown(md);
    // Before the fix the regex matched the ASCII colon inside "https://", so
    // the key was "网站：https" and the value a URL fragment.
    expect(v.url).toBe("https://letsexchange.io");
    expect(v.description).toBe("一个加密货币交易平台。");
  });

  it("parses non-Latin labels across scripts", () => {
    for (const [label, text] of [
      ["الوصف", "منصة تبادل"],
      ["説明", "暗号資産取引所"],
      ["설명", "암호화폐 거래소"],
      ["Описание", "Криптобиржа"],
      ["विवरण", "क्रिप्टो एक्सचेंज"],
    ] as const) {
      const [v] = parseVenueMarkdown(venue({ [label]: text, Website: "https://x.io" }));
      expect(v.description).toBe(text);
    }
  });

  it("still parses the English labels", () => {
    const [v] = parseVenueMarkdown(venue({
      Website: "[LetsExchange](https://letsexchange.io)",
      Pairs: "ZEC/BTC",
      Description: "A crypto exchange hub.",
    }));
    expect(v.description).toBe("A crypto exchange hub.");
    expect(v.url).toBe("https://letsexchange.io");
  });
});

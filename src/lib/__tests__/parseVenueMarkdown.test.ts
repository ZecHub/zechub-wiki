import { parseVenueMarkdown } from "../parseVenueMarkdown";
import { CORPUS_LABELS } from "../__fixtures__/venueLabels";

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

  // A full custodial fixture, per locale, asserting every field by VALUE.
  //
  // Added after review: the cases above assert description, pairs and url, so
  // the support / depositTime / ironwood aliases — 76 of the 109 — were
  // exercised by nothing. Verified by mutation: deleting every one of them left
  // the whole suite green, while custodial cards would silently lose those rows.
  //
  // Equality, not truthiness. A parser that CROSSED two aliases — mapping the
  // "supports" label to depositTime and vice versa — satisfies a `toBeTruthy()`
  // on both, in every locale. Each field carries a distinct value here so a
  // swap fails.
  it.each([
    ["it", "Sito web", "Coppie", "Supporta", "Tempo di deposito", "Ironwood", "Descrizione"],
    ["de", "Website", "Handelspaare", "Unterstützt", "Einzahlungszeit", "Ironwood", "Beschreibung"],
    ["ja", "ウェブサイト", "取引ペア", "対応", "入金時間", "Ironwood", "説明"],
    ["ar", "الموقع الإلكتروني", "الأزواج", "يدعم", "وقت الإيداع", "Ironwood", "الوصف"],
    ["yo", "Ojú-ìwé", "Àwọn méjì", "Awọn atilẹyin", "Àkókò Ìdókòwò", "Igi irin", "Àpèjúwe"],
  ])(
    "parses every custodial field in %s",
    (_locale, wWebsite, wPairs, wSupport, wDeposit, wIronwood, wDescription) => {
      // Distinct value per field: a crossed alias mapping cannot satisfy these.
      const [v] = parseVenueMarkdown(
        venue({
          [wWebsite]: "https://backpack.exchange",
          [wPairs]: "ZEC/USDC",
          [wSupport]: "value-for-support",
          [wDeposit]: "value-for-deposit-time",
          [wIronwood]: "value-for-ironwood",
          [wDescription]: "value-for-description",
        }),
      );
      expect(v.url).toBe("https://backpack.exchange");
      expect(v.pairs).toBe("ZEC/USDC");
      expect(v.support).toBe("value-for-support");
      expect(v.depositTime).toBe("value-for-deposit-time");
      expect(v.ironwood).toBe("value-for-ironwood");
      expect(v.description).toBe("value-for-description");
    },
  );

  // Every label the corpus actually uses, checked against an INDEPENDENT oracle.
  //
  // The fixture is generated from the translated markdown, not from
  // FIELD_ALIASES. That distinction is the whole point: a table-driven test
  // that reads the table under test passes by construction — my first attempt
  // did exactly that, and two mutations (remapping "support" to depositTime in
  // 13 locales, rewriting the Turkish key without its combining dot) sailed
  // through it. An oracle has to come from somewhere the change cannot touch.
  it.each(CORPUS_LABELS)("corpus label %s -> %s", (label, field) => {
    const value =
      field === "url" || field === "logo" ? "https://example.test/x" : `value-for-${field}`;
    const [v] = parseVenueMarkdown(`
### [Example](https://example.test)

- ${label}: ${value}
___
`);
    expect(v?.[field as keyof typeof v]).toBe(value);
  });

  // A URL with trailing punctuation, e.g. a sentence ending in "…(url)."
  //
  // extractUrl strips a trailing ")./," run. An adversarial pass showed that
  // deleting that cleanup passed all 127 cases, because every fixture URL here
  // is clean. Pinning it now: the cleanup is pre-existing behaviour this change
  // relies on to build card links.
  it("strips trailing punctuation from a bare URL", () => {
    const [v] = parseVenueMarkdown(`
### Example

- Website: Visit https://example.test/path).
___
`);
    expect(v.url).toBe("https://example.test/path");
  });

  // French writes "Paires :" — a space BEFORE the colon, per its typography.
  // 55 bullets in the French corpus do this and no other locale does, so the
  // .trim() in applyField is load-bearing for exactly one language and was
  // pinned by nothing.
  it("parses the French space-before-colon form", () => {
    const [v] = parseVenueMarkdown(`
### [Example](https://example.test)

- Paires : ZEC/BTC
- Délai de dépôt : Non indiqué
- Description : Une plateforme.
___
`);
    expect(v.pairs).toBe("ZEC/BTC");
    expect(v.depositTime).toBe("Non indiqué");
    expect(v.description).toBe("Une plateforme.");
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

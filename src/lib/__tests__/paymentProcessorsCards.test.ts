/**
 * The Payment Processors guide turns its comparison table into one card per
 * provider. Each card's "Read the details" link jumps to that provider's
 * section further down the page, so the card's anchor must be the id of the
 * section heading, which is built from the heading's name.
 */

import { PROCESSORS_MARKER, rewritePaymentProcessorsGuide } from "../pageOverrides/paymentProcessorsGuide";

const guide = `# Zcash Payment Processors

Ways to accept ZEC as a merchant, compared side by side.

<div class="processor-table">

| Processor | Custody | Shielded ZEC | Self-host | Merchant fee | Regions / KYC | Verified |
|:--|:--|:--|:--|:--|:--|:--|
| [ZGo](https://zgo.cash/) | Non-custodial | Yes, Sapling and Orchard | No, hosted service | Prepaid session | Not stated | 2026-07-29 |
| [NOWPayments](https://nowpayments.io/) | Non-custodial by default | No, transparent addresses | No | 0.5% | KYC for fiat | 2026-07-29 |
| [Plisio — payments suspended](https://plisio.net/) | Custodial, despite marketing | Not documented | No | 0.5% API | No KYC to receive | 2026-07-29 |

</div>

### What the columns mean

**Custody** is whether the processor holds your ZEC.

### Which one to pick

For a hosted gateway where transparent payments are acceptable, use **NOWPayments**.

---

## [ZGo](https://zgo.cash/) <img src="/content-images/zgo-mark.webp" alt="ZGo logo" class="processor-logo" />
- **Support Type**: Shielded
- **Description**: ZGo is a point-of-sale service.
- **URL**: [ZGo](https://zgo.cash/)

**Last verified:** 2026-07-29

---

## [NOWPayments](https://nowpayments.io/) <img src="/content-images/nowpayments-wordmark.png" alt="NOWPayments logo" class="processor-logo" />
- **Support Type**: Transparent
- **Description**: NOWPayments is a hosted gateway.
- **URL**: [NOWPayments](https://nowpayments.io/)

**Last verified:** 2026-07-29

---

## [Plisio](https://plisio.net/) <img src="/content-images/plisio-wordmark.png" alt="Plisio logo" class="processor-logo processor-logo-wide" />

> **Payments suspended — checked 12 November 2026.** Plisio says payments are temporarily suspended.

- **Support Type**: Transparent (not documented)
- **Description**: Plisio is a cryptocurrency payment gateway.
- **URL**: [Plisio](https://plisio.net/)

**Last verified:** 2026-07-29

---

### No longer accepting ZEC

**CoinGate** does not list ZEC.
`;

type Card = { name: string; href: string; anchor: string };

function cardsOf(page: string): Card[] {
  const start = page.indexOf(PROCESSORS_MARKER);
  expect(start).toBeGreaterThan(-1);
  const end = page.indexOf("]]", start);
  return JSON.parse(Buffer.from(page.slice(start + PROCESSORS_MARKER.length, end), "base64").toString("utf8"));
}

const byHref = (cards: Card[], href: string) => cards.find((c) => c.href === href);

describe("payment processor cards", () => {
  const page = rewritePaymentProcessorsGuide(guide);
  const cards = cardsOf(page);

  it("links a provider with a status note in its table name to its own section", () => {
    expect(page).toContain("## [Plisio](https://plisio.net/)");
    expect(byHref(cards, "https://plisio.net/")?.anchor).toBe("plisio");
  });

  it("keeps the status note on the card", () => {
    expect(byHref(cards, "https://plisio.net/")?.name).toBe("Plisio — payments suspended");
  });

  it("links providers with plain names to their sections", () => {
    expect(byHref(cards, "https://zgo.cash/")?.anchor).toBe("zgo");
    expect(byHref(cards, "https://nowpayments.io/")?.anchor).toBe("nowpayments");
  });
});

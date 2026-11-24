import { readBoundedJsonBody } from "@/lib/apiRequestGuards";
import { NextRequest, NextResponse } from "next/server";
import { priceFeedBodySchema } from "./schema/price-feed-body.schema";
import { getZcashPrice } from "./utils/get-zec-price";

// The DIA quotation endpoint documented in .env.example. Used when
// BASE_URL_ZCASH_PRICE_FEED is unset or blank: `String(undefined)` used to
// hand fetch() the literal URL "undefined", so every request failed and the
// route answered 503 for every caller, which is what production returns today.
const DEFAULT_PRICE_FEED_URL =
  "https://api.diadata.org/v1/assetQuotation/Zcash/0x0000000000000000000000000000000000000000";

function priceFeedUrl(): string {
  const configured = process.env.BASE_URL_ZCASH_PRICE_FEED?.trim();
  return configured ? configured : DEFAULT_PRICE_FEED_URL;
}

// ZEC has 8 decimal places (1 zatoshi = 0.00000001 ZEC). A raw `usd / price`
// quotient carries ~17 significant digits, and every ZIP 321 consumer
// downstream (the QR endpoint, formatZecAmount, the embed's data-amount
// check) rejects more than 8 decimals, so an unrounded quote can never be
// turned into a payment request. Round to the nearest zatoshi here, once.
const ZATOSHI_PER_ZEC = 100_000_000;

function roundToZatoshi(zec: number): number {
  return Math.round(zec * ZATOSHI_PER_ZEC) / ZATOSHI_PER_ZEC;
}

function priceUnavailable() {
  return NextResponse.json(
    { error: "Zcash price is currently unavailable" },
    { status: 503 },
  );
}

export async function GET(req: NextRequest) {
  const { price, source } = await getZcashPrice(priceFeedUrl());

  if (!(price > 0)) {
    return priceUnavailable();
  }

  return NextResponse.json(
    { data: { rate: price, source } },
    { status: 200 },
  );
}

export async function POST(req: NextRequest) {
  const bodyResult = await readBoundedJsonBody(req);
  if (!bodyResult.ok) {
    return NextResponse.json(
      { error: bodyResult.error },
      { status: bodyResult.status },
    );
  }

  const parsed = priceFeedBodySchema.safeParse(bodyResult.body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid request payload" },
      { status: 400 },
    );
  }

  const { amount, from, to } = parsed.data;
  const { price, source } = await getZcashPrice(priceFeedUrl());

  if (!(price > 0)) {
    return priceUnavailable();
  }

  let convertedAmount: number;
  if (from === "usd" && to === "zec") {
    convertedAmount = roundToZatoshi(amount / price);
    if (!(convertedAmount > 0)) {
      return NextResponse.json(
        { error: "Amount is smaller than 1 zatoshi (0.00000001 ZEC)" },
        { status: 400 },
      );
    }
  } else if (from === "zec" && to === "usd") {
    convertedAmount = amount * price;
  } else {
    convertedAmount = amount;
  }

  return NextResponse.json(
    { data: { amount: convertedAmount, rate: price, source } },
    { status: 200 },
  );
}

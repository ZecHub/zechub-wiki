import { readBoundedJsonBody } from "@/lib/apiRequestGuards";
import { NextRequest, NextResponse } from "next/server";
import { priceFeedBodySchema } from "./schema/price-feed-body.schema";
import { getZcashPrice } from "./utils/get-zec-price";

const priceFeedUrl = String(process.env.BASE_URL_ZCASH_PRICE_FEED);

function priceUnavailable() {
  return NextResponse.json(
    { error: "Zcash price is currently unavailable" },
    { status: 503 },
  );
}

export async function GET(req: NextRequest) {
  const { price, source } = await getZcashPrice(priceFeedUrl);

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
  const { price, source } = await getZcashPrice(priceFeedUrl);

  if (!(price > 0)) {
    return priceUnavailable();
  }

  let convertedAmount: number;
  if (from === "usd" && to === "zec") {
    convertedAmount = amount / price;
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

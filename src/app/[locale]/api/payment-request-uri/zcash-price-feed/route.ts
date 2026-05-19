import { NextRequest, NextResponse } from "next/server";
import { priceFeedBodySchema } from "./schema/price-feed-body.schema";
import { getZcashPrice } from "./utils/get-zec-price";

const priceFeedUrl = String(process.env.BASE_URL_ZCASH_PRICE_FEED);

export async function GET(req: NextRequest) {
  try {
    const { price, source } = await getZcashPrice(priceFeedUrl);

    return NextResponse.json(
      { data: { rate: price, source } },
      { status: 200 },
    );
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "Invalid request";

    return NextResponse.json({ error: JSON.parse(errMsg) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { amount, from, to } = priceFeedBodySchema.parse(body);
    const { price, source } = await getZcashPrice(priceFeedUrl);

    let result: number;
    if (from === "usd" && to === "zec") {
      result = amount / price;
    } else if (from === "zec" && to === "usd") {
      result = amount * price;
    } else {
      result = amount;
    }

    return NextResponse.json(
      { data: { amount: result, rate: price, source } },
      { status: 200 },
    );
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "Invalid request";

    return NextResponse.json({ error: JSON.parse(errMsg) }, { status: 500 });
  }
}

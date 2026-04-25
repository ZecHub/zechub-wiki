import { NextRequest, NextResponse } from "next/server";
import { priceFeedBodySchema } from "./schema/price-feed-body.schema";
import { getZcashPrice } from "./utils/get-zec-price";

const priceFeedUrl = String(process.env.BASE_URL_ZCASH_PRICE_FEED);

export async function GET(req: NextRequest) {
  return NextResponse.json({ data: "Hello World!" });
}

export async function POST(req: NextRequest) {
  console.log("called price feed!");
  try {
    const { amount, from, to } = priceFeedBodySchema.parse(req.body);
    const { price, source } = await getZcashPrice(priceFeedUrl);

    let result: number;
    if (from === "usd" && to === "zec") {
      result = amount / price;
    } else if (from === "zec" && to === "usd") {
      result = amount * price;
    } else {
      result = amount;
    }

    return NextResponse.json({ data: { amount: result, rate: price, source } });
  } catch (err) {
    console.error(err);
    const errMsg = err instanceof Error ? err.message : "Invalid request";

    return NextResponse.json({ error: errMsg }, { status: 400 });
  }
}

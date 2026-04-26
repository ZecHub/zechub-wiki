import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

// TODO: Using memory store (can be changed to db)
export const urlStore: Record<string, string> = {}; // shortId => full URI

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { uri } = body;

    if (!uri) {
      return NextResponse.json({ error: "Missing uri" }, { status: 400 });
    }

    const shortId = nanoid(8);
    urlStore[shortId] = uri;

    const url = req.url.split("/api")[0];
    const shortUrl = `${url}/api/payment-request-uri/shorten/${shortId}`;
    console.log({ shortUrl });
    
    return NextResponse.json({ shortUrl }, { status: 200 });
  } catch (err) {
    const msg =
      err instanceof Error ? err.message : "Failed process payment uri.";

    return NextResponse.json({ error: JSON.parse(msg) }, { status: 500 });
  }
}

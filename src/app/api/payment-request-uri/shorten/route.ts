import { config } from "@/app/tools/config";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

// TODO: Using memory store (can be changed to db)
export const urlStore: Record<string, string> = {}; // shortId => full URI

const corsHeaders = {
  "Access-Control-Allow-Origin": `${config.env.ACCESS_CONTROL_ALLOW_ORIGIN}`,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "ACCESS-CONTROL-ALLOW-HEADERS": "CONTENT-TYPE",
};

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { uri } = body;

    if (!uri) {
      return NextResponse.json({ error: "Missing uri" }, { status: 400 });
    }

    const shortId = nanoid(8);
    urlStore[shortId] = uri;

    const url = config.env.NEXT_PUBLIC_WIDGET_API_BASE_URL;
    const shortUrl = `${url}/api/payment-request-uri/shorten/${shortId}`;

    return NextResponse.json(
      { shortUrl },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      },
    );
  } catch (err) {
    const msg =
      err instanceof Error ? err.message : "Failed process payment uri.";

    return NextResponse.json({ error: JSON.parse(msg) }, { status: 500 });
  }
}

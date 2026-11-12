import { config } from "@/app/[locale]/tools/zcash-payment-widget/config";
import { readBoundedJsonBody } from "@/lib/apiRequestGuards";
import { NextRequest, NextResponse } from "next/server";
import { generateShortId, storeUri } from "./store";

const MAX_URI_LENGTH = 4096;

const corsHeaders = {
  "Access-Control-Allow-Origin": `${config.env.ACCESS_CONTROL_ALLOW_ORIGIN}`,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "ACCESS-CONTROL-ALLOW-HEADERS": "CONTENT-TYPE",
};

function jsonWithCors(data: unknown, status: number) {
  return NextResponse.json(data, {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(req: NextRequest) {
  const result = await readBoundedJsonBody<{ uri?: unknown }>(req);
  if (!result.ok) {
    return jsonWithCors({ error: result.error }, result.status);
  }

  const { uri } = result.body ?? {};

  if (typeof uri !== "string" || uri.length === 0) {
    return jsonWithCors({ error: "Missing uri" }, 400);
  }
  if (uri.length > MAX_URI_LENGTH) {
    return jsonWithCors(
      { error: `uri exceeds maximum length of ${MAX_URI_LENGTH} characters` },
      413,
    );
  }

  const shortId = generateShortId();
  await storeUri(shortId, uri);

  // NEXT_PUBLIC_WIDGET_API_BASE_URL already includes the "/api" segment
  // (e.g. "http://localhost:3000/api"), so the path is appended directly.
  const base = config.env.NEXT_PUBLIC_WIDGET_API_BASE_URL;
  const shortUrl = `${base}/payment-request-uri/shorten/${shortId}`;

  return jsonWithCors({ shortUrl }, 200);
}

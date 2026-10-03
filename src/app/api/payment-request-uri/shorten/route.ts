
import { config } from "@/app/[locale]/tools/zcash-payment-widget/config";
import { readBoundedJsonBody } from "@/lib/apiRequestGuards";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

const MAX_URI_LENGTH = 4096;
export const MAX_STORE_ENTRIES = 10_000;

// TODO: Using memory store (can be changed to db)
export const urlStore = new Map<string, string>(); // shortId => full URI

function storeUri(shortId: string, uri: string) {
  if (urlStore.size >= MAX_STORE_ENTRIES) {
    const oldestKey = urlStore.keys().next().value;
    if (oldestKey !== undefined) urlStore.delete(oldestKey);
  }
  urlStore.set(shortId, uri);
}

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
  // The short link redirects to whatever is stored, so only accept payment
  // URIs; anything else would turn it into an open redirect.
  if (!uri.toLowerCase().startsWith("zcash:")) {
    return jsonWithCors({ error: "uri must be a zcash: payment URI" }, 400);
  }
  if (uri.length > MAX_URI_LENGTH) {
    return jsonWithCors(
      { error: `uri exceeds maximum length of ${MAX_URI_LENGTH} characters` },
      413,
    );
  }

  const shortId = nanoid(8);
  storeUri(shortId, uri);

  // The base already ends in /api (default "/api"), and the widget runs on
  // other sites, so resolve it against this origin to hand back a link that
  // works wherever it is pasted. [id]/route.ts serves it.
  const base = config.env.NEXT_PUBLIC_WIDGET_API_BASE_URL.replace(/\/+$/, "");
  const shortUrl = new URL(
    `${base}/payment-request-uri/shorten/${shortId}`,
    req.nextUrl.origin,
  ).toString();

  return jsonWithCors({ shortUrl }, 200);
}


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
  if (uri.length > MAX_URI_LENGTH) {
    return jsonWithCors(
      { error: `uri exceeds maximum length of ${MAX_URI_LENGTH} characters` },
      413,
    );
  }

  const shortId = nanoid(8);
  storeUri(shortId, uri);

  const url = config.env.NEXT_PUBLIC_WIDGET_API_BASE_URL;
  const shortUrl = `${url}/api/payment-request-uri/shorten/${shortId}`;

  return jsonWithCors({ shortUrl }, 200);
}

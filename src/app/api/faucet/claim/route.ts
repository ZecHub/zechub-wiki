import { NextRequest, NextResponse } from "next/server";
const API = "https://fauzec.com/api/v1";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (body?.network !== "testnet" || typeof body?.address !== "string")
      return NextResponse.json({ error: "A testnet network and address are required" }, { status: 400 });
    const response = await fetch(`${API}/claim`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ network: "testnet", address: body.address }), cache: "no-store", signal: AbortSignal.timeout(15000) });
    return NextResponse.json(await response.json().catch(() => ({ error: "Invalid faucet response" })), { status: response.status });
  } catch (error) {
    console.error("[faucet] claim proxy failed", error);
    return NextResponse.json({ error: "The faucet is temporarily unavailable" }, { status: 502 });
  }
}

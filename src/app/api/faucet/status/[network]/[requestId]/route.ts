import { NextRequest, NextResponse } from "next/server";
const API = "https://fauzec.com/api/v1";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(_request: NextRequest, { params }: { params: Promise<{ network: string; requestId: string }> }) {
  const { network, requestId } = await params;
  if (network !== "testnet" || !/^[A-Za-z0-9_-]+$/.test(requestId)) return NextResponse.json({ error: "Invalid faucet request" }, { status: 400 });
  try {
    const response = await fetch(`${API}/status/${network}/${encodeURIComponent(requestId)}`, { cache: "no-store", signal: AbortSignal.timeout(15000) });
    return NextResponse.json(await response.json().catch(() => ({ error: "Invalid faucet response" })), { status: response.status });
  } catch (error) {
    console.error("[faucet] status proxy failed", error);
    return NextResponse.json({ error: "Unable to check faucet status" }, { status: 502 });
  }
}

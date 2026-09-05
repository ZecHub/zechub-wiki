import { is_valid_zcash_address, get_zcash_address_type } from "@elemental-zcash/zaddr_wasm_parser";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const FAUZEC_CLAIM_URL = "https://fauzec.com/api/v1/claim";
const ClaimSchema = z.object({ address: z.string().trim().min(1).max(500) });

export async function POST(request: NextRequest) {
  try {
    const { address } = ClaimSchema.parse(await request.json());
    const type = is_valid_zcash_address(address) ? get_zcash_address_type(address) : null;

    if (type !== "unified" && type !== "sapling") {
      return NextResponse.json(
        { error: "Enter a valid Unified or Sapling address." },
        { status: 400 },
      );
    }

    const upstream = await fetch(FAUZEC_CLAIM_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ network: "testnet", address }),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });

    const body = await upstream.json().catch(() => ({ error: "Fauzec returned an unreadable response." }));
    return NextResponse.json(body, {
      status: upstream.status,
      headers: upstream.headers.has("retry-after")
        ? { "Retry-After": upstream.headers.get("retry-after")! }
        : undefined,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Enter a Unified or Sapling address." }, { status: 400 });
    }
    console.error("[Fauzec] claim failed:", error);
    return NextResponse.json({ error: "The faucet could not be reached. Please try again." }, { status: 502 });
  }
}

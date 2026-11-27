import { NextResponse } from "next/server";
import { fetchTreasuryFromSheet } from "@/lib/parseTreasurySheet";

export async function GET() {
  try {
    const rows = await fetchTreasuryFromSheet();
    return NextResponse.json(
      { rows },
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=300" } },
    );
  } catch {
    return NextResponse.json(
      { error: "Treasury sheet is unavailable." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}

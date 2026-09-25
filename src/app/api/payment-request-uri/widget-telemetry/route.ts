import { readBoundedJsonBody } from "@/lib/apiRequestGuards";
import { NextRequest, NextResponse } from "next/server";

/**
 * Zcash payment request telemetry endpoint
 * @param req
 */
export async function POST(req: NextRequest) {
  // TODO: requires full implementation
  const result = await readBoundedJsonBody(req);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return new NextResponse(null, { status: 204 });
}

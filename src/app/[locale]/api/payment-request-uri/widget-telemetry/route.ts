import { NextRequest } from "next/server";

/**
 * Zcash payment request telemetry endpoint 
 * @param req 
 */
export async function POST(req: NextRequest) {
  // TODO: requires full implementation
  const body = req.json();

  console.log(body);
}

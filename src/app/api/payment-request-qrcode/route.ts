import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET(req: NextRequest) {
  const data = req.nextUrl.searchParams.get("data");

  if (!data || typeof data != "string") {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  try {
    const qrCode = await QRCode.toDataURL(data, { margin: 1, scale: 6 });
    const base64 = qrCode.split(",")[1];
    const buffer = Buffer.from(base64, "base64");

    return NextResponse.json(
      { data: buffer },
      {
        headers: {
          "Content-Type": "image/png",
        },
      },
    );
  } catch (err) {
    const msg =
      err instanceof Error ? err.message : "Failed to generate QRCode";

    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

import { is_valid_zcash_address } from "@elemental-zcash/zaddr_wasm_parser";
import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { qrCodeBodySchema } from "./schema/qrcode.schema";

export async function GET(req: NextRequest) {
  const data = req.nextUrl.searchParams.get("data");
  const size = req.nextUrl.searchParams.get("size");
  const dim = size?.split("x")[0];

  if (!data || typeof data != "string") {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  try {
    const qrCode = await QRCode.toDataURL(data, {
      margin: 1,
      scale: 10,
      width: dim ? parseInt(dim) : 240,

    });
    const base64 = qrCode.split(",")[1];
    const buffer = Buffer.from(base64, "base64");

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "image/png",
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    console.error(err);
    
    return NextResponse.json(
      { error: '"Failed to generate QR code"' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { amount, address, label, memo } = qrCodeBodySchema.parse(body);

    if (!is_valid_zcash_address(address)) {
      return NextResponse.json(
        { error: "Invalid Zcash address!" },
        { status: 400 },
      );
    }

    // Zcash URI format: zcash:<address>?amount=1.23&memo=...
    let uri = `zcash:${address}`;
    const params = new URLSearchParams();

    if (amount) params.append("amount", amount.toString());
    if (label) params.append("label", label);
    if (memo) params.append("memo", memo);

    const paramsStr = params.toString();
    if (paramsStr) {
      uri += `?${paramsStr}`;
    }

    const qrData = await QRCode.toDataURL(uri, { margin: 1, scale: 6 });

    return NextResponse.json({ data: { uri, qrData } }, { status: 200 });
  } catch (err) {
    const msg =
      err instanceof Error ? err.message : "Failed process payment uri.";

    return NextResponse.json({ error: JSON.parse(msg) }, { status: 500 });
  }
}

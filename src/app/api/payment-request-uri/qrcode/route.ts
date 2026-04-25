import { is_valid_zcash_address } from "@elemental-zcash/zaddr_wasm_parser";
import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { qrCodeBodySchema } from "./schema/qrcode.schema";

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { amount, address, label, memo,  } = qrCodeBodySchema.parse(body);

    if (!is_valid_zcash_address(address)) {
      return NextResponse.json({ error: "Invalid Zcash address!" }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Created", data: body },
      { status: 200 },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed";

    console.log({ msg: JSON.parse(msg) });
    return NextResponse.json({ error: JSON.parse(msg) }, { status: 500 });
  }
}

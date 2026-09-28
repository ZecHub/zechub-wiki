import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import * as bindings from "@elemental-zcash/zaddr_wasm_parser/zaddr_wasm_parser_bg.js";
import { qrCodeBodySchema } from "./schema/qrcode.schema";
import { buildZip321Uri, validateZip321Payment } from "@/lib/zip321";

type ZaddrBindings = typeof bindings & {
  __wbg_set_wasm: (exports: WebAssembly.Exports) => void;
  is_valid_zcash_address: (address: string) => boolean;
};

const wasmBindings = bindings as ZaddrBindings;

let wasmReady: Promise<ZaddrBindings> | null = null;

function loadZaddrWasm(): Promise<ZaddrBindings> {
  if (!wasmReady) {
    wasmReady = (async () => {
      const buf = await readFile(
        path.join(process.cwd(), "public/wasm/zaddr_wasm_parser_bg.wasm"),
      );
      const { instance } = await WebAssembly.instantiate(buf, {
        "./zaddr_wasm_parser_bg.js": wasmBindings,
      });
      wasmBindings.__wbg_set_wasm(instance.exports);
      (
        instance.exports as WebAssembly.Exports & {
          __wbindgen_start?: () => void;
        }
      ).__wbindgen_start?.();
      return wasmBindings;
    })().catch((err) => {
      wasmReady = null;
      throw err;
    });
  }
  return wasmReady;
}

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
      { error: "Failed to generate QR code" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = qrCodeBodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid request payload" },
        { status: 400 },
      );
    }

    const { amount, address, label, message, memo } = parsed.data;

    const { is_valid_zcash_address } = await loadZaddrWasm();
    if (!is_valid_zcash_address(address)) {
      return NextResponse.json(
        { error: "Invalid Zcash address!" },
        { status: 400 },
      );
    }

    const validation = validateZip321Payment({
      address,
      amount,
      label,
      message,
      memo,
    });

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 },
      );
    }

    const uri = buildZip321Uri([
      {
        address,
        amount,
        label,
        message,
        memo,
      },
    ]);

    const qrData = await QRCode.toDataURL(uri, { margin: 1, scale: 6 });

    return NextResponse.json({ data: { uri, qrData } }, { status: 200 });
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "Failed to process payment URI.";

    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

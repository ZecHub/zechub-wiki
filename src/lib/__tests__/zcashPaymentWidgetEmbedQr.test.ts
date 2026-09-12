import fs from "fs";
import path from "path";
import jsQR from "jsqr";

/**
 * Verifies the QR encoder actually vendored into
 * public/zcash-payment-request-widget.embed.v2.js (not a re-implementation)
 * produces modules that decode back to the exact original ZIP-321 URI. The
 * widget generates this QR entirely client-side, so this test also guards
 * against regressions that would reintroduce a network round trip for QR
 * generation.
 */

const EMBED_SCRIPT_PATH = path.join(
  process.cwd(),
  "public",
  "zcash-payment-request-widget.embed.v2.js",
);

const BEGIN_MARKER =
  "// ---------- Vendored QR code generator (100% client-side; no network call) ----------";
const END_MARKER = "// ---------- End vendored QR code generator ----------";

function loadVendoredQrcodegen() {
  const source = fs.readFileSync(EMBED_SCRIPT_PATH, "utf8");
  const start = source.indexOf(BEGIN_MARKER);
  const end = source.indexOf(END_MARKER);

  if (start === -1 || end === -1) {
    throw new Error(
      "Could not locate vendored QR generator markers in embed script",
    );
  }

  const vendoredSource = source.slice(start, end);

  // eslint-disable-next-line no-new-func
  const factory = new Function(`${vendoredSource}\nreturn { qrcodegen };`);
  return factory() as { qrcodegen: any };
}

function modulesToBitmap(
  modules: boolean[][],
  pxPerModule: number,
  marginModules: number,
) {
  const n = modules.length;
  const totalModules = n + marginModules * 2;
  const width = totalModules * pxPerModule;
  const height = width;
  const data = new Uint8ClampedArray(width * height * 4);
  data.fill(255); // white background (quiet zone included)

  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (!modules[y][x]) continue;

      const px0 = (x + marginModules) * pxPerModule;
      const py0 = (y + marginModules) * pxPerModule;

      for (let dy = 0; dy < pxPerModule; dy++) {
        for (let dx = 0; dx < pxPerModule; dx++) {
          const idx = ((py0 + dy) * width + (px0 + dx)) * 4;
          data[idx] = 0;
          data[idx + 1] = 0;
          data[idx + 2] = 0;
          data[idx + 3] = 255;
        }
      }
    }
  }

  return { data, width, height };
}

function decodeViaVendoredEncoder(qrcodegen: any, text: string): string {
  const modules = qrcodegen.QrCode.encodeText(
    text,
    qrcodegen.QrCode.Ecc.MEDIUM,
  ).getModules();
  const { data, width, height } = modulesToBitmap(modules, 6, 4);
  const result = jsQR(data, width, height);

  if (!result) {
    throw new Error("jsQR failed to decode the generated QR modules");
  }

  return result.data;
}

describe("vendored QR generator in zcash-payment-request-widget.embed.v2.js", () => {
  const { qrcodegen } = loadVendoredQrcodegen();

  it("exposes the expected encodeText/Ecc/getModules API", () => {
    expect(typeof qrcodegen.QrCode.encodeText).toBe("function");
    expect(qrcodegen.QrCode.Ecc.MEDIUM).toBeDefined();
  });

  it("decodes a simple single-recipient URI", () => {
    const uri = "zcash:t1VpMigELggqi6TBghQNehqspAcBBDYvRQC?amount=1.5";
    expect(decodeViaVendoredEncoder(qrcodegen, uri)).toBe(uri);
  });

  it("decodes a URI with amount and label", () => {
    const uri =
      "zcash:t1VpMigELggqi6TBghQNehqspAcBBDYvRQC?amount=0.5&label=Alice";
    expect(decodeViaVendoredEncoder(qrcodegen, uri)).toBe(uri);
  });

  it("decodes a URI with base64url-encoded memo content", () => {
    const memo = Buffer.from("Thanks for the coffee! 🛡️", "utf8")
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    const uri = `zcash:zs1znewaqucqpc372x6ajmfnmkmxsafnc3fuxmg6g5kq3mkvkv8ufx9hgx9vgcrqncqm3umz56a7pd?amount=1.25&memo=${memo}`;
    expect(decodeViaVendoredEncoder(qrcodegen, uri)).toBe(uri);
  });

  it("decodes a long payload at the 512-byte memo boundary", () => {
    const memo = Buffer.from("A".repeat(512), "utf8")
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    const uri = `zcash:zs1znewaqucqpc372x6ajmfnmkmxsafnc3fuxmg6g5kq3mkvkv8ufx9hgx9vgcrqncqm3umz56a7pd?amount=2.0&memo=${memo}`;
    expect(uri.length).toBeGreaterThan(700);
    expect(decodeViaVendoredEncoder(qrcodegen, uri)).toBe(uri);
  });

  it("decodes a multi-recipient-shaped payload (encoder is payload-agnostic; the embed widget itself only emits single-recipient URIs today)", () => {
    const uri =
      "zcash:?address=zs1znewaqucqpc372x6ajmfnmkmxsafnc3fuxmg6g5kq3mkvkv8ufx9hgx9vgcrqncqm3umz56a7pd&amount=0.25&address.1=t1VpMigELggqi6TBghQNehqspAcBBDYvRQC&amount.1=0.75";
    expect(decodeViaVendoredEncoder(qrcodegen, uri)).toBe(uri);
  });
});

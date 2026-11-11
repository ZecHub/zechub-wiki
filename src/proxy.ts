import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware({ ...routing, alternateLinks: false });

function buildCsp(nonce: string, isEmbed: boolean): string {
  const isDev = process.env.NODE_ENV === "development";
  // No 'unsafe-eval': MDX is rendered on the server via next-mdx-remote/rsc.
  // 'wasm-unsafe-eval' kept for zaddr_wasm_parser + Penumbra WASM.
  // 'unsafe-eval' only in dev (React refresh).
  const scriptSrc = [
    "'self'",
    `'nonce-${nonce}'`,
    "'strict-dynamic'",
    "'wasm-unsafe-eval'",
    isDev ? "'unsafe-eval'" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const directives = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "form-action 'self'",
    isEmbed ? "" : "frame-ancestors 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://i.ytimg.com https://i.postimg.cc https://*.basemaps.cartocdn.com https://img.shields.io https://upload.wikimedia.org https://ipfs.daodao.zone",
    "font-src 'self' data:",
    "connect-src 'self' https://raw.githubusercontent.com",
    "frame-src 'self' https://www.youtube-nocookie.com https://www.youtube.com",
    "media-src 'self' https://free2z.cash https://cdn.jsdelivr.net",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    "report-uri /api/csp-report",
    "report-to csp-endpoint",
  ].filter(Boolean);

  return directives.join("; ");
}

export default function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const path = request.nextUrl.pathname;
  const isEmbed = /\/(?:[a-z]{2}\/)?embed(?:\/|$)/.test(path);
  const csp = buildCsp(nonce, isEmbed);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const intlResponse = intlMiddleware(request);

  if (intlResponse.headers.get("location")) {
    intlResponse.headers.set("Content-Security-Policy", csp);
    return intlResponse;
  }

  const rewrite = intlResponse.headers.get("x-middleware-rewrite");
  const response = rewrite
    ? NextResponse.rewrite(new URL(rewrite), { request: { headers: requestHeaders } })
    : NextResponse.next({ request: { headers: requestHeaders } });

  intlResponse.headers.forEach((value, key) => {
    const k = key.toLowerCase();
    if (k === "content-security-policy" || k === "x-middleware-rewrite") return;
    response.headers.set(key, value);
  });

  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|trpc|_vercel|favicon.ico|icon.png|.*\\..*).*)",
  ],
};

import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware({ ...routing, alternateLinks: false });

function buildCsp(nonce: string, isEmbed: boolean): string {
  // script-src: nonce + strict-dynamic, no 'unsafe-inline'.
  // 'wasm-unsafe-eval' kept for zaddr_wasm_parser + Penumbra WASM.
  // 'unsafe-eval' is required in production too: article bodies are rendered
  // client-side by next-mdx-remote's <MDXRemote>, which evaluates the compiled
  // MDX with the Function constructor. Without it every article page hits the
  // error boundary. Drop it once MDX is rendered on the server
  // (next-mdx-remote/rsc), which needs no eval in the browser.
  const scriptSrc = [
    "'self'",
    `'nonce-${nonce}'`,
    "'strict-dynamic'",
    "'wasm-unsafe-eval'",
    "'unsafe-eval'",
  ]
    .filter(Boolean)
    .join(" ");

  const directives = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "form-action 'self'",
    // /embed is designed to be framed by third parties.
    isEmbed ? "" : "frame-ancestors 'self'",
    `script-src ${scriptSrc}`,
    // style-src stays 'unsafe-inline' for styled-components and inline styles.
    // Script execution is the XSS concern; style nonce can be a later pass.
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

  // Next.js reads the nonce from the request Content-Security-Policy header
  // and auto-applies it to framework/bootstrap scripts. x-nonce is for our
  // own <script> tags (JSON-LD etc.).
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const intlResponse = intlMiddleware(request);

  // Redirects / rewrites from next-intl: just attach the CSP and return.
  if (intlResponse.headers.get("location") || intlResponse.headers.get("x-middleware-rewrite")) {
    intlResponse.headers.set("Content-Security-Policy", csp);
    return intlResponse;
  }

  // Continue with the modified request so the renderer sees the nonce.
  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // Preserve any headers next-intl set (set-cookie, vary, etc.).
  intlResponse.headers.forEach((value, key) => {
    if (key.toLowerCase() === "content-security-policy") return;
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

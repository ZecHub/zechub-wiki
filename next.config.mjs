import path from "path";
import { fileURLToPath } from "url";
import createMDX from "@next/mdx";
import rehypePlugins from "rehype-prism-plus";
import remarkGfm from "remark-gfm";
import createNextIntlPlugin from "next-intl/plugin";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    // Add the exact origin from your error, or your LAN IP for phone testing
    // 'http://192.168.1.42:3000',
  ],
  // Images are self-hosted under /content-images/ and public/ (same-origin).
  // The only remote host kept is Wikimedia — a privacy-respecting source we
  // deliberately don't vendor; a few exchange logos load it via next/image.
  // (shields.io badges render as plain <img>, so they need no remotePattern —
  // they're allow-listed in the CSP img-src instead.) Everything else is
  // same-origin, so a stray external <Image> still fails loudly in review.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org", pathname: "/**" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/start-here/network-upgrades",
        destination: "/zcash-evolution",
      },
    ];
  },
  async headers() {
    // Baseline security headers. These are all safe to enforce immediately and
    // change no rendering behaviour. A full Content-Security-Policy (and its
    // frame-ancestors) is deliberately deferred to a later PR, once the
    // third-party asset/data sources have been localized.
    const baseline = [
      // Send only the ORIGIN (scheme+host, never the path) to cross-origin
      // destinations, and nothing on an HTTPS->HTTP downgrade. We do NOT use
      // no-referrer: YouTube's embed player refuses to play (PlayabilityStatus
      // ERROR -> "video player configuration error") when it receives no Referer,
      // so no-referrer broke every embedded video site-wide. Origin-only is the
      // right balance here — the origin is already visible to the network via
      // DNS/TLS SNI, while the page path (the sensitive part) is still withheld.
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      // Never let a browser MIME-sniff a response into an executable type.
      { key: "X-Content-Type-Options", value: "nosniff" },
      // Disable powerful features the wiki never uses (also opts out of FLoC/Topics).
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
      },
      // On a first http:// visit a hostile network can observe/modify before the
      // HTTPS redirect; HSTS closes that gap. Assumes all subdomains are always
      // HTTPS (verify before relying on includeSubDomains/preload).
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
    ];
    return [
      { source: "/:path*", headers: baseline },
      {
        // Clickjacking protection everywhere EXCEPT the embeddable widget under
        // /embed (and its locale-prefixed form /xx/embed), which is designed to
        // be framed by third-party sites.
        source: "/((?!(?:[a-z]{2}/)?embed(?:/|$)).*)",
        headers: [{ key: "X-Frame-Options", value: "DENY" }],
      },
    ];
  },

  // Force correct project root (avoids picking parent package-lock.json)
  turbopack: {
    root: __dirname,
  },
};

const withMDX = createMDX({
  options: {
    mdxExtensions: ["mdx", "md"],
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypePlugins],
  },
});

// removes the bad key injected by old @next/mdx
const mdxConfig = withMDX(nextConfig);
if (mdxConfig.experimental?.turbo) {
  delete mdxConfig.experimental.turbo;
}

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(mdxConfig);
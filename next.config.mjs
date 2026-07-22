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
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ibb.co", pathname: "/**" },
      { protocol: "https", hostname: "github.com", pathname: "/**" },
      { protocol: "https", hostname: "objects.githubusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "avatars.githubusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "pbs.twimg.com", pathname: "/**" },
      { protocol: "https", hostname: "*.twimg.com", pathname: "/**" },
      { protocol: "https", hostname: "cdn.discordapp.com", pathname: "/**" },
      { protocol: "https", hostname: "media.discordapp.net", pathname: "/**" },
      { protocol: "https", hostname: "free2z.cash", pathname: "/**" },
      { protocol: "https", hostname: "*.discourse-cdn.com", pathname: "/**" },
      { protocol: "https", hostname: "ipfs.daodao.zone", pathname: "/**" },
      { protocol: "https", hostname: "hackmd.io", pathname: "/**" },
      { protocol: "https", hostname: "user-images.githubusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "raw.githubusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "logos-world.net", pathname: "/**" },
      { protocol: "https", hostname: "logowik.com", pathname: "/**" },
      { protocol: "https", hostname: "www.logo.wine", pathname: "/**" },
      { protocol: "https", hostname: "upload.wikimedia.org", pathname: "/**" },
      { protocol: "https", hostname: "assets.kraken.com", pathname: "/**" },
      { protocol: "https", hostname: "www.svgrepo.com", pathname: "/**" },
      { protocol: "https", hostname: "firo.org", pathname: "/**" },
      { protocol: "https", hostname: "blockchair.com", pathname: "/**" },
      { protocol: "https", hostname: "messari.io", pathname: "/**" },
      { protocol: "https", hostname: "3xpl.com", pathname: "/**" },
      { protocol: "https", hostname: "blockexplorer.one", pathname: "/**" },
      { protocol: "https", hostname: "mainnet.zcashexplorer.app", pathname: "/**" },
      { protocol: "https", hostname: "explorer.bitquery.io", pathname: "/**" },
      { protocol: "https", hostname: "cipherscan.app", pathname: "/**" },
      { protocol: "https", hostname: "www.zypherscan.com", pathname: "/**" },
      { protocol: "https", hostname: "img.shields.io", pathname: "/**" },
      { protocol: "https", hostname: "images.app.goo.gl", pathname: "/**"},
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
import createMDX from "@next/mdx";
import rehypePlugins from "rehype-prism-plus";
import remarkGfm from "remark-gfm";

/** @type {import('next').NextConfig} */
const nextConfig = {
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

  // Keeps Turbopack happy
  turbopack: {},
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

export default mdxConfig;

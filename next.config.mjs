import createMDX from "@next/mdx";
import rehypePlugins from "rehype-prism-plus";
import remarkGfm from "remark-gfm";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // imgbb (many wallet logos)
      { protocol: "https", hostname: "i.ibb.co" },

      // GitHub user attachments (Wallets.md uses github.com/user-attachments/...)
      { protocol: "https", hostname: "github.com" },

      // GitHub often serves/redirects image binaries here
      { protocol: "https", hostname: "objects.githubusercontent.com" },

      // GitHub avatars (very common on the DAO page)
      { protocol: "https", hostname: "avatars.githubusercontent.com" },

      // X / Twitter profile photos (pbs.twimg.com)
      { protocol: "https", hostname: "pbs.twimg.com" },

      // Discord avatars (both domains Discord uses)
      { protocol: "https", hostname: "cdn.discordapp.com" },
      { protocol: "https", hostname: "media.discordapp.net" },
    ],
  },

  // ← NEW: Rewrite old URL to serve the new Zcash Evolution page
  async rewrites() {
    return [
      {
        source: "/start-here/network-upgrades",
        destination: "/zcash-evolution",
      },
    ];
  },
};

const withMDX = createMDX({
  options: {
    mdxExtensions: ["mdx", "md"],
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypePlugins],
  },
});

export default withMDX(nextConfig);

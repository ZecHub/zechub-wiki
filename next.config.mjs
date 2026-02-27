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
    ],
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

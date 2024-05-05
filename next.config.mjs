import remarkGfm from 'remark-gfm'
import rehypePlugins from 'rehype-prism-plus'
import createMDX from '@next/mdx'
 
/** @type {import('next').NextConfig} */
const nextConfig = {}
 
const withMDX = createMDX({
  options: {
    extension: [/\.mdx?$/, /\.md?$/ ],
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypePlugins],

    // If you use `MDXProvider`, uncomment the following line.
    // providerImportSource: "@mdx-js/react",
  },
})
export default withMDX(nextConfig)
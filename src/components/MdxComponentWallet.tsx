import remarkGfm from "remark-gfm";
import rehypePrism from 'rehype-prism-plus';
import rehypeWrapSections from './rehype-wrap-sections'; // Import your custom plugin
import {
  compileMDX,
} from "next-mdx-remote/rsc";
import { MdxComponents } from "./ConfigComponent";

type ContentSource = {
  source: string
};

const MdxComponentWallet = async ({ source }: ContentSource) => {
    
  const { content, frontmatter } = await compileMDX<{ title: string }>({
    source: source,
     options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm], 
        rehypePlugins: [rehypePrism, rehypeWrapSections], // Use your custom plugin
        mdExtensions: ['.md']
      },
    }, 
    components: MdxComponents,
  });
  return (
    content ? (
      <div className="px-3 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">{content}</div>
    ) :
    (
      <p className="text-center text-2xl">{source}</p>
    )
  );
};

export default MdxComponentWallet;

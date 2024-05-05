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
    
  const { content } = await compileMDX<{ title: string }>({
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
      <div className="flex">{content}</div>
    ) :
    (
      <p className="text-center text-2xl">{source}</p>
    )
  );
};

export default MdxComponentWallet;

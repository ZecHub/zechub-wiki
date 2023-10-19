import remarkGfm from "remark-gfm";
import rehypePrism from 'rehype-prism-plus';
import {
  compileMDX,
} from "next-mdx-remote/rsc";
import { MdxComponents } from "./ConfigComponent";

type ContentSource = {
  source: string
};

const MdxComponent = async ({ source }: ContentSource) => {
  const { content, frontmatter } = await compileMDX<{ title: string }>({
    source: source,
     options: {
      parseFrontmatter: true,
      mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypePrism], mdExtensions: ['.md']},
    }, 
    components: MdxComponents,
  });
 
  return <div className="px-3">{content}</div>;
};

export default MdxComponent;

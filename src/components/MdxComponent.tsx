import remarkGfm from "remark-gfm";
import rehypePrism from 'rehype-prism-plus';
import {
  MDXRemoteSerializeResult,
  compileMDX,
} from "next-mdx-remote/rsc";
import { MdxComponents } from "./ConfigComponent";

type MdxContentProps = {
  source: MDXRemoteSerializeResult;
};

const MdxComponent = async ({ source }: MdxContentProps) => {
  const { content, frontmatter } = await compileMDX<{ title: string }>({
    source: source,
    options: {
      parseFrontmatter: true,
      mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypePrism]},
    },
    components: MdxComponents,
  });
 
  return <div>{content}</div>;
};

export default MdxComponent;

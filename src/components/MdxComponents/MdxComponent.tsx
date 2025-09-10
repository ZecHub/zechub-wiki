import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrism from "rehype-prism-plus";
import remarkGfm from "remark-gfm";
import rehypePrism from "rehype-prism-plus";
import remarkGfm from "remark-gfm";
import ZecToZatsConverter from "../Converter/ZecToZatsConverter";
import MdxComponents from "./ConfigComponent";

type ContentSource = {
  source: string;
  slug: string;
};

const MdxComponent = async ({ source, slug }: ContentSource) => {
  const { content } = await compileMDX<{ title: string }>({
    source: source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypePrism],
        mdExtensions: [".md"],
      },
    },

    components: MdxComponents,
  });

  console.log({ content });

  return content ? (
    <>
      <div className="px-3">{content}</div>
      {slug == "transactions" && <ZecToZatsConverter />}
    </>
  ) : (
    <p className="text-center text-2xl">{source}</p>
  );
};

export default MdxComponent;

import { parseProcessorMarkdown } from "@/lib/parseProcessorMarkdown";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrism from "rehype-prism-plus";
import remarkGfm from "remark-gfm";
import ZecToZatsConverter from "../Converter/ZecToZatsConverter";
import PaymentProcessorList from "../PaymentProcessor/PaymentProcessorList";
import MdxComponents from "./ConfigComponent";

type ContentSource = {
  source: string;
  slug: string;
};

const MdxComponent = async ({ source, slug }: ContentSource) => {
  let content;
  let body;

  switch (slug) {
    case "payment-processors": {
      const paymentProcessors = parseProcessorMarkdown(source);

      //  Still can render markdown if you want
      const compiled = await compileMDX<{ title: string }>({
        source,
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

      content = compiled.content;
      body = <PaymentProcessorList allProcessors={paymentProcessors as any} />;
      break;
    }

    case "transactions": {
      const compiled = await compileMDX({
        source,
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

      content = compiled.content;
      body = <ZecToZatsConverter />;
      break;
    }

    default: {
      const compiled = await compileMDX({
        source,
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

      content = compiled.content;
    }
  }

  return (
    <>
      {slug === "payment-processors" ? (
        body
      ) : content ? (
        <>
          <div className="px-3">{content}</div>
          {body}
        </>
      ) : (
        <p className="text-center text-2xl">{source}</p>
      )}
    </>
  );
};

export default MdxComponent;

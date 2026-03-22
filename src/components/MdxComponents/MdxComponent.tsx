import { parseProcessorMarkdown } from "@/lib/parseProcessorMarkdown";
import type { MDXComponents } from "mdx/types";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrism from "rehype-prism-plus";
import remarkGfm from "remark-gfm";
import ZecToZatsConverter from "../Converter/ZecToZatsConverter";
import { MdxFetchError } from "../MdxFetchError";
import PaymentProcessorList from "../PaymentProcessor/PaymentProcessorList";
import MdxComponents from "./ConfigComponent";

async function safeCompileMDX(source: string, components: MDXComponents) {
  try {
    const compiled = await compileMDX({
      source,
      options: {
        parseFrontmatter: true,
        mdxOptions: {
          //These casts fix the version conflict between next-mdx-remote and modern plugins
          remarkPlugins: [remarkGfm as any],
          rehypePlugins: [rehypePrism as any],
        },
      },
      components,
    });

    return { content: compiled.content, error: null };
  } catch (err) {
    console.error("[MdxComponent] safeCompileMDX failed:", err);
    return { content: null, error: err };
  }
}

function MdxErrorBanner({ error }: { error: unknown }) {
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-4 rounded">
      <p className="font-semibold">Warning: Invalid Markdown/MDX</p>
      <p className="text-sm">This page contains invalid Markdown/MDX and is being shown as raw text.</p>
      <details className="mt-2 text-xs">
        <summary className="cursor-pointer">Error details</summary>
        <pre className="whitespace-pre-wrap mt-1">{String((error as Error).message || error)}</pre>
      </details>
    </div>
  );
}

export default async function MdxComponent({
  source,
  slug,
}: {
  source: string | { error: Error };
  slug: string;
}) {
  if (typeof source !== "string") {
    return <MdxFetchError error={source} />;
  }

  if (slug === "payment-processors") {
    const paymentProcessors = parseProcessorMarkdown(source);
    return <PaymentProcessorList allProcessors={paymentProcessors as any} />;
  }

  if (slug === "transactions") {
    const { content, error } = await safeCompileMDX(source, MdxComponents);
    return (
      <>
        {error ? (
          <>
            <MdxErrorBanner error={error} />
            <pre className="whitespace-pre-wrap p-3 rounded text-sm">{source}</pre>
          </>
        ) : (
          <>
            <div className="px-3">{content}</div>
            <ZecToZatsConverter />
          </>
        )}
      </>
    );
  }

  const { content, error } = await safeCompileMDX(source, MdxComponents);

  if (error) {
    return (
      <div className="px-3">
        <MdxErrorBanner error={error} />
        <pre className="whitespace-pre-wrap p-3 rounded text-sm">{source}</pre>
      </div>
    );
  }

  return <div className="px-3">{content}</div>;
}

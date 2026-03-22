import { parseProcessorMarkdown } from "@/lib/parseProcessorMarkdown";
import type { MDXComponents } from "mdx/types";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrism from "rehype-prism-plus";
import remarkGfm from "remark-gfm";           // ← Already here
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
          mdExtensions: [".md"],
          remarkPlugins: [remarkGfm],           // ← THIS WAS MISSING (fixes tables + dashes)
          rehypePlugins: [rehypePrism],
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
  let body = null;

  if (typeof source !== "string") {
    return <MdxFetchError error={source} />;
  }

  // Special pages
  if (slug === "payment-processors") {
    const paymentProcessors = parseProcessorMarkdown(source);
    body = <PaymentProcessorList allProcessors={paymentProcessors as any} />;
    return <>{body}</>;
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

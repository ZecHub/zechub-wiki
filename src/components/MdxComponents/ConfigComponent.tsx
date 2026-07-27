import { Link } from "@/i18n/navigation";
import Image from "next/image";
import React, { HTMLProps, JSX } from "react";
import { transformGithubFilePathToWikiLink } from "@/lib/helpers";
import LiteYouTube from "@/components/LiteYouTube";
import type { MDXComponents } from "mdx/types";

const youTubeId = (src: string): string | null => {
  if (!/(?:youtube(?:-nocookie)?\.com|youtu\.be)/i.test(src)) return null;
  const path = src.match(
    /(?:\/embed\/|\/v\/|\/shorts\/|youtu\.be\/)([A-Za-z0-9_-]{6,})/i,
  );
  if (path) return path[1];
  const q = src.match(/[?&]v=([A-Za-z0-9_-]{6,})/i);
  return q ? q[1] : null;
};

const MdxComponents = {
  // INLINE CODE (single backticks)
  code: (props: HTMLProps<HTMLElement> & { className?: string }): JSX.Element => {
    const isBlockCode = props.className?.includes("language-") ?? false;

    if (isBlockCode) {
      // Force inner code to be transparent so pre's background wins
      return (
        <code
          className={`font-mono text-sm bg-transparent !bg-transparent !p-0 !m-0 block w-full ${props.className || ""}`}
          style={{ backgroundColor: "transparent" }}
          {...props}
        />
      );
    }

    // Single backticks (inline)
    return (
      <code
        className="font-mono text-sm !inline-block !translate-y-[16px]"
        {...props}
      />
    );
  },

  // CODE BLOCKS
  pre: (props: HTMLProps<HTMLPreElement>): JSX.Element => {
    return (
      <div className="relative group my-6">
        {/* Fixed header for ALL code blocks */}
        <div className="absolute -top-3 left-4 z-10 px-3 py-1 
          bg-amber-50 dark:bg-amber-950 
          text-amber-800 dark:text-amber-300 
          text-xs font-mono tracking-widest rounded border border-amber-200 dark:border-amber-800 shadow-sm">
          Code-highlight
        </div>

        {/* Tan background */}
        <pre
          className="bg-amber-50 dark:bg-amber-950 !bg-amber-50 dark:!bg-amber-950 text-neutral-900 dark:text-neutral-100 p-5 pt-8 rounded-2xl overflow-x-auto border border-amber-200 dark:border-amber-900 font-mono text-sm leading-relaxed shadow-xl"
          {...props}
        />
      </div>
    );
  },

  img: (props: HTMLProps<HTMLImageElement>): JSX.Element => (
    // Images are self-hosted under /content-images/ (same-origin) — serve as-is.
    <img
      src={props.src || ""}
      alt={props.alt || "Image"}
      className="rounded-lg my-4"
      loading="lazy"
    />
  ),
  // Route YouTube <iframe> through the click-to-load facade (no render-time
  // contact with Google); other iframes pass through.
  iframe: (props: HTMLProps<HTMLIFrameElement>): JSX.Element => {
    const src = String(props.src || "");
    const id = youTubeId(src);
    if (id) {
      return (
        <LiteYouTube
          videoId={id}
          title={typeof props.title === "string" ? props.title : undefined}
          className="rounded-lg my-4 w-full aspect-video"
        />
      );
    }
    return <iframe {...props} sandbox="allow-same-origin allow-popups allow-forms" />;
  },
  a: (props: HTMLProps<HTMLHyperlinkElementUtils>): JSX.Element => (
    <Link
      href={props.href?.startsWith("/site") ? transformGithubFilePathToWikiLink(props.href) : props.href!}
      target={props.href?.startsWith("/site") ? "" : "_blank"}
      className="font-medium text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200 underline decoration-dashed"
    >
      {props.children}
    </Link>
  ),
  table: (props: HTMLProps<HTMLTableElement>): JSX.Element => (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full border-collapse text-sm" {...props} />
    </div>
  ),
  thead: (props: HTMLProps<HTMLTableSectionElement>): JSX.Element => (
    <thead className="bg-emerald-600 text-white dark:bg-emerald-700" {...props} />
  ),
  tr: (props: HTMLProps<HTMLTableRowElement>): JSX.Element => (
    <tr className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800" {...props} />
  ),
  th: (props: HTMLProps<HTMLTableCellElement>): JSX.Element => (
    <th className="px-4 py-3 text-left font-semibold" {...props} />
  ),
  td: (props: HTMLProps<HTMLTableCellElement>): JSX.Element => (
    <td className="px-4 py-3" {...props} />
  ),
  ul: (props: HTMLProps<HTMLUListElement>): JSX.Element => <ul className="list-disc pl-6 my-4" {...props} />,
  ol: (props: React.ComponentProps<"ol">): JSX.Element => <ol className="list-decimal pl-6 my-4" {...props} />,
  li: (props: HTMLProps<HTMLLIElement>): JSX.Element => <li {...props} />,
  p: (props: HTMLProps<HTMLParagraphElement>): JSX.Element => <p className="my-4" {...props} />,
  h1: (props: HTMLProps<HTMLHeadingElement>): JSX.Element => <h1 className="text-4xl font-bold my-6" {...props} />,
  h2: (props: HTMLProps<HTMLHeadingElement>): JSX.Element => <h2 className="text-3xl font-bold my-6" {...props} />,
  h3: (props: HTMLProps<HTMLHeadingElement>): JSX.Element => <h3 className="text-2xl font-bold my-5" {...props} />,
} as MDXComponents;

export default MdxComponents;

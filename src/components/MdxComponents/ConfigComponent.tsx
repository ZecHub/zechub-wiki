import Link from "next/link";
import Image from "next/image";
import React, { HTMLProps, JSX } from "react";
import { transformGithubFilePathToWikiLink } from "@/lib/helpers";
import type { MDXComponents } from "mdx/types";

const MdxComponents = {
  code: (props: HTMLProps<HTMLElement>): JSX.Element => (
    <code className="bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 px-1 rounded" {...props} />
  ),

  img: (props: HTMLProps<HTMLImageElement>): JSX.Element => (
    <img
      src={props.src?.startsWith("/") ? "https://github.com/ZecHub/zechub/tree/main" + props.src : props.src || ""}
      alt={props.alt || "Image"}
      className="rounded-lg my-4"
      loading="lazy"
    />
  ),

  a: (props: HTMLProps<HTMLHyperlinkElementUtils>): JSX.Element => (
    <Link
      href={props.href?.startsWith("/site") ? transformGithubFilePathToWikiLink(props.href) : props.href!}
      target={props.href?.startsWith("/site") ? "" : "_blank"}
      className="font-medium text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200 underline decoration-dashed"
    >
      {props.children}
    </Link>
  ),

  // Improved table support (dark mode + nice styling)
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

  // Fixed list types (this was causing the TypeScript error)
  pre: (props: HTMLProps<HTMLPreElement>): JSX.Element => <pre {...props} />,
  ul: (props: HTMLProps<HTMLUListElement>): JSX.Element => <ul className="list-disc pl-6 my-4" {...props} />,
  ol: (props: React.ComponentProps<"ol">): JSX.Element => <ol className="list-decimal pl-6 my-4" {...props} />,
  li: (props: HTMLProps<HTMLLIElement>): JSX.Element => <li {...props} />,

  p: (props: HTMLProps<HTMLParagraphElement>): JSX.Element => <p className="my-4" {...props} />,
  h1: (props: HTMLProps<HTMLHeadingElement>): JSX.Element => <h1 className="text-4xl font-bold my-6" {...props} />,
  h2: (props: HTMLProps<HTMLHeadingElement>): JSX.Element => <h2 className="text-3xl font-bold my-6" {...props} />,
  h3: (props: HTMLProps<HTMLHeadingElement>): JSX.Element => <h3 className="text-2xl font-bold my-5" {...props} />,
} as MDXComponents;

export default MdxComponents;

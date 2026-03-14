import Link from "next/link";
import Image from "next/image";
import React, { HTMLProps, JSX } from "react";
import { transformGithubFilePathToWikiLink } from "@/lib/helpers";
import type { MDXComponents } from "mdx/types";

const MdxComponents = {
  code: (props: HTMLProps<HTMLElement>): JSX.Element => (
    <code
      {...props}
      className="bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono"
    >
      {props.children}
    </code>
  ),
  Video: (props: React.VideoHTMLAttributes<HTMLVideoElement>) => <video {...props} />,

  // Mobile-friendly tables
  table: (props: HTMLProps<HTMLTableElement>): JSX.Element => (
    <div className="overflow-x-auto my-8 rounded-2xl border border-slate-200 dark:border-slate-700">
      <table className="w-full min-w-full border-collapse text-sm" {...props} />
    </div>
  ),

  thead: (props: HTMLProps<HTMLTableSectionElement>): JSX.Element => (
    <thead className="bg-slate-100 dark:bg-slate-800" {...props} />
  ),

  tr: (props: HTMLProps<HTMLTableRowElement>): JSX.Element => (
    <tr className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/50" {...props} />
  ),

  tbody: (props: HTMLProps<HTMLTableSectionElement>): JSX.Element => <tbody {...props} />,
  th: (props: HTMLProps<HTMLTableCellElement>): JSX.Element => (
    <th className="px-6 py-4 text-left font-semibold text-slate-900 dark:text-white" {...props} />
  ),
  td: (props: HTMLProps<HTMLTableCellElement>): JSX.Element => (
    <td className="px-6 py-4 text-slate-700 dark:text-slate-300" {...props} />
  ),

  // Clean image handling (local + external, no legacy props)
  img: (props: HTMLProps<HTMLImageElement>): JSX.Element => {
    const src = props.src || "";
    const { layout, objectFit, objectPosition, placeholder, lazyBoundary, ...cleanProps } = props;

    if (src.startsWith("/")) {
      return (
        <Image
          src={src}
          alt={cleanProps.alt || "Image for wiki docs"}
          width={1200}
          height={630}
          className="w-full h-auto rounded-2xl shadow-xl my-6"
          priority={src.includes("header") || src.includes("cpz")}
          unoptimized={true}
          {...cleanProps}
        />
      );
    }

    return (
      <img
        src={src}
        alt={cleanProps.alt || "Image for wiki docs"}
        className="w-full h-auto rounded-2xl shadow-xl my-6"
        {...cleanProps}
      />
    );
  },

  a: (props: HTMLProps<HTMLAnchorElement>): JSX.Element => {
    return (
      <Link
        href={
          props.href?.startsWith("/site")
            ? transformGithubFilePathToWikiLink(props.href)
            : props.href!
        }
        target={props.href?.startsWith("/site") ? "" : "_blank"}
        className="font-medium text-blue-700 hover:text-blue-800 underline decoration-dashed underline-offset-2 dark:text-blue-300 dark:hover:text-blue-200"
      >
        {props.children}{" "}
      </Link>
    );
  },

  pre: (props: HTMLProps<HTMLPreElement>): JSX.Element => <pre {...props}>{props.children}</pre>,
  em: (props: HTMLProps<HTMLSpanElement>): JSX.Element => <em {...props}>{props.children}</em>,

  blockquote: (props: HTMLProps<HTMLQuoteElement>): JSX.Element => (
    <blockquote className="text-base text-justify my-2 border-l-4 border-slate-300 dark:border-slate-600 pl-4" {...props}>
      {props.children}
    </blockquote>
  ),

  ul: (props: HTMLProps<HTMLUListElement>): JSX.Element => (
    <ul {...props} className="list-disc pl-6 space-y-1" />
  ),

  li: (props: HTMLProps<HTMLLIElement>): JSX.Element => <li {...props}>{props.children}</li>,

  h1: (props: HTMLProps<HTMLHeadingElement>): JSX.Element => <h1 className="text-4xl font-bold my-6" {...props} />,
  h2: (props: HTMLProps<HTMLHeadingElement>): JSX.Element => <h2 className="text-3xl font-bold my-6" {...props} />,
  h3: (props: HTMLProps<HTMLHeadingElement>): JSX.Element => <h3 className="text-2xl font-bold my-5" {...props} />,
  h4: (props: HTMLProps<HTMLHeadingElement>): JSX.Element => <h4 className="text-xl font-bold my-4" {...props} />,
  h5: (props: HTMLProps<HTMLHeadingElement>): JSX.Element => <h5 className="text-lg font-bold my-4" {...props} />,
  h6: (props: HTMLProps<HTMLHeadingElement>): JSX.Element => <h6 className="text-base font-bold my-4" {...props} />,

  p: (props: HTMLProps<HTMLParagraphElement>): JSX.Element => (
    <p className="text-base text-left my-4 leading-relaxed" {...props} />
  ),
  strong: (props: HTMLProps<HTMLElement>): JSX.Element => <strong className="font-bold" {...props} />,

  br: () => <br />,
  hr: () => <hr className="my-8 border-slate-200 dark:border-slate-700" />,
} as MDXComponents;

export default MdxComponents;

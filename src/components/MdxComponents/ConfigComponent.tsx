import Link from "next/link";
import Image from "next/image";
import React, { HTMLProps, JSX } from "react";
import { transformGithubFilePathToWikiLink } from "@/lib/helpers";
import type { MDXComponents } from "mdx/types";

const MdxComponents = {
  code: (props: HTMLProps<HTMLElement>): JSX.Element => (
    <code
      {...props}
      className={`
      bg-neutral-200
      dark:bg-neutral-800 dark:text-neutral-100
    `}
    >
      {props.children}
    </code>
  ),
  Video: (props: React.VideoHTMLAttributes<HTMLVideoElement>) => (
    <video {...props} />
  ),
  img: (props: HTMLProps<HTMLImageElement>): JSX.Element => {
    if (props.src?.startsWith("/"))
      props.src = "https://github.com/ZecHub/zechub/tree/main" + props.src;
    return (
      <Image
        src={
          props.src?.startsWith("/")
            ? "https://github.com/ZecHub/zechub/tree/main" + props.src
            : props.src || ""
        }
        alt={props.alt || "Image for wiki docs"}
        height={200}
        width={300}
        layout="responsive"
        loading="lazy"
      />
    );
  },

  a: (props: HTMLProps<HTMLHyperlinkElementUtils>): JSX.Element => {
    return (
      <Link
        href={
          props.href?.startsWith("/site")
            ? transformGithubFilePathToWikiLink(props.href)
            : props.href!
        }
        target={props.href?.startsWith("/site") ? "" : "_blank"}
        className=" 
        inline
          font-medium
          text-blue-700
          hover:text-blue-800
          underline
          decoration-dashed
          underline-offset-2
          decoration-[0.5px]
          decoration-slate-600 /* light mode color */
          dark:text-blue-300
          dark:decoration-slate-400 /* dark mode color */
          dark:hover:text-blue-200"
      >
        {props.children}{" "}
      </Link>
    );
  },

  pre: (props: HTMLProps<HTMLPreElement>): JSX.Element => (
    <pre {...props}>{props.children}</pre>
  ),

  em: (props: HTMLProps<HTMLSpanElement>): JSX.Element => (
    <em {...props}>{props.children}</em>
  ),

  blockquote: (props: HTMLProps<HTMLQuoteElement>): JSX.Element => (
    <blockquote className="text-base text-justify my-2" {...props}>
      {props.children}
    </blockquote>
  ),

  ul: (props: HTMLProps<HTMLUListElement>): JSX.Element => (
    <ul {...props} className="list-outside">
      {props.children}
    </ul>
  ),

  li: (props: HTMLProps<HTMLLIElement>): JSX.Element => (
    <li {...props}>{props.children}</li>
  ),

  h1: (props: HTMLProps<HTMLHeadingElement>): JSX.Element => (
    <h1 className="text-4xl font-bold my-4" {...props}>
      {props.children}
    </h1>
  ),

  h2: (props: HTMLProps<HTMLHeadingElement>): JSX.Element => (
    <h2 className="text-4xl font-bold my-4" {...props}>
      {props.children}
    </h2>
  ),

  h3: (props: HTMLProps<HTMLHeadingElement>): JSX.Element => (
    <h3 className="text-3xl font-bold my-4" {...props}>
      {props.children}
    </h3>
  ),

  h4: (props: HTMLProps<HTMLHeadingElement>): JSX.Element => (
    <h4 className="text-2xl text-lg font-bold my-4" {...props}>
      {props.children}
    </h4>
  ),

  h5: (props: HTMLProps<HTMLHeadingElement>): JSX.Element => (
    <h5 className="text-xl font-bold my-4" {...props}>
      {props.children}
    </h5>
  ),

  h6: (props: HTMLProps<HTMLHeadingElement>): JSX.Element => (
    <h6 className="text-lg font-bold my-4" {...props}>
      {props.children}
    </h6>
  ),

  p: (props: HTMLProps<HTMLParagraphElement>): JSX.Element => (
    <p className="text-base text-left my-4" {...props}>
      {props.children}
    </p>
  ),
  strong: (props: HTMLProps<HTMLHtmlElement>): JSX.Element => (
    <strong className="font-bold">{props.children}</strong>
  ),

  table: (props: HTMLProps<HTMLTableElement>): JSX.Element => (
    <table className="table-fixed">{props.children}</table>
  ),

  thead: (props: HTMLProps<HTMLTableSectionElement>): JSX.Element => (
    <thead>{props.children}</thead>
  ),

  tr: (props: HTMLProps<HTMLTableRowElement>): JSX.Element => (
    <tr className="p-3 py-3 border-2">{props.children}</tr>
  ),

  tbody: (props: HTMLProps<HTMLTableSectionElement>): JSX.Element => (
    <tbody className="p-3 ">{props.children}</tbody>
  ),

  th: (props: HTMLProps<HTMLTableCellElement>): JSX.Element => (
    <th>{props.children}</th>
  ),
  td: (props: HTMLProps<HTMLTableCellElement>): JSX.Element => (
    <td className="p-3">{props.children}</td>
  ),
  br: () => <br />,
  hr: () => <hr />,
} as MDXComponents;

export default MdxComponents;


import Link from "next/link";
import Image from "next/image";
import { HTMLProps } from "react";
import { transformGithubFilePathToWikiLink } from "@/lib/helpers";
import type { MDXComponents } from 'mdx/types'

const MdxComponents: MDXComponents = {
  img: (props: HTMLProps<HTMLImageElement | MDXComponents>) => {
    if (props.src?.startsWith('/')) props.src = 'https://github.com/ZecHub/zechub/tree/main' + props.src
    return (
      <Image
        src={props.src?.startsWith('/') ? 'https://github.com/ZecHub/zechub/tree/main' + props.src : props.src || ''}
        alt={props.alt || 'Image for wiki docs'}
        height={200}
        width={300}
        layout="responsive"
        loading="lazy"
      />
    )
  },

  a: (props: HTMLProps<HTMLHyperlinkElementUtils>) => {

    return (

      <Link href={props.href?.startsWith('/site') ? transformGithubFilePathToWikiLink(props.href) : props.href!} target={props.href?.startsWith('/site') ? '' : "_blank"} className="text-blue-700">
        {props.children}{" "}
      </Link>
    )
  },

  pre: (props: HTMLProps<HTMLPreElement>) => (
    <pre {...props} >{props.children}</pre>
  ),

  em: (props: HTMLProps<HTMLSpanElement>) => (
    <em {...props}>{props.children}</em>
  ),

  blockquote: (props: HTMLProps<HTMLQuoteElement>) => (
    <blockquote className="text-base text-justify my-2" {...props}>
      {props.children}
    </blockquote>
  ),

  ul: (props: HTMLProps<HTMLUListElement>) => (
    <ul {...props} className="list-outside">
      {props.children}
    </ul>
  ),

  li: (props: HTMLProps<HTMLLIElement>) => (
    <li {...props}>{props.children}</li>
  ),

  h1: (props: HTMLProps<HTMLHeadingElement>) => (
    <h1 className="text-5xl font-bold my-4" {...props}>
      {props.children}
    </h1>
  ),

  h2: (props: HTMLProps<HTMLHeadingElement>) => (
    <h2 className="text-4xl font-bold my-4" {...props}>
      {props.children}
    </h2>
  ),

  h3: (props: HTMLProps<HTMLHeadingElement>) => (
    <h3 className="text-3xl font-bold my-4" {...props}>
      {props.children}
    </h3>
  ),

  h4: (props: HTMLProps<HTMLHeadingElement>) => (
    <h4 className="text-2xl text-lg font-bold my-4" {...props}>
      {props.children}
    </h4>
  ),

  h5: (props: HTMLProps<HTMLHeadingElement>) => (
    <h5 className="text-xl font-bold my-4" {...props}>
      {props.children}
    </h5>
  ),

  h6: (props: HTMLProps<HTMLHeadingElement>) => (
    <h6 className="text-lg font-bold my-4" {...props}>
      {props.children}
    </h6>
  ),

  p: (props: HTMLProps<HTMLParagraphElement>) => (
    <p className="text-base text-justify my-4" {...props}>
      {props.children}
    </p>
  ),
  strong: (props: HTMLProps<HTMLHtmlElement>) => (
    <strong className="font-bold">{props.children}</strong>
  ),

  table: (props: HTMLProps<HTMLTableElement>) => (
    <table className="table-fixed">
      {props.children}
    </table>
  ),

  thead: (props: HTMLProps<HTMLTableSectionElement>) => (
    <thead >
      {props.children}
    </thead>
  ),

  tr: (props: HTMLProps<HTMLTableRowElement>) => (
    <tr className="p-3 py-3 border-2">
      {props.children}
    </tr>
  ),

  tbody: (props: HTMLProps<HTMLTableSectionElement>) => (
    <tbody className="p-3 ">
      {props.children}
    </tbody>
  ),

  th: (props: HTMLProps<HTMLTableCellElement>) => (
    <th>
      {props.children}
    </th>
  ),
  td: (props: HTMLProps<HTMLTableCellElement>) => (
    <td className="p-3">
      {props.children}
    </td>
  ),
  br: () => <br />,
  hr: () => <hr />,
}

export default MdxComponents;

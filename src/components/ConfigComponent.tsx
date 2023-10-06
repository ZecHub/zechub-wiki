import Link from "next/link";
import Image from "next/image";
import { HTMLProps } from "react";

export const ImagePrev = (props: HTMLProps<HTMLImageElement>) => (
    <Image 
      src={props.src || ''} 
      alt={props.alt || 'Image'} 
      height={400} 
      width={600} 
      layout="responsive"
    />
  )

export const LinkComponent = (props: HTMLProps<HTMLHyperlinkElementUtils>): JSX.Element => (
    <Link href={props.href || ""} target="_blank" className="text-blue-700">
      {props.children}{" "}
    </Link>
)

export const PreComponent = (props: HTMLProps<HTMLPreElement>): JSX.Element => (
    <pre {...props} >{props.children}</pre>
)

export const EmComponent = (props: HTMLProps<HTMLSpanElement>): JSX.Element => (
    <em {...props}>{props.children}</em>
)

export const BlockQuote = (props: HTMLProps<HTMLQuoteElement>): JSX.Element => (
    <blockquote className="text-base text-justify my-2" {...props}>
      {props.children}
    </blockquote>
  )

export const UlComponent = (props: HTMLProps<HTMLUListElement>): JSX.Element => (
    <ul {...props} className="list-outside">
      {props.children}
    </ul>
)

export const LiComponent = (props: HTMLProps<HTMLLIElement>): JSX.Element => (
    <li {...props}>{props.children}</li>
)

export const H1Component = (props: HTMLProps<HTMLHeadingElement>): JSX.Element => (
    <h1 className="text-xl font-bold my-4" {...props}>
      {props.children}
    </h1>
)

export const H2Component = (props: HTMLProps<HTMLHeadingElement>): JSX.Element => (
    <h2 className="text-lg font-bold my-4" {...props}>
      {props.children}
    </h2>
  )

 export const H3Component = (props: HTMLProps<HTMLHeadingElement>): JSX.Element => (
    <h3 className="font-bold my-4" {...props}>
      {props.children}
    </h3>
  )

 export const H4Component = (props: HTMLProps<HTMLHeadingElement>): JSX.Element => (
    <h4 className="font-bold my-4" {...props}>
      {props.children}
    </h4>
  )

 export const H5Component = (props: HTMLProps<HTMLHeadingElement>): JSX.Element => (
    <h5 className="font-bold my-4" {...props}>
      {props.children}
    </h5>
  )

 export const H6Component = (props: HTMLProps<HTMLHeadingElement>): JSX.Element => (
    <h6 className="font-bold my-4" {...props}>
      {props.children}
    </h6>
  )

 export const ParaphCompoent = (props: HTMLProps<HTMLParagraphElement>): JSX.Element => (
    <p className="text-base text-justify my-4" {...props}>
      {props.children}
    </p>
  )
export const StrongComponent = (props: HTMLProps<HTMLHtmlElement>): JSX.Element => (
  <strong className="font-bold">{props.children}</strong>
)
 export const MdxComponents = {
    a: LinkComponent,
    br: (): JSX.Element => <br/>,
    hr: (): JSX.Element => <hr />,
    pre: PreComponent,
    em: EmComponent,
    img: ImagePrev,
    h1: H1Component,
    h2: H2Component,
    h3: H3Component,
    h4: H4Component,
    h5: H5Component,
    h6: H6Component,
    p: ParaphCompoent,
    blockquote: BlockQuote,
    ul: UlComponent,
    li: LiComponent 
};
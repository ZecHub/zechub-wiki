"use client";

import type { HTMLProps, JSX, MouseEvent } from "react";

type HashLinkProps = HTMLProps<HTMLAnchorElement> & {
  /** Slugified "#id" the link scrolls to. */
  normalized: string;
};

/**
 * In-page anchor for MDX. It is a client component because MDX is rendered on
 * the server, and a server component cannot pass an onClick handler to an <a>.
 */
export default function HashLink({ normalized, className, ...rest }: HashLinkProps): JSX.Element {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const element = document.getElementById(normalized.slice(1));
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    rest.onClick?.(e);
  };
  return <a href={normalized} className={className} {...rest} onClick={handleClick} />;
}

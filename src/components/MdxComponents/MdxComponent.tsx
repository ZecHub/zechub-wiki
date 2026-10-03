import { Link } from "@/i18n/navigation";
import Image from "next/image";
import React, { HTMLProps, JSX } from "react";
import { transformGithubFilePathToWikiLink } from "@/lib/helpers";
import LiteYouTube from "@/components/LiteYouTube";
import type { MDXComponents } from "mdx/types";
import styles from "./MdxComponent.module.css";

// Pull a YouTube video id out of any embed/watch/short/v/youtu.be URL form.
// Requires a YouTube host first (no over-match of unrelated iframes).
const youTubeId = (src: string): string | null => {
  if (!/(?:youtube(?:-nocookie)?\.com|youtu\.be)/i.test(src)) return null;
  const path = src.match(
    /(?:\/embed\/|\/v\/|\/shorts\/|youtu\.be\/)([A-Za-z0-9_-]{6,})/i,
  );
  if (path) return path[1];
  const q = src.match(/[?&]v=([A-Za-z0-9_-]{6,})/i); // watch?v= (v anywhere)
  return q ? q[1] : null;
};

// Strong slugify for TOC links (handles parentheses, +, etc.)
const slugify = (text: string): string => {
  return text
    .trim()
    .toLowerCase()
    .replace(/[\(\)]/g, '')
    .replace(/\+/g, '-and-')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const getHeadingText = (children: React.ReactNode): string => {
  return React.Children.toArray(children)
    .map((child) =>
      React.isValidElement<{ children?: React.ReactNode }>(child)
        ? getHeadingText(child.props.children)
        : child,
    )
    .join("");
};

const MdxComponents = {
  // TOC LINKS — underline on hover only (no dashed line)
  a: (props: HTMLProps<HTMLAnchorElement>): JSX.Element => {
    let href = props.href || "";
    if (href.startsWith("#")) {
      const normalized = "#" + slugify(href.slice(1));
      const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const targetId = normalized.slice(1);
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };
      return (
        <a
          href={normalized}
          className="font-medium text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200 hover:underline scroll-mt-20"
          onClick={handleClick}
          {...props}
        />
      );
    }
    const resolved = href.startsWith("/site")
      ? transformGithubFilePathToWikiLink(href)
      : href;
    // Protocol-relative URLs ("//host/...") start with "/" but are external;
    // only single-leading-slash app paths are internal.
    const isInternal = resolved.startsWith("/") && !resolved.startsWith("//");
    const className =
      "font-medium text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200 underline decoration-dashed";
    // Internal links use the locale-aware next-intl Link so navigation stays
    // within the active locale (e.g. /it/...). External links open in a new tab.
    if (isInternal) {
      return (
        <Link href={resolved} className={className}>
          {props.children}
        </Link>
      );
    }
    return (
      <a href={resolved} target="_blank" rel="noreferrer" className={className}>
        {props.children}
      </a>
    );
  },

  // Headings with IDs
  h1: (props: HTMLProps<HTMLHeadingElement>): JSX.Element => {
    const text = getHeadingText(props.children).trim();
    const id = slugify(text);
    return <h1 id={id} className={styles.h1} {...props} />;
  },
  h2: (props: HTMLProps<HTMLHeadingElement>): JSX.Element => {
    const text = getHeadingText(props.children).trim();
    const id = slugify(text);
    return <h2 id={id} className={styles.h2} {...props} />;
  },
  h3: (props: HTMLProps<HTMLHeadingElement>): JSX.Element => {
    const text = getHeadingText(props.children).trim();
    const id = slugify(text);
    return <h3 id={id} className={styles.h3} {...props} />;
  },

  code: ({ className, ...props }: HTMLProps<HTMLElement>): JSX.Element => (
    <code {...props} className={[styles.code, className].filter(Boolean).join(" ")} />
  ),
  pre: ({ className, ...props }: HTMLProps<HTMLPreElement>): JSX.Element => (
    <pre {...props} className={[styles.pre, className].filter(Boolean).join(" ")} />
  ),
  table: ({ className, ...props }: HTMLProps<HTMLTableElement>): JSX.Element => (
    <div className={styles.tableScroll} tabIndex={0}>
      <table {...props} className={[styles.table, className].filter(Boolean).join(" ")} />
    </div>
  ),
  thead: (props: HTMLProps<HTMLTableSectionElement>): JSX.Element => <thead {...props} />,
  tr: (props: HTMLProps<HTMLTableRowElement>): JSX.Element => <tr {...props} />,
  th: (props: HTMLProps<HTMLTableCellElement>): JSX.Element => <th scope="col" {...props} />,
  td: (props: HTMLProps<HTMLTableCellElement>): JSX.Element => <td {...props} />,
  blockquote: (props: HTMLProps<HTMLQuoteElement>): JSX.Element => (
    <blockquote className={styles.quote} {...props} />
  ),

  // Everything else
  img: (props: HTMLProps<HTMLImageElement>): JSX.Element => (
    // Images are self-hosted under /content-images/ (same-origin) — serve as-is.
    <img
      src={props.src || ""}
      alt={props.alt || "Image"}
      className="rounded-lg my-4"
      loading="lazy"
    />
  ),
  // Raw <iframe> in content markdown: route YouTube through the click-to-load
  // facade so a page doesn't contact Google on render; other iframes pass through.
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
    // Non-YouTube iframes: sandbox without allow-scripts so an injected
    // <iframe> can't execute script (srcdoc is already stripped upstream).
    return <iframe {...props} sandbox="allow-same-origin allow-popups allow-forms" />;
  },
  ul: (props: HTMLProps<HTMLUListElement>): JSX.Element => <ul className={styles.list} {...props} />,
  ol: (props: React.ComponentProps<"ol">): JSX.Element => <ol className={`${styles.list} ${styles.orderedList}`} {...props} />,
  li: (props: HTMLProps<HTMLLIElement>): JSX.Element => <li {...props} />,
  p: (props: HTMLProps<HTMLParagraphElement>): JSX.Element => <p className={styles.paragraph} {...props} />,
} as MDXComponents;

export default MdxComponents;

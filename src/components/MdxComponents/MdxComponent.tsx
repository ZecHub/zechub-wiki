import { Link } from "@/i18n/navigation";
import Image from "next/image";
import React, { HTMLProps, JSX } from "react";
import { transformGithubFilePathToWikiLink } from "@/lib/helpers";
import LiteYouTube from "@/components/LiteYouTube";
import type { MDXComponents } from "mdx/types";

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
    const text = React.Children.toArray(props.children).join('').trim();
    const id = slugify(text);
    return <h1 id={id} className="text-4xl font-bold my-6 scroll-mt-20" {...props} />;
  },
  h2: (props: HTMLProps<HTMLHeadingElement>): JSX.Element => {
    const text = React.Children.toArray(props.children).join('').trim();
    const id = slugify(text);
    return <h2 id={id} className="text-3xl font-bold my-6 scroll-mt-20" {...props} />;
  },
  h3: (props: HTMLProps<HTMLHeadingElement>): JSX.Element => {
    const text = React.Children.toArray(props.children).join('').trim();
    const id = slugify(text);
    return <h3 id={id} className="text-2xl font-bold my-5 scroll-mt-20" {...props} />;
  },

  // Code blocks — your exact tan styling
  code: (props: HTMLProps<HTMLElement> & { className?: string }): JSX.Element => {
    const isBlockCode = props.className?.includes("language-") ?? false;
    if (isBlockCode) {
      return (
        <code
          className={`font-mono text-sm bg-transparent !bg-transparent !p-0 !m-0 block w-full ${props.className || ""}`}
          style={{ backgroundColor: "transparent" }}
          {...props}
        />
      );
    }
    return (
      <code
        className="font-mono text-sm !inline-block !translate-y-[16px]"
        {...props}
      />
    );
  },

  pre: (props: HTMLProps<HTMLPreElement>): JSX.Element => (
    <div className="relative group my-6">
      <div className="absolute -top-3 left-4 z-10 px-3 py-1 
        bg-amber-50 dark:bg-amber-950 
        text-amber-800 dark:text-amber-300 
        text-xs font-mono tracking-widest rounded border border-amber-200 dark:border-amber-800 shadow-sm">
        Code-highlight
      </div>
      <pre
        className="bg-amber-50 dark:bg-amber-950 !bg-amber-50 dark:!bg-amber-950 text-neutral-900 dark:text-neutral-100 p-5 pt-8 rounded-2xl overflow-x-auto border border-amber-200 dark:border-amber-900 font-mono text-sm leading-relaxed shadow-xl"
        {...props}
      />
    </div>
  ),

  // === UPDATED: Beautiful amber-themed tables (matches your tan code blocks) ===
  table: (props: HTMLProps<HTMLTableElement>): JSX.Element => (
    <div className="overflow-x-auto my-6">
      <table 
        className="min-w-full border-collapse text-sm bg-white dark:bg-neutral-900 rounded-xl overflow-hidden shadow-sm" 
        {...props} 
      />
    </div>
  ),
  thead: (props: HTMLProps<HTMLTableSectionElement>): JSX.Element => (
    <thead className="bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-100" {...props} />
  ),
  tr: (props: HTMLProps<HTMLTableRowElement>): JSX.Element => (
    <tr className="border-b border-amber-200 dark:border-amber-900 hover:bg-amber-50 dark:hover:bg-neutral-800" {...props} />
  ),
  th: (props: HTMLProps<HTMLTableCellElement>): JSX.Element => (
    <th className="px-6 py-4 text-left font-semibold" {...props} />
  ),
  td: (props: HTMLProps<HTMLTableCellElement>): JSX.Element => (
    <td className="px-6 py-4" {...props} />
  ),
  // =====================================================================

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
  ul: (props: HTMLProps<HTMLUListElement>): JSX.Element => <ul className="list-disc pl-6 my-4" {...props} />,
  ol: (props: React.ComponentProps<"ol">): JSX.Element => <ol className="list-decimal pl-6 my-4" {...props} />,
  li: (props: HTMLProps<HTMLLIElement>): JSX.Element => <li {...props} />,
  p: (props: HTMLProps<HTMLParagraphElement>): JSX.Element => <p className="my-4" {...props} />,
} as MDXComponents;

export default MdxComponents;

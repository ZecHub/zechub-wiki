import Link from "next/link";
import Image from "next/image";
import React, { HTMLProps, JSX } from "react";
import { transformGithubFilePathToWikiLink } from "@/lib/helpers";
import type { MDXComponents } from "mdx/types";

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
  a: (props: HTMLProps<HTMLAnchorElement>): JSX.Element => {   // ← fixed type here
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

    return (
      <Link
        href={href.startsWith("/site") ? transformGithubFilePathToWikiLink(href) : href}
        target={href.startsWith("/site") ? "" : "_blank"}
        className="font-medium text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200 underline decoration-dashed"
      >
        {props.children}
      </Link>
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

  // Everything else
  img: (props: HTMLProps<HTMLImageElement>): JSX.Element => (
    <img
      src={props.src?.startsWith("/") ? "https://github.com/ZecHub/zechub/tree/main" + props.src : props.src || ""}
      alt={props.alt || "Image"}
      className="rounded-lg my-4"
      loading="lazy"
    />
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
} as MDXComponents;

export default MdxComponents;
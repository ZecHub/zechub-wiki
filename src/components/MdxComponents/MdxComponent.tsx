import { Link } from "@/i18n/navigation";
import Image from "next/image";
import React, { HTMLProps, JSX } from "react";
import { transformGithubFilePathToWikiLink } from "@/lib/helpers";
import LiteYouTube from "@/components/LiteYouTube";
import type { MDXComponents } from "mdx/types";
import { ArrowUpRight } from "lucide-react";

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

// Reading-text link: brand colour, thin solid underline that firms up on hover.
const LINK =
  "font-medium text-brand underline decoration-brand/40 underline-offset-[3px] transition-colors hover:decoration-brand dark:text-brand-soft dark:decoration-brand-soft/40 dark:hover:decoration-brand-soft";

// Same look as the "Explore" button / home page call-to-action buttons.
const BUTTON =
  "inline-flex items-center justify-center gap-1.5 rounded-lg border border-brand bg-brand px-4 py-2 text-center text-sm font-semibold !text-on-brand no-underline transition-colors hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:border-brand/40 dark:bg-brand/15 dark:!text-brand-soft dark:hover:border-brand/70 dark:hover:bg-brand/25 dark:hover:!text-white dark:focus-visible:ring-offset-slate-900";

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
          className={`${LINK} scroll-mt-20`}
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
    const isButton = (props as Record<string, unknown>)["data-button"] === "true";
    const className = isButton ? BUTTON : LINK;
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
        {isButton ? <ArrowUpRight aria-hidden="true" className="h-4 w-4" /> : null}
      </a>
    );
  },

  // Headings with IDs
  h1: (props: HTMLProps<HTMLHeadingElement>): JSX.Element => {
    const text = getHeadingText(props.children).trim();
    const id = slugify(text);
    return <h1 id={id} className="text-3xl md:text-4xl font-semibold tracking-tight mt-2 mb-6 scroll-mt-20 text-slate-900 dark:text-white" {...props} />;
  },
  h2: ({ children, ...rest }: HTMLProps<HTMLHeadingElement>): JSX.Element => {
    const text = getHeadingText(children).trim();
    const id = slugify(text);
    return (
      <h2
        id={id}
        className="group mt-14 mb-4 scroll-mt-20 border-t border-slate-200 pt-10 text-2xl font-semibold tracking-tight text-slate-900 md:text-[1.75rem] dark:border-slate-800 dark:text-white [h1+&]:mt-8 [h1+&]:border-0 [h1+&]:pt-0 [hr+&]:mt-8 [hr+&]:border-0 [hr+&]:pt-0"
        {...rest}
      >
        {children}
        <a
          href={`#${id}`}
          aria-label="Link to this section"
          className="ml-2 text-lg font-normal text-slate-400 opacity-0 transition-opacity hover:text-brand focus-visible:opacity-100 group-hover:opacity-100"
        >
          #
        </a>
      </h2>
    );
  },
  h3: (props: HTMLProps<HTMLHeadingElement>): JSX.Element => {
    const text = getHeadingText(props.children).trim();
    const id = slugify(text);
    return <h3 id={id} className="mt-9 mb-3 scroll-mt-20 text-xl font-semibold tracking-tight text-slate-900 md:text-[1.35rem] dark:text-white" {...props} />;
  },

  // Code: neutral surface in both themes; no decorative badge.
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
        className="rounded-md border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-[0.875em] text-slate-800 dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
        {...props}
      />
    );
  },

  pre: (props: HTMLProps<HTMLPreElement>): JSX.Element => (
    <pre
      className="my-6 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-5 font-mono text-sm leading-relaxed text-slate-800 dark:border-white/10 dark:bg-[#040f1d] dark:text-slate-100 [&_code]:!m-0 [&_code]:!translate-y-0 [&_code]:!border-0 [&_code]:!bg-transparent [&_code]:!p-0"
      {...props}
    />
  ),

  // Tables: quiet header, hairline rows, brand-tinted hover.
  table: (props: HTMLProps<HTMLTableElement>): JSX.Element => (
    <div className="my-6 overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10">
      <table className="min-w-full border-collapse text-sm" {...props} />
    </div>
  ),
  thead: (props: HTMLProps<HTMLTableSectionElement>): JSX.Element => (
    <thead
      className="bg-slate-100 text-left text-xs uppercase tracking-wider text-slate-600 dark:bg-white/5 dark:text-slate-300"
      {...props}
    />
  ),
  tr: (props: HTMLProps<HTMLTableRowElement>): JSX.Element => (
    <tr
      className="border-b border-slate-200 last:border-b-0 hover:bg-brand/5 dark:border-white/10"
      {...props}
    />
  ),
  th: (props: HTMLProps<HTMLTableCellElement>): JSX.Element => (
    <th className="px-4 py-3 font-semibold" {...props} />
  ),
  td: (props: HTMLProps<HTMLTableCellElement>): JSX.Element => (
    <td className="px-4 py-3 align-top" {...props} />
  ),

  blockquote: (props: HTMLProps<HTMLQuoteElement>): JSX.Element => (
    <blockquote
      className="my-6 rounded-r-lg border-l-4 border-brand bg-brand/5 px-5 py-3 text-slate-700 dark:bg-brand/10 dark:text-slate-200 [&>p]:my-2"
      {...props}
    />
  ),
  hr: (): JSX.Element => (
    <hr className="my-10 border-0 border-t border-slate-200 dark:border-white/10" />
  ),

  // Everything else
  img: (props: HTMLProps<HTMLImageElement>): JSX.Element => (
    // Images are self-hosted under /content-images/ (same-origin) — serve as-is.
    <img
      src={props.src || ""}
      alt={props.alt || "Image"}
      className="my-5 rounded-xl border border-slate-200 dark:border-white/10"
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
  ul: (props: HTMLProps<HTMLUListElement>): JSX.Element => {
    const variant = (props as Record<string, unknown>)["data-variant"];
    const { children } = props;
    // Summary and warning lists: one quiet callout style, a thin accent bar
    // and ordinary bullets (no icons, no boxes).
    if (variant === "tldr" || variant === "warn") {
      const accent = variant === "warn" ? "border-amber-500/70" : "border-brand";
      return (
        <ul
          className={`my-6 list-disc space-y-2 rounded-r-lg border-l-2 ${accent} bg-slate-50 py-4 pl-10 pr-5 marker:text-slate-400 dark:bg-white/[0.03] dark:marker:text-slate-500`}
        >
          {children}
        </ul>
      );
    }
    // Related pages: plain two-column list of links with a muted description.
    if (variant === "related") {
      return (
        <ul className="my-6 grid list-none gap-x-8 gap-y-4 pl-0 sm:grid-cols-2 [&>li]:border-t [&>li]:border-slate-200 [&>li]:pt-3 [&>li]:text-sm [&>li]:text-slate-600 dark:[&>li]:border-white/10 dark:[&>li]:text-slate-400 [&>li>a]:block [&>li>a]:font-semibold [&>li>a]:no-underline hover:[&>li>a]:underline">
          {children}
        </ul>
      );
    }
    return (
      <ul
        className="my-5 list-disc space-y-2 pl-6 marker:text-slate-400 dark:marker:text-slate-500"
        {...props}
      />
    );
  },
  ol: (props: React.ComponentProps<"ol">): JSX.Element => (
    <ol
      className="my-5 list-decimal space-y-2 pl-6 marker:font-medium marker:text-slate-500 dark:marker:text-slate-400"
      {...props}
    />
  ),
  li: (props: HTMLProps<HTMLLIElement>): JSX.Element => <li {...props} />,
  p: (props: HTMLProps<HTMLParagraphElement>): JSX.Element => {
    const rec = props as Record<string, unknown>;
    if (rec["data-link-title"] === "true") {
      // A paragraph that is only a link: treated as an entry title
      // (e.g. an exchange name) so it reads as a heading, not a stray link.
      return (
        <p className="mt-7 mb-1 text-base font-semibold [&>a]:no-underline [&>a]:hover:underline">
          {props.children}
        </p>
      );
    }
    if (rec["data-button-row"] === "true") {
      return <p className="mt-8 mb-3">{props.children}</p>;
    }
    return <p className="my-5" {...props} />;
  },
} as MDXComponents;

export default MdxComponents;

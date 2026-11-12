"use client";

import { Link } from "@/i18n/navigation";
import { transformGithubFilePathToWikiLink } from "@/lib/helpers";
import type { HTMLProps, JSX, MouseEvent } from "react";

const slugify = (text: string): string =>
  text
    .trim()
    .toLowerCase()
    .replace(/[\(\)]/g, "")
    .replace(/\+/g, "-and-")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** MDX <a>. Client component so hash-link onClick is legal under RSC. */
export default function MdxLink(props: HTMLProps<HTMLAnchorElement>): JSX.Element {
  const href = props.href || "";

  if (href.startsWith("#")) {
    const normalized = "#" + slugify(href.slice(1));
    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
      const targetId = normalized.slice(1);
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    return (
      <a
        href={normalized}
        className="font-medium text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200 hover:underline scroll-mt-20 [overflow-wrap:anywhere]"
        onClick={handleClick}
        {...props}
      />
    );
  }

  const resolved = href.startsWith("/site")
    ? transformGithubFilePathToWikiLink(href)
    : href;
  const isInternal = resolved.startsWith("/") && !resolved.startsWith("//");
  const className =
    "font-medium text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200 underline decoration-dashed [overflow-wrap:anywhere]";

  if (isInternal) {
    return (
      <Link href={resolved} className={className}>
        {props.children}
      </Link>
    );
  }

  const normalized = resolved.replace(/[\t\n\r\f\v\u0000-\u001F\u007F]/g, "").trim();
  const allowed =
    normalized.startsWith("#") ||
    normalized.startsWith("/") ||
    /^(https?|mailto):/i.test(normalized);
  if (!allowed) {
    return <span className={className}>{props.children}</span>;
  }
  return (
    <a href={normalized} target="_blank" rel="noreferrer" className={className}>
      {props.children}
    </a>
  );
}

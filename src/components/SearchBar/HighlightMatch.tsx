"use client";

import { escapeRegExp, tokenizeQuery } from "@/lib/wikiSearch";
import { Fragment } from "react";

type Props = {
  text: string;
  query: string;
  className?: string;
};

/**
 * Highlights query tokens in text (case-insensitive). Safe for plain text fields only.
 */
export function HighlightMatch({ text, query, className }: Props) {
  const tokens = tokenizeQuery(query);
  if (!tokens.length) {
    return <>{text}</>;
  }

  const pattern = tokens.map(escapeRegExp).join("|");
  const re = new RegExp(`(${pattern})`, "gi");
  const parts = text.split(re);

  return (
    <>
      {parts.map((part, i) => {
        const isMatch = tokens.some(
          (t) => part.toLowerCase() === t.toLowerCase(),
        );
        if (!isMatch) {
          return <Fragment key={i}>{part}</Fragment>;
        }
        return (
          <mark
            key={i}
            className={
              className ??
              "rounded-sm bg-amber-200/90 px-0.5 font-medium text-inherit dark:bg-amber-500/35"
            }
          >
            {part}
          </mark>
        );
      })}
    </>
  );
}

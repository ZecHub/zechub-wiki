"use client";

import { escapeRegExp, foldSearchAccents, tokenizeQuery } from "@/lib/wikiSearch";
import { Fragment } from "react";

type Props = {
  text: string;
  query: string;
  className?: string;
};

type Range = { start: number; end: number };

function matchRanges(text: string, tokens: string[]) {
  const folded = foldSearchAccents(text);
  const positions: Range[] = [];

  // Keep original offsets when an accent disappears or a ligature expands.
  if (folded !== text) {
    for (const group of text.matchAll(/\P{M}\p{M}*|\p{M}+/gu)) {
      const start = group.index ?? 0;
      const range = { start, end: start + group[0].length };
      const length = foldSearchAccents(group[0]).length;
      for (let index = 0; index < length; index++) positions.push(range);
    }
  }

  const matches: Range[] = [];
  const pattern = new RegExp(tokens.map(escapeRegExp).join("|"), "giu");
  for (const match of folded.matchAll(pattern)) {
    const index = match.index ?? 0;
    const start = positions[index]?.start ?? index;
    const end = positions[index + match[0].length - 1]?.end ?? index + match[0].length;
    const previous = matches.at(-1);
    if (previous && start < previous.end) {
      previous.end = Math.max(previous.end, end);
    } else {
      matches.push({ start, end });
    }
  }
  return matches;
}

/** Highlights query matches without changing the original result text. */
export function HighlightMatch({ text, query, className }: Props) {
  const tokens = tokenizeQuery(query);
  if (!tokens.length) {
    return <>{text}</>;
  }

  const matches = matchRanges(text, tokens);
  let endOfLastMatch = 0;

  return (
    <>
      {matches.map(({ start, end }) => {
        const beforeMatch = text.slice(endOfLastMatch, start);
        endOfLastMatch = end;
        return (
          <Fragment key={start}>
            {beforeMatch}
            <mark
              className={
                className ??
                "rounded-sm bg-amber-200/90 px-0.5 font-medium text-inherit dark:bg-amber-500/35"
              }
            >
              {text.slice(start, end)}
            </mark>
          </Fragment>
        );
      })}
      {text.slice(endOfLastMatch)}
    </>
  );
}

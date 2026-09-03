"use client";

import {
  useMemo,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { MdArrowForward as ArrowIcon } from "react-icons/md";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useLanguage } from "@/context/LanguageContext";
import { pathSectionLabel, searchWiki } from "@/lib/wikiSearch";
import { suggestPages } from "@/lib/notFoundSuggestions";
import { HighlightMatch } from "./SearchBar/HighlightMatch";
import { SearchInput } from "./SearchBar/SearchInput";
import { Icon } from "./UI/Icon";
import type { Searcher } from "@/types";

const RESULT_LIMIT = 6;

type NotFoundSearchProps = {
  /** The same index the nav search box uses, built in not-found.tsx. */
  searchItems: readonly Searcher[];
};

/**
 * Search box and recovery suggestions for the 404 page.
 *
 * The reader arrives here having already typed or followed something close to
 * a real page, so the failed path is the best query available. It is read from
 * usePathname rather than passed in, because Next does not give not-found.tsx
 * the URL that missed. Typing takes over from there and searches the whole
 * wiki, which is the same call the nav search box makes.
 */
export default function NotFoundSearch({ searchItems }: NotFoundSearchProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const [query, setQuery] = useState("");

  const trimmedQuery = query.trim();
  const hasQuery = trimmedQuery.length > 0;

  const suggestions = useMemo(
    () => suggestPages(searchItems, pathname, { locales: routing.locales }),
    [searchItems, pathname],
  );

  const results = useMemo(
    () =>
      hasQuery ? searchWiki(searchItems, trimmedQuery).slice(0, RESULT_LIMIT) : [],
    [hasQuery, searchItems, trimmedQuery],
  );

  const list = hasQuery ? results : suggestions;
  const heading = hasQuery
    ? t.common?.searchResultsLabel || "Results"
    : t.common?.searchSuggested || "Suggested pages";

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // Enter opens the top hit. SearchInput swallows form submission, so the key
  // has to be handled here or it would do nothing at all.
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const first = list[0];
    if (first) router.push(first.url);
  };

  return (
    <div className="mt-10 w-full max-w-xl text-left">
      <SearchInput
        id="not-found-search-input"
        hintId="not-found-search-hint"
        searchInput={query}
        handleSearch={handleChange}
        onKeyDown={handleKeyDown}
      />
      <p
        id="not-found-search-hint"
        className="mt-2 text-xs text-slate-500 dark:text-slate-400"
      >
        {t.common?.searchHint ||
          "Search by page title, topic, or path. Use arrow keys to choose, Enter to open."}
      </p>

      {list.length > 0 ? (
        <>
          <h2 className="mt-8 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {heading}
          </h2>
          <ul className="mt-3 flex flex-col gap-1.5">
            {list.map((item) => {
              const section = pathSectionLabel(item.url);

              return (
                <li key={item.url}>
                  <Link
                    href={item.url}
                    className="block rounded-xl outline-none transition focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <div className="flex items-start gap-3 rounded-xl border border-transparent bg-white px-3 py-3 text-left transition hover:border-slate-200 dark:bg-slate-900 dark:hover:border-slate-600 dark:hover:bg-slate-800/90 sm:px-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-base font-semibold text-slate-900 dark:text-white">
                            <HighlightMatch
                              text={item.name}
                              query={trimmedQuery}
                            />
                          </span>
                          {section ? (
                            <span className="inline-flex shrink-0 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                              {section}
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                          <HighlightMatch
                            text={item.desc}
                            query={trimmedQuery}
                          />
                        </p>
                      </div>
                      <Icon
                        className="mt-1 h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500"
                        icon={ArrowIcon}
                        aria-hidden
                      />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      ) : null}

      {hasQuery && results.length === 0 ? (
        <div className="mt-8 text-sm">
          <p className="font-medium text-slate-700 dark:text-slate-200">
            {t.common?.searchNoResults || "No matching pages"}
          </p>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            {t.common?.searchTryDifferent ||
              "Try shorter queries, synonyms, or different words."}
          </p>
        </div>
      ) : null}
    </div>
  );
}

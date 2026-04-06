"use client";
import { searcher } from "@/constants/searcher";
import { SearchBarProps } from "@/types";
import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  Fragment,
} from "react";
import { IoMdClose as closeIcon } from "react-icons/io";
import { MdArrowForward as ArrowIcon } from "react-icons/md";
import { Icon } from "../UI/Icon";
import { SearchInput } from "./SearchInput";
import { useLanguage } from "@/context/LanguageContext";
import { pathSectionLabel, searchWiki } from "@/lib/wikiSearch";
import { HighlightMatch } from "./HighlightMatch";
import AIAssistantPanel from "../AIAssistant";

const SUGGESTED_COUNT = 8;
type SearchMode = "search" | "ai";

const SearchBar = ({ openSearch, setOpenSearch }: SearchBarProps) => {
  const { t } = useLanguage();
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mode, setMode] = useState<SearchMode>("search");
  const [aiAutoSendQuery, setAiAutoSendQuery] = useState("");
  const [aiAutoSendNonce, setAiAutoSendNonce] = useState(0);
  const [aiIsLoading, setAiIsLoading] = useState(false);
  const [aiHasUnreadReply, setAiHasUnreadReply] = useState(false);
  const selectedIndexRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const ignoreNextDialogCloseRef = useRef(false);
  const lastAutoAskedQueryRef = useRef("");
  selectedIndexRef.current = selectedIndex;

  const trimmedQuery = searchInput.trim();
  const hasQuery = trimmedQuery.length > 0;

  const searchResults = useMemo(() => {
    if (!hasQuery) return [];
    return searchWiki(searcher, trimmedQuery);
  }, [trimmedQuery, hasQuery]);

  const suggested = useMemo(() => searcher.slice(0, SUGGESTED_COUNT), []);

  const listToShow = hasQuery ? searchResults : suggested;
  const showEmpty = hasQuery && searchResults.length === 0;

  const searchHint =
    t.common?.searchHint ||
    "Search by page title, topic, or path. Use ↑↓ to choose, Enter to open.";

  const noResultsTitle =
    t.common?.searchNoResults || "No matching pages";
  const noResultsTry =
    t.common?.searchTryDifferent ||
    "Try shorter queries, synonyms, or different words.";
  const askAiLabel = t.common?.searchAskAi || "Answer with AI";
  const askAiHint =
    t.common?.searchAskAiHint || "Get a synthesized answer with sources.";
  const suggestedTitle =
    t.common?.searchSuggested || "Suggested pages";
  const resultsTitle = t.common?.searchResultsLabel || "Results";
  const modalTitle = t.common?.searchModalTitle || "Search ZecHub Wiki";
  const aiModeTitle = t.common?.searchAiTitle || "Answer with AI";

  useEffect(() => {
    setSelectedIndex(0);
  }, [trimmedQuery]);

  useEffect(() => {
    if (!openSearch) return;
    const id = requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
    return () => cancelAnimationFrame(id);
  }, [openSearch]);

  useEffect(() => {
    if (!openSearch) {
      setMode("search");
      setAiAutoSendQuery("");
      setAiAutoSendNonce(0);
    }
  }, [openSearch]);

  useEffect(() => {
    if (listToShow.length === 0) {
      setSelectedIndex(0);
      return;
    }
    setSelectedIndex((i) => Math.min(i, listToShow.length - 1));
  }, [listToShow.length]);

  const onClose = useCallback(() => {
    setSearchInput("");
    setMode("search");
    setOpenSearch(false);
  }, [setOpenSearch]);

  const askAiForQuery = useCallback((force = false) => {
    if (!hasQuery) {
      setMode("ai");
      setAiHasUnreadReply(false);
      return;
    }

    const normalizedQuery = trimmedQuery.toLowerCase();
    if (!force && lastAutoAskedQueryRef.current === normalizedQuery) {
      setMode("ai");
      setAiHasUnreadReply(false);
      return;
    }

    ignoreNextDialogCloseRef.current = true;
    setAiAutoSendQuery(trimmedQuery);
    setAiAutoSendNonce((n) => n + 1);
    lastAutoAskedQueryRef.current = normalizedQuery;
    setMode("ai");
    setAiHasUnreadReply(false);
  }, [hasQuery, trimmedQuery]);

  const handleDialogClose = useCallback(() => {
    if (ignoreNextDialogCloseRef.current) {
      ignoreNextDialogCloseRef.current = false;
      return;
    }
    onClose();
  }, [onClose]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const goToResult = useCallback(
    (url: string) => {
      router.push(url);
      onClose();
    },
    [router, onClose],
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      return;
    }
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      askAiForQuery(true);
      return;
    }
    if (mode === "ai") return;
    if (!listToShow.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, listToShow.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      const item = listToShow[selectedIndexRef.current];
      if (item) {
        e.preventDefault();
        goToResult(item.url);
      }
    }
  };

  return (
    <Transition show={openSearch} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleDialogClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto p-4 sm:p-6">
          <div className="flex h-full items-start justify-center sm:items-center sm:pt-10">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-[0.95]"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-[0.95]"
            >
              <Dialog.Panel className="relative flex h-[80%] w-full max-w-xl min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/40">
                <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/80">
                  <div className="min-w-0 flex-1">
                    <Dialog.Title className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                      {modalTitle}
                    </Dialog.Title>
                    <p
                      id="wiki-search-hint"
                      className="mt-0.5 text-xs text-slate-500 dark:text-slate-400"
                    >
                      {searchHint}
                    </p>
                    <div className="mt-2 flex items-center gap-6">
                      <button
                        type="button"
                        onClick={() => setMode("search")}
                        className={`relative pb-1 text-sm font-medium transition cursor-pointer ${mode === "search"
                            ? "text-slate-900 dark:text-white"
                            : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                          }`}
                      >
                        Search
                        {mode === "search" ? (
                          <span className="absolute -bottom-[3px] left-0 right-0 h-0.5 rounded bg-blue-600 dark:bg-blue-400" />
                        ) : null}
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (hasQuery) {
                            askAiForQuery();
                            return;
                          }
                          setMode("ai");
                        }}
                        className={`relative pb-1 text-sm font-medium transition cursor-pointer ${mode === "ai"
                            ? "text-slate-900 dark:text-white"
                            : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                          }`}
                        aria-label={hasQuery ? `${askAiLabel}: ${trimmedQuery}` : askAiLabel}
                      >
                        {aiModeTitle}
                        {aiHasUnreadReply && mode !== "ai" ? (
                          <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-blue-600 align-middle dark:bg-blue-400" />
                        ) : null}
                        {mode === "ai" ? (
                          <span className="absolute -bottom-[3px] left-0 right-0 h-0.5 rounded bg-blue-600 dark:bg-blue-400" />
                        ) : null}
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white cursor-pointer"
                    aria-label={t.common?.close || "Close"}
                  >
                    <Icon icon={closeIcon} className="h-5 w-5 cursor-pointer" />
                  </button>
                </div>

                {mode === "search" && (
                  <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/50">
                    <SearchInput
                      ref={inputRef}
                      searchInput={searchInput}
                      handleSearch={handleChange}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                )}

                <div className="flex-1 min-h-0 bg-slate-50/80 dark:bg-slate-950/40">
                  <div
                    className={`h-full overflow-y-auto overscroll-contain px-2 py-2 ${
                      mode === "search" ? "block" : "hidden"
                    }`}
                  >
                    {showEmpty ? (
                      <div className="flex flex-col items-center justify-center gap-2 px-4 py-16 text-center">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                          {noResultsTitle}
                        </p>
                        <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
                          {noResultsTry}
                        </p>
                        <button
                          type="button"
                          onClick={() => askAiForQuery(true)}
                          className="mt-2 inline-flex items-center rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 transition hover:bg-blue-100 dark:border-blue-500/40 dark:bg-blue-900/30 dark:text-blue-200 dark:hover:bg-blue-900/50 cursor-pointer"
                        >
                          {askAiLabel}
                        </button>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          {askAiHint}
                        </p>
                      </div>
                    ) : (
                      <>
                        <ul className="flex flex-col gap-1.5 pb-2">
                          {listToShow.map((result, i) => {
                            const section = pathSectionLabel(result.url);
                            const selected = i === selectedIndex;
                            return (
                              <li key={result.url}>
                                <Link
                                  href={result.url}
                                  data-selected={selected}
                                  onClick={onClose}
                                  onMouseEnter={() => setSelectedIndex(i)}
                                  className="block rounded-xl outline-none transition focus-visible:ring-2 focus-visible:ring-blue-500"
                                >
                                  <div
                                    className={`flex cursor-pointer items-start gap-3 border px-3 py-3 text-left transition sm:px-4 ${selected
                                        ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500/30 dark:border-blue-400/60 dark:bg-blue-950/40 dark:ring-blue-400/25"
                                        : "border-transparent bg-white hover:border-slate-200 hover:bg-white dark:bg-slate-900 dark:hover:border-slate-600 dark:hover:bg-slate-800/90"
                                      }`}
                                  >
                                    <div className="min-w-0 flex-1">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-base font-semibold text-slate-900 dark:text-white">
                                          <HighlightMatch
                                            text={result.name}
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
                                          text={result.desc}
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
                    )}
                  </div>

                  <div
                    className={`h-full overflow-hidden ${
                      mode === "ai" ? "block" : "hidden"
                    }`}
                  >
                    <AIAssistantPanel
                      autoSendQuery={aiAutoSendQuery}
                      autoSendNonce={aiAutoSendNonce}
                      onLoadingChange={setAiIsLoading}
                      onAssistantReply={() => {
                        if (mode !== "ai") {
                          setAiHasUnreadReply(true);
                        }
                      }}
                    />
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SearchBar;

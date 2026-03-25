"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  FormEvent,
  KeyboardEvent,
} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ApiError {
  error: string;
}

const MAX_MESSAGE_LENGTH = 1000;
const AI_HISTORY_STORAGE_KEY = "zechub_ai_search_history_v1";

const QUICK_QUESTIONS = [
  "What is Zcash?",
  "What is ZecHub?",
  "How do shielded transactions work?",
  "What wallets support Zcash?",
  "What is a z-address vs t-address?",
  "How do I get started with ZEC?",
  "What is the Zcash development fund?",
  "What are zk-SNARKs?",
];

const SENSITIVE_HINTS: RegExp[] = [
  /\b([a-z]{3,8}\s){11,23}[a-z]{3,8}\b/,
  /\bzs1[a-z0-9]{50,}/i,
  /\bu[a-z0-9]{60,}/i,
  /\bt1[a-zA-Z0-9]{33}\b/,
  /\bzxviews[a-z0-9]{40,}/i,
  /\b[0-9a-f]{60,}\b/i,
];

function looksLikeSensitive(text: string): boolean {
  return SENSITIVE_HINTS.some((re) => re.test(text));
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available in non-HTTPS dev environments
    }
  }

  return (
    <button
      onClick={handleCopy}
      aria-label="Copy response"
      className="mt-1 flex items-center gap-1 text-[10px] text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
    >
      {copied ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end mb-3">
        <div className="max-w-[82%] rounded-2xl rounded-br-none bg-[#F4B728] px-4 py-2.5 text-sm text-black leading-relaxed break-words">
          {msg.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-3">
      <div className="max-w-[88%]">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F4B728] text-black text-[9px] font-bold shrink-0">Z</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">ZecHub AI</span>
        </div>
        <div className="rounded-2xl rounded-tl-none border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 leading-relaxed break-words dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              strong: ({ children }) => <strong className="font-semibold text-slate-900 dark:text-white">{children}</strong>,
              em: ({ children }) => <em className="italic text-slate-600 dark:text-slate-300">{children}</em>,
              h1: ({ children }) => <h1 className="text-base font-bold text-slate-900 dark:text-white mt-3 mb-1 first:mt-0">{children}</h1>,
              h2: ({ children }) => <h2 className="text-sm font-bold text-slate-900 dark:text-white mt-3 mb-1 first:mt-0">{children}</h2>,
              h3: ({ children }) => <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-300 mt-2 mb-1 first:mt-0">{children}</h3>,
              ul: ({ children }) => <ul className="mb-2 space-y-0.5 pl-1">{children}</ul>,
              li: ({ children }) => (
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                  <span>{children}</span>
                </li>
              ),
              ol: ({ children }) => <ol className="mb-2 space-y-0.5 pl-1 list-decimal list-inside">{children}</ol>,
              code: ({ children, className }) => {
                const isBlock = className?.includes("language-");
                if (isBlock) {
                  return (
                    <code className="block w-full overflow-x-auto rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 my-2 font-mono text-xs text-slate-800 whitespace-pre dark:border-slate-600 dark:bg-slate-900 dark:text-emerald-300">
                      {children}
                    </code>
                  );
                }
                return (
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-800 dark:bg-slate-700 dark:text-emerald-300">
                    {children}
                  </code>
                );
              },
              pre: ({ children }) => (
                <pre className="my-2 overflow-x-auto rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 font-mono text-xs text-slate-800 whitespace-pre dark:border-slate-600 dark:bg-slate-900 dark:text-emerald-300">
                  {children}
                </pre>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-blue-500 pl-3 my-2 text-slate-500 italic text-xs dark:text-slate-400">
                  {children}
                </blockquote>
              ),
              hr: () => <hr className="my-2 border-slate-200 dark:border-slate-700" />,
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline underline-offset-2 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200"
                >
                  {children}
                </a>
              ),
              table: ({ children }) => (
                <div className="my-2 overflow-x-auto">
                  <table className="w-full text-xs border-collapse">{children}</table>
                </div>
              ),
              th: ({ children }) => (
                <th className="border border-slate-300 bg-slate-100 px-2 py-1 text-left font-semibold text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white">{children}</th>
              ),
              td: ({ children }) => (
                <td className="border border-slate-300 px-2 py-1 text-slate-700 dark:border-slate-600 dark:text-slate-300">{children}</td>
              ),
            }}
          >
            {msg.content}
          </ReactMarkdown>
        </div>
        <CopyButton text={msg.content} />
      </div>
    </div>
  );
}

interface AIAssistantPanelProps {
  autoSendQuery?: string;
  autoSendNonce?: number;
  onLoadingChange?: (isLoading: boolean) => void;
  onAssistantReply?: () => void;
}

export default function AIAssistantPanel({
  autoSendQuery,
  autoSendNonce,
  onLoadingChange,
  onAssistantReply,
}: AIAssistantPanelProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.sessionStorage.getItem(AI_HISTORY_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(
        (m): m is Message =>
          typeof m === "object" &&
          m !== null &&
          "role" in m &&
          "content" in m &&
          (((m as { role?: unknown }).role === "user") ||
            (m as { role?: unknown }).role === "assistant") &&
          typeof (m as { content?: unknown }).content === "string",
      );
    } catch {
      return [];
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sensitiveWarning, setSensitiveWarning] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const processedAutoSendNonceRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.sessionStorage.setItem(
        AI_HISTORY_STORAGE_KEY,
        JSON.stringify(messages),
      );
    } catch {
      // no-op if storage is unavailable
    }
  }, [messages]);

  useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const autoResize = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    const maxHeight = 120;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  }, []);

  function handleInputChange(value: string) {
    setInput(value);
    setError(null);
    setSensitiveWarning(looksLikeSensitive(value));
    setTimeout(autoResize, 0);
  }

  const sendMessage = useCallback(async (overrideText?: string) => {
    const trimmed = (overrideText ?? input).trim();
    if (!trimmed || isLoading) return;
    if (trimmed.length > MAX_MESSAGE_LENGTH) {
      setError(`Message too long (max ${MAX_MESSAGE_LENGTH} chars).`);
      return;
    }

    setInput("");
    setError(null);
    setSensitiveWarning(false);
    setTimeout(autoResize, 0);

    const userMessage: Message = { role: "user", content: trimmed };
    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
          history: updatedHistory.slice(-10).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) {
        const data: ApiError = await res.json().catch(() => ({ error: "Unknown error." }));
        throw new Error(data.error ?? `Server error ${res.status}`);
      }

      const data: { answer: string } = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
      onAssistantReply?.();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
      setMessages((prev) => prev.slice(0, -1));
      if (!overrideText) setInput(trimmed);
    } finally {
      setIsLoading(false);
    }
  }, [autoResize, input, isLoading, messages]);

  useEffect(() => {
    if (autoSendNonce === undefined || autoSendNonce === processedAutoSendNonceRef.current) {
      return;
    }
    processedAutoSendNonceRef.current = autoSendNonce;
    const query = autoSendQuery?.trim();
    if (!query) return;
    void sendMessage(query);
  }, [autoSendNonce, autoSendQuery, sendMessage]);

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    sendMessage();
  }

  function clearConversation() {
    setMessages([]);
    setError(null);
    setSensitiveWarning(false);
    if (typeof window !== "undefined") {
      try {
        window.sessionStorage.removeItem(AI_HISTORY_STORAGE_KEY);
      } catch {
        // no-op if storage is unavailable
      }
    }
    setTimeout(() => inputRef.current?.focus(), 80);
  }

  const showQuickQuestions = messages.length === 0 && !isLoading;

  return (
    <div className="flex h-full min-h-0 flex-col bg-slate-50 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-100 px-4 py-2 dark:border-slate-800 dark:bg-slate-950/50">
        <p className="text-[10px] text-slate-500 leading-tight dark:text-slate-400">
          Questions are processed by OpenAI. Never share seed phrases, private keys, or wallet addresses.
        </p>
        {messages.length > 0 && (
          <button
            onClick={clearConversation}
            aria-label="Clear conversation"
            title="Clear conversation"
            className="shrink-0 rounded-md px-2 py-1 text-[10px] text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            Clear
          </button>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50 px-4 py-3 scroll-smooth dark:bg-slate-950/40">
        {showQuickQuestions ? (
          <div className="flex flex-col gap-3">
            <p className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 pb-1">
              Get started with a question:
            </p>
            <div className="flex flex-wrap gap-2">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-left text-xs text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-blue-500/50 dark:hover:bg-slate-700 dark:hover:text-white"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)
        )}

        {isLoading && (
          <div className="flex justify-start mb-3">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F4B728] text-black text-[9px] font-bold shrink-0">Z</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">ZecHub AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {sensitiveWarning && (
        <div className="mx-3 mb-1 flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-1.5 dark:border-amber-700/50 dark:bg-amber-900/40">
          <p className="text-[10px] text-amber-700 leading-snug dark:text-amber-300">
            This looks like sensitive wallet data. Never share private keys or seed phrases with any service.
          </p>
        </div>
      )}

      {error && (
        <div className="mx-3 mb-1.5 rounded-lg border border-red-300 bg-red-50 px-2.5 py-1.5 text-xs text-red-700 dark:border-red-800/50 dark:bg-red-900/50 dark:text-red-300">
          {error}
        </div>
      )}

      <form
        onSubmit={handleFormSubmit}
        className="sticky bottom-0 z-10 border-t border-slate-200/80 bg-white/95 px-3 pb-2 pt-2 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-slate-700 dark:bg-slate-900/95 dark:supports-[backdrop-filter]:bg-slate-900/80"
      >
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-2 shadow-sm dark:border-slate-600 dark:bg-slate-800">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question... (Enter to send, Shift+Enter for new line)"
              rows={1}
              maxLength={MAX_MESSAGE_LENGTH}
              disabled={isLoading}
              className="flex-1 resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none disabled:opacity-50 leading-relaxed dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 dark:focus:border-blue-400"
              style={{ maxHeight: "120px", overflowY: "auto" }}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F4B728] text-black transition hover:brightness-95 disabled:opacity-40"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" />
              </svg>
            </button>
          </div>
          <div className="mt-1.5 flex items-center justify-between">
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Enter to send, Shift+Enter for a new line
            </p>
            <p className="text-[10px] tabular-nums text-slate-500 dark:text-slate-400">
              {input.length}/{MAX_MESSAGE_LENGTH}
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

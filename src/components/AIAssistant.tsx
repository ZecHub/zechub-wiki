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
      className="mt-1 flex items-center gap-1 text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
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
          <span className="text-[10px] text-zinc-400">ZecHub AI</span>
        </div>
        <div className="rounded-2xl rounded-tl-none bg-zinc-800 px-4 py-3 text-sm text-zinc-100 leading-relaxed break-words">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
              em: ({ children }) => <em className="italic text-zinc-300">{children}</em>,
              h1: ({ children }) => <h1 className="text-base font-bold text-white mt-3 mb-1 first:mt-0">{children}</h1>,
              h2: ({ children }) => <h2 className="text-sm font-bold text-white mt-3 mb-1 first:mt-0">{children}</h2>,
              h3: ({ children }) => <h3 className="text-sm font-semibold text-[#F4B728] mt-2 mb-1 first:mt-0">{children}</h3>,
              ul: ({ children }) => <ul className="mb-2 space-y-0.5 pl-1">{children}</ul>,
              li: ({ children }) => (
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F4B728]" />
                  <span>{children}</span>
                </li>
              ),
              ol: ({ children }) => <ol className="mb-2 space-y-0.5 pl-1 list-decimal list-inside">{children}</ol>,
              code: ({ children, className }) => {
                const isBlock = className?.includes("language-");
                if (isBlock) {
                  return (
                    <code className="block w-full overflow-x-auto rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 my-2 font-mono text-xs text-emerald-300 whitespace-pre">
                      {children}
                    </code>
                  );
                }
                return (
                  <code className="rounded bg-zinc-700 px-1.5 py-0.5 font-mono text-xs text-emerald-300">
                    {children}
                  </code>
                );
              },
              pre: ({ children }) => (
                <pre className="my-2 overflow-x-auto rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 font-mono text-xs text-emerald-300 whitespace-pre">
                  {children}
                </pre>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-[#F4B728] pl-3 my-2 text-zinc-400 italic text-xs">
                  {children}
                </blockquote>
              ),
              hr: () => <hr className="my-2 border-zinc-700" />,
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F4B728] underline underline-offset-2 hover:text-yellow-300"
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
                <th className="border border-zinc-700 bg-zinc-900 px-2 py-1 text-left font-semibold text-white">{children}</th>
              ),
              td: ({ children }) => (
                <td className="border border-zinc-700 px-2 py-1 text-zinc-300">{children}</td>
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

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sensitiveWarning, setSensitiveWarning] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  const autoResize = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, []);

  function handleInputChange(value: string) {
    setInput(value);
    setError(null);
    setSensitiveWarning(looksLikeSensitive(value));
    setTimeout(autoResize, 0);
  }

  async function sendMessage(overrideText?: string) {
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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
      setMessages((prev) => prev.slice(0, -1));
      if (!overrideText) setInput(trimmed);
    } finally {
      setIsLoading(false);
    }
  }

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
    setTimeout(() => inputRef.current?.focus(), 80);
  }

  const showQuickQuestions = messages.length === 0 && !isLoading;

  return (
    <>
      {/* Floating toggle */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Close AI assistant" : "Open ZecHub AI assistant"}
        title="ZecHub AI"
        className="fixed bottom-8 right-24 z-50 flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[#F4B728] text-black shadow-2xl ring-4 ring-[#F4B728]/30 dark:ring-amber-900/50 transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#F4B728]/60 cursor-pointer"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="ZecHub AI Assistant"
          className="fixed bottom-28 right-6 z-50 flex w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 shadow-2xl"
          style={{ height: "560px" }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-zinc-700 bg-zinc-900 px-4 py-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F4B728] text-black text-xs font-bold">Z</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">ZecHub AI</p>
              <p className="text-xs text-zinc-400">Ask anything about the docs</p>
            </div>
            {messages.length > 0 && (
              <button
                onClick={clearConversation}
                aria-label="Clear conversation"
                title="Clear conversation"
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear
              </button>
            )}
          </div>

          {/* Privacy notice */}
          <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-950 px-4 py-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 shrink-0 text-zinc-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <p className="text-[10px] text-zinc-500 leading-tight">
              Questions are processed by OpenAI. Never share seed phrases, private keys, or wallet addresses.
            </p>
          </div>

          {/* Message list */}
          <div className="flex-1 overflow-y-auto px-4 py-3 scroll-smooth">
            {showQuickQuestions ? (
              <div className="flex flex-col gap-3">
                <p className="text-center text-xs text-zinc-500 pt-2 pb-1">
                  Get started with a question:
                </p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="rounded-full border border-zinc-600 bg-zinc-800 px-3 py-1.5 text-left text-xs text-zinc-300 transition-colors hover:border-[#F4B728] hover:bg-zinc-700 hover:text-white"
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
                    <span className="text-[10px] text-zinc-400">ZecHub AI is thinking…</span>
                  </div>
                  <div className="rounded-2xl rounded-tl-none bg-zinc-800 px-4 py-3">
                    <span className="flex gap-1.5">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:0ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:150ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:300ms]" />
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Sensitive data warning */}
          {sensitiveWarning && (
            <div className="mx-4 mb-1 flex items-start gap-2 rounded-lg bg-amber-900/40 border border-amber-700/50 px-3 py-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-[10px] text-amber-300 leading-snug">
                This looks like sensitive wallet data. Never share private keys or seed phrases with any service.
              </p>
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div className="mx-4 mb-2 rounded-lg bg-red-900/50 border border-red-800/50 px-3 py-2 text-xs text-red-300">
              {error}
            </div>
          )}

          {/* Input bar */}
          <form onSubmit={handleFormSubmit} className="border-t border-zinc-700 bg-zinc-900 px-3 py-3">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question… (Enter to send, Shift+Enter for new line)"
                rows={1}
                maxLength={MAX_MESSAGE_LENGTH}
                disabled={isLoading}
                className="flex-1 resize-none rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-[#F4B728] focus:outline-none disabled:opacity-50 leading-relaxed"
                style={{ maxHeight: "120px", overflowY: "auto" }}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                aria-label="Send message"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F4B728] text-black transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" />
                </svg>
              </button>
            </div>
            <p className="mt-1.5 text-right text-[10px] text-zinc-600">
              {input.length}/{MAX_MESSAGE_LENGTH}
            </p>
          </form>
        </div>
      )}
    </>
  );
}

"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { X } from "lucide-react";
import { useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface FilterInfoDialogProps {
  title: string;
  markdown: string;
  onClose: () => void;
  closeLabel?: string;
}

const FilterInfoDialog: React.FC<FilterInfoDialogProps> = ({
  title,
  markdown,
  onClose,
  closeLabel = "Close",
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <Dialog
      open
      onClose={onClose}
      initialFocus={closeButtonRef}
      className="fixed inset-0 z-[400] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    >
      <DialogPanel className="max-h-[85dvh] w-full max-w-md overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <DialogTitle className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
            {title}
          </DialogTitle>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="-mr-1 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              strong: ({ children }) => (
                <strong className="font-semibold text-slate-900 dark:text-white">
                  {children}
                </strong>
              ),
              em: ({ children }) => <em className="italic">{children}</em>,
              h3: ({ children }) => (
                <h3 className="mb-1 mt-3 text-sm font-semibold text-slate-900 first:mt-0 dark:text-white">
                  {children}
                </h3>
              ),
              h4: ({ children }) => (
                <h4 className="mb-1 mt-3 text-sm font-semibold text-slate-900 first:mt-0 dark:text-white">
                  {children}
                </h4>
              ),
              ul: ({ children }) => (
                <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">
                  {children}
                </ol>
              ),
              li: ({ children }) => <li>{children}</li>,
              a: ({ href, children }) => (
                <a
                  href={href}
                  target={href?.startsWith("http") ? "_blank" : undefined}
                  rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="text-brand underline underline-offset-2 hover:text-brand-hover dark:text-brand-soft"
                >
                  {children}
                </a>
              ),
              code: ({ children, className }) => {
                const isBlock = className?.includes("language-");
                if (isBlock) {
                  return (
                    <code className="my-2 block w-full overflow-x-auto rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 font-mono text-xs whitespace-pre text-slate-800 dark:border-slate-600 dark:bg-slate-950 dark:text-emerald-300">
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
              pre: ({ children }) => <pre className="m-0">{children}</pre>,
              blockquote: ({ children }) => (
                <blockquote className="my-2 border-l-2 border-brand pl-3 italic text-slate-500 dark:text-slate-400">
                  {children}
                </blockquote>
              ),
              hr: () => (
                <hr className="my-3 border-slate-200 dark:border-slate-700" />
              ),
              table: ({ children }) => (
                <div className="my-2 overflow-x-auto">
                  <table className="w-full border-collapse text-xs">
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th className="border border-slate-300 bg-slate-100 px-2 py-1 text-left font-semibold text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border border-slate-300 px-2 py-1 text-slate-700 dark:border-slate-600 dark:text-slate-300">
                  {children}
                </td>
              ),
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      </DialogPanel>
    </Dialog>
  );
};

export default FilterInfoDialog;

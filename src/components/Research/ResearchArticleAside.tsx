"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaDiscord, FaLinkedin, FaReddit, FaTelegram } from "react-icons/fa";

type Props = {
  title: string;
  /** Full canonical URL for share intents (provided by the server). */
  shareUrl: string;
};

export default function ResearchArticleAside({ title, shareUrl }: Props) {
  const [discordCopied, setDiscordCopied] = useState(false);
  const copyResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyResetRef.current) clearTimeout(copyResetRef.current);
    };
  }, []);

  const copyLinkForDiscord = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setDiscordCopied(true);
      if (copyResetRef.current) clearTimeout(copyResetRef.current);
      copyResetRef.current = setTimeout(() => setDiscordCopied(false), 2500);
    } catch {
      /* clipboard may be denied in insecure contexts */
    }
  }, [shareUrl]);

  const shareLinks = useMemo(() => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title);
    return {
      x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      reddit: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    };
  }, [title, shareUrl]);

  return (
    <aside className="w-full shrink-0 space-y-10 border-t border-slate-200 pt-8 dark:border-slate-400 xl:w-[min(100%,280px)] xl:border-t-0 xl:border-l xl:border-slate-200 xl:pl-8 xl:pt-0 dark:xl:border-slate-400">
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Share post
        </p>
        <div className="flex flex-wrap items-center gap-3 text-foreground">
          <a
            href={shareLinks.x}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer rounded-md p-2 transition-colors hover:bg-muted"
            aria-label="Share on X"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a
            href={shareLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer rounded-md p-2 transition-colors hover:bg-muted"
            aria-label="Share on LinkedIn"
          >
            <FaLinkedin className="h-5 w-5" />
          </a>
          <a
            href={shareLinks.reddit}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer rounded-md p-2 transition-colors hover:bg-muted"
            aria-label="Share on Reddit"
          >
            <FaReddit className="h-5 w-5" />
          </a>
          <a
            href={shareLinks.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer rounded-md p-2 transition-colors hover:bg-muted"
            aria-label="Share on Telegram"
          >
            <FaTelegram className="h-5 w-5" />
          </a>
          <button
            type="button"
            onClick={copyLinkForDiscord}
            className="inline-flex cursor-pointer items-center rounded-md p-2 text-foreground transition-colors hover:bg-muted"
            title="Copy page link to paste in Discord"
            aria-label="Copy page link for Discord"
          >
            <FaDiscord className="h-5 w-5 shrink-0" aria-hidden />
          </button>
        </div>
        {discordCopied ? (
          <p className="mt-2 text-xs font-medium text-muted-foreground" role="status">
            Link copied to clipboard!
          </p>
        ) : null}
        <p className="sr-only" aria-live="polite">
          {discordCopied ? "Link copied to clipboard." : ""}
        </p>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Written by
        </p>
        <p className="text-sm font-medium text-foreground">ZecHub</p>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Tags
        </p>
        <span className="inline-block rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
          Research
        </span>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          More on the wiki
        </p>
        <Link
          href="/explore"
          className="btn-brand inline-flex w-full items-center justify-center rounded-lg text-center text-sm font-medium"
        >
          Explore topics
        </Link>
      </div>
    </aside>
  );
}

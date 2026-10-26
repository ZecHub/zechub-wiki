import { ArrowUpRight, Globe, MessageSquareText } from "lucide-react";
import { SiDiscord, SiElement } from "react-icons/si";
import { socialIcons } from "@/components/UI/SvgIcons";

const ICONS: Record<string, React.ReactNode> = {
  telegram: socialIcons.telegram,
  x: socialIcons.x,
  mastodon: socialIcons.mastodon,
  discord: <SiDiscord aria-hidden="true" className="h-6 w-6" />,
  matrix: <SiElement aria-hidden="true" className="h-6 w-6" />,
  forum: <MessageSquareText aria-hidden="true" className="h-6 w-6" />,
  globe: <Globe aria-hidden="true" className="h-6 w-6" />,
};

const TILE =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand/30 bg-brand/10 text-brand dark:text-brand-soft";

// Two-column grid that holds the community cards.
export function CommunityGrid({ children }: { children?: React.ReactNode }) {
  return <div className="not-prose my-6 grid gap-4 sm:grid-cols-2">{children}</div>;
}

// One platform (Telegram, Discord, ...): icon tile + title, with the original content below.
export function CommunityGroup(props: Record<string, unknown> & { children?: React.ReactNode }) {
  const wide = String(props.wide ?? "") === "true";
  return (
    <div
      className={`flex h-full min-w-0 flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50/60 p-5 dark:border-white/10 dark:bg-white/[0.03] ${
        wide ? "sm:col-span-2" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={TILE}>{ICONS[String(props.icon ?? "globe")] ?? ICONS.globe}</span>
        <h3 className="m-0 text-lg font-semibold text-slate-900 dark:text-white">{String(props.title ?? "")}</h3>
      </div>
      <div className="min-w-0 text-[0.95rem] leading-6 text-slate-700 dark:text-slate-300 [&>div]:my-0 [&>p]:m-0 [&>ul]:my-0 [&>ul]:space-y-1.5">
        {props.children}
      </div>
    </div>
  );
}

// A single community / hub entry as a link card.
export function CommunityCard(props: Record<string, unknown>) {
  const href = String(props.href ?? "");
  const body = (
    <>
      <span className={TILE}>{ICONS.globe}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-semibold leading-tight text-slate-900 dark:text-white">
          {String(props.name ?? "")}
        </span>
        {props.desc ? (
          <span className="mt-0.5 block text-sm text-slate-600 dark:text-slate-400">{String(props.desc)}</span>
        ) : null}
      </span>
      {href && <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0 text-brand dark:text-brand-soft" />}
    </>
  );
  const cls =
    "group flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 no-underline transition-colors dark:border-white/10 dark:bg-white/[0.03]";
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${cls} hover:border-brand/40 dark:hover:border-brand/40`}>
      {body}
    </a>
  ) : (
    <div className={cls}>{body}</div>
  );
}

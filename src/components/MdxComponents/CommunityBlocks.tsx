import { ArrowUpRight, CalendarDays, Code, Coins, Cpu, FileText, Globe, HandCoins, Languages, Megaphone, MessageSquareText, Presentation, Scale, ShieldAlert, ShieldCheck, UserPlus, Users, Video, Vote } from "lucide-react";
import { SiDiscord, SiElement } from "react-icons/si";
import { socialIcons } from "@/components/UI/SvgIcons";
import { Link } from "@/i18n/navigation";

const ICONS: Record<string, React.ReactNode> = {
  telegram: socialIcons.telegram,
  x: socialIcons.x,
  mastodon: socialIcons.mastodon,
  discord: <SiDiscord aria-hidden="true" className="h-6 w-6" />,
  matrix: <SiElement aria-hidden="true" className="h-6 w-6" />,
  forum: <MessageSquareText aria-hidden="true" className="h-6 w-6" />,
  globe: <Globe aria-hidden="true" className="h-6 w-6" />,
  file: <FileText aria-hidden="true" className="h-6 w-6" />,
  code: <Code aria-hidden="true" className="h-6 w-6" />,
  video: <Video aria-hidden="true" className="h-6 w-6" />,
  scale: <Scale aria-hidden="true" className="h-6 w-6" />,
  coins: <Coins aria-hidden="true" className="h-6 w-6" />,
  cpu: <Cpu aria-hidden="true" className="h-6 w-6" />,
  vote: <Vote aria-hidden="true" className="h-6 w-6" />,
  grants: <HandCoins aria-hidden="true" className="h-6 w-6" />,
  shield: <ShieldCheck aria-hidden="true" className="h-6 w-6" />,
  users: <Users aria-hidden="true" className="h-6 w-6" />,
  alert: <ShieldAlert aria-hidden="true" className="h-6 w-6" />,
  calendar: <CalendarDays aria-hidden="true" className="h-6 w-6" />,
  megaphone: <Megaphone aria-hidden="true" className="h-6 w-6" />,
  languages: <Languages aria-hidden="true" className="h-6 w-6" />,
  userplus: <UserPlus aria-hidden="true" className="h-6 w-6" />,
  presentation: <Presentation aria-hidden="true" className="h-6 w-6" />,
};

const TILE =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand/30 bg-brand/10 text-brand dark:text-brand-soft";

// Two-column grid that holds the community cards.
export function CommunityGrid(props: Record<string, unknown> & { children?: React.ReactNode }) {
  const cols = String(props.cols ?? "2") === "3" ? "imd:grid-cols-2 lg:grid-cols-3" : "imd:grid-cols-2";
  return <div className={`not-prose clear-both my-6 grid gap-4 ${cols}`}>{props.children}</div>;
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
      <span className={TILE}>{ICONS[String(props.icon ?? "globe")] ?? ICONS.globe}</span>
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
  return href && href.startsWith("/") ? (
    <Link href={href} className={`${cls} hover:border-brand/40 dark:hover:border-brand/40`}>
      {body}
    </Link>
  ) : href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${cls} hover:border-brand/40 dark:hover:border-brand/40`}>
      {body}
    </a>
  ) : (
    <div className={cls}>{body}</div>
  );
}

// Row of key figures (e.g. NFT supply split).
// `compact` keeps the cards side by side on phones; use it only when each card is just a number and a label.
export function StatGrid({ children, ...props }: Record<string, unknown> & { children?: React.ReactNode }) {
  const compact = String(props.compact ?? "") === "true";
  return (
    <div
      className={
        compact
          ? "not-prose my-6 grid grid-cols-3 gap-2 imd:gap-4 [&>div]:gap-1 [&>div]:p-3 imd:[&>div]:p-5 [&>div>span:first-child]:text-2xl imd:[&>div>span:first-child]:text-3xl [&>div>p:empty]:hidden"
          : "not-prose my-6 grid gap-4 imd:grid-cols-3"
      }
    >
      {children}
    </div>
  );
}

export function StatCard(props: Record<string, unknown>) {
  return (
    <div className="flex h-full flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50/60 p-5 dark:border-white/10 dark:bg-white/[0.03]">
      <span className="text-3xl font-semibold tracking-tight text-brand dark:text-brand-soft">
        {String(props.value ?? "")}
      </span>
      {props.label ? (
        <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
          {String(props.label)}
        </span>
      ) : null}
      <p className="m-0 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{String(props.text ?? "")}</p>
    </div>
  );
}

// One organization: name, its bullet list (children) and profile / website buttons.
export function OrgCard(props: Record<string, unknown> & { children?: React.ReactNode }) {
  let links: { label: string; href: string }[] = [];
  try {
    links = JSON.parse(String(props.links ?? "[]"));
  } catch {
    links = [];
  }
  return (
    <div className="flex h-full min-w-0 flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50/60 p-5 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="flex items-center gap-3">
        {props.logo ? (
          <span className="flex h-14 w-14 shrink-0 items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={String(props.logo)}
              alt=""
              width={56}
              height={56}
              loading="lazy"
              className={`m-0 h-14 w-14 object-contain ${props.logoDark ? "dark:hidden" : ""}`}
            />
            {props.logoDark ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={String(props.logoDark)} alt="" width={56} height={56} loading="lazy" className="m-0 hidden h-14 w-14 object-contain dark:block" />
            ) : null}
          </span>
        ) : (
          <span className={TILE}>{ICONS.globe}</span>
        )}
        <h3 className="m-0 text-lg font-semibold leading-tight text-slate-900 dark:text-white">{String(props.name ?? "")}</h3>
      </div>
      <div className="min-w-0 flex-1 text-[0.95rem] leading-6 text-slate-700 dark:text-slate-300 [&>ul]:my-0 [&>ul]:space-y-2">
        {props.children}
      </div>
      {links.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-slate-200 pt-4 dark:border-white/10">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-brand/50 px-3 py-1.5 text-sm font-semibold text-brand no-underline transition-colors hover:border-brand hover:bg-brand/10 dark:text-brand-soft dark:hover:text-white"
            >
              {l.label}
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// A person: initials in a round tile + name.
export function MemberCard(props: Record<string, unknown>) {
  const name = String(props.name ?? "");
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 dark:border-white/10 dark:bg-white/[0.03]">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand/30 bg-brand/10 text-sm font-semibold text-brand dark:text-brand-soft">
        {initials}
      </span>
      <span className="min-w-0 text-base font-semibold leading-tight text-slate-900 dark:text-white">{name}</span>
    </div>
  );
}

// Vertical list of dated entries (year / period on the left, content with its links on the right).
export function TimelineList({ children }: { children?: React.ReactNode }) {
  return <div className="not-prose my-6 space-y-3">{children}</div>;
}

export function TimelineItem(props: Record<string, unknown> & { children?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-white/10 dark:bg-white/[0.03] sm:flex-row sm:gap-5">
      <span className="shrink-0 text-base font-semibold tracking-tight text-brand dark:text-brand-soft sm:w-32">
        {String(props.year ?? "")}
      </span>
      <div className="min-w-0 text-[0.95rem] leading-6 text-slate-700 dark:text-slate-300 [&>p]:m-0">{props.children}</div>
    </div>
  );
}

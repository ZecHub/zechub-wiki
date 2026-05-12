'use client';

import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Calculator,
  Code2,
  ExternalLink,
  FolderOpen,
  Gamepad2,
  Github,
  HelpCircle,
  KeyRound,
  Layers,
  LogIn,
  Puzzle,
  Server,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { HackathonGithubProject } from "@/lib/fetchHackathonGithubProjects";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/UI/shadcn/card";

const HACKATHON_START_DATE_UTC = "2026-05-25T00:00:00Z";
const HACKATHON_END_DATE_UTC = "2026-07-15T23:59:59Z";

const PREVIOUS_PROJECTS_REPO =
  "https://github.com/ZecHub/zechub/tree/main/Hackathon";

type HackathonProps = {
  githubProjects?: HackathonGithubProject[];
  githubProjectsError?: string;
};

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
};

type HackathonPhase = "pre" | "active" | "post";

const getCountdown = (targetDate: Date): Countdown => {
  const now = new Date().getTime();
  const distance = targetDate.getTime() - now;

  if (distance <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, completed: true };
  }

  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((distance / (1000 * 60)) % 60),
    seconds: Math.floor((distance / 1000) % 60),
    completed: false,
  };
};

const getPhase = (now: number, start: Date, end: Date): HackathonPhase => {
  if (now < start.getTime()) return "pre";
  if (now < end.getTime()) return "active";
  return "post";
};

const devToolsDocs = [
  {
    title: "Zcash Core Documentation",
    description:
      "Understand core concepts, node operations, and configuration details.",
    href: "https://zcash.readthedocs.io/en/latest/",
    icon: BookOpen,
  },
  {
    title: "Zcash RPC Reference",
    description:
      "Explore RPC methods to query chain data and interact with zcashd.",
    href: "https://zcash.github.io/rpc/",
    icon: Code2,
  },
  {
    title: "Run a Node on Akash",
    description:
      "Step-by-step guide for deploying a Zcash node with Akash infrastructure.",
    href: "/guides/akash-network",
    icon: Server,
  },
  {
    title: "Build on Zcash",
    description:
      "Reference ideas and infrastructure notes for Zcash-powered applications.",
    href: "https://github.com/ZecHub/zechub/blob/main/site/contribute/Community_Infrastructure.md",
    icon: Layers,
  },
] as const;

const tracks = [
  {
    name: "Infrastructure",
    description:
      "Nodes, indexers, RPC tooling, and reliability for builders and operators.",
    icon: Server,
  },
  {
    name: "Games",
    description:
      "Interactive experiences and game loops where Zcash is part of the fun.",
    icon: Gamepad2,
  },
  {
    name: "FROST",
    description:
      "Threshold signing, custody patterns, and safer key management on Zcash.",
    icon: KeyRound,
  },
  {
    name: "Zcash Login",
    description:
      "Auth and identity flows that use Zcash primitives for sign-in or access.",
    icon: LogIn,
  },
  {
    name: "Accounting",
    description:
      "Reporting, reconciliation, and workflows for teams handling ZEC.",
    icon: Calculator,
  },
] as const;

const faqItems = [
  {
    question: "Who can participate?",
    answer:
      "Anyone building with Zcash can join: developers, designers, and multidisciplinary teams.",
  },
  {
    question: "What must a valid submission include?",
    answer:
      "A working prototype or demo, basic documentation, and an explanation of how it uses the Zcash network.",
  },
  {
    question: "Where do we submit projects?",
    answer:
      "Share your entry in the Zcash Global Discord and include any relevant repository or demo links.",
  },
  {
    question: "How are winners selected?",
    answer:
      "A public community process is run via ZecHub DAO channels after submissions close.",
  },
  {
    question: "What are the tracks?",
    answer:
      "This year’s themes are Infrastructure, Games, FROST, Zcash Login, and Accounting. Pick the track that best matches your build—you can still combine ideas across tracks.",
  },
];

const rules = [
  "Projects must interact with the Zcash network in a meaningful way.",
  "Teams can submit only one final project per team.",
  "All submissions must include clear setup and usage documentation.",
  "Use open-source licensing whenever possible to encourage collaboration.",
  "Respect privacy, security, and community guidelines in both code and content.",
];

function SectionTitle({
  children,
  eyebrow,
}: {
  children: React.ReactNode;
  eyebrow?: string;
}) {
  return (
    <div className="mb-6">
      {eyebrow ? (
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="border-l-4 border-sky-500 pl-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white md:text-3xl">
        {children}
      </h2>
    </div>
  );
}

const Hackathon = ({
  githubProjects = [],
  githubProjectsError,
}: HackathonProps) => {
  const startDate = useMemo(() => new Date(HACKATHON_START_DATE_UTC), []);
  const endDate = useMemo(() => new Date(HACKATHON_END_DATE_UTC), []);
  const [nowTs, setNowTs] = useState(() => Date.now());

  const projectsByGroup = useMemo(() => {
    const m = new Map<string, HackathonGithubProject[]>();
    for (const p of githubProjects) {
      const key = p.cohort ?? "__root__";
      const list = m.get(key) ?? [];
      list.push(p);
      m.set(key, list);
    }
    for (const list of m.values()) {
      list.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
      );
    }
    const keys = [...m.keys()].sort((a, b) => {
      if (a === "__root__") return -1;
      if (b === "__root__") return 1;
      if (/^\d{4}$/.test(a) && /^\d{4}$/.test(b)) {
        return parseInt(b, 10) - parseInt(a, 10);
      }
      return a.localeCompare(b);
    });
    return keys.map((k) => ({
      key: k,
      label: k === "__root__" ? "Hackathon 2025" : `Hackathon ${k}`,
      projects: m.get(k)!,
    }));
  }, [githubProjects]);

  useEffect(() => {
    const timer = setInterval(() => setNowTs(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const phase = useMemo(
    () => getPhase(nowTs, startDate, endDate),
    [nowTs, startDate, endDate]
  );

  const countdownTarget = phase === "pre" ? startDate : endDate;
  const countdown = useMemo(
    () => getCountdown(countdownTarget),
    [countdownTarget, nowTs]
  );

  return (
    <main className="relative mx-auto w-full max-w-6xl px-4 py-10 text-slate-900 dark:text-slate-100">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(14,165,233,0.22),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,211,238,0.12),transparent)]"
        aria-hidden
      />

      <section className="relative mb-12 overflow-hidden rounded-3xl border border-sky-500/25 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-8 text-white shadow-xl shadow-slate-900/20 ring-1 ring-white/10 md:p-12">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-emerald-500/15 blur-3xl"
          aria-hidden
        />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xl">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider ring-1 ring-white/15 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" aria-hidden />
              Build · Document · Submit
            </p>
            <h1 className="mb-4 text-4xl font-black tracking-tight md:text-5xl lg:text-6xl">
              ZecHub{" "}
              <span className="bg-gradient-to-r from-sky-300 via-cyan-200 to-emerald-300 bg-clip-text text-transparent">
                Hackathon
              </span>
            </h1>
            <p className="text-balance text-lg leading-relaxed text-slate-300 md:text-xl">
              Build across five tracks—from infra to games—then document and demo
              your work. Official kickoff{" "}
              <span className="font-semibold text-white">May 25, 2026</span>{" "}
              (UTC); submissions close{" "}
              <span className="font-semibold text-white">July 15, 2026</span>{" "}
              (UTC).
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/dao"
                className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/25"
              >
                ZecHub DAO <ArrowUpRight className="h-4 w-4 opacity-80" />
              </Link>
              <a
                href="https://discord.gg/zcash"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-transparent px-4 py-2.5 text-sm font-semibold transition hover:bg-white/10"
              >
                Discord <ExternalLink className="h-3.5 w-3.5 opacity-70" />
              </a>
            </div>
          </div>

          <div className="w-full min-w-[min(100%,280px)] max-w-md rounded-2xl border border-white/15 bg-black/25 p-5 backdrop-blur-md lg:max-w-sm">
            <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              {phase === "pre"
                ? "Hackathon starts in"
                : phase === "active"
                  ? "Time until submissions close"
                  : "Hackathon ended"}
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {(
                [
                  { label: "Days", value: countdown.days },
                  { label: "Hours", value: countdown.hours },
                  { label: "Mins", value: countdown.minutes },
                  { label: "Secs", value: countdown.seconds },
                ] as const
              ).map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-white/10 bg-white/5 px-2 py-4 text-center"
                >
                  <p className="font-mono text-2xl font-bold tabular-nums tracking-tight sm:text-3xl">
                    {item.value}
                  </p>
                  <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-slate-400">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
            {phase === "post" ? (
              <p className="mt-4 text-center text-sm font-medium text-emerald-300">
                This hackathon window has ended—thanks to everyone who took part.
              </p>
            ) : phase === "pre" ? (
              <p className="mt-4 text-center text-xs text-slate-400">
                Starts{" "}
                <span className="font-medium text-slate-300">May 25, 2026</span>{" "}
                (UTC). Submissions close{" "}
                <span className="font-medium text-slate-300">July 15, 2026</span>{" "}
                (UTC).
              </p>
            ) : (
              <p className="mt-4 text-center text-xs text-slate-400">
                Submissions close on{" "}
                <span className="font-medium text-slate-300">July 15, 2026</span>{" "}
                (UTC).
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mb-12">
        <SectionTitle eyebrow="2026 event">Tracks</SectionTitle>
        <p className="-mt-2 mb-6 max-w-2xl text-muted-foreground">
          Align your project with a track for clarity when you submit—judges and
          the community use them to browse entries.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tracks.map((track) => {
            const Icon = track.icon;
            return (
              <Card
                key={track.name}
                className="border-slate-200/80 bg-card transition-all hover:border-emerald-500/35 hover:shadow-md dark:border-slate-700/80"
              >
                <CardHeader className="pb-2">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-400">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <CardTitle className="text-lg">{track.name}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {track.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mb-12">
        <SectionTitle eyebrow="Start here">Devtools &amp; documentation</SectionTitle>
        <div className="grid gap-5 md:grid-cols-2">
          {devToolsDocs.map((tool) => {
            const Icon = tool.icon;
            const isInternal = tool.href.startsWith("/");
            return (
              <Card
                key={tool.title}
                className="group h-full overflow-hidden border-slate-200/80 bg-card transition-all hover:-translate-y-0.5 hover:border-sky-500/40 hover:shadow-lg dark:border-slate-700/80"
              >
                <CardHeader className="pb-2">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/15 text-sky-600 ring-1 ring-sky-500/25 dark:text-sky-400">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <CardTitle className="text-xl transition group-hover:text-sky-600 dark:group-hover:text-sky-400">
                    {tool.title}
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isInternal ? (
                    <Link
                      href={tool.href}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#1984c7] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1574af]"
                    >
                      Open guide <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <a
                      href={tool.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-[#1984c7] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1574af]"
                    >
                      Open docs <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mb-12 grid gap-6 lg:grid-cols-2">
        <Card className="border-slate-200/80 shadow-sm dark:border-slate-700/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-400">
                <Puzzle className="h-5 w-5" aria-hidden />
              </span>
              Rules
            </CardTitle>
            <CardDescription>Keep submissions fair and easy to judge.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-slate-700 dark:text-slate-300">
              {rules.map((rule, i) => (
                <li key={rule} className="flex gap-3 text-sm leading-relaxed">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-sky-700 dark:bg-slate-800 dark:text-sky-400">
                    {i + 1}
                  </span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 shadow-sm dark:border-slate-700/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/15 text-violet-700 dark:text-violet-400">
                <HelpCircle className="h-5 w-5" aria-hidden />
              </span>
              FAQ
            </CardTitle>
            <CardDescription>Quick answers before you dive in.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {faqItems.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-xl border border-slate-200 bg-slate-50/80 p-4 transition hover:border-sky-500/35 dark:border-slate-700 dark:bg-slate-900/40"
              >
                <summary className="cursor-pointer list-none font-medium text-slate-900 outline-none marker:content-none dark:text-white [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start justify-between gap-2">
                    {faq.question}
                    <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 opacity-40 transition group-open:rotate-45 group-open:opacity-70" />
                  </span>
                </summary>
                <p className="mt-3 border-t border-slate-200/80 pt-3 text-sm leading-relaxed text-slate-700 dark:border-slate-600 dark:text-slate-300">
                  {faq.answer}
                </p>
              </details>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="mb-12">
        <SectionTitle eyebrow="Past editions">Previous hackathon projects</SectionTitle>

        {githubProjectsError ? (
          <div
            className="mb-6 rounded-xl border border-amber-500/40 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-500/30 dark:bg-amber-950/30 dark:text-amber-100"
            role="alert"
          >
            <p className="font-medium">Could not load project list</p>
            <p className="mt-1 opacity-90">{githubProjectsError}</p>
            <p className="mt-2">
              <a
                href={PREVIOUS_PROJECTS_REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#1984c7] underline-offset-2 hover:underline"
              >
                Browse Hackathon on GitHub
              </a>
            </p>
          </div>
        ) : null}

        {!githubProjectsError && githubProjects.length === 0 ? (
          <p className="mb-6 text-sm text-muted-foreground">
            No project folders were returned. Open the repo tree to verify
            structure.
          </p>
        ) : null}

        {githubProjects.length > 0 ? (
          <div className="mb-8 space-y-10">
            {projectsByGroup.map((group) => (
              <div key={group.key}>
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  <FolderOpen className="h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400" aria-hidden />
                  {group.label}
                  <span className="font-mono text-xs font-normal normal-case tracking-normal text-muted-foreground">
                    ({group.projects.length})
                  </span>
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {group.projects.map((p) => (
                    <Card
                      key={p.slugPath}
                      className="group flex flex-col overflow-hidden border-slate-200/80 transition-all hover:-translate-y-0.5 hover:border-sky-500/35 hover:shadow-lg dark:border-slate-700/80"
                    >
                      <CardHeader className="pb-2">
                        <div className="mb-2 flex items-start justify-between gap-2">
                          <CardTitle className="text-lg leading-snug transition group-hover:text-sky-700 dark:group-hover:text-sky-400">
                            {p.name}
                          </CardTitle>
                          {p.cohort ? (
                            <span className="shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                              {p.cohort}
                            </span>
                          ) : null}
                        </div>
                        <CardDescription className="font-mono text-xs text-slate-500 dark:text-slate-400">
                          {p.slugPath}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="mt-auto pt-0">
                        <a
                          href={p.htmlUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-semibold text-[#1984c7] transition hover:gap-2.5 hover:underline"
                        >
                          <Github className="h-4 w-4" aria-hidden />
                          View on GitHub
                          <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                        </a>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <section className="relative overflow-hidden rounded-3xl border border-sky-500/20 bg-gradient-to-br from-slate-50 to-sky-50/80 p-8 dark:from-slate-900 dark:to-sky-950/40 md:p-10">
        <div
          className="pointer-events-none absolute right-0 top-0 h-40 w-40 translate-x-1/4 -translate-y-1/4 rounded-full bg-sky-400/15 blur-2xl dark:bg-sky-500/10"
          aria-hidden
        />
        <div className="relative">
          <h2 className="mb-2 text-2xl font-bold md:text-3xl">Need help?</h2>
          <p className="mb-6 max-w-xl text-slate-600 dark:text-slate-400">
            The Zcash Global Discord is the best place for build questions,
            infra tips, and hackathon chatter.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://discord.gg/zcash"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#1984c7] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-sky-900/20 transition hover:bg-[#1574af]"
            >
              Join Discord <ExternalLink className="h-4 w-4" />
            </a>
            <Link
              href="/donation"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-sky-500/50 hover:bg-sky-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Support with a donation <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Hackathon;

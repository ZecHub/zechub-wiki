"use client";

import { Link } from "@/i18n/navigation";
import {
  ArrowUpRight,
  BookOpen,
  Calculator,
  ExternalLink,
  FolderOpen,
  Gamepad2,
  Github,
  PlayCircle,
  UserRound,
  HelpCircle,
  KeyRound,
  LogIn,
  Puzzle,
  Server,
  Sparkles,
  Trophy,
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
const HACKATHON_END_DATE_UTC = "2026-07-15T12:00:00Z";
const VOTING_END_DATE_UTC = "2026-07-20T12:00:00Z";

const HACKATHON_BACKGROUND_IMAGE = "/hackathon-background.png";

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

type HackathonPhase = "pre" | "active" | "voting" | "post";

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

const getPhase = (
  now: number,
  start: Date,
  submissionEnd: Date,
  votingEnd: Date,
): HackathonPhase => {
  if (now < start.getTime()) return "pre";
  if (now < submissionEnd.getTime()) return "active";
  if (now < votingEnd.getTime()) return "voting";
  return "post";
};

const devToolsDocs = [
  {
    title: "ZecHub Developer Quick Start",
    description:
      "Find the essential tools, references, and setup steps for building on Zcash.",
    href: "https://zechub.wiki/developers/quick-start",
    icon: BookOpen,
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

type Submission = {
  title: string;
  creator: string;
  track: string;
  description: string;
  videoEmbedUrl?: string;
  videoUrl?: string;
  videoType?: "video/mp4" | "video/quicktime";
  demoUrl?: string;
  repoUrl?: string;
  prUrl?: string;
  articleUrl?: string;
  docsUrl?: string;
  credentials?: string;
};

const submissions: Submission[] = [
  {
    title: "ZShield",
    creator: "EdCryptoFi",
    track: "Zcash Login",
    description:
      "ZShield turns any Zcash address into a W3C DID and OIDC identity. Users sign a wallet challenge instead of relying on passwords, email addresses, or KYC. It supports ZIP 304 challenge-response authentication, W3C DID v1.1 identities, zero-knowledge claims, and an OIDC bridge for OAuth2-compatible applications.",
    videoEmbedUrl: "https://www.youtube.com/embed/xqK69d5gwSA",
    demoUrl: "https://zshield.vercel.app/",
    repoUrl: "https://github.com/EdCryptoFi/zshield",
  },
  {
    title: "ZPayroll",
    creator: "Monsignore",
    track: "Accounting",
    description:
      "ZPayroll is a private payroll application for distributing salaries with Zcash. It executes payroll runs as Orchard shielded transactions, supports Unified Addresses, connects to testnet through lightwalletd and zingo-cli, and derives employer wallets deterministically using browser-generated cryptographic keys and ZIP-32-compatible derivation.",
    videoEmbedUrl: "https://www.youtube.com/embed/ss6DDuaUMkg",
    demoUrl: "https://zpayroll.vercel.app/",
    repoUrl: "https://github.com/MageDee/ZPayroll/",
  },
  {
    title: "ZecPass",
    creator: "devacunetixtech",
    track: "Zcash Login",
    description:
      "ZecPass is a drop-in SDK for adding Sign in with Zcash without exposing user addresses. It uses zingolib to decrypt on-chain mainnet memos in real time and includes setup instructions and a quick start in its README.",
    videoEmbedUrl: "https://www.youtube.com/embed/M-rnk3Q9YuA",
    demoUrl: "https://zec-pass-web.vercel.app/",
    repoUrl: "https://github.com/devacunetixtech/zechub/tree/zecpass-hack26/zecpass-hack26",
  },
  {
    title: "ZecLedger",
    creator: "vancube2",
    track: "Accounting",
    description:
      "ZecLedger is a read-only command-line accounting tool for shielded Zcash funds. It works from a viewing key rather than a spending key and produces cost-basis reports, payment reconciliation, ZIP-321 requests, and privacy checks without being able to move funds. It has been verified on mainnet.",
    videoEmbedUrl: "https://www.youtube.com/embed/7emZKHAH7TQ",
    demoUrl: "https://zecledger-web.vercel.app/",
    repoUrl: "https://github.com/vancube2/zecledger",
  },
  {
    title: "ZecAuth",
    creator: "Raydar",
    track: "Zcash Login",
    description:
      "ZecAuth is a privacy-preserving wallet connection protocol for Zcash. It derives isolated authentication keys through ZIP-32, creates unlinkable per-app identities, signs human-readable challenges with RedPallas, supports capability-based grants, and sends responses directly between wallet and app without a relay.",
    videoUrl:
      "https://free2z.cash/uploadz/public/ZecHub/zecauth-demo.mp4",
    videoType: "video/mp4",
    repoUrl: "https://github.com/ZecHub/zechub/tree/main/Hackathon/2026/ZecAuth",
  },
  {
    title: "Zcash Node Launcher",
    creator: "zcashjava",
    track: "Infrastructure",
    description:
      "Zcash Node Launcher is a management tool for deploying, operating, and monitoring Zcash nodes. It provides automated installation and removal, node lifecycle management, and a real-time geospatial monitoring dashboard.",
    videoEmbedUrl: "https://www.youtube.com/embed/1tkV1Qd-UdU",
    demoUrl: "https://demo-zcashnodelauncher.zcashjava.com/",
    repoUrl: "https://github.com/zcashjava/ZcashNodeLauncher",
    docsUrl: "https://github.com/zcashjava/ZcashNodeLauncher/blob/main/README.md",
    credentials: "Demo login: zcashjava / zcashjava",
  },
  {
    title: "Z3 Launcher",
    creator: "Jubrilabdulazeez",
    track: "Infrastructure",
    description:
      "Z3 Launcher is a single Go binary that supervises the official Z3 stack through Docker Compose. It manages Zebra, Zaino, and optionally Zallet, adds preflight checks and port conflict handling, supports snapshots for faster startup, and keeps services bound to localhost with no telemetry or key custody.",
    videoEmbedUrl: "https://www.youtube.com/embed/ttgSmMy-mPg",
    repoUrl: "https://github.com/Jubrilabdulazeez/z3-launcher",
  },
  {
    title: "ZEC-OS",
    creator: "orb",
    track: "Infrastructure",
    description:
      "ZEC-OS is a privacy-oriented operating system emulator for exploring the Zcash ecosystem. Its windowed interface combines a block explorer, mempool information, block comparisons, miner distribution, historical charts, calculators, games, and a terminal, with customizable themes and accessibility controls.",
    videoUrl:
      "https://free2z.cash/uploadz/public/ZecHub/zec-os_hackathon2026_explorer.mp4",
    videoType: "video/mp4",
    demoUrl: "https://zec-os.com/",
    repoUrl: "https://github.com/orbism/zec-os_hackathon2026",
  },
  {
    title: "ZEC Ledger (Transparent)",
    creator: "mrwealthking",
    track: "Accounting",
    description:
      "ZEC Ledger is a lightweight accounting tool for Zcash transparent addresses. It uses real mainnet data to provide transaction history, a running balance, and CSV export.",
    videoEmbedUrl: "https://www.youtube.com/embed/BzU474BuJ9U",
    repoUrl: "https://github.com/mrwealthking/zec-ledger",
  },
  {
    title: "Pedalshield",
    creator: "intelligrip",
    track: "Games",
    description:
      "Pedalshield rewards real bicycle rides with shielded ZEC while keeping route data entirely on the rider's phone. Its mainnet flow combines on-device anti-cheat checks with autonomous Orchard payouts, creating a new shielded transaction for every paid ride.",
    videoEmbedUrl: "https://www.youtube.com/embed/yNrw9CI24zc",
    repoUrl: "https://github.com/intelligrip/Pedalshield",
  },
  {
    title: "Zaygent",
    creator: "Joshua Onazi",
    track: "Infrastructure",
    description:
      "Zaygent is a privacy-first autonomous crypto trading agent that funds, trades, and settles through Zcash shielded transactions modeled on Zashi CrossPay, with NEAR Intents used for cross-chain settlement. It reads live Zcash mainnet chain data and generates validly encoded transparent mainnet addresses.",
    videoEmbedUrl: "https://www.youtube.com/embed/uwX-ZH7SrY8",
    repoUrl: "https://github.com/ZecHub/zechub/tree/main/Hackathon/2026/zaygent",
  },
  {
    title: "ZecAgent",
    creator: "aliiqbal24",
    track: "Infrastructure",
    description:
      "ZecAgent is a local MCP wallet and agent payment approval layer funded by shielded ZEC. It lets agents prepare verified purchases, direct shielded ZEC transfers, and managed CrossPay routes while enforcing local policy, dashboard approval, spend limits, receipt tracking, and confirmation checks.",
    repoUrl: "https://github.com/aliiqbal24/ZecAgent",
    docsUrl: "https://github.com/aliiqbal24/ZecAgent/blob/main/QUICKSTART.md",
  },  {
    title: "Steward",
    creator: "Hamid-Alan",
    track: "FROST",
    description:
      "Steward is a threshold-custody protocol for shielded Zcash. It splits an Orchard vault's spend authority into t-of-n FROST shares for group custody, social recovery, and inheritance. Guardians co-sign a real transaction sighash on their own devices, while the relay coordinating the signing process holds no keys or shares. Steward has completed a real 2-of-3 threshold-signed shielded transaction on mainnet.",
    videoEmbedUrl: "https://www.youtube.com/embed/JpDBunva2Ek",
    repoUrl: "https://github.com/ZecHub/zechub/tree/main/Hackathon/2026/Steward",
  },
  {
    title: "ZBooks",
    creator: "Austin Chris",
    track: "Accounting",
    description:
      "ZBooks is a non-custodial accounting and structured batch-payout platform for Zcash teams and DAOs. Built on the Sign in with Zcash (SIWZ) authentication primitive, it supports memo-challenge, signed-message, and experimental MetaMask Snap sign-in flows. Teams can create a single multi-recipient ZIP-321 payout request, require M-of-N treasury approval, automatically reconcile payments through a treasury UFVK, and generate tagged monthly profit-and-loss reports and CSV exports. ZBooks runs on Zcash mainnet and extends the workflow from bounty creation through approval, shielded batch payment, and reconciliation.",
    videoEmbedUrl: "https://www.youtube.com/embed/An8s-ca0ZxQ",
    demoUrl: "https://zecbooks.vercel.app/",
    repoUrl: "https://github.com/AustinChris1/ZBooks-SIWZ",
  },
];

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
      "This year’s themes are Infrastructure, Games, FROST, Zcash Login, and Accounting. Pick the track that best matches your build, you can still combine ideas across tracks.",
  },
];

const rules = [
  "Projects must interact with the Zcash network in a meaningful way.",
  "Teams can submit only one final project per team.",
  "All submissions must include clear setup and usage documentation.",
  "Use open-source licensing whenever possible to encourage collaboration.",
  "Respect privacy, security, and community guidelines in both code and content.",
];

function SubmissionLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon?: "demo" | "github";
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-sky-500/50 hover:bg-sky-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
    >
      {icon === "demo" ? <PlayCircle className="h-4 w-4" aria-hidden /> : null}
      {icon === "github" ? <Github className="h-4 w-4" aria-hidden /> : null}
      {label}
      <ExternalLink className="h-3.5 w-3.5 opacity-70" />
    </a>
  );
}

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
  const votingEndDate = useMemo(() => new Date(VOTING_END_DATE_UTC), []);
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
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
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
    () => getPhase(nowTs, startDate, endDate, votingEndDate),
    [nowTs, startDate, endDate, votingEndDate],
  );

  const countdownTarget =
    phase === "pre" ? startDate : phase === "active" ? endDate : votingEndDate;
  const countdown = useMemo(
    () => getCountdown(countdownTarget),
    [countdownTarget, nowTs],
  );

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[52rem] overflow-hidden" aria-hidden>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.10] dark:opacity-30"
          style={{ backgroundImage: `url(${HACKATHON_BACKGROUND_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-slate-50/90 to-slate-50 dark:from-slate-950/55 dark:via-slate-950/80 dark:to-slate-950" />
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[36rem] bg-[radial-gradient(ellipse_80%_45%_at_50%_0%,rgba(14,165,233,0.16),transparent_72%)] dark:bg-[radial-gradient(ellipse_80%_45%_at_50%_0%,rgba(14,165,233,0.22),transparent_72%)]"
        aria-hidden
      />
      <main className="relative z-10 mx-auto w-full max-w-6xl px-4 py-10 text-slate-900 dark:text-slate-100">

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
              Build across five tracks, from infra to games, then document and
              demo your work. Official kickoff{" "}
              <span className="font-semibold text-white">May 25, 2026</span>{" "}
              (UTC); submissions close{" "}
              <span className="font-semibold text-white">
                July 15, 2026 at 12:00 UTC
              </span>
              . Community voting then runs until{" "}
              <span className="font-semibold text-white">
                July 20, 2026 at 12:00 UTC
              </span>
              .
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
                  : phase === "voting"
                    ? "Community voting ends in"
                    : "Voting ended"}
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
                Community voting ended July 20, 2026 at 12:00 UTC.
              </p>
            ) : phase === "voting" ? (
              <p className="mt-4 text-center text-xs text-slate-400">
                Submissions are closed. Voting ends{" "}
                <span className="font-medium text-slate-300">
                  Monday, July 20 at 12:00 UTC
                </span>
                .
              </p>
            ) : phase === "pre" ? (
              <p className="mt-4 text-center text-xs text-slate-400">
                Starts{" "}
                <span className="font-medium text-slate-300">May 25, 2026</span>
                . Submissions close July 15 at 12:00 UTC.
              </p>
            ) : (
              <p className="mt-4 text-center text-xs text-slate-400">
                Submissions close{" "}
                <span className="font-medium text-slate-300">
                  July 15, 2026 at 12:00 UTC
                </span>
                .
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mb-12">
        <SectionTitle eyebrow="2026 event">Tracks</SectionTitle>
        <p className="-mt-2 mb-6 max-w-2xl text-muted-foreground">
          Align your project with a track for clarity when you submit, judges
          and the community use them to browse entries.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tracks.map((track) => {
            const Icon = track.icon;
            return (
              <Card
                key={track.name}
                className="border-slate-200/90 bg-white/95 text-slate-900 shadow-sm backdrop-blur-sm transition-all hover:border-emerald-500/40 hover:shadow-md dark:border-slate-700/80 dark:bg-slate-900/90 dark:text-slate-100"
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
        <SectionTitle eyebrow="Rewards">Prizes</SectionTitle>
        <Card className="overflow-hidden border-amber-500/30 bg-gradient-to-br from-amber-50 to-white shadow-sm dark:border-amber-500/25 dark:from-amber-950/30 dark:to-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15 text-amber-700 ring-1 ring-amber-500/25 dark:text-amber-300">
                <Trophy className="h-6 w-6" aria-hidden />
              </span>
              25 ZEC Prize pool
            </CardTitle>
            <CardDescription>
              Build, submit, and compete for the community prize pool.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      <section className="mb-12">
        <SectionTitle eyebrow="Start here">
          Devtools &amp; documentation
        </SectionTitle>
        <div className="grid max-w-3xl gap-5">
          {devToolsDocs.map((tool) => {
            const Icon = tool.icon;
            const isInternal = tool.href.startsWith("/");
            return (
              <Card
                key={tool.title}
                className="group h-full overflow-hidden border-slate-200/90 bg-white/95 text-slate-900 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-sky-500/40 hover:shadow-lg dark:border-slate-700/80 dark:bg-slate-900/90 dark:text-slate-100"
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
        <Card className="border-slate-200/90 bg-white/95 text-slate-900 shadow-sm backdrop-blur-sm dark:border-slate-700/80 dark:bg-slate-900/90 dark:text-slate-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-400">
                <Puzzle className="h-5 w-5" aria-hidden />
              </span>
              Rules
            </CardTitle>
            <CardDescription>
              Keep submissions fair and easy to judge.
            </CardDescription>
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

        <Card className="border-slate-200/90 bg-white/95 text-slate-900 shadow-sm backdrop-blur-sm dark:border-slate-700/80 dark:bg-slate-900/90 dark:text-slate-100">
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
        <SectionTitle eyebrow="2026 entries">
          Hackathon submissions
        </SectionTitle>
        <p className="-mt-2 mb-6 max-w-3xl text-muted-foreground">
          Explore the projects submitted to the 2026 ZecHub Hackathon, including
          their creators, demos, source code, and video walkthroughs.
        </p>

        <div className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
          {submissions.map((submission) => (
            <details
              key={submission.title}
              className="group overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 text-slate-900 shadow-sm backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-sky-500/40 hover:shadow-lg dark:border-slate-700/80 dark:bg-slate-900/90 dark:text-slate-100"
            >
              <summary className="cursor-pointer list-none p-5 outline-none [&::-webkit-details-marker]:hidden">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-300">
                        {submission.track}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                        <UserRound className="h-4 w-4" aria-hidden />
                        Made by {submission.creator}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 transition group-hover:text-sky-700 dark:text-white dark:group-hover:text-sky-400">
                      {submission.title}
                    </h3>
                  </div>
                  <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-slate-400 transition group-open:rotate-45 group-open:text-sky-500" />
                </div>
              </summary>

              <div className="border-t border-slate-200/80 p-5 dark:border-slate-700/80">
                <div className="space-y-5">
                  {submission.videoUrl ? (
                    <div className="space-y-2">
                      <div className="aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-black dark:border-slate-700">
                        <video
                          className="h-full w-full bg-black object-contain"
                          controls
                          preload="metadata"
                          playsInline
                        >
                          <source
                            src={submission.videoUrl}
                            type={submission.videoType}
                          />
                          Your browser does not support embedded video.
                        </video>
                      </div>
                      <a
                        href={submission.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 hover:underline dark:text-sky-400"
                      >
                        Open video directly
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                      </a>
                    </div>
                  ) : submission.videoEmbedUrl ? (
                    <div className="aspect-video w-full overflow-hidden rounded-xl bg-slate-950">
                      <iframe
                        className="h-full w-full"
                        src={submission.videoEmbedUrl}
                        title={`${submission.title} video demo`}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    </div>
                  ) : null}

                  <div>
                    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 md:text-base">
                      {submission.description}
                    </p>
                    {submission.credentials ? (
                      <p className="mt-4 rounded-lg border border-amber-500/30 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-950 dark:bg-amber-950/30 dark:text-amber-100">
                        {submission.credentials}
                      </p>
                    ) : null}
                    <div className="mt-5 flex flex-wrap gap-3">
                      {submission.demoUrl ? (
                        <SubmissionLink
                          href={submission.demoUrl}
                          label="Open demo"
                          icon="demo"
                        />
                      ) : null}
                      {submission.repoUrl ? (
                        <SubmissionLink
                          href={submission.repoUrl}
                          label="GitHub"
                          icon="github"
                        />
                      ) : null}
                      {submission.prUrl ? (
                        <SubmissionLink
                          href={submission.prUrl}
                          label="View PR"
                        />
                      ) : null}
                      {submission.docsUrl ? (
                        <SubmissionLink
                          href={submission.docsUrl}
                          label="Documentation"
                        />
                      ) : null}
                      {submission.articleUrl ? (
                        <SubmissionLink
                          href={submission.articleUrl}
                          label="Read article"
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <SectionTitle eyebrow="Past editions">
          Previous hackathon projects
        </SectionTitle>

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
          <Card className="mb-8 border-slate-200/80 bg-white/85 shadow-sm backdrop-blur-sm dark:border-slate-700/80 dark:bg-slate-900/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-slate-900 dark:text-white">
                <FolderOpen className="h-5 w-5 text-sky-400" aria-hidden />
                Browse previous hackathons
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-300">
                Previous project folders were not returned to this component.
                You can still browse every past submission directly on GitHub.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href={PREVIOUS_PROJECTS_REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#1984c7] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1574af]"
              >
                Browse previous projects
                <ExternalLink className="h-4 w-4" aria-hidden />
              </a>
            </CardContent>
          </Card>
        ) : null}

        {githubProjects.length > 0 ? (
          <div className="mb-8 space-y-10">
            {projectsByGroup.map((group) => (
              <div key={group.key}>
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  <FolderOpen
                    className="h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400"
                    aria-hidden
                  />
                  {group.label}
                  <span className="font-mono text-xs font-normal normal-case tracking-normal text-muted-foreground">
                    ({group.projects.length})
                  </span>
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {group.projects.map((p) => (
                    <Card
                      key={p.slugPath}
                      className="group flex flex-col overflow-hidden border-slate-200/90 bg-white/95 text-slate-900 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-sky-500/35 hover:shadow-lg dark:border-slate-700/80 dark:bg-slate-900/90 dark:text-slate-100"
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
    </div>
  );
};

export default Hackathon;

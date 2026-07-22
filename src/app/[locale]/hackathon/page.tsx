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
  X,
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
const VOTING_END_DATE_UTC = "2026-07-24T12:00:00Z";

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
    repoUrl:
      "https://github.com/devacunetixtech/zechub/tree/zecpass-hack26/zecpass-hack26",
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
    videoUrl: "https://free2z.cash/uploadz/public/ZecHub/zecauth-demo.mp4",
    videoType: "video/mp4",
    repoUrl:
      "https://github.com/ZecHub/zechub/tree/main/Hackathon/2026/ZecAuth",
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
    docsUrl:
      "https://github.com/zcashjava/ZcashNodeLauncher/blob/main/README.md",
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
    repoUrl:
      "https://github.com/ZecHub/zechub/tree/main/Hackathon/2026/zaygent",
  },
  {
    title: "Steward",
    creator: "Hamid-Alan",
    track: "FROST",
    description:
      "Steward is a threshold-custody protocol for shielded Zcash. It splits an Orchard vault's spend authority into t-of-n FROST shares for group custody, social recovery, and inheritance. Guardians co-sign a real transaction sighash on their own devices, while the relay coordinating the signing process holds no keys or shares. Steward has completed a real 2-of-3 threshold-signed shielded transaction on mainnet.",
    videoEmbedUrl: "https://www.youtube.com/embed/JpDBunva2Ek",
    repoUrl:
      "https://github.com/ZecHub/zechub/tree/main/Hackathon/2026/Steward",
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
  {
    title: "Glasspane Rooms",
    creator: "dolepee",
    track: "Accounting",
    description:
      "Glasspane Rooms enables selective transparency for shielded Zcash payouts. A treasury can prove chosen recipients, amounts, memos, and totals without sharing a viewing key or exposing unrelated activity. Each selected payout discloses a single Out Cipher Key that reveals only that payment. The prototype has been verified on Zcash mainnet using two real Orchard payouts and rejects tampered receipts.",
    videoEmbedUrl: "https://www.youtube.com/embed/am9CfcHKQSQ",
    demoUrl: "https://glasspane-iota.vercel.app",
    repoUrl: "https://github.com/dolepee/glasspane",
  },
  {
    title: "ZecGuard",
    creator: "Lexiie",
    track: "Infrastructure",
    description:
      "ZecGuard is a local-first recovery-readiness prototype for Zcash. It explores how users can prepare and coordinate wallet recovery without exposing sensitive recovery material to a hosted service. The demonstration uses Zcash testnet framing and dummy recovery data for safety, while the protocol is intended to support shielded memo coordination on Zcash mainnet.",
    videoUrl:
      "https://cdn.jsdelivr.net/gh/Lexiie/ZecGuard@main/assets/demo.mp4",
    videoType: "video/mp4",
    repoUrl: "https://github.com/Lexiie/ZecGuard",
    docsUrl:
      "https://github.com/Lexiie/ZecGuard/blob/main/HACKATHON_SUBMISSION.md",
  },
  {
    title: "SAVANNA",
    creator: "LucasdoCondo",
    track: "Accounting",
    description:
      "SAVANNA is a secure desktop point-of-sale terminal that enables merchants to accept private Orchard-shielded Zcash payments at the counter. It operates using an Incoming Viewing Key rather than a seed phrase or spending key, keeping the terminal read-only and preventing it from authorizing withdrawals. Merchants can monitor and confirm selected incoming shielded payments without exposing wallet spending authority.",
    videoUrl: "https://free2z.cash/uploadz/public/ZecHub/savanna.mp4",
    videoType: "video/mp4",
    repoUrl: "https://github.com/LucasdoCondo/SAVANNA",
  },
  {
    title: "Paypunk",
    creator: "blockhackersio",
    track: "Infrastructure",
    description:
      "Paypunk is a multi-process, privacy-first wallet framework written in Rust. It separates key management from wallet logic so keys can remain in a dedicated daemon or on an air-gapped device, with signing requests transferred through QR codes. Its protocol abstractions currently support Zcash Orchard and Ethereum, while the same backend powers a CLI, terminal interface, WebSocket bridge, and Tauri mobile signer. Paypunk supports shielded Zcash transactions across regtest, testnet, and mainnet, encrypted wallet storage, wallet restoration, air-gapped signing, and authenticated encrypted IPC. It is alpha software and is not intended for use with real funds.",
    videoEmbedUrl: "https://www.youtube.com/embed/BTWRUIATk10",
    repoUrl: "https://github.com/blockhackersio/paypunk",
    docsUrl: "https://blockhackersio.github.io/paypunk",
  },
  {
    title: "CYZE",
    creator: "USCMig",
    track: "FROST",
    description:
      "CYZE, Coordinate Your Zcash Easily, is a FROST-enabled coordination tool and wallet for teams and groups. Users create a distributed key generation group, choose a signing threshold, and collectively manage an Orchard wallet. Approved participants can coordinate threshold-authorized Orchard transactions on Zcash mainnet without any single participant holding complete signing authority.",
    videoEmbedUrl: "https://www.youtube.com/embed/yrWCumgBuNU",
    repoUrl: "https://github.com/USCMig/Cyze",
  },
  {
    title: "Pendrake Watch",
    creator: "Dorian",
    track: "Accounting",
    description:
      "Pendrake Watch is a watch-only Zcash desktop wallet for Linux, macOS, and Windows. Users import a Unified Full Viewing Key, after which a background daemon keeps the wallet synchronized and sends desktop notifications when new transactions are detected, even when the main window is closed. It displays transaction history, memos, current balances, and a historical balance chart with USD values. Wallet files are encrypted behind a passphrase, and the application never stores spending keys.",
    videoEmbedUrl: "https://www.youtube.com/embed/Hk5awvFrZuI",
    repoUrl: "https://github.com/auzum197/pendrake-watch",
  },
  {
    title: "ZHAC",
    creator: "te-mpe-st",
    track: "Zcash Login",
    description:
      "ZHAC, a recursive acronym for ZHAC Has Awesome Cryptography, is a GPG-like cryptographic toolsuite built with modern Zcash primitives. It combines authentication challenges with FROST-based functionality, providing tools for proving control of cryptographic identities and coordinating threshold-authorized operations.",
    videoEmbedUrl: "https://www.youtube.com/embed/YjsQbOMRvsI",
    repoUrl: "https://github.com/te-mpe-st/zhac",
  },
  {
    title: "ZBounty",
    creator: "Jay-cey",
    track: "Accounting",
    description:
      "ZBounty is a privacy-focused bounty platform for individuals and open-source communities. Users can publish tasks and reward contributors through fully shielded Zcash z-to-z transactions. The platform uses Zingo CLI and lightwalletd for real-time mainnet synchronization and includes a gamified Privacy Score that highlights how effectively each bounty flow uses Zcash privacy.",
    videoEmbedUrl: "https://www.youtube.com/embed/E-yto4ZM668",
    demoUrl: "https://zbounty.onrender.com/",
    repoUrl:
      "https://github.com/Jay-cey/zechub/tree/hackathon-submission/Hackathon/2026/ZBounty",
  },
  {
    title: "Gleyo",
    creator: "Gilmore",
    track: "Infrastructure",
    description:
      "Gleyo is a Zcash-native quest and community growth platform. Projects can fund a community wallet in ZEC, publish quests, reward contributors directly with shielded ZEC, run community chat, and measure retention from one platform. Quest tasks can include GitHub, Discord, Telegram, YouTube, quizzes, polls, puzzles, and file uploads. Deposits, quest publishing, rewards, and shielded withdrawals are operating end-to-end using real Zcash mainnet transactions through a self-hosted Zebra node and Nozy Wallet.",
    videoEmbedUrl: "https://www.youtube.com/embed/Har9yk9Ep04",
    demoUrl: "https://gleyo.app/",
    repoUrl: "https://github.com/gilmorre/gleyo-Zechub-",
  },
  {
    title: "Authentication with ZcashMe",
    creator: "ZcashMe",
    track: "Zcash Login",
    description:
      "Authentication with ZcashMe provides one-time-password-based Zcash login through a fully OIDC-compatible authentication flow. It can be integrated with OIDC providers such as Clerk, Better Auth, and NextAuth, allowing applications to add Zcash-native sign-in without building a custom identity system. The ZcashMe team also plans to integrate the login flow with PGPZ.",
    videoEmbedUrl: "https://www.youtube.com/embed/ynirewTAHeA?start=40",
    demoUrl: "https://auth.zcash.me/demo",
    repoUrl: "https://github.com/zcashme/zns-login",
  },
  {
    title: "ZecSafe",
    creator: "cyberrockng",
    track: "FROST",
    description:
      "ZecSafe is a recorded proof of concept for FROST-authorized Zcash custody. It demonstrates a threshold-signing session and publishes artifact fingerprints that can be used to verify how a transaction was authorized. The resulting spend is validated by Zcash as a normal transaction because the blockchain does not expose a special FROST marker. ZecSafe is experimental demonstration software and should not be treated as production custody infrastructure.",
    videoEmbedUrl: "https://www.youtube.com/embed/B16fPtEGfnY",
    demoUrl: "https://zecsafe.vercel.app/",
    repoUrl: "https://github.com/cyberrockng/zecsafe",
  },
  {
    title: "Konclave",
    creator: "deegalabs",
    track: "FROST",
    description:
      "Konclave provides browser-based FROST threshold vaults for Zcash treasurers. Teams can coordinate quorum-approved payments and private payroll without ever reconstructing the complete signing key. Its multi-device distributed key generation and FROST signing flows run in the browser through a blind relay. Konclave has demonstrated a real 2-of-3 threshold-authorized transaction on Zcash mainnet.",
    videoEmbedUrl: "https://youtu.be/_UyWlLRnJms?is=aUDoRbTSvnRkaF",
    demoUrl: "https://konclave-demo.vercel.app/",
    repoUrl: "https://github.com/deegalabs/konclave",
  },
  {
    title: "Zink",
    creator: "KaranSinghBisht",
    track: "Accounting",
    description:
      "Zink is a non-custodial, Stripe-style payment-link platform for shielded ZEC. Merchants configure a Unified Full Viewing Key rather than a spending key, and every invoice receives a fresh Orchard-only diversified address. This prevents customers from linking invoice activity across transactions.",
    demoUrl: "https://zink.vercel.app/",
    repoUrl: "https://github.com/KaranSinghBisht/zink",
  },
];

export default function HackathonPage({
  githubProjects = [],
  githubProjectsError,
}: HackathonProps) {
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);

  const filteredSubmissions = useMemo(() => {
    if (!selectedTrack) return submissions;
    return submissions.filter(
      (sub) => sub.track.toLowerCase() === selectedTrack.toLowerCase(),
    );
  }, [selectedTrack]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-8">
        {/* Submissions Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Hackathon Submissions</h2>
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSelectedTrack(null)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedTrack === null
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              All
            </button>
            {tracks.map((track) => (
              <button
                key={track.name}
                onClick={() => setSelectedTrack(track.name)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedTrack === track.name
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {track.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubmissions.map((sub, idx) => (
              <Card key={idx} className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle className="text-xl">{sub.title}</CardTitle>
                  <CardDescription>
                    By {sub.creator} • {sub.track}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-4">
                    {sub.description}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {sub.demoUrl && (
                      <a
                        href={sub.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center text-xs text-primary hover:underline"
                      >
                        Demo <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    )}
                    {sub.repoUrl && (
                      <a
                        href={sub.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center text-xs text-primary hover:underline"
                      >
                        Repository <Github className="w-3 h-3 ml-1" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Previous Hackathon Projects Section */}
        <section className="pt-8 border-t">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FolderOpen className="w-6 h-6" /> Previous Projects
            </h2>
            <a
              href={PREVIOUS_PROJECTS_REPO}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View Repository <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {githubProjectsError && (
            <div className="p-4 mb-4 text-sm bg-destructive/10 text-destructive rounded-md">
              {githubProjectsError}
            </div>
          )}

          {githubProjects && githubProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {githubProjects.map((project, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <a
                      href={project.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Browse Folder <ExternalLink className="w-3 h-3" />
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center rounded-lg border border-dashed bg-muted/40">
              <p className="text-sm text-muted-foreground">
                Previous project folders were not returned to this component or are currently unavailable.
              </p>
              <a
                href={PREVIOUS_PROJECTS_REPO}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center text-sm font-medium text-primary hover:underline"
              >
                Browse all previous projects directly on GitHub{" "}
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

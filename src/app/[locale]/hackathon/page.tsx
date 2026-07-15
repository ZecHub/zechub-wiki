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
  videoUrl:
    "https://free2z.cash/uploadz/public/ZecHub/savanna.mp4",
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
    demoUrl: "https://konclave-demo.vercel.app/",
    repoUrl: "https://github.com/deegalabs/konclave",
  },
  {
    title: "Zink",
    creator: "KaranSinghBisht",
    track: "Accounting",
    description:
      "Zink is a non-custodial, Stripe-style payment-link platform for shielded ZEC. Merchants configure a Unified Full Viewing Key rather than a spending key, and every invoice receives a fresh Orchard-only diversified address. This prevents customers from linking an invoice to the merchant's balance, payment history, or other customers while allowing the merchant to monitor incoming payments.",
    videoEmbedUrl: "https://www.youtube.com/embed/DI69ZiJnaUA",
    repoUrl: "https://github.com/KaranSinghBisht/zink",
  },
  {
    title: "ZecVault",
    creator: "Ridwannurudeen",
    track: "FROST",
    description:
      "ZecVault is a private 2-of-3 shielded escrow protocol for Zcash. A buyer, seller, and neutral arbiter each hold one FROST share controlling a single Orchard address, and any two participants can authorize settlement. On-chain, the resulting payment appears as an ordinary shielded transaction and does not reveal the escrow arrangement, participants, policy, or dispute outcome.",
    videoEmbedUrl: "https://www.youtube.com/embed/elSUBGYcma8",
    repoUrl: "https://github.com/Ridwannurudeen/zecvault",
  },
  {
    title: "zk.poker",
    creator: "rotkonetworks",
    track: "Games",
    description:
      "zk.poker is an end-to-end encrypted peer-to-peer poker implementation using a mental-poker shuffle and 2-of-3 FROST escrow. It supports the complete game loop, including dealing, betting, the flop, showdown, pot settlement, and repeated hands. Games can run through an encrypted blind relay so the server sees only ciphertext and players do not expose their IP addresses to one another. Player actions are signed with Ed25519 to support future automated dispute resolution.",
    videoEmbedUrl: "https://www.youtube.com/embed/xwmEUOXYE24",
    repoUrl: "https://github.com/rotkonetworks/zeratul/tree/master/crates",
  },
  {
    title: "Turnstile",
    creator: "Drey.eth",
    track: "Infrastructure",
    description:
      "Turnstile is an Ironwood migration-readiness companion for Zcash users and ecosystem services. Users can paste a Unified Full Viewing Key to receive a wallet-specific breakdown of visible pool balances and a migration verdict without providing a spending key. Viewing keys are first decoded locally in WebAssembly, and pools that cannot be inspected are clearly marked as unavailable rather than incorrectly reported as zero. Turnstile also includes a live activation countdown, wallet migration guides, shielded-memo alert subscriptions, shielded-pool charts, an ecosystem readiness board, an embeddable countdown widget, and a local command-line checker.",
    videoEmbedUrl: "https://www.youtube.com/embed/Vp7gKDIvjts",
    demoUrl: "https://turnstile-xi.vercel.app/",
    repoUrl:
      "https://github.com/ZecHub/zechub/tree/main/Hackathon/2026/Turnstile",
  },
  {
    title: "Bluff Arena",
    creator: "Kunwar Anirudhsingh",
    track: "Games",
    description:
      "Bluff Arena is a multiplayer bluffing card game built around a real ZEC staking pool on Zcash testnet. Players place cards face-down, declare a rank, and may challenge opponents by calling their bluff. The project is progressing toward requiring a ZEC stake for every game and using FROST threshold signatures so that no single participant or service controls the staking keys.",
    videoEmbedUrl: "https://www.youtube.com/embed/eZvhazCkFfY",
    repoUrl:
      "https://github.com/ZecHub/zechub/tree/main/Hackathon/2026/bluffgame",
  },
  {
    title: "ZClash",
    creator: "jerydam",
    track: "Games",
    description:
      "ZClash is a 1v1 quiz game where two players stake ZEC and compete across three rounds of AI-generated questions on a chosen topic. Both players fund a shared Zcash escrow address before the match, and the winner receives the full prize pool automatically. The project aims to provide competitive ZEC-based gameplay without a middleman or platform fee.",
    videoUrl:
      "https://free2z.cash/uploadz/public/ZecHub/zclash-builds-competitive-learning-on-zcash.mp4",
    videoType: "video/mp4",
    demoUrl: "https://zclash.vercel.app/",
    repoUrl: "https://github.com/jerydam/Zclash",
  },
  {
    title: "FrostVault",
    creator: "Jatin Sahijwani",
    track: "FROST",
    description:
      "FrostVault is a threshold vault for shielded ZEC built with genuine distributed key generation and rerandomized threshold signing. Its Rust service uses reddsa::frost::redpallas, the same signature scheme used for Orchard spend authorization. No participant, including the backend, ever holds or reconstructs the complete private key, reducing the risk that a single lost or compromised key can permanently expose or lock the vault.",
    videoEmbedUrl: "https://www.youtube.com/embed/puDKy7F6Y9A",
    repoUrl:
      "https://github.com/ZecHub/zechub/tree/main/Hackathon/2026/frostvault",
  },
  {
  title: "Zutility",
  creator: "DavidIfebueme",
  track: "Infrastructure",
  description:
    "Zutility enables users across Africa to privately pay for airtime, mobile data, cable television, electricity, and school fees using ZEC. It provides live exchange rates, 15-minute price locks, and multi-provider dispatch. Zutility supports Zingolib on Zcash testnet and mainnet, together with a mock Zcash mode for demonstrations.",
  videoUrl:
      "https://free2z.cash/uploadz/public/ZecHub/zutility-demo.mp4",
  videoType: "video/mp4",
  demoUrl: "https://www.zutility.xyz",
  repoUrl: "https://github.com/DavidIfebueme/zutility",
  },
  {
  title: "ZecAgent",
  creator: "aliiqbal24",
  track: "Infrastructure",
  description:
    "ZecAgent is a local MCP wallet and agent-payment approval layer funded by shielded ZEC. It supports verified agentic purchases, direct shielded ZEC transfers, managed CrossPay routing, dashboard-based payment approval, configurable spending limits, receipts, and transaction confirmation checks. ZecAgent can be connected to Codex through its npm quickstart command.",
  videoEmbedUrl: "https://www.youtube.com/embed/cv74E_j3Who",
  repoUrl: "https://github.com/aliiqbal24/ZecAgent",
  docsUrl:
    "https://github.com/aliiqbal24/ZecAgent/blob/main/QUICKSTART.md",
},
{
  title: "Portal",
  creator: "IamHarrie-Labs",
  track: "Zcash Login",
  description:
    "Portal enables users to sign in, unlock paid content, and send or receive payments using only a Zcash wallet. A user sends a private shielded transaction containing a one-time code in the memo, which Portal detects on Zcash mainnet to authenticate the user without requiring an email address or password. The same flow supports payment links and gated content while keeping the user's identity private from the application. Portal operates using real Zcash mainnet transactions rather than simulated payments.",
  videoEmbedUrl: "https://www.youtube.com/embed/UxJZrXAuWY4",
  demoUrl: "https://tryportal.xyz",
  repoUrl: "https://github.com/IamHarrie-Labs/portal",
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
  const [selectedSubmissionTitle, setSelectedSubmissionTitle] = useState<
    string | null
  >(null);

  const selectedSubmission = useMemo(
    () =>
      submissions.find(
        (submission) => submission.title === selectedSubmissionTitle,
      ),
    [selectedSubmissionTitle],
  );

  const handleSubmissionClick = (title: string) => {
    const nextTitle = selectedSubmissionTitle === title ? null : title;
    setSelectedSubmissionTitle(nextTitle);

    if (nextTitle) {
      window.requestAnimationFrame(() => {
        document.getElementById("submission-details")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  };

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
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[52rem] overflow-hidden"
        aria-hidden
      >
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
                  July 24, 2026 at 12:00 UTC
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
                  Community voting ended July 24, 2026 at 12:00 UTC.
                </p>
              ) : phase === "voting" ? (
                <p className="mt-4 text-center text-xs text-slate-400">
                  Submissions are closed. Voting ends{" "}
                  <span className="font-medium text-slate-300">
                    Friday, July 24 at 12:00 UTC
                  </span>
                  .
                </p>
              ) : phase === "pre" ? (
                <p className="mt-4 text-center text-xs text-slate-400">
                  Starts{" "}
                  <span className="font-medium text-slate-300">
                    May 25, 2026
                  </span>
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
              <CardDescription>
                Quick answers before you dive in.
              </CardDescription>
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
          <p className="-mt-2 mb-3 max-w-3xl text-slate-600 dark:text-slate-400">
            Explore all {submissions.length} projects submitted to the 2026
            ZecHub Hackathon. Select any project to reveal its description,
            video, demo site, and source code.
          </p>
          <p className="mb-6 text-sm font-medium text-sky-700 dark:text-sky-400">
            One project can be opened at a time. 
          </p>

          {selectedSubmission ? (
            <div
              id="submission-details"
              className="mb-6 scroll-mt-24 overflow-hidden rounded-3xl border border-sky-500/35 bg-white shadow-xl shadow-slate-900/10 dark:border-sky-400/25 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-950/50 md:px-6">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-300">
                      {selectedSubmission.track}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                      <UserRound className="h-4 w-4" aria-hidden />
                      Made by {selectedSubmission.creator}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-950 dark:text-white md:text-3xl">
                    {selectedSubmission.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSubmissionTitle(null)}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 transition hover:border-sky-500 hover:text-sky-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-sky-400 dark:hover:text-sky-400"
                  aria-label={`Close ${selectedSubmission.title} details`}
                >
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </div>

              <div
                className={`grid gap-6 p-5 md:p-6 ${
                  selectedSubmission.videoUrl ||
                  selectedSubmission.videoEmbedUrl
                    ? "lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]"
                    : ""
                }`}
              >
                {selectedSubmission.videoUrl ? (
                  <div className="space-y-2">
                    <div className="aspect-video w-full overflow-hidden rounded-2xl border border-slate-200 bg-black dark:border-slate-700">
                      <video
                        className="h-full w-full bg-black object-contain"
                        controls
                        preload="metadata"
                        playsInline
                      >
                        <source
                          src={selectedSubmission.videoUrl}
                          type={selectedSubmission.videoType}
                        />
                        Your browser does not support embedded video.
                      </video>
                    </div>
                    <a
                      href={selectedSubmission.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 hover:underline dark:text-sky-400"
                    >
                      Open video directly
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                    </a>
                  </div>
                ) : selectedSubmission.videoEmbedUrl ? (
                  <div className="aspect-video w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 dark:border-slate-700">
                    <iframe
                      className="h-full w-full"
                      src={selectedSubmission.videoEmbedUrl}
                      title={`${selectedSubmission.title} video demo`}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                ) : null}

                <div className="flex min-w-0 flex-col">
                  <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
                    {selectedSubmission.description}
                  </p>

                  {selectedSubmission.credentials ? (
                    <p className="mt-4 rounded-lg border border-amber-500/30 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-950 dark:bg-amber-950/30 dark:text-amber-100">
                      {selectedSubmission.credentials}
                    </p>
                  ) : null}

                  <div className="mt-6 flex flex-wrap gap-3">
                    {selectedSubmission.demoUrl ? (
                      <SubmissionLink
                        href={selectedSubmission.demoUrl}
                        label="Open demo"
                        icon="demo"
                      />
                    ) : null}
                    {selectedSubmission.repoUrl ? (
                      <SubmissionLink
                        href={selectedSubmission.repoUrl}
                        label="GitHub"
                        icon="github"
                      />
                    ) : null}
                    {selectedSubmission.prUrl ? (
                      <SubmissionLink
                        href={selectedSubmission.prUrl}
                        label="View PR"
                      />
                    ) : null}
                    {selectedSubmission.docsUrl ? (
                      <SubmissionLink
                        href={selectedSubmission.docsUrl}
                        label="Documentation"
                      />
                    ) : null}
                    {selectedSubmission.articleUrl ? (
                      <SubmissionLink
                        href={selectedSubmission.articleUrl}
                        label="Read article"
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {submissions.map((submission) => {
              const isSelected = selectedSubmissionTitle === submission.title;

              return (
                <button
                  key={submission.title}
                  type="button"
                  onClick={() => handleSubmissionClick(submission.title)}
                  aria-expanded={isSelected}
                  aria-controls={isSelected ? "submission-details" : undefined}
                  className={`group flex h-full min-h-[12.5rem] w-full flex-col rounded-2xl border p-5 text-left shadow-sm backdrop-blur-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 ${
                    isSelected
                      ? "border-sky-500 bg-sky-50 shadow-lg shadow-sky-900/10 dark:border-sky-400 dark:bg-sky-950/35"
                      : "border-slate-200/90 bg-white/95 hover:-translate-y-0.5 hover:border-sky-500/45 hover:shadow-lg dark:border-slate-700/80 dark:bg-slate-900/90 dark:hover:border-sky-400/50"
                  }`}
                >
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-300">
                      {submission.track}
                    </span>
                  </div>

                  <h3 className="line-clamp-2 text-xl font-bold leading-snug text-slate-950 transition group-hover:text-sky-700 dark:text-white dark:group-hover:text-sky-400">
                    {submission.title}
                  </h3>

                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                    <UserRound className="h-4 w-4 shrink-0" aria-hidden />
                    <span className="line-clamp-1">
                      Made by {submission.creator}
                    </span>
                  </span>

                  <span className="mt-auto flex items-center justify-between gap-3 border-t border-slate-200/80 pt-4 text-sm font-semibold text-sky-700 dark:border-slate-700/80 dark:text-sky-400">
                    {isSelected ? "Hide submission" : "View submission"}
                    <ArrowUpRight
                      className={`h-4 w-4 shrink-0 transition ${
                        isSelected ? "rotate-45" : "group-hover:translate-x-0.5"
                      }`}
                      aria-hidden
                    />
                  </span>
                </button>
              );
            })}
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
                  <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {group.projects.map((p) => (
                      <Card
                        key={p.slugPath}
                        className="group flex h-full flex-col overflow-hidden border-slate-200/90 bg-white/95 text-slate-900 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-sky-500/35 hover:shadow-lg dark:border-slate-700/80 dark:bg-slate-900/90 dark:text-slate-100"
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

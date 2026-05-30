"use client";

import React, { useState, useRef, useEffect, ReactNode } from "react";
import { FcLinux } from "react-icons/fc";
import { PiAppleLogoDuotone } from "react-icons/pi";
import { BsWindows } from "react-icons/bs";

// ── Types ────────────────────────────────────────────────────────────────────

interface CodeBlockProps {
  code: string;
  language?: string;
}

interface SectionCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

interface StepBadgeProps {
  number: number;
}

// ── Utilities ────────────────────────────────────────────────────────────────

const CopyIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

// ── Components ───────────────────────────────────────────────────────────────

// CodeBlock intentionally stays dark (terminal aesthetic) in both modes
const CodeBlock = ({ code, language = "bash" }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: "relative",
        background: "#0a0e17",
        border: "1px solid #1e293b",
        borderRadius: "8px",
        overflow: "hidden",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      }}
    >
      {/* Terminal header bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 14px",
          background: "#0d1117",
          borderBottom: "1px solid #1e293b",
        }}
      >
        <div style={{ display: "flex", gap: "6px" }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#ff5f57",
              display: "block",
            }}
          />
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#febc2e",
              display: "block",
            }}
          />
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#28c840",
              display: "block",
            }}
          />
        </div>
        <span
          style={{
            fontSize: "10px",
            color: "#4a5568",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {language}
        </span>
        <button
          onClick={handleCopy}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: "4px 10px",
            background: copied
              ? "rgba(34, 197, 94, 0.15)"
              : "rgba(255,255,255,0.06)",
            border: `1px solid ${copied ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.1)"}`,
            borderRadius: "5px",
            color: copied ? "#22c55e" : "#9ca3af",
            fontSize: "11px",
            fontFamily: "inherit",
            cursor: "pointer",
            transition: "all 0.2s ease",
            letterSpacing: "0.02em",
          }}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Code content */}
      <pre
        style={{
          margin: 0,
          padding: "18px 20px",
          overflowX: "auto",
          fontSize: "13px",
          lineHeight: "1.75",
          color: "#e2e8f0",
        }}
      >
        <code style={{ maxWidth: "750px" }}>{code.trim()}</code>
      </pre>
    </div>
  );
};

const SectionCard = ({ title, children, className = "" }: SectionCardProps) => (
  <div
    className={`${className} p-4 rounded-xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/[0.03] backdrop-blur-sm`}
  >
    <h4
      style={{
        fontSize: "13px",
        fontWeight: 600,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "#22d3ee",
        marginBottom: "18px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#22d3ee",
          display: "inline-block",
        }}
      />
      {title}
    </h4>
    {children}
  </div>
);

const StepBadge = ({ number }: StepBadgeProps) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 32,
      height: 32,
      borderRadius: "50%",
      background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
      color: "#fff",
      fontSize: "13px",
      fontWeight: 700,
      flexShrink: 0,
      boxShadow: "0 0 20px rgba(14,165,233,0.3)",
    }}
  >
    {number}
  </span>
);

const Divider = () => (
  <div className="my-9 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/8 to-transparent" />
);

const ResourceLink = ({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 px-[14px] py-[10px] rounded-lg text-[13.5px] no-underline transition-all duration-200
      border border-black/8 dark:border-white/8
      bg-black/[0.02] dark:bg-white/[0.04]
      text-slate-500 dark:text-slate-400
      hover:bg-sky-500/8 hover:border-sky-500/30 hover:text-slate-700 dark:hover:text-slate-200"
  >
    <ExternalLinkIcon />
    {children}
  </a>
);

// ── Shared sub-labels ────────────────────────────────────────────────────────

const SubLabel = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <p
    className={`text-[11px] tracking-[0.1em] uppercase text-slate-900 dark:text-slate-600 mb-2 ${className}`}
  >
    {children}
  </p>
);

const InfoBox = ({ children }: { children: ReactNode }) => (
  <div
    className="rounded-[10px] p-[18px_22px] mb-6 text-sm leading-relaxed
      bg-indigo-500/[0.06] dark:bg-indigo-500/[0.08]
      border border-indigo-500/20
      text-slate-600 dark:text-slate-400"
  >
    {children}
  </div>
);

// ── Tab content ──────────────────────────────────────────────────────────────

const ZebradTab = () => {
  const [osTab, setOsTab] = useState<"linux" | "macos" | "windows">("linux");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
      {/* TOC */}
      <div className="rounded-xl px-7 py-6 bg-sky-500/[0.04] dark:bg-sky-500/[0.06] border border-sky-500/20">
        <p className="text-[11px] tracking-[0.15em] uppercase text-sky-500 mb-[14px] font-semibold">
          On this page
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[
            ["#installing-zcash", "Installing Zebrad"],
            ["#running-zebrad", "Running zebrad"],
            ["#connecting-lightwalletd", "Connecting with lightwalletd"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="text-slate-900 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm no-underline flex items-center gap-2 max-w-fit transition-colors"
            >
              <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-600 inline-block" />
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* Step 1 — Installing */}
      <SectionCard title="Installation">
        {/* OS Tab bar */}
        <div className="grid grid-cols-2 imd:flex gap-1 border-b border-black/8 dark:border-white/8 mb-6">
          {(
            [
              { id: "linux", icon: FcLinux, label: "Linux", color: null },
              {
                id: "macos",
                icon: PiAppleLogoDuotone,
                label: "macOS",
                color: null,
              },
              {
                id: "windows",
                icon: BsWindows,
                label: "Windows",
                color: "#22d3ee",
              },
            ] as const
          ).map(({ id, icon: Icon, label, color }) => (
            <button
              key={id}
              onClick={() => setOsTab(id)}
              className={`flex items-center gap-2 px-[18px] py-[10px] bg-transparent border-0 border-b-2 cursor-pointer transition-all duration-200 text-sm ${
                osTab === id
                  ? "border-b-sky-500 text-slate-900 dark:text-slate-200 font-semibold"
                  : "border-b-transparent text-slate-400 dark:text-slate-500 font-normal hover:text-slate-600 dark:hover:text-slate-300"
              }`}
            >
              <Icon size={18} color={color ?? ""} />
              {label}
            </button>
          ))}
        </div>

        {osTab === "linux" && (
          <>
            <SubLabel className="mt-[14px]">Dependencies</SubLabel>
            <CodeBlock
              code={`curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh\nsudo apt update\nsudo apt install libclang-dev clang pkg-config openssl protobuf-compiler npm`}
            />
            <SubLabel className="mt-[14px]">From Source</SubLabel>
            <CodeBlock
              code={`git clone https://github.com/ZcashFoundation/zebra.git\ncd zebra\ngit checkout v4.5.1\ncargo build --release --bin zebrad\nexport PATH="$PATH:(pwd)/target/release"`}
            />
            <SubLabel className="mt-[14px]">Alternatively</SubLabel>
            <CodeBlock
              code={`cargo install --git https://github.com/ZcashFoundation/zebra --tag v4.5.1 zebrad`}
            />
          </>
        )}

        {osTab === "macos" && (
          <>
            <SubLabel className="mt-[14px]">Dependencies</SubLabel>
            <CodeBlock
              code={`curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh\nsudo apt update\nsudo apt install libclang-dev clang pkg-config openssl protobuf-compiler npm`}
            />
            <SubLabel className="mt-[14px]">Manual Download</SubLabel>
            <CodeBlock
              code={`git clone https://github.com/ZcashFoundation/zebra.git\ncd zebra\ngit checkout v4.5.1\ncargo build --release --bin zebrad\nexport PATH="$PATH:(pwd)/target/release"`}
            />
            <SubLabel className="mt-[14px]">Alternatively</SubLabel>
            <CodeBlock
              code={`cargo install --git https://github.com/ZcashFoundation/zebra --tag v4.5.1 zebrad`}
            />
          </>
        )}

        {osTab === "windows" && (
          <>
            <SubLabel>WSL (Recommended)</SubLabel>
            <CodeBlock code={`wsl --install`} />
            <SubLabel className="mt-[14px]">Dependencies</SubLabel>
            <CodeBlock
              code={`curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh\nsudo apt update\nsudo apt install libclang-dev clang pkg-config openssl protobuf-compiler npm\nsource $HOME/.cargo/env\nexport CXXFLAGS="$CXXFLAGS -include cstdint"`}
            />
            <SubLabel className="mt-[14px]">From Source</SubLabel>
            <CodeBlock
              code={`git clone https://github.com/ZcashFoundation/zebra.git\ncd zebra\ngit checkout v4.5.1\ncargo build --release --bin zebrad\nexport PATH="$PATH:(pwd)/target/release"`}
            />
            <SubLabel className="mt-[14px]">Alternatively</SubLabel>
            <CodeBlock
              code={`cargo install --git https://github.com/ZcashFoundation/zebra --tag v4.5.1 zebrad`}
            />
          </>
        )}
      </SectionCard>

      <Divider />

      {/* Step 2 — Running */}
      <section id="running-zebrad">
        <div className="flex items-center gap-[14px] mb-7">
          <StepBadge number={2} />
          <h2 className="text-slate-900 dark:text-slate-100 text-[22px] font-bold m-0">
            Running zebrad
          </h2>
        </div>

        <SectionCard title="Initial Setup" className="mb-6">
          <SubLabel>Create Configuration Directory</SubLabel>
          <CodeBlock code={`zebrad generate -o ~/.config/zebrad.toml`} />
          <SubLabel className="mt-[18px]">zebrad.toml</SubLabel>
          <CodeBlock
            language="toml"
            code={`[consensus]
checkpoint_sync = true

[mempool]
eviction_memory_time = "1h"
tx_cost_limit = 80000000

[network]
cache_dir = true
crawl_new_peer_interval = "1m 1s"
listen_addr = "[::]:8233"
network = "Mainnet"
peerset_initial_target_size = 25

[rpc]
listen_addr = "127.0.0.1:8232"
cookie_dir = "/home/your_username/.cache/zebra"
enable_cookie_auth = false

[state]
cache_dir = "/home/your_username/.cache/zebra" # (Change to store in external SSD)
delete_old_database = true
ephemeral = false

[sync]
checkpoint_verify_concurrency_limit = 1000
download_concurrency_limit = 50
full_verify_concurrency_limit = 20

[tracing]
buffer_limit = 128000
use_color = true`}
          />
        </SectionCard>

        <div
          className="grid gap-5"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          }}
        >
          <SectionCard title="Starting zebrad">
            <SubLabel>Command Line</SubLabel>
            <CodeBlock
              code={`zebrad start\n# Or with specific config\nzebrad -c ~/.config/zebrad.toml start`}
            />
          </SectionCard>

          <SectionCard title="Important Notes">
            <ul className="flex flex-col gap-[10px] list-none p-0 m-0">
              {[
                "First run downloads the entire blockchain (~250 GB)",
                "Initial sync can take several hours",
                "Keep your zebrad.toml secure and private",
              ].map((note, i) => (
                <li
                  key={i}
                  className="flex gap-[10px] text-[13.5px] text-slate-500 dark:text-slate-400 leading-relaxed"
                >
                  <span className="text-amber-500 shrink-0 mt-[2px]">⚠</span>
                  {note}
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      </section>

      <Divider />

      {/* Step 3 — lightwalletd */}
      <section id="connecting-lightwalletd">
        <div className="flex items-center gap-[14px] mb-7">
          <StepBadge number={3} />
          <h2 className="text-slate-900 dark:text-slate-100 text-[22px] font-bold m-0">
            Connecting with lightwalletd
          </h2>
        </div>

        <InfoBox>
          <strong className="text-indigo-400 dark:text-indigo-300">
            lightwalletd
          </strong>{" "}
          is a server that provides a lightweight interface to the Zcash
          blockchain, designed for mobile and desktop wallets that don't need to
          run a full node.
        </InfoBox>

        <div
          className="grid gap-5"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          }}
        >
          <SectionCard title="Installation">
            <SubLabel>Prerequisites</SubLabel>
            <CodeBlock
              code={`# Install Go
sudo apt install golang-go
# Or download from golang.org`}
            />
            <SubLabel className="mt-[14px]">Build lightwalletd</SubLabel>
            <CodeBlock
              code={`git clone https://github.com/zcash/lightwalletd.git\ncd lightwalletd\ngo build\nmake\nmake install\nexport PATH=$PATH:~/go/bin`}
            />
          </SectionCard>

          <SectionCard title="Configuration">
            <SubLabel>Basic Setup</SubLabel>
            <CodeBlock
              code={`cat > ~/.config/zcash.conf << EOF
zebrad-rpcuser=your_rpc_username
zebrad-rpcpass=your_rpc_password
zebrad-rpcbind=127.0.0.1
zebrad-rpcport=8232
grpc-bind-addr=127.0.0.1:9067
log-file=lightwalletd.log
EOF`}
            />
            <SubLabel className="mt-[14px]">Run</SubLabel>
            <CodeBlock
              code={`lightwalletd --zcash-conf-path ~/.config/zcash.conf --data-dir ~/data/zebrad/.cache/lightwalletd --log-file ~/.local/state/lwd.log --no-tls-very-insecure`}
            />
          </SectionCard>
        </div>
      </section>

      <ResourcesSection />
    </div>
  );
};

const ZainodTab = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
    <section id="installing-zaino">
      <div className="flex items-center gap-[14px] mb-7">
        <StepBadge number={1} />
        <h2 className="text-slate-900 dark:text-slate-100 text-[22px] font-bold m-0">
          Installing Zaino
        </h2>
      </div>

      <InfoBox>
        <strong className="text-indigo-400 dark:text-indigo-300">Zaino</strong>{" "}
        is a Rust-based indexer for the Zcash blockchain. It serves both light
        clients (wallets that don't store the full history) and full clients /
        block explorers, providing access to finalized chain, the non-finalized
        best chain, and the mempool.
      </InfoBox>

      <div
        className="grid gap-5"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
      >
        <SectionCard title="Installation">
          <SubLabel>Build Zaino</SubLabel>
          <CodeBlock
            code={`git clone https://github.com/zingolabs/zaino.git\ncd zaino\ncargo build --release\nPATH=$PATH:~/zaino/target/release/`}
          />
          <SubLabel className="mt-[14px]">Configure</SubLabel>
          <CodeBlock
            code={`cd ~/zaino/zainod\nsudo nano zindexer.toml\n# Adjust port to 8232 for mainnet`}
          />
        </SectionCard>

        <SectionCard title="Configuration">
          <SubLabel>zindexer.toml</SubLabel>
          <CodeBlock
            language="toml"
            code={`# TcpIngestor status
tcp_active = true

# Listen port
listen_port = 8137

# LightWalletD listen port [DEPRECATED]
lightwalletd_port = 9067

# Full node / validator listen port
zebrad_port = 8232

# Optional credentials
node_user = "xxxxxx"
node_password = "xxxxxx"

# Worker pool settings
max_queue_size = 1024
max_worker_pool_size = 64
idle_worker_pool_size = 4`}
          />
          <SubLabel className="mt-[14px]">Run zainod</SubLabel>
          <CodeBlock code={`zainod --config zindexer.toml`} />
        </SectionCard>
      </div>
    </section>

    <ResourcesSection />
  </div>
);

const ZingolibTab = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
    <section id="installing-zingo">
      <div className="flex items-center gap-[14px] mb-7">
        <StepBadge number={1} />
        <h2 className="text-slate-900 dark:text-slate-100 text-[22px] font-bold m-0">
          Installing Zingo CLI
        </h2>
      </div>

      <InfoBox>
        <strong className="text-indigo-400 dark:text-indigo-300">
          Zingo-cli
        </strong>{" "}
        is a command-line lightwalletd-proxy client built in Rust. Releases are
        currently provisional — this guide covers compiling from source.
      </InfoBox>

      <div
        className="grid gap-5"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
      >
        <SectionCard title="Installation">
          <SubLabel>Build Zingo CLI</SubLabel>
          <CodeBlock
            code={`git clone https://github.com/zingolabs/zingolib.git\ncd zingolib\ncargo build --release --package zingo-cli`}
          />
        </SectionCard>

        <SectionCard title="Running">
          <SubLabel>Start Zingo CLI</SubLabel>
          <CodeBlock
            code={`cd ~/zingolib/target\n./zingo-cli \\\n  --server http://127.0.0.1:8137 \\\n  --data-dir /path/to/your/zaino/data`}
          />
          <div className="mt-[14px] p-[12px_14px] rounded-lg text-[13px] leading-relaxed bg-amber-500/[0.06] border border-amber-500/20 text-amber-600 dark:text-amber-400">
            ⚠ This will perform a full sync on first run, similar to
            lightwalletd.
          </div>
        </SectionCard>
      </div>
    </section>

    <ResourcesSection />
  </div>
);

const ResourcesSection = () => (
  <section className="rounded-[14px] p-8 mt-2 bg-sky-500/[0.03] dark:bg-sky-500/[0.05] border border-sky-500/15">
    <h3 className="text-slate-900 dark:text-slate-100 text-[18px] font-bold mb-6">
      Next Steps &amp; Resources
    </h3>
    <div
      className="grid gap-6"
      style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}
    >
      <div>
        <p className="text-[11px] tracking-[0.12em] uppercase text-cyan-500 dark:text-cyan-400 mb-3 font-semibold">
          Ready to Build?
        </p>
        <div className="flex flex-col gap-2">
          <ResourceLink href="https://zebra.zfnd.org/index.html">
            Official Documentation
          </ResourceLink>
          <ResourceLink href="https://discord.gg/zcash">
            Zcash Discord Community
          </ResourceLink>
          <ResourceLink href="https://github.com/zcash">
            GitHub Repositories
          </ResourceLink>
          <ResourceLink href="https://zips.z.cash/">
            Zcash Improvement Proposals
          </ResourceLink>
        </div>
      </div>
      <div>
        <p className="text-[11px] tracking-[0.12em] uppercase text-cyan-500 dark:text-cyan-400 mb-3 font-semibold">
          Need Help?
        </p>
        <div className="flex flex-col gap-2">
          <ResourceLink href="https://forum.zcashcommunity.com/">
            Zcash Community Forum
          </ResourceLink>
          <ResourceLink href="https://github.com/zcash/zcash/issues">
            GitHub Issues
          </ResourceLink>
          <ResourceLink href="https://zcash.readthedocs.io/en/latest/rtd_pages/troubleshooting.html">
            Troubleshooting Guide
          </ResourceLink>
          <ResourceLink href="https://stackoverflow.com/questions/tagged/zcash">
            Stack Overflow
          </ResourceLink>
        </div>
      </div>
    </div>
  </section>
);

// ── Main Page ────────────────────────────────────────────────────────────────

const TABS = ["Zebrad", "Zaino", "Zingolib"] as const;
type Tab = (typeof TABS)[number];

export default function QuickStartPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Zebrad");

  const tabContent: Record<Tab, ReactNode> = {
    Zebrad: <ZebradTab />,
    Zaino: <ZainodTab />,
    Zingolib: <ZingolibTab />,
  };

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0a0e17; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 3px; }
      `}</style>

      <div className="min-h-screen bg-white dark:bg-[#030712] text-slate-800 dark:text-slate-200">
        {/* Hero */}
        <div
          className="relative overflow-hidden px-10 pt-20 pb-[72px] text-center
            bg-gradient-to-b from-slate-50 to-white
            dark:from-[#050d1a] dark:to-[#030712]"
        >
          {/* Grid overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(14,165,233,0.06) 1px, transparent 1px),
                linear-gradient(90deg, rgba(14,165,233,0.06) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
              maskImage:
                "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
            }}
          />

          {/* Glow */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: "30%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "600px",
              height: "300px",
              background:
                "radial-gradient(ellipse, rgba(14,165,233,0.10) 0%, transparent 70%)",
            }}
          />

          <div style={{ position: "relative" }}>
            <div
              className="inline-flex items-center gap-2 px-4 py-[6px] mb-7 rounded-full text-[12px] tracking-[0.12em] uppercase font-[500]
                bg-sky-500/10 border border-sky-500/25 text-sky-600 dark:text-sky-400"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#22c55e",
                  display: "inline-block",
                  boxShadow: "0 0 6px #22c55e",
                }}
              />
              Developer Quick Start
            </div>

            <h1
              className="text-[clamp(36px,6vw,72px)] font-extrabold leading-[1.05] tracking-tight m-0 mb-5
                bg-gradient-to-br from-slate-900 to-slate-600
                dark:from-slate-100 dark:to-slate-400
                bg-clip-text text-transparent"
              style={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Zcash Dev
              <br />
              Quick Start
            </h1>

            <p className="text-[17px] text-slate-600 dark:text-slate-500 max-w-[480px] mx-auto leading-[1.7]">
              Get up and running with Zcash development. Choose your stack and
              follow the guide.
            </p>
          </div>
        </div>

        {/* Tab bar */}
        <div className="sticky top-0 z-10 bg-white/90 dark:bg-[#030712]/90 backdrop-blur-[12px] border-b border-black/[0.06] dark:border-white/[0.06] px-10">
          <div className="max-w-[1024px] mx-auto flex gap-1">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 bg-transparent border-0 border-b-2 cursor-pointer transition-all duration-200 text-sm font-[inherit]
                  ${
                    activeTab === tab
                      ? "border-b-sky-500 text-slate-900 dark:text-slate-100 font-bold"
                      : "border-b-transparent text-slate-400 dark:text-slate-500 font-normal hover:text-slate-600 dark:hover:text-slate-300"
                  }`}
                style={{ letterSpacing: "0.02em" }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <main className="max-w-[1024px] mx-auto px-10 pt-12 pb-20">
          {tabContent[activeTab]}
        </main>
      </div>
    </>
  );
}

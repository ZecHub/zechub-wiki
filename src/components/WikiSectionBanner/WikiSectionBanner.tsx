import type { CSSProperties, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import type { LiveHeroId } from "@/lib/liveHero";
import "./wiki-section-banner.css";

type Copy = {
  title: string;
  sub: string;
  titleSize?: "md";
};

const COPY: Record<LiveHeroId, Copy> = {
  "start-here": {
    title: "Start Here",
    sub: "Begin your Zcash learning journey",
  },
  "using-zcash": {
    title: "Using Zcash",
    sub: "Wallets · Exchanges · Payments",
  },
  guides: {
    title: "Guides",
    sub: "Structured documentation for understanding Zcash protocols",
  },
  "zcash-tech": {
    title: "Zcash Tech",
    sub: "Inside the Technology Powering Zcash",
  },
  organizations: {
    title: "Organizations",
    sub: "Structure · Governance · Contributors",
  },
  ecosystem: {
    title: "Ecosystem",
    sub: "Community · Media · Governance",
  },
  zfav: {
    title: "ZF AV",
    sub: "Zcash Foundation AV Club",
  },
  "privacy-tools": {
    title: "Privacy Tools",
    sub: "Practical privacy solutions",
    titleSize: "md",
  },
  research: {
    title: "Research",
    sub: "Exploring Zero-Knowledge · Privacy · Cryptography",
  },
  glossary: {
    title: "Glossary & FAQs",
    sub: "Definitions, answers, clarity.",
    titleSize: "md",
  },
  contribute: {
    title: "Contribute",
    sub: "Write · Translate · Design · Develop",
  },
  tutorials: {
    title: "Tutorials",
    sub: "Watch and follow along",
  },
};

type OrbitItem = {
  id: string;
  href: string;
  label: string;
  angle: string;
  dur: string;
  delay: string;
  hub?: boolean;
  fill?: boolean;
  invert?: boolean;
  src?: string;
  bg?: string;
  className?: string;
  icon?: ReactNode;
};

const ORG_LOGOS: OrbitItem[] = [
  {
    id: "zcash",
    href: "/start-here/what-is-zec-and-zcash",
    label: "Zcash",
    src: "/org-banner/zcash-brandmark-yellow.svg",
    className: "wiki-hero__logo--hub",
    dur: "4.7s",
    delay: "-0.8s",
    angle: "0deg",
    hub: true,
    fill: true,
  },
  {
    id: "zkav",
    href: "/zcash-organizations/zkav",
    label: "ZKAV Club",
    src: "/community-projects/zkav.png",
    dur: "4.9s",
    delay: "-1.9s",
    angle: "-78deg",
    fill: true,
  },
  {
    id: "shielded-labs",
    href: "/zcash-organizations/shielded-labs",
    label: "Shielded Labs",
    src: "/content-images/Shielded-labs-shield-white-2-27aef199ae.webp",
    className: "wiki-hero__logo--shield",
    dur: "5.1s",
    delay: "-1.4s",
    angle: "-28deg",
  },
  {
    id: "zodl",
    href: "/zcash-organizations/ZODL",
    label: "ZODL",
    src: "/community-projects/zodl.png",
    invert: true,
    dur: "4.1s",
    delay: "0s",
    angle: "22deg",
  },
  {
    id: "zingolabs",
    href: "/zcash-organizations/zingo-labs",
    label: "Zingo Labs",
    src: "/org-banner/zingolabs.jpg",
    dur: "4.4s",
    delay: "-0.4s",
    angle: "78deg",
    fill: true,
  },
  {
    id: "fpf",
    href: "/zcash-organizations/financial-privacy-foundation",
    label: "Financial Privacy Foundation",
    src: "/org-banner/fpf.png",
    dur: "4.8s",
    delay: "-1.1s",
    angle: "128deg",
    fill: true,
    bg: "#fff",
  },
  {
    id: "ecc",
    href: "/zcash-organizations/electric-coin-company",
    label: "Electric Coin Company",
    src: "/org-banner/ecc-red.svg",
    className: "wiki-hero__logo--ecc",
    dur: "5.3s",
    delay: "-0.2s",
    angle: "178deg",
    fill: true,
  },
  {
    id: "valar",
    href: "/zcash-organizations/valar-group",
    label: "Valar Group",
    src: "/org-banner/valar.jpg",
    dur: "4.6s",
    delay: "-2.2s",
    angle: "-138deg",
    fill: true,
  },
];

function IconPin() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="10" r="2.2" fill="currentColor" />
    </svg>
  );
}

function IconBook() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 5.5A2.5 2.5 0 0 1 6.5 3H12v16.5H6.5A2.5 2.5 0 0 0 4 22V5.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M20 5.5A2.5 2.5 0 0 0 17.5 3H12v16.5h5.5A2.5 2.5 0 0 1 20 22V5.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function IconFlag() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 3v18" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M6 4.5h11l-2.2 3.4L17 11.5H6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconShield() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3 5 6.2v6.1c0 4 2.8 6.9 7 8.7 4.2-1.8 7-4.7 7-8.7V6.2L12 3Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function IconLock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="6" y="11" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8.5 11V8.2a3.5 3.5 0 0 1 7 0V11" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function IconKey() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="8" cy="14" r="3.2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M11 14h9l-1.6 1.7 1.6 1.6" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function IconFolder() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 8.5h6l1.5 1.8H20V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function IconChat() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 6.5h14v9H9l-4 3v-3H5v-9Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconTerminal() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="5.5" width="16" height="13" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M7.5 10 10 12.2 7.5 14.5M12.5 14.5H16" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4 12h16M12 4c2.4 2.4 3.6 5.2 3.6 8s-1.2 5.6-3.6 8c-2.4-2.4-3.6-5.2-3.6-8s1.2-5.6 3.6-8Z" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function IconCode() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m8 8-4 4 4 4M16 8l4 4-4 4M13 6l-2 12" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function IconDoc() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 3.5h7l5 5V20a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 20V5A1.5 1.5 0 0 1 7 3.5Z" stroke="currentColor" strokeWidth="1.7" />
      <path d="M14 3.5V9h5.5M8.5 13h7M8.5 16.5h5" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function IconMegaphone() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 10v4h3l8 4V6L7 10H4Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M16.5 9.5v5M7 14l1.2 5h2.6" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function IconWallet() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="7" width="17" height="12" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3.5 10h17M16.5 14.2h2.2" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function IconSwap() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 8h11l-2.4-2.4M17 16H6l2.4 2.4" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="8" r="2.4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="16" cy="9" r="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4.5 18c.4-2.6 2.4-4 4.5-4s4.1 1.4 4.5 4M13 14.2c1.8 0 3.4 1 3.8 3.3" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function IconMic() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="9" y="4" width="6" height="10" rx="3" stroke="currentColor" strokeWidth="1.7" />
      <path d="M7 11.5a5 5 0 0 0 10 0M12 16.5V20" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function IconPlay() {
  return (
    <svg viewBox="0 0 88 88" aria-hidden="true">
      <circle cx="44" cy="44" r="30" fill="currentColor" opacity="0.18" />
      <circle cx="44" cy="44" r="22" stroke="currentColor" strokeWidth="2.4" fill="none" />
      <path d="M38 32.5v23L58 44 38 32.5Z" fill="currentColor" />
    </svg>
  );
}

function IconBoltShield() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path
        d="M32 6 12 14.5v16c0 12.4 8.2 21.4 20 27.5 11.8-6.1 20-15.1 20-27.5v-16L32 6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path d="M35 18 24 34h8l-3 14 13-18h-8l3-12Z" fill="currentColor" />
    </svg>
  );
}

function IconOpenBook() {
  return (
    <svg viewBox="0 0 88 88" aria-hidden="true">
      <path
        d="M10 22c10-6 18-6 34 0v46c-16-6-24-6-34 0V22Z"
        fill="currentColor"
        opacity="0.22"
      />
      <path
        d="M78 22c-10-6-18-6-34 0v46c16-6 24-6 34 0V22Z"
        fill="currentColor"
        opacity="0.38"
      />
      <path
        d="M44 22c-16-6-24-6-34 0v46c10-6 18-6 34 0 16-6 24-6 34 0V22C68 16 60 16 44 22Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
      />
      <path d="M44 22v46" stroke="currentColor" strokeWidth="2.4" />
    </svg>
  );
}

function IconResearch() {
  return (
    <svg viewBox="0 0 88 88" aria-hidden="true">
      <circle cx="38" cy="36" r="18" fill="currentColor" opacity="0.16" />
      <circle cx="38" cy="36" r="16" stroke="currentColor" strokeWidth="3.2" fill="none" />
      <rect x="30" y="28" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="2.2" fill="none" />
      <path d="M36 32h4M38 32v8M34 36h8" stroke="currentColor" strokeWidth="2" />
      <path d="m50 50 16 16" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <circle cx="66" cy="22" r="9" fill="currentColor" />
      <path d="M62.5 22.2 65.2 25l5.3-6" stroke="#152036" strokeWidth="2.1" fill="none" />
    </svg>
  );
}

function Orbit({ items }: { items: OrbitItem[] }) {
  return (
    <ul className="wiki-hero__orbit">
      <li className="wiki-hero__rings" aria-hidden="true">
        <span className="wiki-hero__ring wiki-hero__ring--inner" />
        <span className="wiki-hero__ring wiki-hero__ring--outer" />
      </li>
      {items.map((item) => (
        <li
          key={item.id}
          className={[
            "wiki-hero__logo",
            item.hub ? "wiki-hero__logo--hub" : "",
            item.fill ? "wiki-hero__logo--fill" : "",
            item.invert ? "wiki-hero__logo--invert" : "",
            item.icon && !item.src ? "wiki-hero__logo--chip" : "",
            item.className ?? "",
          ]
            .filter(Boolean)
            .join(" ")}
          style={
            {
              "--wiki-dur": item.dur,
              "--wiki-delay": item.delay,
              "--a": item.angle,
              ...(item.hub ? { "--r": "0px" } : {}),
              ...(item.bg ? { background: item.bg } : {}),
            } as CSSProperties
          }
        >
          <Link
            href={item.href}
            aria-label={item.label}
            title={item.label}
            className="wiki-hero__bob"
          >
            {item.src ? (
              <img src={item.src} alt="" width={64} height={64} />
            ) : (
              item.icon
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function StartHereArt() {
  return (
    <div className="wiki-hero__path">
      <svg className="wiki-hero__path-line" viewBox="0 0 264 184" aria-hidden="true">
        <path
          d="M42 128 C 88 128, 112 84, 152 72 S 214 28, 236 28"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          className="wiki-hero__flow-line"
        />
      </svg>
      <Link href="/start-here/new-user-guide" className="wiki-hero__node wiki-hero__node--start wiki-hero__bob" style={{ "--wiki-dur": "4.2s" } as CSSProperties} aria-label="Start">
        <span className="wiki-hero__node-mark">START</span>
      </Link>
      <Link href="/start-here/what-is-zec-and-zcash" className="wiki-hero__node wiki-hero__node--learn wiki-hero__bob" style={{ "--wiki-dur": "4.8s", "--wiki-delay": "-1s" } as CSSProperties} aria-label="Learn">
        <span className="wiki-hero__node-mark"><IconBook /></span>
        <span>Learn</span>
      </Link>
      <Link href="/contribute/help-build-zechub" className="wiki-hero__node wiki-hero__node--build wiki-hero__bob" style={{ "--wiki-dur": "5.1s", "--wiki-delay": "-1.8s" } as CSSProperties} aria-label="Build">
        <span className="wiki-hero__node-mark"><IconFlag /></span>
        <span>Build</span>
      </Link>
    </div>
  );
}

function TechArt() {
  return (
    <div className="wiki-hero__flow" aria-hidden="true">
      <svg viewBox="0 0 420 170">
        <text className="wiki-hero__flow-label" x="18" y="18">INPUT</text>
        <circle cx="28" cy="46" r="5" fill="currentColor" />
        <circle cx="28" cy="72" r="5" fill="currentColor" />
        <circle cx="28" cy="98" r="5" fill="currentColor" />
        <path className="wiki-hero__flow-line" d="M36 46 H92 V72 H150" />
        <path className="wiki-hero__flow-line" d="M36 72 H150" />
        <path className="wiki-hero__flow-line" d="M36 98 H92 V72 H150" />
        <rect x="150" y="42" width="92" height="58" rx="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M162 86 H196 V54 H228" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <text className="wiki-hero__flow-label" x="158" y="114">PROOF GENERATION</text>
        <path className="wiki-hero__flow-line" d="M242 70 H272" />
        <path d="M272 70 L302 46 L332 70 L302 94 Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M294 70 l6 6 12-14" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <text className="wiki-hero__flow-label" x="276" y="114">VERIFY</text>
        <path className="wiki-hero__flow-line" d="M332 70 H360 V46 H394" />
        <path className="wiki-hero__flow-line" d="M332 70 H360 V98 H394" />
        <circle cx="400" cy="46" r="5" fill="currentColor" />
        <circle cx="400" cy="98" r="5" fill="currentColor" />
        <text className="wiki-hero__flow-label" x="348" y="18">OUTPUT</text>
        <line x1="18" y1="148" x2="402" y2="148" stroke="currentColor" strokeWidth="1" opacity="0.35" />
        <text className="wiki-hero__flow-label" x="150" y="164">TOTAL TRANSACTION FLOW</text>
      </svg>
    </div>
  );
}

function renderArt(id: LiveHeroId) {
  switch (id) {
    case "start-here":
      return <StartHereArt />;
    case "guides":
      return (
        <div className="wiki-hero__book wiki-hero__bob" style={{ "--wiki-dur": "5.2s" } as CSSProperties}>
          <IconOpenBook />
        </div>
      );
    case "zcash-tech":
      return <TechArt />;
    case "organizations":
      return <Orbit items={ORG_LOGOS} />;
    case "privacy-tools":
      return (
        <Orbit
          items={[
            {
              id: "shield",
              href: "/privacy-tools",
              label: "Privacy Tools",
              angle: "0deg",
              hub: true,
              dur: "4.6s",
              delay: "0s",
              icon: <IconShield />,
              bg: "#101820",
            },
            {
              id: "terminal",
              href: "/privacy-tools/pgp-encryption",
              label: "PGP Encryption",
              angle: "-140deg",
              dur: "4.2s",
              delay: "-0.6s",
              icon: <IconTerminal />,
            },
            {
              id: "folder",
              href: "/privacy-tools/grapheneos",
              label: "GrapheneOS",
              angle: "-40deg",
              dur: "4.9s",
              delay: "-1.2s",
              icon: <IconFolder />,
            },
            {
              id: "chat",
              href: "/privacy-tools/2fa-hardware-devices",
              label: "2FA Hardware Devices",
              angle: "40deg",
              dur: "5.1s",
              delay: "-1.8s",
              icon: <IconChat />,
            },
            {
              id: "key",
              href: "/privacy-tools/pgp-encryption",
              label: "Keys",
              angle: "110deg",
              dur: "4.4s",
              delay: "-0.3s",
              icon: <IconKey />,
            },
            {
              id: "lock",
              href: "/privacy-tools",
              label: "Lockdown",
              angle: "188deg",
              dur: "5.3s",
              delay: "-2s",
              icon: <IconLock />,
            },
          ]}
        />
      );
    case "research":
      return (
        <div className="wiki-hero__mag wiki-hero__bob" style={{ "--wiki-dur": "5s" } as CSSProperties}>
          <IconResearch />
        </div>
      );
    case "glossary":
      return (
        <div className="wiki-hero__faq">
          <div className="wiki-hero__card wiki-hero__card--back wiki-hero__bob" style={{ "--wiki-dur": "4.8s" } as CSSProperties}>
            <span className="wiki-hero__card-line" />
            <span className="wiki-hero__card-line" />
          </div>
          <div className="wiki-hero__card wiki-hero__card--front wiki-hero__bob" style={{ "--wiki-dur": "5.2s", "--wiki-delay": "-1.2s" } as CSSProperties}>
            <span className="wiki-hero__card-line" />
            <span className="wiki-hero__card-line" />
          </div>
          <div className="wiki-hero__pill wiki-hero__pill--term wiki-hero__bob" style={{ "--wiki-dur": "4.3s", "--wiki-delay": "-0.4s" } as CSSProperties}>
            Term: Transparent
          </div>
          <div className="wiki-hero__pill wiki-hero__pill--ok wiki-hero__bob" style={{ "--wiki-dur": "4.7s", "--wiki-delay": "-1.6s" } as CSSProperties}>
            <span className="wiki-hero__dot" />
            Verified
          </div>
        </div>
      );
    case "contribute":
      return (
        <Orbit
          items={[
            {
              id: "hub",
              href: "/",
              label: "ZecHub",
              src: "/org-banner/zechub-white.svg",
              angle: "0deg",
              hub: true,
              fill: true,
              dur: "4.6s",
              delay: "0s",
              className: "wiki-hero__logo--globe",
            },
            {
              id: "write",
              href: "/contribute/help-build-zechub",
              label: "Write",
              angle: "-90deg",
              dur: "4.2s",
              delay: "-0.5s",
              icon: <IconMegaphone />,
            },
            {
              id: "translate",
              href: "/contribute/help-build-zechub",
              label: "Translate",
              angle: "180deg",
              dur: "4.8s",
              delay: "-1.1s",
              icon: <IconGlobe />,
            },
            {
              id: "design",
              href: "/contribute/style-guide",
              label: "Design",
              angle: "0deg",
              dur: "5s",
              delay: "-1.7s",
              icon: <IconDoc />,
            },
            {
              id: "develop",
              href: "/contribute/help-build-zechub",
              label: "Develop",
              angle: "90deg",
              dur: "4.4s",
              delay: "-0.2s",
              icon: <IconCode />,
            },
          ]}
        />
      );
    case "using-zcash":
      return (
        <Orbit
          items={[
            {
              id: "zec",
              href: "/using-zcash/buying-zec",
              label: "Zcash",
              src: "/org-banner/zcash-brandmark-yellow.svg",
              angle: "0deg",
              hub: true,
              fill: true,
              dur: "4.7s",
              delay: "0s",
            },
            {
              id: "wallets",
              href: "/wallets",
              label: "Wallets",
              angle: "-90deg",
              dur: "4.2s",
              delay: "-0.6s",
              icon: <IconWallet />,
            },
            {
              id: "exchanges",
              href: "/using-zcash/buying-zec",
              label: "Exchanges",
              angle: "0deg",
              dur: "4.9s",
              delay: "-1.3s",
              icon: <IconSwap />,
            },
            {
              id: "pools",
              href: "/using-zcash/shielded-pools",
              label: "Shielded pools",
              angle: "90deg",
              dur: "5.1s",
              delay: "-1.9s",
              icon: <IconShield />,
            },
            {
              id: "map",
              href: "/map",
              label: "Map",
              angle: "180deg",
              dur: "4.4s",
              delay: "-0.4s",
              icon: <IconPin />,
            },
          ]}
        />
      );
    case "ecosystem":
      return (
        <Orbit
          items={[
            {
              id: "z",
              href: "/zcash-community/zcash-governance",
              label: "Zcash Community",
              src: "/org-banner/zcash-secondary-yellow.svg",
              angle: "0deg",
              hub: true,
              fill: true,
              dur: "4.8s",
              delay: "0s",
            },
            {
              id: "people",
              href: "/zcash-community/community-projects",
              label: "Community projects",
              angle: "-90deg",
              dur: "4.2s",
              delay: "-0.7s",
              icon: <IconUsers />,
            },
            {
              id: "forum",
              href: "/zcash-community/community-links",
              label: "Community links",
              angle: "0deg",
              dur: "4.9s",
              delay: "-1.4s",
              icon: <IconChat />,
            },
            {
              id: "media",
              href: "/zcash-community/zcash-podcasts",
              label: "Podcasts",
              angle: "90deg",
              dur: "5s",
              delay: "-0.3s",
              icon: <IconMic />,
            },
            {
              id: "world",
              href: "/zcash-global-ambassadors",
              label: "Global ambassadors",
              angle: "180deg",
              dur: "4.5s",
              delay: "-1.8s",
              icon: <IconGlobe />,
            },
          ]}
        />
      );
    case "zfav":
      return (
        <div className="wiki-hero__zfav">
          <span className="wiki-hero__zfav-arc" aria-hidden="true" />
          <div className="wiki-hero__zfav-mark wiki-hero__bob" style={{ "--wiki-dur": "5s" } as CSSProperties}>
            <IconBoltShield />
          </div>
        </div>
      );
    case "tutorials":
      return (
        <div className="wiki-hero__play wiki-hero__bob" style={{ "--wiki-dur": "4.8s" } as CSSProperties}>
          <IconPlay />
        </div>
      );
    default:
      return null;
  }
}

export default function WikiSectionBanner({ id }: { id: LiveHeroId }) {
  const copy = COPY[id];

  return (
    <section
      className={`wiki-hero wiki-hero--${id}`}
      aria-label={copy.title}
    >
      <div className="wiki-hero__copy">
        <p className="wiki-hero__kicker">ZecHub</p>
        <div className="wiki-hero__title-row">
          <p
            className={
              copy.titleSize === "md"
                ? "wiki-hero__title wiki-hero__title--md"
                : "wiki-hero__title"
            }
          >
            {copy.title}
          </p>
          <span className="wiki-hero__bar" aria-hidden="true" />
        </div>
        <div className="wiki-hero__dashes" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        <p className="wiki-hero__sub">{copy.sub}</p>
      </div>
      <div className="wiki-hero__art">{renderArt(id)}</div>
    </section>
  );
}

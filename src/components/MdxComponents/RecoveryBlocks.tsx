import JumpNav from "./JumpNav";

const ROUTES = [
  { label: "Restore with Zkool", hint: "Seed phrase or private key", href: "#fund-recovery-with-zkool" },
  { label: "Recover with Argos", hint: "ZecWallet Lite, wallet.dat, Sprout", href: "#zecwallet-lite-and-legacy-wallet-recovery-with-argos" },
  { label: "No seed or key?", hint: "Professional recovery", href: "#professional-recovery-when-you-do-not-have-the-seed" },
];

// "Jump to your situation" index shown under the introduction.
export function RecoveryNav() {
  return <JumpNav title="Jump to your situation" items={JSON.stringify(ROUTES)} />;
}

// Amber safety callout: icon, title and short text.
// Summaries, tips and status notes read as information (blue); everything else stays a warning (amber).
const INFO_TITLE = /^(tl;dr|progress|what you.ll learn|note|tip|new to zcash\??|keep in mind|good to know|recommended)$/i;

export function GuideCallout({ children, ...props }: Record<string, unknown> & { children?: React.ReactNode }) {
  const title = String(props.title ?? "");
  const info = INFO_TITLE.test(title.trim());
  return (
    <aside
      role="note"
      className={`not-prose my-8 border-l-2 py-1 pl-5 ${info ? "border-brand" : "border-amber-500 dark:border-amber-400"}`}
    >
      <p
        className={`m-0 text-xs font-semibold uppercase tracking-[0.12em] ${
          info ? "text-brand dark:text-brand-soft" : "text-amber-700 dark:text-amber-400"
        }`}
      >
        {title}
      </p>
      <div className="mt-1.5 text-[0.95rem] leading-relaxed text-slate-700 dark:text-slate-300">{children}</div>
    </aside>
  );
}

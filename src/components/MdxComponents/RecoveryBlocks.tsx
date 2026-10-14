import { ArrowDown, ShieldAlert } from "lucide-react";

const ROUTES = [
  { label: "Restore with Zkool", hint: "Seed phrase or private key", href: "#fund-recovery-with-zkool" },
  { label: "Recover with Argos", hint: "ZecWallet Lite, wallet.dat, Sprout", href: "#zecwallet-lite-and-legacy-wallet-recovery-with-argos" },
  { label: "No seed or key?", hint: "Professional recovery", href: "#professional-recovery-when-you-do-not-have-the-seed" },
];

// "Jump to your situation" buttons shown under the introduction.
export function RecoveryNav() {
  return (
    <nav aria-label="Recovery routes" className="not-prose my-8">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
        Jump to your situation
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        {ROUTES.map((r) => (
          <a
            key={r.href}
            href={r.href}
            className="group flex items-center justify-between gap-3 rounded-xl border border-brand/40 px-4 py-3 text-left no-underline transition-colors hover:border-brand hover:bg-brand/10"
          >
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-brand dark:text-brand-soft">{r.label}</span>
              <span className="block text-xs text-slate-600 dark:text-slate-400">{r.hint}</span>
            </span>
            <ArrowDown aria-hidden="true" className="h-4 w-4 shrink-0 text-brand dark:text-brand-soft" />
          </a>
        ))}
      </div>
    </nav>
  );
}

// Amber safety callout: icon, title and short text.
export function GuideCallout({ children, ...props }: Record<string, unknown> & { children?: React.ReactNode }) {
  return (
    <aside
      role="note"
      className="not-prose my-8 flex gap-4 rounded-xl border border-amber-500/40 bg-amber-500/5 p-5 dark:bg-amber-400/10"
    >
      <ShieldAlert aria-hidden="true" className="mt-0.5 h-6 w-6 shrink-0 text-amber-600 dark:text-amber-400" />
      <div className="min-w-0">
        <p className="m-0 text-base font-semibold text-slate-900 dark:text-white">{String(props.title ?? "")}</p>
        <div className="mt-1 text-[0.95rem] leading-relaxed text-slate-700 dark:text-slate-300">{children}</div>
      </div>
    </aside>
  );
}

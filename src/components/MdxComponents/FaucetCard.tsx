import { ArrowUpRight } from "lucide-react";

const NOTES: Record<string, string> = {
  mainnet: "Sends real ZEC on the main network.",
  testnet: "Free test coins for developers and testing.",
};

// Grid wrapper for a group of faucet cards.
export function FaucetList({ children }: { children?: React.ReactNode }) {
  return <div className="not-prose my-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

// One faucet entry: network label, site, short note and an outlined button.
export default function FaucetCard(props: Record<string, unknown>) {
  const network = String(props.network ?? "");
  const href = String(props.href ?? "");
  let host = String(props.name ?? "");
  try {
    host = new URL(href).hostname.replace(/^www\./, "");
  } catch {}
  const isMainnet = /^main/i.test(network);
  return (
    <div className="flex h-full flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-5 dark:border-white/10 dark:bg-white/[0.03]">
      <span
        className={`w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold ${
          isMainnet
            ? "bg-brand/15 text-brand dark:text-brand-soft"
            : "bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-300"
        }`}
      >
        {network}
      </span>
      <div className="min-w-0">
        <h3 className="m-0 break-words text-lg font-semibold text-slate-900 dark:text-white">{host}</h3>
        <p className="m-0 mt-1 text-sm text-slate-600 dark:text-slate-400">{NOTES[network.toLowerCase()] ?? ""}</p>
      </div>
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-brand/50 px-4 py-2 text-sm font-semibold text-brand no-underline transition-colors hover:border-brand hover:bg-brand/10 dark:text-brand-soft dark:hover:text-white"
        >
          Visit website
          <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}

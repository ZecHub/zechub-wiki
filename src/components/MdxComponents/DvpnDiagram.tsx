// Simple multi-hop path for a decentralized VPN: device -> entry -> relay -> exit -> internet.
// Laid out as a row on wide screens and a column on phones, so the labels stay readable.
const STEPS = [
  { title: "Your device", note: "Encrypts traffic before it leaves" },
  { title: "Entry node", note: "Knows you, not where you are going" },
  { title: "Relay node", note: "Knows neither end" },
  { title: "Exit node", note: "Knows the destination, not you" },
  { title: "Internet", note: "Sees the exit node, not your device" },
];

export default function DvpnDiagram() {
  return (
    <figure className="not-prose my-6">
      <ol className="m-0 flex list-none flex-col items-stretch gap-2 p-0 imd:flex-row imd:items-stretch imd:gap-1">
        {STEPS.map((s, i) => (
          <li key={s.title} className="m-0 flex flex-col items-stretch imd:flex-1 imd:flex-row imd:items-center">
            <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-center dark:border-white/10 dark:bg-white/[0.03]">
              <div className="font-mono text-sm font-semibold text-slate-900 dark:text-white">{s.title}</div>
              <div className="mt-1 text-xs leading-snug text-slate-600 dark:text-slate-300">{s.note}</div>
            </div>
            {i < STEPS.length - 1 ? (
              <span aria-hidden="true" className="select-none py-1 text-center text-brand imd:px-1 imd:py-0 dark:text-brand-soft">
                <span className="imd:hidden">↓</span>
                <span className="hidden imd:inline">→</span>
              </span>
            ) : null}
          </li>
        ))}
      </ol>
      <figcaption className="mt-2 text-center text-xs text-slate-600 dark:text-slate-400">
        In a decentralized VPN, traffic passes through several independent nodes, so no single node sees both who you are and where you are going.
      </figcaption>
    </figure>
  );
}

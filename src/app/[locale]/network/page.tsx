import { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { genMetadata, getBanner } from "@/lib/helpers";
import { buildAlternatesAllLocales } from "@/lib/localeCoverage";
import { routing } from "@/i18n/routing";
import { menuSections, navigations } from "@/constants/navigation";
import NetworkStats from "./NetworkStats";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const localePrefix =
    locale && locale !== routing.defaultLocale ? `/${locale}` : "";
  return genMetadata({
    title: "Zcash Network: Dashboards & Visualizers | ZecHub",
    description:
      "Live Zcash metrics, protocol parameters and interactive visualizers: everything the Network menu offers in one place.",
    url: `https://zechub.wiki${localePrefix}/network`,
    image: getBanner("tools") || "/content-banners/bannertech.jpg",
    locale,
    alternates: buildAlternatesAllLocales("/network", locale),
  });
}

// Short descriptions for each page in the Network menu. The groups and their
// order come from `menuSections.Data`, so the menu and this page stay in sync.
const DESCRIPTIONS: Record<string, string> = {
  "Ecosystem Dashboard":
    "Live ZEC metrics, shielded supply, governance, ZCG grants, YouTube and code activity.",
  "Protocol Parameters":
    "Protocol parameters and governance proposals with their current values.",
  "All Visualizers":
    "Interactive lessons and quizzes on Zcash technology and the ecosystem.",
  "Network & Infrastructure":
    "How nodes, wallets and network components work together.",
  "Value Pools":
    "Zcash privacy pools, address types and the Ironwood migration.",
  "zk-SNARK Proofs": "An interactive demonstration of shielded transactions.",
  Consensus: "How hundreds of nodes agree on the state of the chain.",
  "Hash Function": "What a hash function is and why Zcash relies on it.",
  "Zcash Keys": "Understanding Zcash keys.",
};

const SECTION_DESCRIPTIONS: Record<string, string> = {
  "Live data": "Real-time numbers and reference values for the network.",
  "Explore the network":
    "Interactive lessons on nodes, wallets and value pools.",
  Protocol: "How the network reaches agreement and proves transactions.",
  Cryptography: "The building blocks behind Zcash privacy.",
};

export default function NetworkPage() {
  const data = navigations.find((n) => n.name === "Data");
  const links = data?.links ?? [];
  const sections = (menuSections["Data"] ?? [])
    .map((s) => ({
      ...s,
      links: s.items
        .map((name) => links.find((l) => l.name === name))
        .filter((l): l is NonNullable<typeof l> => Boolean(l)),
    }))
    .filter((s) => s.links.length > 0);

  return (
    <div className="text-foreground">
      <header className="border-b border-slate-200 dark:border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-12 md:px-6 md:py-16">
          <p className="mb-4 font-mono text-sm font-semibold text-brand dark:text-brand-soft">
            &gt; Network
          </p>
          <h1 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
            Zcash Network
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Dashboards, protocol parameters and interactive visualizers to
            follow the network and understand how it works.
          </p>
          <NetworkStats />
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-14 px-5 py-12 md:px-6 md:py-16">
        {sections.map((section, n) => (
          <section key={section.title} id={section.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}>
            <div className="mb-6 flex items-baseline gap-4 border-b border-slate-200 pb-4 dark:border-white/10">
              <span className="font-mono text-sm font-semibold text-brand dark:text-brand-soft">
                {String(n + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="text-2xl font-bold sm:text-3xl">{section.title}</h2>
                {SECTION_DESCRIPTIONS[section.title] && (
                  <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                    {SECTION_DESCRIPTIONS[section.title]}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {section.links.map((link) => {
                const Icon = link.icon as unknown as
                  | React.ComponentType<{ className?: string }>
                  | undefined;
                return (
                  <Link
                    key={link.name}
                    href={link.path ?? "/"}
                    className="group flex h-full flex-col rounded-xl border border-slate-200 bg-slate-50/60 p-5 no-underline transition-colors hover:border-brand/40 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-brand/40"
                  >
                    <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-brand/30 bg-brand/10 text-brand dark:text-brand-soft">
                      {Icon && typeof Icon !== "string" ? (
                        <Icon className="h-5 w-5" />
                      ) : null}
                    </span>
                    <h3 className="mb-2 text-lg font-semibold text-foreground">
                      {link.name}
                    </h3>
                    <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                      {DESCRIPTIONS[link.name]}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand transition-all group-hover:gap-2.5 dark:text-brand-soft">
                      Open
                      <ArrowRight aria-hidden="true" className="h-4 w-4" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

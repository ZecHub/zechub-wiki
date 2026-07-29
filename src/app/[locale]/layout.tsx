import { DarkModeProvider } from "@/provider/DarkModeProvider";
import { LanguageProvider } from "@/context/LanguageContext";
import { getDictionary } from "@/lib/getDictionary";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavigationWrapper from "@/components/NavigationWrapper";
import { ThemeProvider } from "next-themes";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { socialNav } from "@/constants/navigation";
import { ORG_ID, jsonLdScript } from "@/lib/helpers";

const inter = Inter({ subsets: ["latin"] });

// Organization structured data (schema.org), emitted once site-wide. `sameAs`
// is sourced from the site's social navigation so it stays in sync with the
// links we actually render (Discord, YouTube, X/Twitter, GitHub).
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORG_ID,
  name: "ZecHub",
  url: "https://zechub.wiki",
  logo: "https://zechub.wiki/zechubLogo.png",
  sameAs: socialNav.map((s) => s.url),
};

// Locales that render right-to-left. Drives the <html dir> attribute so RTL
// languages (e.g. Arabic) lay out correctly.
const RTL_LOCALES = new Set<string>(["ar"]);

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = (await getDictionary(locale)) as Record<string, any>;
  const title = dict?.meta?.title ?? "ZecHub Wiki";
  const description =
    dict?.meta?.description ?? "An open source education hub for Zcash";
  return {
    title,
    description,
    icons: "/ZecHubBlue.png",
    alternates: {
      types: {
        "application/rss+xml": [
          {
            url: "https://zechub.wiki/rss.xml",
            title: "ZecHub Dashboard Updates",
          },
        ],
      },
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering for this locale.
  setRequestLocale(locale);

  // Preload the locale dictionary on the server so the UI chrome renders in the
  // correct language during SSR (no English flash before client hydration).
  const initialDictionary = await getDictionary(locale);

  return (
    <html lang={locale} dir={RTL_LOCALES.has(locale) ? "rtl" : "ltr"} suppressHydrationWarning>
      <head>
        {/* Manual RSS link as backup for better feed detection (Brave, Feedly, etc.) */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="ZecHub Dashboard Updates"
          href="https://zechub.wiki/rss.xml"
        />
        {/* Organization structured data — site-wide, consumed by classic search
            and AI answer engines. Referenced by @id from per-page article JSON-LD. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(organizationJsonLd) }}
        />
      </head>
      <body className={`px-0 ${inter.className} dark:bg-slate-900 dark:text-white`}>
        <NextIntlClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={true}
            disableTransitionOnChange={true}
            enableColorScheme={true}
          >
            <LanguageProvider
              initialLocale={locale}
              initialDictionary={initialDictionary}
            >
              <DarkModeProvider>
                <NavigationWrapper>{children}</NavigationWrapper>
              </DarkModeProvider>
            </LanguageProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

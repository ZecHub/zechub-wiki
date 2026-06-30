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

const inter = Inter({ subsets: ["latin"] });

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
    <html lang={locale} suppressHydrationWarning>
      <head>
        <style>{`
          .goog-te-banner-frame,
          .goog-te-balloon-frame,
          iframe.goog-te-banner-frame,
          #goog-gt-tt,
          .goog-tooltip,
          div.skiptranslate:not(#google_translate_element) {
            display: none !important;
            visibility: hidden !important;
          }
          body {
            top: 0 !important;
            position: static !important;
          }
          .goog-text-highlight {
            background: none !important;
            box-shadow: none !important;
          }
        `}</style>

        {/* Manual RSS link as backup for better feed detection (Brave, Feedly, etc.) */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="ZecHub Dashboard Updates"
          href="https://zechub.wiki/rss.xml"
        />
      </head>
      <body className={`px-0 ${inter.className} dark:bg-slate-900 dark:text-white`}>
        {/* Hidden Google Translate mount — must be inside <body> */}
        <div
          id="google_translate_element"
          style={{
            position: "absolute",
            top: -9999,
            left: -9999,
            width: 300,
            height: 60,
          }}
        />
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

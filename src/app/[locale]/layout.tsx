import { Footer, Navigation } from "@/components";
import ProgressBar from "@/components/UI/ProgressBar";
import { DarkModeProvider } from "@/provider/DarkModeProvider";
import { LanguageProvider } from "@/context/LanguageContext";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import FloatingExplore from "@/components/FloatingExplore";
import "./globals.css";
import NavigationWrapper from "@/components/NavigationWrapper";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ZecHub Wiki",
  description: "An open source education hub for Zcash",
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

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang="en-US">
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
      <body className={`px-0 ${inter.className}`}>
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
          <LanguageProvider params={{ locale }}>
            <DarkModeProvider>
              <NavigationWrapper>{children}</NavigationWrapper>
            </DarkModeProvider>
          </LanguageProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

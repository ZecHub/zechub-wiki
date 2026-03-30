import { Footer, Navigation } from "@/components";
import ProgressBar from "@/components/UI/ProgressBar";
import { DarkModeProvider } from "@/provider/DarkModeProvider";
import { LanguageProvider } from "@/context/LanguageContext";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import FloatingExplore from "@/components/FloatingExplore";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ZecHub Wiki",
  description: "An open source education hub for Zcash",
  icons: "/ZecHubBlue.png",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

        <LanguageProvider>
          <DarkModeProvider>
            <div className="min-h-screen mx-auto">
              <ProgressBar />
              <Navigation />
              <FloatingExplore />
              <div className="flex flex-col justify-between flex-grow">
                <div
                //  style={{ margin: "0 0 48px 0" }}
                >
                  {children}
                </div>
              </div>
            </div>
            <Footer />
          </DarkModeProvider>
        </LanguageProvider>

        {/* Google Translate init — runs after page is interactive */}
        <Script
          id="google-translate-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                new google.translate.TranslateElement(
                  {
                    pageLanguage: 'en',
                    includedLanguages: 'en,fr,de,es,pt,ar,zh-CN,hi,ru,ja,ko,tr,uk,sw,yo,ig,ak,ee',
                    layout: google.translate.TranslateElement.InlineLayout.HORIZONTAL,
                    autoDisplay: false,
                  },
                  'google_translate_element'
                );
                const killBanner = () => {
                  const b = document.querySelector('.goog-te-banner-frame');
                  if (b) b.style.setProperty('display', 'none', 'important');
                  document.body.style.setProperty('top', '0', 'important');
                  document.body.style.setProperty('position', 'static', 'important');
                };
                setTimeout(killBanner, 500);
                setTimeout(killBanner, 1500);
              }
            `,
          }}
        />
        <Script
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}

import { Footer, Navigation } from "@/components";
import ProgressBar from "@/components/UI/ProgressBar";
import { DarkModeProvider } from "@/provider/DarkModeProvider";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ZecHub Wiki",
  description: "An open source education hub for Zcash",
  icons: "https://i.ibb.co/ysPDS9Q/Zec-Hub-blue-globe.png",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //dark:bg-slate-900 dark:text-gray-200

  return (
    <html lang="en-US">
      <body className={`px-0  ${inter.className}`}>
        <DarkModeProvider>
          {/* <div className="container mx-auto min-h-screen flex flex-col"> */}
          <div className="min-h-screen mx-auto">
            <ProgressBar />
            <Navigation />

            <div className=" flex flex-col justify-between flex-grow">
              <div style={{ margin: "0 0 48px 0" }}>{children}</div>
            </div>
          </div>
          <Footer />
        </DarkModeProvider>
      </body>
    </html>
  );
}

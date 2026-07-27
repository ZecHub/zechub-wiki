"use client";
import HomePage from "@/components/Home/Home";
import { useLanguage } from "@/context/LanguageContext";

// Client wrapper: pulls the localized hero copy from the language context and
// hands it to the (client) HomePage. Split out of page.tsx so the route file
// can stay a server component and export generateMetadata (canonical + OG +
// hreflang for the homepage).
export default function HomeClient() {
  const { t } = useLanguage();
  const text =
    t.home?.description ||
    `ZecHub is the community-driven education hub for the Zcash cryptocurrency (ZEC). Zcash is a digital currency providing censorship resistant, secure & private payments. The Zcash Blockchain utilises highly advanced 'verifiable' zk-snarks that do not require Trusted Setup following the NU5 network upgrade in 2022.`;

  return <HomePage text={text} />;
}

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
    `ZecHub is the community-driven education hub for Zcash (ZEC), a decentralized digital currency built for censorship-resistant, secure and private payments. Zcash uses advanced zero-knowledge cryptography to enable transactions whose validity can be verified without revealing sensitive financial information. In 2026 Zcash activated the Ironwood shielded pool, formally verified using machine-checked mathematical proofs it guarantees balance integrity. Project Tachyon is developing a proposed next-generation shielded protocol designed to dramatically improve the scalability of private payments, reduce validator state growth and advance Zcash toward fully post-quantum secure privacy.`;

  return <HomePage text={text} />;
}

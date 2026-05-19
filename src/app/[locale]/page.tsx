// "use client";
import HomePage from "@/components/Home/Home"
import { useLanguage } from "@/context/LanguageContext";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";

export default function Home({ params }: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('home');
  
  const text = t('description') || `ZecHub is the community-driven education hub for the Zcash cryptocurrency (ZEC). Zcash is a digital currency providing censorship resistant, secure & private payments. The Zcash Blockchain utilises highly advanced 'verifiable' zk-snarks that do not require Trusted Setup following the NU5 network upgrade in 2022.`;

  return <HomePage text={text} />;
}

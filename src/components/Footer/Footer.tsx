"use client";
import { Link } from "@/i18n/navigation";
import { ShopButton } from "../Shop-button/shop-button";
import { useLanguage } from "@/context/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-slate-200 bg-slate-100 text-slate-600 dark:border-[#1984c7]/20 dark:bg-[#0b1626] dark:text-slate-300">
      <div className="mx-auto flex w-full max-w-screen-xl flex-col items-center gap-6 px-4 py-8 md:flex-row md:justify-between md:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-1 text-sm md:items-start">
          <span>
            © {new Date().getFullYear()}{" "}
            <Link
              href="https://zechub.social/@Zechub"
              rel="me"
              className="font-medium text-slate-800 hover:underline dark:text-slate-200"
            >
              Zechub™
            </Link>
            . {t.footer?.allRightsReserved || "All Rights Reserved"}.
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            <Link href={"/sitemap"} className="hover:underline">
              Sitemap
            </Link>
            {" · "}
            <Link href={"/privacy"} className="hover:underline">
              {t.footer?.privacy || "Privacy"}
            </Link>
          </span>
        </div>
        <ShopButton shopUrl="https://zechub.store" />
      </div>
    </footer>
  );
};

export default Footer;

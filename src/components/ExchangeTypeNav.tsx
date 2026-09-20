"use client";

import { Link } from "@/i18n/navigation";
import { useLanguage } from "@/context/LanguageContext";

const btnClass =
  "inline-flex py-2 px-4 btn-brand focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-sm";

export default function ExchangeTypeNav() {
  const { t } = useLanguage();
  const dexLabel = t?.pages?.dex?.title ?? "DEX platforms";
  const custodialLabel = t?.pages?.dex?.custodial ?? "Custodial Exchanges";
  const centralisedLabel =
    t?.pages?.dex?.centralised ?? "Centralised Swap platforms";

  return (
    <div className="flex gap-4 mt-0 imd:mt-4 text-center flex-col items-center imd:flex-row">
      <Link href="/dex" className={btnClass}>
        {dexLabel}
      </Link>
      <Link href="/using-zcash/custodial-exchanges" className={btnClass}>
        {custodialLabel}
      </Link>
      <Link href="/using-zcash/centralizedswaps" className={btnClass}>
        {centralisedLabel}
      </Link>
    </div>
  );
}

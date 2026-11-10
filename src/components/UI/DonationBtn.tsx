"use client";
import '@/components/Donation/donation.css';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

const DonationBtn = () => {
  const { t } = useLanguage();
    
  return (
    <div className='nav-donate-btn'>
        <Link
          href="/donation"
          className="inline-flex items-center justify-center rounded-lg border border-brand bg-brand px-4 py-2 text-sm font-semibold text-on-brand transition-colors hover:bg-brand-hover dark:border-brand/40 dark:bg-brand/15 dark:text-brand-soft dark:hover:border-brand/70 dark:hover:bg-brand/25 dark:hover:text-white"
        >
          {t.navigation?.donate || "Donate"}
        </Link>
    </div>
  )
}

export default DonationBtn

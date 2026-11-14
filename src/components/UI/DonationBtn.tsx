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
          className="inline-flex items-center justify-center rounded-lg border border-brand bg-brand px-4 py-2 text-sm font-semibold text-on-brand transition-colors hover:bg-brand-hover "
        >
          {t.navigation?.donate || "Donate"}
        </Link>
    </div>
  )
}

export default DonationBtn

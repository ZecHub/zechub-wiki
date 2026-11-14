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
          className="inline-flex items-center justify-center rounded-lg border border-brand/60 px-3.5 py-1.5 text-sm font-medium text-brand transition-colors hover:border-brand hover:bg-brand/10"
        >
          {t.navigation?.donate || "Donate"}
        </Link>
    </div>
  )
}

export default DonationBtn

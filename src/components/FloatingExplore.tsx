'use client';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { DarkModeContext } from "@/context/DarkModeContext";
import { useContext } from 'react';
import Link from 'next/link';
import { Button } from '@/components/UI/button';
import { exploreMenu } from '@/constants/explore-menu';

export default function FloatingExplore() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || '';
  const { dark } = useContext(DarkModeContext) || { dark: false };
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [folder, setFolder] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    setFolder(dark ? 'dark' : 'light');
  }, [dark]);

  // Cleanup timeout when component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const iconMap: Record<string, string> = {
    "Start Here": `/explore/${folder}/start-here.png`,
    "Tutorials": `/explore/${folder}/tutorials.png`,
    "Using Zcash": `/explore/${folder}/using-zcash.png`,
    "Guides": `/explore/${folder}/guides.png`,
    "Zcash Tech": `/explore/${folder}/zcash-tech.png`,
    "Zcash Organizations": `/explore/${folder}/zcash-organizations.png`,
    "Zcash Community": `/explore/${folder}/zcash-community.png`,
    "ZKAV Club": `/explore/${folder}/zkav-club.png`,
    "Privacy Tools": `/explore/${folder}/privacy-tools.png`,
    "Research": `/explore/${folder}/research.png`,
    "Glossary & FAQs": `/explore/${folder}/glossary-faq.png`,
    "Contribute": `/explore/${folder}/contribute.png`,
  };

  const deepLinkMap: Record<string, string> = {
    "Start Here": "/start-here/new-user-guide#content",
    "Tutorials": "https://youtube.com/@zechub",
    "Using Zcash": "/using-zcash/buying-zec#content",
    "Guides": "/guides/nym-vpn#content",
    "Zcash Tech": "/zcash-tech/crosslink-protocol#content",
    "Zcash Organizations": "/zcash-organizations/zcash-foundation#content",
    "Zcash Community": "/zcash-community/community-links#content",
    "ZKAV Club": "https://zkav.club/",
    "Privacy Tools": "/privacy-tools/2fa-hardware-devices#content",
    "Research": "/research/social-media-data-collection#content",
    "Glossary & FAQs": "/glossary-and-faqs/zcash-library#content",
    "Contribute": "/contribute/help-build-zechub#content",
  };

  const handleLinkClick = () => {
    setOpen(false);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 80);
  };

  if (pathname === '/explore') return null;

  return (
    <div 
      className="fixed bottom-8 right-8 z-50"
      // Mouse leaves the whole floating widget (button + menu) → close with a tiny grace period
      onMouseLeave={() => {
        timeoutRef.current = setTimeout(() => setOpen(false), 150);
      }}
    >
      <Button
        onClick={() => setOpen((prev) => !prev)}
        className="h-[50px] w-[50px] rounded-full shadow-2xl bg-amber-500 hover:bg-amber-600 ring-4 ring-amber-400/30 dark:ring-amber-900/50 transition-all active:scale-95 flex items-center justify-center p-0 overflow-hidden"
        size="icon"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-[47px] w-[47px]" viewBox="0 0 100 100" fill="none">
          <text x="50" y="68" textAnchor="middle" dominantBaseline="middle" fill="#000000" fontSize="140" fontWeight="900" fontFamily="Arial Black, sans-serif">Z</text>
        </svg>
      </Button>

      {open && (
        <div 
          className="absolute bottom-20 right-0 w-72 max-w-[280px] rounded-3xl bg-slate-50 dark:bg-card border border-border shadow-2xl p-3 text-sm backdrop-blur-2xl"
          // Cancel the close when the mouse enters the menu (handles the gap perfectly)
          onMouseEnter={() => {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
          }}
        >
          <div className="font-semibold mb-3 px-2 text-foreground">Explore Zcash</div>

          <div className="space-y-0 mb-4">
            {exploreMenu.mainLinks.map((item) => {
              const href = deepLinkMap[item.label] || item.href;
              const iconSrc = iconMap[item.label] || `/explore/${folder}/start-here.png`;

              return (
                <Link
                  key={item.href}
                  href={href}
                  onClick={handleLinkClick}
                  className="flex items-center gap-4 px-4 py-2 rounded-2xl transition-all hover:bg-yellow-400 hover:text-black dark:hover:bg-amber-600 font-medium text-foreground"
                >
                  <img src={iconSrc} alt={item.label} className="h-6 w-6 object-contain flex-shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="border-t border-border pt-3">
            <div className="font-semibold mb-2 px-3 text-xs uppercase tracking-widest text-muted-foreground">
              For Forks & Maintainers
            </div>
            {exploreMenu.forkSection.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 px-4 py-2 rounded-2xl transition-all hover:bg-yellow-400 hover:text-black dark:hover:bg-amber-600 font-medium text-foreground"
                onClick={() => setOpen(false)}
              >
                <span className="text-xl w-6 flex-shrink-0">{item.icon}</span>
                <div>
                  {item.label}
                  {item.note && <span className="text-xs block text-muted-foreground mt-0.5">{item.note}</span>}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
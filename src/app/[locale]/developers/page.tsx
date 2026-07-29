import { Metadata } from 'next';
import { genMetadata } from '@/lib/helpers';
import { buildAlternates } from '@/lib/localeCoverage';
import { routing } from '@/i18n/routing';
import DeveloperPage from './DeveloperPage';
import { getDictionary } from '@/lib/getDictionary';

type DevelopersDictionary = {
  pages?: {
    developers?: {
      title?: string;
    };
  };
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = (await getDictionary(locale)) as DevelopersDictionary;
  const localePrefix = locale && locale !== routing.defaultLocale ? `/${locale}` : "";
  // Bespoke app route: English-only in the sitemap, so emit a locale-aware self
  // canonical (no hreflang). (Also fixes a prior copy-paste bug: the url pointed
  // at /using-zcash/blockchain-explorers.)
  return genMetadata({
    title: dict.pages?.developers?.title || "Zcash Developer Resources",
    url: `https://zechub.wiki${localePrefix}/developers`,
    locale,
    alternates: buildAlternates("/developers", locale, [locale]),
  });
}

export default function Page() {
  return <DeveloperPage />;
}

import Client from './ClientPage';
import { genMetadata } from '@/lib/helpers';
import { getDictionary } from '@/lib/getDictionary';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = (await getDictionary(locale)) as {
    pages?: {
      dex?: {
        centralizedTitle?: string;
      };
    };
  };

  return genMetadata({
    title: dict.pages?.dex?.centralizedTitle ?? 'Centralized Swap Platform Listing',
    url: 'https://zechub.wiki/using-zcash/centralizedswaps',
  }) as Metadata;
}

export default function Page() {
  return <Client />;
}

import { Metadata } from 'next';
import { genMetadata } from '@/lib/helpers';
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
  return genMetadata({
    title: dict.pages?.developers?.title || "Zcash Developer Resources",
    url: "https://zechub.wiki/using-zcash/blockchain-explorers",
  }) as Metadata;
}

export default function Page() {
  return <DeveloperPage />;
}

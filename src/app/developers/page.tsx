import { Metadata } from 'next';
import { genMetadata } from '@/lib/helpers';
import DeveloperPage from './DeveloperPage';
import { getDictionary } from '@/lib/getDictionary';

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return genMetadata({
    title: dict.pages?.developers?.title || "Zcash Developer Resources",
    url: "https://zechub.wiki/using-zcash/blockchain-explorers",
  }) as Metadata;
}

export default function Page() {
  return <DeveloperPage />;
}

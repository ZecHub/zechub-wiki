import Client from './ClientPage';
import { genMetadata } from '@/lib/helpers';
import { getDictionary } from '@/lib/getDictionary';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return genMetadata({
    title: dict.pages?.usingZcash?.blockchainExplorers?.title ?? 'Blockchain Explorers',
    url: 'https://zechub.wiki/using-zcash/blockchain-explorers',
  }) as Metadata;
}

export default function Page() {
  return <Client />;
}

import Client from './ClientPage';
import { genMetadata } from '@/lib/helpers';
import { getDictionary } from '@/lib/getDictionary';
import { Metadata } from 'next';

type Dictionary = {
  pages?: {
    usingZcash?: {
      blockchainExplorers?: {
        title?: string;
      };
    };
  };
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = (await getDictionary(locale)) as Dictionary;
  return genMetadata({
    title: dict.pages?.usingZcash?.blockchainExplorers?.title ?? 'Blockchain Explorers',
    url: 'https://zechub.wiki/using-zcash/blockchain-explorers',
  }) as Metadata;
}

export default function Page() {
  return <Client />;
}

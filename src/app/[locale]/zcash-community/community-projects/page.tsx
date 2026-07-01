import Client from './ClientPage';
import { genMetadata } from '@/lib/helpers';
import { getDictionary } from '@/lib/getDictionary';
import { Metadata } from 'next';

type Dictionary = {
  pages?: {
    zcashCommunity?: {
      communityProjects?: {
        title?: string;
      };
    };
  };
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = (await getDictionary(locale)) as Dictionary;
  return genMetadata({
    title: dict.pages?.zcashCommunity?.communityProjects?.title ?? 'Community Projects',
    url: 'https://zechub.wiki/zcash-community/community-projects',
  }) as Metadata;
}

export default function Page() {
  return <Client />;
}
import { Metadata } from 'next';
import { genMetadata } from '@/lib/helpers';
import DeveloperPage from './DeveloperPage';

export const metadata: Metadata = genMetadata({
  title: "Zcash Developer Resources",
  url: "https://zechub.wiki/using-zcash/blockchain-explorers"
});

export default function Page() {
  return <DeveloperPage />;
}

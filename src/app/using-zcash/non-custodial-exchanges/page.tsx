import { Card } from '@/components/Card/Card';
import { dexListingConfig } from '@/constants/dex-listing-config';
import { genMetadata } from '@/lib/helpers';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = genMetadata({
  title: "Non-Custodial Exchange Listing",
  url: "https://zechub-wiki.vercel.app/using-zcash/non-custodial-exchanges"
});

const DEXListingPage = () => {
  return (
    <div className='container mx-auto px-4'>
      <div className='flex justify-between items-center my-12'>
        <h1 className='text-4xl font-semibold'>
          Non-Custodial Exchanges
        </h1>
        <Link href="https://zechub.wiki/using-zcash/custodial-exchanges">
          <a className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'>
            Custodial Exchanges
          </a>
        </Link>
      </div>
      <p className='text-gray-600 my-4'>
        ZecHub does not endorse any particular exchange service, please do your own research.
      </p>
      <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {dexListingConfig.map((itm, i) => (
          <Card
            thumbnailImage={itm.image}
            description={itm.description}
            title={itm.title}
            url={itm.url}
            key={itm.title + '_' + Math.random() / i}
            ctaLabel='Read More'
          />
        ))}
      </div>
    </div>
  );
};

export default DEXListingPage;

import { Card } from '@/components/Card/Card';
import { dexListingConfig } from '@/constants/dex-listing-config';
import { genMetadata } from '@/lib/helpers';
import { Metadata } from 'next';

export const metadata: Metadata = genMetadata({
  title: "Decentralize Exchange Listing",
  url: "https://zechub-wiki.vercel.app/using-zcash/non-custodial-exchanges"
})

const DEXListingPage = () => {
  return (
    <div className='container mx-auto px-4'>
      <h1 className='text-4xl my-12 font-semibold flex justify-center'>
        Non-Custodial Exchanges
      </h1>

      <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {dexListingConfig.map((itm, i) => (
          <Card
            thumbnailImage={itm.image}
            description={itm.description}
            title={itm.title}
            url={itm.url}
            key={itm.title + '_' + Math.random() / i}
            ctaLabel='' // Providing an empty string as ctaLabel
          />
        ))}
      </div>
    </div>
  );
};

export default DEXListingPage;

import { DEXListingCards } from '@/components/DEXListing/DEXListing';
import { dexListingConfig } from '@/constants/dex-listing-config';

const DEXListingPage = () => {
  const dexList = dexListingConfig.map((itm, i) => (
    <DEXListingCards
      image={itm.image}
      description={itm.description}
      title={itm.title}
      url={itm.url}
      key={i}
    />
  ));

  return (
    <>
      <h1 className='text-4xl my-12 font-semibold flex justify-center'>
        Decentralize Exchange Listing
      </h1>
      <div className='py-10 flex flex-col  md:flex-row md:space-x-11 justify-center sm:items-center'>
        {dexList}
      </div>
    </>
  );
};

export default DEXListingPage;

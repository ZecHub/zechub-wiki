import { Card } from '@/components/Card/Card';
import { blockchainExplorers } from '@/constants/blockchainExplorers';

const BlockchainExplorers = () => {
  return (
    <div className='container mx-auto px-4'>
      <h1 className='text-4xl my-12 font-semibold flex justify-center'>
        Blockchain Explorers
      </h1>
      <p className='text-xl text-center text-slate-600 mb-12'>
        A blockchain explorer is a search engine that allows users to explore
        the blockchain of a cryptocurrency. It provides a user-friendly
        interface to view transaction details, block information, and address
        histories.
      </p>

      <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {blockchainExplorers.map((itm, i) => (
          <Card
            thumbnailImage={itm.thumbnailImage}
            description={itm.description}
            title={itm.title}
            url={itm.url}
            key={i}
            features={itm.features}
            ctaLabel='Read More'
          />
        ))}
      </div>
    </div>
  );
};

export default BlockchainExplorers;

import Image from 'next/image';
import Link from 'next/link';
import { FadeInAnimation } from './ui/FadeInAnimation';

const ContentSections = () => {
  return (
    <>
      <section>
        <div className='flex  space-y-4 flex-col w-full mt-5'>
          {/* Other sections of your code here */}
          
          <div
            className='flex flex-col md:flex-row space-y-4 h-screen my-4 w-auto border-2 border-black/50 rounded-md p-5'
            style={{ height: '30rem' }}
          >
            <div className='flex flex-col w-auto md:w-2/4  items-center justify-center'>
              <FadeInAnimation>
                <h1 className='text-3xl mb-4 font-semibold'>Pay with Zcash</h1>
              </FadeInAnimation>
              <FadeInAnimation>
                <p className='text-center'>
                  This website is an answer to the question: <strong>where can I pay with Zcash?</strong>
                </p>
                <p className='text-center mb-5'>
                  The directory is free to use. The items listed are for informational purposes only, and not endorsements of any kind. Enjoy!
                </p>
              </FadeInAnimation>
              <FadeInAnimation>
                <div className='flex flex-row space-x-4 mt-4'>
                  <Link
                    href={'https://paywithz.cash/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className='inline-flex justify-center items-center w-full px-3 py-2 text-sm font-semibold text-center border-blue-300 border-2 rounded-lg hover:bg-blue-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                  >
                    paywithz.cash
                  </Link>
                  <Link
                    href={'https://zechub.wiki/map'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className='inline-flex justify-center items-center w-full px-3 py-2 text-sm font-semibold text-center text-white bg-pink-300 rounded-lg hover:bg-pink-400 focus:ring-4 focus:outline-none focus:ring-pink-200'
                  >
                    Spedn
                  </Link>
                </div>
              </FadeInAnimation>
            </div>
            <div className='flex justify-center items-center w-9/12 md:w-2/4 self-center pt-8 md:pt-0'>
              <FadeInAnimation>
                <Image
                  className='w-50 h-auto'
                  src={'/paywithzcash.png'}
                  alt='paywithz.cash'
                  width={400}
                  height={40}
                />
              </FadeInAnimation>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContentSections;

'use client'

import Image from 'next/image';
import Link from 'next/link';
import { FadeInAnimation } from '../ui/Fade';
import './DexListing.css';

type DEXDetails = {
  title: string;
  url: string;
  image: string;
  description: string;
  [index: string]: any;
};

export const DEXListingCards = ({
  image,
  url,
  description,
  title,
}: DEXDetails) => (
  <div className='flex max-w-sm md:w-1/2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-4'>
    <FadeInAnimation>
      <Link href={url}>
        <Image
          className='rounded-t-lg '
          src={image}
          alt=''
          width={400}
          height={100}
        />
      </Link>
      <div className='flex flex-col p-5 min-h-56 space-y-4'>
        <Link href={url}>
          <h5 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
            {title}
          </h5>
        </Link>
        <p className='font-normal text-gray-700 dark:text-gray-400'>
          {description}
        </p>
        <div className='grow'></div>
        { }
      </div>
    </FadeInAnimation>
  </div>
);

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FadeInAnimation } from '../ui/FadeInAnimation';

type CardsProps = {
  title: string;
  url: string;
  image: string;
  description: string;
  [index: string]: any;
};

export const Card = (props: CardsProps) => (
  <div className='bg-white rounded-lg shadow flex flex-col justify-between mb-8 sm:mb-4'>
    <div>
      <Image
        width={1000}
        height={500}
        src={props.image}
        alt='Thumbnail 1'
        className='w-full h-48 object-cover mb-4 rounded-t'
      />
      <h2 className='text-xl font-bold mb-2 p-4'>{props.title}</h2>
      <p className='text-gray-700 p-4'>{props.description}</p>
    </div>

    <div className='p-4'>
      <Link
        href={props.url}
        className='inline-flex py-2 px-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
      >
        Read More
      </Link>
    </div>
  </div>
);

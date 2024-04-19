'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FadeInAnimation } from '../ui/FadeInAnimation';
import { formatString } from '@/lib/helpers';

type CardsProps = {
  title: string;
  url: string;
  thumbnailImage: string;
  description: string;
  [index: string]: any;
  ctaLabel: string
};

export const Card = (props: CardsProps) => (
  <div className='bg-white rounded-lg shadow flex flex-col justify-between mb-8 sm:mb-4'>
    <div>
      <Link href={props.url}>
        <Image
          width={1000}
          height={500}
          src={props.thumbnailImage}
          alt='Thumbnail 1'
          className='w-full h-48 object-cover mb-4 rounded-t'
        />
      </Link>

      <h2 className='text-xl font-bold px-4 my-6'>{props.title}</h2>
      <p className='text-gray-700 px-4 mb-4'>{props.description}</p>

      {props.features && props.features.length > 0 && (
        <div className='px-4'>
          <h4 className='text-gray-700 my-2 text-xl'>Features:</h4>
          <ul className='text-gray-600 px-4 mb-4'>
            {props.features?.map((f: any, i: number) => (
              <li key={i} className='list-item list-disc  '>
                {formatString.titleCase(f)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>

    <div className='p-4'>
      <Link
        href={props.url}
        className='inline-flex py-2 px-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
      >
        {props.ctaLabel}
      </Link>
    </div>
  </div>
);

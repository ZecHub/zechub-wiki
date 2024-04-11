'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import './AdminComp.css';

export const AdminComp = () => {
  const { data } = useSession();

  return (
    <div className='h-screen'>
      <div className='flex items-center justify-center py-8 bg-gray-700 text-white mb-24'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold mb-4'>Welcome to Admin Page</h1>
          <p className='text-lg'>Acess to all Admin modules</p>
          <p className='text-base'>Welcome, {data?.user?.email}</p>
        </div>
      </div>

      <div className='lg:container flex flex-col md:flex-row mx-auto'>
        <div className='bg-gray-200 p-4 m-2 md:w-1/2'>
          <div className='p-6'>
            <h2 className='text-xl font-semibold text-gray-800 mb-2'>
              Push Notification
            </h2>

            <p className='text-gray-600'>Access list of Subscribers</p>
            <div className='mt-4'>
              <Link
                href={'/admin/push-notification'}
                className='btn  bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
              >
                View List
              </Link>
            </div>
          </div>
        </div>

        <div className='bg-gray-200 p-4 m-2 md:w-1/2'>
          <div className='p-6'>
            <h2 className='text-xl font-semibold text-gray-800 mb-2'>
              Banner Notification
            </h2>

            <p className='text-gray-600'>Banner Message</p>

            <div className='mt-4'>
              <Link
                href={'/admin/banner-notification'}
                className='btn bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
              >
                View Message
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

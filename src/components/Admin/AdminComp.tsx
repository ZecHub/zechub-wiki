'use client';

import Link from 'next/link';
import './AdminComp.css';
import { useSession } from 'next-auth/react';

export const AdminComp = () => {
  const { data, status, update } = useSession();

  return (
    <div className=' min-h-screen'>
      <div className='admin'>
        <div className='intro'>
          <h1>Admin Page</h1>
          <p>Acess to all Admin modules</p>
          <p>Welcome, {data?.user?.email} </p>
        </div>
      </div>

      <div className='flex flex-wrap justify-center mb-24'>
        <div className='bg-white max-w-md mx-2 my-4 shadow-md rounded-md overflow-hidden'>
          {/* <!-- Card Content --> */}
          <div className='p-6'>
            {/* <!-- Card Title --> */}
            <h2 className='text-xl font-semibold text-gray-800 mb-2'>
              Push Notification
            </h2>

            {/* <!-- Card Description --> */}
            <p className='text-gray-600'>Access list of Subscribers</p>

            {/* <!-- Card Button --> */}
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

        <div className='bg-white max-w-md mx-2 my-4 shadow-md rounded-md overflow-hidden'>
          {/* <!-- Card Content --> */}
          <div className='p-6'>
            {/* <!-- Card Title --> */}
            <h2 className='text-xl font-semibold text-gray-800 mb-2'>
              Banner Notification
            </h2>

            {/* <!-- Card Description --> */}
            <p className='text-gray-600'>Banner Message</p>

            {/* <!-- Card Button --> */}
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

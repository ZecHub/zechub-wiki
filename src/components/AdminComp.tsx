'use client';

import { UserProfile } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';

type AdminCompProps = {
  user: UserProfile | undefined;
};

export const AdminComp = (props: AdminCompProps) => {
  return (
    <>
      <div>
        <h1>Admin Page</h1>
      </div>
      <div className=''>
        <h3>Push Notification Subscribers</h3>
        <Link href={'/admin/push-notification'}>Push Notification</Link>
      </div>
    </>
  );
};

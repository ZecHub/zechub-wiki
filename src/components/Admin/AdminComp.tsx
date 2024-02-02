'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import './AdminComp.css';

export const AdminComp = () => {
  return (
    <>
      <div className='admin'>
        <div className='intro'>
          <h1>Admin Page</h1>
          <p>Acess to all Admin modules</p>
        </div>
        <div className='row'>
          <div className='card'>
            <h3>Push Notification</h3>
            <div className='cover'>
              <div className='left'>🔔</div>
              <div className='right'>
                <p>Access list of Subscribers</p>
                <Link href={'/admin/push-notification'} className='btn'>
                  View List
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export const SubscriberWelcomeMessage = () => {
  const [form, setForm] = useState();
  const [subscribersWelcomMsg, setSubscribersWelcomMsg] = useState<any[]>([]);

  useEffect(() => {
    setSubscribersWelcomMsg((arr) => [...arr]);
  }, []);

  const handleFormData = () => {
    return (
      <form action=''>
        <label htmlFor='title'>
          <input
            type='text'
            name='title'
            id='title'
            placeholder='Enter title'
          />
        </label>
        <label htmlFor='description'>
          <input
            type='text'
            name='title'
            id='description'
            placeholder='Enter a description'
          />
        </label>

        <button>Save</button>
      </form>
    );
  };
  return (
    <>
      <h3 className='text-2xl font-bold my-12 text-left'>
        Subscribers welcome message
      </h3>

      {subscribersWelcomMsg && subscribersWelcomMsg.length > 0 ? (
        subscribersWelcomMsg &&
        subscribersWelcomMsg.length > 0 &&
        subscribersWelcomMsg.map((msg, i) => (
          <div key={i} className='my-12 flex-1 '>
            <p>Title: {msg.title}</p>
            <p>description: {msg.description}</p>
            <p>description: {msg.description}</p>
          </div>
        ))
      ) : (
        <div className='flex my-12'>
          <p>No message! </p>
          <button>Create one</button>
        </div>
      )}
    </>
  );
};

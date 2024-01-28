'use client';

import './SubscriberWelcomeMessage.css';

import {
  SubscriberWelcomeMessageType,
  getSubscriberWelcomeMessage,
  handlerCreateSubscriberWelcomeMessage,
} from '@/app/actions';
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { experimental_useFormStatus as useFormStatus } from 'react-dom';

export const SubscriberWelcomeMessage = () => {
  const [subscribersWelcomMsg, setSubscribersWelcomMsg] = useState<
    SubscriberWelcomeMessageType[]
  >([]);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { pending } = useFormStatus();

  useEffect(() => {
    getMessages();
  }, [isSubmitting]);

  const handleFormData = async (formData: FormData) => {
    setIsSubmitting(true);

    const { data } = await handlerCreateSubscriberWelcomeMessage(formData);
    if (data !== undefined && typeof data !== 'string') {
      setIsSubmitting(false);
      setShowForm(false);
    }
  };

  const getMessages = async () => {
    const { data } = await getSubscriberWelcomeMessage();
    const d = data as SubscriberWelcomeMessageType[];
    setSubscribersWelcomMsg([...d]);
  };

  return (
    <>
      <h3 className='text-2xl font-bold my-12 text-left'>
        Subscribers welcome message
      </h3>

      {subscribersWelcomMsg && subscribersWelcomMsg.length > 0 ? (
        <div className='sub-messages'>
          {subscribersWelcomMsg.map((msg, i) => (
            <div
              key={i}
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <p>
                Title: <span>{msg.title}</span>{' '}
              </p>
              <p>
                Body: <span>{msg.body}</span>{' '}
              </p>
              <p style={{ display: 'flex', flexDirection: 'row', gap: '12px' }}>
                Image:{' '}
                <span>
                  <Image
                    width={30}
                    height={30}
                    alt={msg.title}
                    src={msg.image}
                  />{' '}
                </span>
              </p>
              <p style={{ display: 'flex', flexDirection: 'row', gap: '12px' }}>
                Icon:{' '}
                <span>
                  <Image
                    width={30}
                    height={30}
                    alt={msg.title}
                    src={msg.icon}
                  />{' '}
                </span>
              </p>
            </div>
          ))}
          <div className=''>
            <button
              className='btn send'
              type='submit'
              onClick={() => setShowForm(!showForm)}
            >
              Edit Messge
            </button>
          </div>
        </div>
      ) : (
        <>
          {!showForm && (
            <div className='sub-messages'>
              <em>No default message set yet!</em>
              <button
                className='btn send'
                type='submit'
                onClick={() => setShowForm(!showForm)}
              >
                Create
              </button>
            </div>
          )}

          {showForm && (
            <ErrorBoundary
              fallback={
                <p style={{ fontWeight: 400, fontSize: '22px', color: '#333' }}>
                  There was an error while submitting the form...
                </p>
              }
            >
              <div className='form'>
                <h4>Personalise a default message for Push Subscribers </h4>
                <form action={handleFormData}>
                  <label htmlFor='title'>
                    <input
                      className='input'
                      type='text'
                      name='title'
                      id='title'
                      placeholder='Enter title'
                      disabled={pending}
                    />
                  </label>
                  <label htmlFor='icon'>
                    <input
                      className='input'
                      type='text'
                      name='icon'
                      id='icon'
                      placeholder='Enter url for icon to use'
                      disabled={pending}
                    />
                  </label>
                  <label htmlFor='image'>
                    <input
                      className='input'
                      type='text'
                      name='image'
                      id='image'
                      placeholder='Enter url for image to use'
                      disabled={pending}
                    />
                  </label>
                  <label htmlFor='description'>
                    <textarea
                      name='body'
                      id='body'
                      cols={30}
                      rows={10}
                      maxLength={200}
                      placeholder='Enter a description'
                      disabled={pending}
                    ></textarea>
                  </label>

                  <div style={{ display: 'flex', gap: '24px' }}>
                    <button
                      className='btn send'
                      type='submit'
                      disabled={pending}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                    {showForm && (
                      <button
                        className='btn cancel'
                        type='submit'
                        onClick={() => setShowForm(!showForm)}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </ErrorBoundary>
          )}
        </>
      )}
    </>
  );
};

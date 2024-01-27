'use client';

import { PUSH_NOTIFICATION_API } from '@/config';
import { wordWrap } from '@/lib/helpers';
import { sendNotifications } from '@/lib/push-notification/helpers';
import { useCallback, useState } from 'react';
import { Modal } from '../ui/Modal';
import { SendNotificationForm } from '../ui/send-notification-form/SendNotificationForm';
import { Spinner } from '../ui/spinner/Spinner';
import './ListOfSubscribers.css';

type Subscribers = {
  id: string;
  endpoint: string;
  expirationTime: string | undefined;
  keys: {
    p256dh: string;
    auth: string;
    [index: string]: any;
  };
};
export function ListOfSubscribers() {
  const [subscribers, setSubscribers] = useState<Subscribers[]>([]);
  const [subscriber, setSubscriber] = useState<Subscribers>();
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [notifyAll, setNotifyAll] = useState(false);

  const handleGetListOfSubscriber = useCallback(async () => {
    setIsLoading(true);

    try {
      const res = await fetch(PUSH_NOTIFICATION_API.url.subscription, {
        headers: {
          'X-Custom-Filter-By': JSON.stringify([
            'id',
            'endpoint',
            'expirationTime',
          ]),
        },
      });
      const sub = await res.json();
      setIsLoading(false);

      setSubscribers(sub.data);
    } catch (err) {
      setIsError(true);
      setIsLoading(false);
    }
  }, []);

  const handleOnOpen = () => {
    setIsOpen(true);
  };

  const handleOnClose = () => {
    setIsOpen(false);
  };

  const handleNotifyOne = (subscriber: any) => {
    handleOnOpen();

    setSubscriber(subscriber);
  };

  const handleSendNotifications = async (
    subscriber: string | any[],
    payload: any
  ) => {
    try {
      await sendNotifications(subscribers, payload);
    } catch (err) {
      throw err;
    }
  };

  return (
    <>
      <section id='subscribers' className='mt-4 subscribers'>
        <h3 className='text-3xl font-bold my-12 text-left'>
          List of subscribers
        </h3>

        <div className='subscribers-header  mx-auto mb-8 '>
          <button onClick={handleGetListOfSubscriber}>Get Subscribers</button>
          <input
            type='text'
            placeholder='Search for by id or endpoint'
            className='searchForm'
          />
          {subscribers.length > 0 && (
            <button
              className='notify-btn'
              onClick={() => {
                setNotifyAll(true);
              }}
            >
              Notify all subscribers
            </button>
          )}
        </div>

        {isLoading ? (
          <div className='loading'>
            <Spinner style={{ width: '64px', height: '64px' }} />
          </div>
        ) : (
          subscribers &&
          subscribers.length > 0 && (
            <div style={{ overflowX: 'auto' }}>
              <table className=' my-16 mx-auto border-spacing-1 border border-slate-500'>
                <thead
                  style={{
                    backgroundColor: '#c1c1c1',
                    height: '42px',
                  }}
                >
                  <tr>
                    <th>ID</th>
                    <th style={{ width: '50%' }}>Endpoint</th>
                    <th>Expiration Time</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((sub, i) => {
                    return (
                      <tr
                        key={i}
                        className='shadow-sm hover:bg-gray-200 border-gray-500'
                      >
                        <td className='h-1 p-3 m-3 border-spacing-8'>
                          {wordWrap(sub.id, 10)}
                        </td>
                        <td className='h-1 p-3 m-3 border-spacing-8'>
                          {wordWrap(sub.endpoint, 50)}
                        </td>
                        <td className='h-1 p-3 m-3 border-spacing-8'>
                          {sub.expirationTime || 'Not available'}
                        </td>
                        <td
                          className='h-1 p-3 m-3 border-spacing-8 cursor-pointer'
                          onClick={() => handleNotifyOne(sub)}
                        >
                          <span className='tooltip'>
                            {'🔔'}
                            <span className='tooltiptext'>
                              Notify this user
                            </span>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        )}
      </section>
      <Modal isOpen={isOpen} handleOnClose={handleOnClose}>
        <SendNotificationForm
          handleSendNotifications={handleSendNotifications}
          subscribers={notifyAll ? subscribers : [subscriber]}
          onClose={handleOnClose}
        />
      </Modal>
    </>
  );
}

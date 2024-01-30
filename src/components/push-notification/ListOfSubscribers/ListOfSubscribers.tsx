'use client';

import { PUSH_NOTIFICATION_API } from '@/config';
import { formatString } from '@/lib/helpers';
import { sendNotifications } from '@/lib/push-notification/pushHelpers';
import { useCallback, useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Spinner } from 'flowbite-react';
import { SendNotificationForm } from '../send-notification-form/SendNotificationForm';
import './ListOfSubscribers.css';
import { NotificationIcon } from '@/components/ui/NotificationIcon';

export type Subscriber = {
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
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [subscriber, setSubscriber] = useState<Subscriber>();
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [notifyAll, setNotifyAll] = useState(false);
  const [filteredValue, setFilterdValue] = useState('');

  const filteredData = subscribers.filter((itm) =>
    itm.id.toLowerCase().includes(filteredValue.toLowerCase())
  );

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

  const handleNotifyOne = (subscriber: Subscriber) => {
    handleOnOpen();

    setSubscriber(subscriber);
  };

  const handleNotifyAll = () => {
    handleOnOpen();

    setNotifyAll(true);
  };

  const handleSendNotifications = async (
    subscribers: Subscriber[],
    payload: any
  ) => {
    try {
      await sendNotifications(subscribers, payload);
    } catch (err) {
      throw err;
    }
  };

  const handleFilterOnChange = (e: React.FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.value) {
      return;
    }
    setFilterdValue(e.currentTarget.value);
  };

  return (
    <>
      <section id='subscribers' className='mt-4 subscribers'>
        <h3 className='text-2xl font-bold my-12 text-left'>
          List of subscribers
        </h3>

        <div className='subscribers-header'>
          <button onClick={handleGetListOfSubscriber}>Get Subscriber</button>
          <input
            type='text'
            onChange={handleFilterOnChange}
            value={filteredValue}
            placeholder='Search by id or endpoint'
            className='searchForm'
          />
          {subscribers.length > 0 && (
            <button className=' notify-btn' onClick={handleNotifyAll}>
              Notify all subscribers
            </button>
          )}
        </div>

        {isLoading ? (
          <div className='loading'>
            <Spinner aria-label='Default status example' />
          </div>
        ) : subscribers && subscribers.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className='my-16 mx-auto border-spacing-1 border border-slate-500'>
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
                {filteredData.map((sub, i) => {
                  return (
                    <tr
                      key={i}
                      className='shadow-sm hover:bg-gray-200 border-gray-500'
                    >
                      <td className='h-1 p-3 m-3 border-spacing-8'>
                        {formatString.wordWrap(sub.id, 10)}
                      </td>
                      <td className='h-1 p-3 m-3 border-spacing-8'>
                        {formatString.wordWrap(sub.endpoint, 50)}
                      </td>
                      <td className='h-1 p-3 m-3 border-spacing-8'>
                        {sub.expirationTime || 'Not available'}
                      </td>
                      <td
                        className='h-1 p-3 m-3 border-spacing-8 cursor-pointer'
                        // onClick={() => handleNotifyOne(sub)}
                      >
                        <span className='tooltip'>
                          <NotificationIcon
                            fillColor='#666'
                            path=' M17.1 12.6v-1.8A5.4 5.4 0 0 0 13 5.6V3a1 1 0 0 0-2 0v2.4a5.4 5.4 0 0 0-4 5.5v1.8c0 2.4-1.9 3-1.9 4.2 0 .6 0 1.2.5 1.2h13c.5 0 .5-.6.5-1.2 0-1.2-1.9-1.8-1.9-4.2ZM8.8 19a3.5 3.5 0 0 0 6.4 0H8.8Z'
                            handleOnClick={() => handleNotifyOne(sub)}
                          />
                          <span className='tooltiptext'>Notify this user</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className='no-subscribers'>
            <p>No subscribers at the moment.</p>
          </div>
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

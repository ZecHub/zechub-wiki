'use client';

import { NotificationIcon } from '@/components/ui/NotificationIcon';
import { PUSH_NOTIFICATION_API } from '@/config';
import { formatString } from '@/lib/helpers';
import { Modal, Spinner, Table, Tooltip } from 'flowbite-react';
import { useCallback, useState } from 'react';

import { SendNotificationForm } from '../send-notification-form/SendNotificationForm';
import './ListOfSubscribers.css';

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
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [notifyAll, setNotifyAll] = useState(false);
  const [filteredValue, setFilterdValue] = useState('');
  const [isError, setIsError] = useState(false);

  const filteredData = subscribers.filter((itm) =>
    itm.id.toLowerCase().includes(filteredValue.toLowerCase())
  );

  const handleGetListOfSubscriber = useCallback(async () => {
    try {
      setIsLoading(true);
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
      if (sub) {
        setIsLoading(false);
        setSubscribers(sub.data);
      }
    } catch (err) {
      setIsError(true);
      setIsLoading(false);
    }
  }, []);

  const handleOnOpen = () => {
    setOpenModal(true);
  };

  const handleOnCloseModal = () => {
    setOpenModal(false);
  };

  const handleNotifyOne = (subscriber: Subscriber) => {
    handleOnOpen();

    setSubscriber(subscriber);
  };

  const handleNotifyAll = () => {
    handleOnOpen();
    setNotifyAll(true);
  };

  return (
    <>
      <section id='subscribers' className='subscribers'>
        <div className='flex flex-col md:flex-row my-2'>
          <div className='my-2 md:w-1/2'>
            <h3 className='text-xl font-bold text-left  text-slate-600'>
              List of subscribers
            </h3>
          </div>
          <div className='my-2 md:w-1/2'>
            {subscribers.length > 1 && (
              <button className='px-4 ' onClick={handleNotifyAll}>
                Notify all
              </button>
            )}
          </div>
        </div>

        {!subscribers.length ? (
          <button onClick={handleGetListOfSubscriber} className='px-2 my-4'>
            Get Subscribers
          </button>
        ) : (
          subscribers.length === 0 && (
            <div className='no-subscribers '>
              <p className='text-sm '>No subscribers at the moment.</p>
            </div>
          )
        )}

        {isLoading && (
          <div className='loading'>
            <Spinner aria-label='page loading' />
          </div>
        )}

        {subscribers && subscribers.length > 0 && (
          <div className='overflow-x-auto'>
            <Table hoverable>
              <Table.Head className='bg-slate-500'>
                <Table.HeadCell>ID</Table.HeadCell>
                <Table.HeadCell>Endpoint</Table.HeadCell>
                <Table.HeadCell>Expiration Time</Table.HeadCell>
                <Table.HeadCell>Action</Table.HeadCell>
                <Table.HeadCell>
                  <span className='sr-only'>Send</span>
                </Table.HeadCell>
              </Table.Head>
              <Table.Body className='divide-y'>
                {filteredData.map((sub, i) => {
                  return (
                    <Table.Row
                      key={i}
                      className='bg-white dark:border-gray-700 dark:bg-gray-800'
                    >
                      <Table.Cell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
                        {formatString.wordWrap(sub.id, 10)}
                      </Table.Cell>
                      <Table.Cell>
                        {formatString.wordWrap(sub.endpoint, 28)}
                      </Table.Cell>
                      <Table.Cell>
                        {sub.expirationTime || 'Not available'}
                      </Table.Cell>
                      <Table.Cell>
                        <span className='font-medium text-cyan-600 hover:underline dark:text-cyan-500 hover:cursor-pointer '>
                          <Tooltip
                            placement='left'
                            content='   Notify this user'
                            trigger='hover'
                          >
                            <NotificationIcon
                              fillColor='#666'
                              path=' M17.1 12.6v-1.8A5.4 5.4 0 0 0 13 5.6V3a1 1 0 0 0-2 0v2.4a5.4 5.4 0 0 0-4 5.5v1.8c0 2.4-1.9 3-1.9 4.2 0 .6 0 1.2.5 1.2h13c.5 0 .5-.6.5-1.2 0-1.2-1.9-1.8-1.9-4.2ZM8.8 19a3.5 3.5 0 0 0 6.4 0H8.8Z'
                              handleOnClick={() => handleNotifyOne(sub)}
                            />
                          </Tooltip>
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className='sr-only'>Send</span>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          </div>
        )}
      </section>

      <Modal
        className='sm:pt-28'
        show={openModal}
        onClose={handleOnCloseModal}
        dismissible
      >
        <Modal.Header>Send Message</Modal.Header>
        <Modal.Body>
          <div className='space-y-6'>
            <SendNotificationForm
              subscribers={notifyAll ? subscribers : [subscriber]}
              handleOnCloseModal={handleOnCloseModal}
            />
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
}

'use client';

import {
  SubscriberWelcomeMessageType,
  getSubscriberWelcomeMessage,
} from '@/app/actions';
import { Modal, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { EditMessage } from './EditMessage';
import './SubscriberWelcomeMessage.css';

export const SubscriberWelcomeMessage = () => {
  const [subscribersWelcomMsg, setSubscribersWelcomMsg] = useState<
    SubscriberWelcomeMessageType[]
  >([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    getMessages();
  }, [openModal, isSubmitting]);

  const getMessages = async () => {
    try {
      setIsLoading(true);
      const { data } = await getSubscriberWelcomeMessage();
      const d = data as SubscriberWelcomeMessageType[];
      if (d) {
        setSubscribersWelcomMsg([...d]);
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <>
      <h3 className='text-xl font-bold my-2 text-left text-slate-600'>
        Subscribers message
      </h3>

      {isLoading ? (
        <Spinner style={{ alignSelf: 'center' }} className='pt-24' />
      ) : null}

      {!isLoading && subscribersWelcomMsg?.length > 0 ? (
        <div className=' text-sm text-left sub-messages md:text-base'>
          {subscribersWelcomMsg.map((msg, i) => (
            <div
              key={i}
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <p>
                <span className='font-bold'>Title:</span> {msg.title}
              </p>
              <p>
                <span className='font-bold'>Body:</span> {msg.body}
              </p>
            </div>
          ))}

          <button
            className='btn bg-teal-600 hover:bg-teal-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
            onClick={() => {
              setOpenModal(true);
            }}
          >
            Edit
          </button>
        </div>
      ) : (
        <div className='text-center space-x-8 my-4 '>
          <em className='sm:text-sm'>No default message set yet!</em>
          <button
            className='btn send'
            type='submit'
            onClick={() => setShowForm(false)}
          >
            Create
          </button>
        </div>
      )}

      <Modal
        className='sm:pt-28'
        show={openModal}
        onClose={() => setOpenModal(false)}
        dismissible
      >
        <Modal.Header>Edit Message</Modal.Header>
        <Modal.Body>
          <div className='space-y-6'>
            <EditMessage
              setOpenModal={setOpenModal}
              subscribersWelcomMsg={subscribersWelcomMsg}
              showForm={showForm}
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
              setShowForm={setShowForm}
            />
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
};

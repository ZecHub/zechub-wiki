import { useState } from 'react';
import './SendNotificationForm.css';
import { NOTIFICATION_PERMISSION } from '@/config';
import { toast } from 'react-toastify';
import { formatString } from '@/lib/helpers';
import { Subscriber } from '../ListOfSubscribers/ListOfSubscribers';

type FormStateData = {
  title?: string;
  body?: string;
  [index: string]: any;
};

type SendNotificationProps = {
  handleSendNotifications: (
    subscribers: Subscriber[],
    payload: any
  ) => Promise<void>;
  subscribers: any[];
  onClose: () => void;
};
export function SendNotificationForm(props: SendNotificationProps) {
  const [formFields, setFormFields] = useState<FormStateData>({});
  const [notificationPermission, setNotificationPermission] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleChange = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const target = e.currentTarget;
    const name = target.name;
    const value = target.value;

    setFormFields((formFields) => ({ ...formFields, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. check if serviceWorker/push notification is active
    const notifyPermission = localStorage.getItem(NOTIFICATION_PERMISSION);
    if (!notifyPermission) {
      toast.info(
        'You need to enable Notification API in order to use this feature.'
      );
      setNotificationPermission(true);
      return;
    }

    Object.keys(formFields).forEach((k, i) => {
      formFields[k] = formatString.titleCase(Object.values(formFields)[i]);
    });

    try {
      setIsSending(true);
      const res = await props.handleSendNotifications(
        props.subscribers,
        formFields
      );

      handleFormReset(e);
      setIsSending(false);
    } catch (err) {
      setIsSending(false);
      throw err;
    }
  };

  const handleFormReset = (e: React.FormEvent) => {
    e.preventDefault();

    const newFormData: any = {};

    for (let key in formFields) {
      newFormData[key] = '';
    }

    setFormFields(newFormData);
    props.onClose();
  };

  const handleEnableNotification = () => {
    // call handleShowNotification function
    console.log('called now');
    const notifyPermission = localStorage.getItem(NOTIFICATION_PERMISSION);
    if (notifyPermission) {
    }
    setNotificationPermission(!notificationPermission);
  };

  return (
    <>
      <section className=''>
        <form
          onSubmit={handleFormSubmit}
          id='sendNotificationForm'
          name='sendNotificationForm'
          className='sendNotificationForm'
        >
          <div className='header'>
            <h3>Send a notification</h3>
          </div>

          <label htmlFor='title'>
            <input
              type='text'
              id='title'
              name='title'
              value={formFields.title}
              placeholder='Enter title'
              onChange={handleChange}
              required
              disabled={isSending}
            />
          </label>

          <br />
          <label htmlFor='body'>
            <textarea
              cols={40}
              id='body'
              name='body'
              value={formFields.body}
              placeholder='Enter body content'
              onChange={handleChange}
              required
              disabled={isSending}
            />
          </label>
          <br />

          <div className='flex space-x-10'>
            <button type='submit' disabled={isSending}>
              {isSending ? 'Sending...' : 'Send'}
            </button>
            <button
              type='button'
              onClick={handleFormReset}
              className='cancelbtn'
            >
              Cancel
            </button>
            {notificationPermission ? (
              <button
                type='button'
                onClick={handleEnableNotification}
                className='cancelbtn'
              >
                Enable Notification
              </button>
            ) : null}
          </div>
        </form>
      </section>
    </>
  );
}

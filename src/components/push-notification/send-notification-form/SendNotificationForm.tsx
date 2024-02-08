import { NOTIFICATION_PERMISSION } from '@/config';
import { sendNotifications } from '@/lib/push-notification/pushHelpers';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z, ZodError } from 'zod';
import './SendNotificationForm.css';

export const zodSchema = z.object({
  title: z.string().min(2, { message: 'Must be two or more characters long' }),
  body: z.string().min(10, { message: 'Must be two or more characters long' }),
});

type FormStateData = {
  title?: string;
  body?: string;
  [index: string]: any;
};

type SendNotificationProps = {
  subscribers: any[];
  handleOnCloseModal: () => void;
};

export function SendNotificationForm(props: SendNotificationProps) {
  const [notificationPermission, setNotificationPermission] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleFormReset = () => {
    reset();
  };

  const handleOnSubmit = async (data: any) => {
    // 1. check if serviceWorker/push notification is active
    const notifyPermission = localStorage.getItem(NOTIFICATION_PERMISSION);
    if (!notifyPermission) {
      toast.warn(
        'You need to enable Notification API in order to use this feature.',
        {
          position: 'bottom-center',
        }
      );
      setNotificationPermission(true);
      return;
    }

    try {
      setIsSending(true);
      const validatedformData = zodSchema.parse(data);
      const clonedValidatedFields = Object.create(validatedformData);
      const encodedPairs = [];

      for (let key in clonedValidatedFields) {
        const encodedKey = encodeURIComponent(key);
        const encodedValue = encodeURIComponent(clonedValidatedFields[key]);

        encodedPairs.push(
          `${encodedKey.toLowerCase().trim()}=${encodedValue
            .toLowerCase()
            .trim()}`
        );
      }

      const res = await sendNotifications(
        props.subscribers,
        encodedPairs.join('^') as any
      );

      if (res.ok) {
        setIsSending(false);
        handleFormReset();
        props.handleOnCloseModal();
      }
    } catch (err: any) {
      setIsSending(false);

      if (err instanceof ZodError) {
        console.error(err);
      } else {
        toast.error('Failed submitting data', {
          closeButton: true,
          position: 'bottom-center',
        });
      }
    }
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
    <section className='flex flex-wrap mx-auto text-base text-gray-500 dark:text-gray-400'>
      <form
        className='flex flex-col gap-4 w-full'
        onSubmit={handleSubmit(handleOnSubmit)}
      >
        <div className='mb-4'>
          <label
            htmlFor='title'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            Title
          </label>
          <input
            type='text'
            id='title'
            placeholder='Enter title'
            className='w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500'
            disabled={isSending}
            {...register('title', {
              required: 'Title is required.',
            })}
            aria-invalid={errors.title ? 'true' : 'false'}
          />
          {errors.title?.message && (
            <p role='alert' style={{ color: 'red' }}>
              {errors.title?.message.toString()}
            </p>
          )}
        </div>
        <div className='mb-4'>
          <label
            htmlFor='description'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            Description
          </label>
          <textarea
            id='body'
            placeholder='Enter description'
            disabled={isSending}
            className='w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500'
            {...register('body', {
              required: 'Description is required',
            })}
            aria-invalid={errors.body ? 'true' : 'false'}
          />
          {errors.body?.message && (
            <p role='alert' style={{ color: 'red' }}>
              {errors.body?.message.toString()}
            </p>
          )}
        </div>

        <div className='flex space-x-10'>
          {/* <!-- Submit Button --> */}
          <button
            type='submit'
            className='bg-teal-600 hover:bg-teal-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
            disabled={isSending}
          >
            {isSending ? 'Sending...' : 'Send'}
          </button>
          <button
            className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
            disabled={isSending}
            onClick={(e) => {
              e.preventDefault();
              handleFormReset();
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}

import {
  SubscriberWelcomeMessageType,
  handlerUpdateSubscriberWelcomeMessage,
} from '@/app/actions';
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';
import { formatString } from '@/lib/helpers';
import { useState } from 'react';
import { experimental_useFormStatus as useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { ZodError } from 'zod';
import { WelcomeMessageProps, zodSchema } from './CreateMessge';

type EditFormProps = {
  setOpenModal: (arg: boolean) => void;
} & WelcomeMessageProps;

export function EditMessage(props: EditFormProps) {
  const { pending } = useFormStatus();
  const { body, title, id } = props.subscribersWelcomMsg[0];

  const [isSending, setIsSending] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubscriberWelcomeMessageType>();

  const handleFormReset = () => {
    reset();
  };

  const handleOnSubmit = async (data: any) => {
    try {
      setIsSending(true);
      const validatedformData = zodSchema.parse({ ...data, id });
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

      await handlerUpdateSubscriberWelcomeMessage(encodedPairs.join('Z'));
      setIsSending(false);
      handleFormReset();
      props.setOpenModal(false);
    } catch (err: any) {
      setIsSending(false);

      if (err instanceof ZodError) {
        console.error(err);
        toast.error(ErrorToast(err), {
          closeButton: true,
          position: 'bottom-center',
        });
      } else {
        toast.error('Failed submitting data', {
          closeButton: true,
          position: 'bottom-center',
        });
      }
    }
  };

  const ErrorToast = (err: any) => {
    return (
      <ul className='mb-4'>
        {err?.errors?.map((e: any, i: number) => (
          <li key={i} className='mb-4'>
            <p>
              Code:{' '}
              <span className='text-gray-700 text-sm font-bold'>
                {formatString.removeUnderscore(e.code)}
              </span>
            </p>
            <p>
              Message:{' '}
              <span className='text-gray-700 text-sm font-bold'>
                {e.message}
              </span>
            </p>
            <p>
              Path:{' '}
              <span className='text-gray-700 text-sm font-bold'>
                {e.path[i]}
              </span>
            </p>
            <p>
              Validation:{' '}
              <span className='text-gray-700 text-sm font-bold'>
                {e.validation}
              </span>
            </p>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <ErrorBoundary
      fallback={
        <p className='text-base leading-relaxed text-gray-500 dark:text-gray-400'>
          There was an error while loading the form...
        </p>
      }
    >
      <div className='"flex flex-wrap mx-auto text-base text-gray-500 dark:text-gray-400'>
        <form
          className='flex flex-col gap-4'
          onSubmit={handleSubmit(handleOnSubmit)}
          id='notificationForm'
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
                value: title,
                required: 'Title is required.',
              })}
              aria-invalid={errors.title ? 'true' : 'false'}
            />
            {errors.title?.message && (
              <p role='alert' style={{ color: 'red' }}>
                {errors.title?.message}
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
                value: body,
                required: 'Description is required',
              })}
              aria-invalid={errors.body ? 'true' : 'false'}
            />
            {errors.body?.message && (
              <p role='alert' style={{ color: 'red' }}>
                {errors.body?.message}
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
              {isSending ? 'Updating...' : 'Update'}
            </button>
            <button
              className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
              disabled={isSending}
              onClick={(e) => {
                e.preventDefault();

                handleFormReset();
                props.setOpenModal(false);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </ErrorBoundary>
  );
}

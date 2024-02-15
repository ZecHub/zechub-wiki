'use client';

import { getBannerMessage, saveBannerMessage } from '@/app/actions';
import { formatString } from '@/lib/helpers';
import { Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import { ZodError, z } from 'zod';

type NotificationBannerFormProps = {
  formAction: (data: FormData) => void;
};

export type FormDataType = {
  title?: string;
  description?: string;
  link?: string;
  send_btn_label?: string;
  [index: string]: any;
};

const FormSchema = z.object({
  title: z.string().min(2, { message: 'Must be two or more characters long' }),
  description: z
    .string()
    .min(2, { message: 'Must be two or more characters long' }),
  link: z.string().min(5).url({ message: 'Must be a valid url ' }),
  send_btn_label: z
    .string()
    .min(2, { message: 'Must be two or more characters long' }),
});

export function NotificationBannerForm(props: NotificationBannerFormProps) {
  const [formFields, setFormFields] = useState<FormDataType>({});
  const [isSending, setIsSending] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<FormDataType>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormDataType>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetching(true);
        const d = await getBannerMessage();

        setData(JSON.parse(d));
        setIsFetching(false);
      } catch (err) {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [isSending]);

  const onSubmit = async (data: any) => {
    try {
      setIsSending(true);
      const clonedValidatedFields = Object.create(FormSchema.parse(data));
      const encodedPairs = [];

      for (let key in clonedValidatedFields) {
        const encodedKey = encodeURIComponent(key);
        const encodedValue = encodeURIComponent(clonedValidatedFields[key]);
        encodedPairs.push(
          `${encodedKey.toLowerCase()}=${encodedValue.toLowerCase()}`
        );
      }

      await saveBannerMessage(encodedPairs.join('&'));
      setIsSending(false);
      handleFormReset();
    } catch (err: any) {
      setIsSending(false);

      if (err instanceof ZodError) {
        console.error(err);
        toast.error(ErrorToast(err), {
          closeButton: true,
          position: 'bottom-center',
        });
      } else {
        console.error(err);
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

  const handleFormReset = () => {
    console.log('clicked...');
    reset();
  };

  const handleParsedData = () => {
    if (data != undefined) {
      return (
        <div className='flex flex-col flex-wrap justify-items-start gap-2 text-gray-600'>
          <p>
            Title:
            <span className='font-semibold'> {data.title}</span>
          </p>
          <p>
            Description:
            <span className='font-semibold '> {data.description}</span>
          </p>
          <p>
            Link:{' '}
            <span className='font-semibold text-wrap'>
              <a href={data.link} target='_blank'>
                {formatString.wordWrap(data?.link!, 24)}
              </a>
            </span>
          </p>
          <p>
            Button Label:
            <span className='font-semibold'> {data.send_btn_label}</span>
          </p>
        </div>
      );
    } else {
      return <p className='text-gray-600 mt-4'>No info found!</p>;
    }
  };

  return (
    <>
      <div className='lg:md:container lg:mx-auto'>
        <div className='sm:flex-col-reverse flex flex-col md:flex-row mx-auto'>
          <div className='bg-gray-200 p-4 m-2 md:w-1/2'>
            <div className='p-6'>
              <h2 className='text-xl font-semibold text-gray-800 mb-2'>
                Create content
              </h2>
              <div className='mt-12'>
                <form
                  className='flex flex-col gap-4'
                  onSubmit={handleSubmit(onSubmit)}
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
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text'
                      disabled={isSending}
                      {...register('title', { required: 'Title is required.' })}
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
                      id='description'
                      placeholder='Enter description'
                      disabled={isSending}
                      className='w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500'
                      {...register('description', {
                        required: 'Description is required',
                      })}
                      aria-invalid={errors.description ? 'true' : 'false'}
                    />
                    {errors.description?.message && (
                      <p role='alert' style={{ color: 'red' }}>
                        {errors.description?.message}
                      </p>
                    )}
                  </div>

                  <div className='mb-4'>
                    <label
                      htmlFor='link'
                      className='block text-gray-700 text-sm font-bold mb-2'
                    >
                      Url link for redirect
                    </label>
                    <input
                      type='text'
                      id='link'
                      placeholder='Enter link for redirect'
                      disabled={isSending}
                      className='w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500'
                      {...register('link', {
                        required: 'Link is required',
                      })}
                      aria-invalid={errors.link ? 'true' : 'false'}
                    />
                    {errors.link?.message && (
                      <p role='alert' style={{ color: 'red' }}>
                        {errors.link?.message}
                      </p>
                    )}
                  </div>
                  <div className='mb-4'>
                    <label
                      htmlFor='send_btn_label'
                      className='block text-gray-700 text-sm font-bold mb-2'
                    >
                      Button label
                    </label>
                    <input
                      type='text'
                      id='send_btn_label'
                      placeholder='Enter label name of the button'
                      disabled={isSending}
                      className='w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500'
                      {...register('send_btn_label', {
                        required: 'Button label is required',
                      })}
                      aria-invalid={errors.send_btn_label ? 'true' : 'false'}
                    />
                    {errors.send_btn_label?.message && (
                      <p role='alert' style={{ color: 'red' }}>
                        {errors.send_btn_label?.message}
                      </p>
                    )}
                  </div>
                  <div className='flex space-x-10'>
                    {/* <!-- Submit Button --> */}
                    <button
                      type='submit'
                      className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                      disabled={isSending}
                    >
                      {isSending ? 'Sending...' : 'Send'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className='bg-gray-200 p-4 m-2 md:w-1/2'>
            <div className='p-6'>
              <h2 className='text-xl font-semibold text-gray-800 mb-2'>
                Current Notification Banner info
              </h2>
              <div className='mt-12'>
                {isFetching ? (
                  <Spinner
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignContent: 'center',
                      marginTop: '48px',
                    }}
                  />
                ) : (
                  handleParsedData()
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

'use client';

import { getBannerMessage, saveBannerMessage } from '@/app/actions';
import { formatString } from '@/lib/helpers';
import { Card, Spinner } from 'flowbite-react';
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
    reset();
  };

  const handleParsedData = () => {
    if (data != undefined) {
      return (
        <>
          <p className='text-gray-600 mb-2'>
            Title:
            <span className='font-semibold'>{data.title}</span>
          </p>
          <p className='text-gray-600 mb-2'>
            Description:
            <span className='font-semibold '> {data.description}</span>
          </p>
          <p className='text-gray-600 mb-2'>
            Link:
            <span className='font-semibold '>
              <a href={data.link}> {formatString.wordWrap(data?.link!, 18)}</a>
            </span>
          </p>
          <p className='text-gray-600 mb-2'>
            Button Label:
            <span className='font-semibold'> {data.send_btn_label}</span>
          </p>
        </>
      );
    } else {
      return <p className='text-gray-600 font-semibold mb-2'>No info found!</p>;
    }
  };

  return (
    <>
      <div className='max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl'>
        <div className='md:flex gap-8'>
          <div className='"flex flex-wrap mx-auto '>
            <Card className='max-w-sm   text-gray-700'>
              <form
                className='flex flex-col gap-4'
                onSubmit={handleSubmit(onSubmit)}
                id='notificationForm'
              >
                <div className='tracking-wide text-sm text-gray-500 font-semibold mb-8'>
                  Create a new Notification Banner content:
                </div>
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
                  <input
                    type='text'
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
                    Send button label
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
                  <button
                    onClick={handleFormReset}
                    type='submit'
                    className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                    disabled={isSending}
                  >
                    Reset
                  </button>
                </div>
              </form>
            </Card>
          </div>

          <div className='p-8 mx-auto'>
            <div className='tracking-wide text-sm text-gray-500 font-semibold mb-8'>
              Current Notification Banner info:
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
                color: 'rgb(38, 55, 131)',
                marginTop: '48px',
              }}
            >
              {isFetching ? <Spinner /> : handleParsedData()}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

'use client';

import {
  BannerMessageType,
  deleteBannerMessage,
  getBannerMessage,
  saveBannerMessage,
  updateBannerMessage,
} from '@/app/actions';
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
  urlRedirectLink?: string;
  buttonLabel?: string;
  [index: string]: any;
};

const FormSchema = z.object({
  title: z.string().min(2, { message: 'Must be two or more characters long' }),
  description: z
    .string()
    .min(2, { message: 'Must be two or more characters long' }),
  urlRedirectLink: z.string().min(5).url({ message: 'Must be a valid url ' }),
  buttonLabel: z
    .string()
    .min(2, { message: 'Must be two or more characters long' }),
});

export function NotificationBannerForm(props: NotificationBannerFormProps) {
  const [isSending, setIsSending] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [docToEdit, setDocToEdit] = useState<BannerMessageType>();
  const [toastifyBannerInfo, setToastifyBannerInfo] = useState<
    BannerMessageType[] | string
  >();

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
        await getAndUpdateBannerMsg();
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

  const handleFormReset = () => {
    reset();
  };

  const handleDeleteInfo = async (docId: string) => {
    try {
      setIsFetching(true);
      await deleteBannerMessage(docId);
      await getAndUpdateBannerMsg();

      setIsFetching(false);
    } catch (err) {
      setIsFetching(false);
      if (err instanceof ZodError) {
        toast.error(ErrorToast(err), {
          closeButton: true,
          position: 'bottom-center',
        });
      } else {
        toast.error('Failed to delete data', {
          closeButton: true,
          position: 'bottom-center',
        });
      }
    }
  };

  const getAndUpdateBannerMsg = async () => {
    const { data } = await getBannerMessage();
    setToastifyBannerInfo(data);
  };

  const handleParsedData = () => {
    if (Array.isArray(toastifyBannerInfo) && toastifyBannerInfo?.length > 0) {
      return (
        <div className='flex flex-col flex-wrap justify-start content-start gap-2 text-gray-600'>
          <ul>
            {toastifyBannerInfo.map((d, i) => (
              <li
                key={i}
                className='flex flex-col gap-1 mb-8 border border-gray-500 p-4'
              >
                <p>
                  Title:
                  <span className='font-semibold'> {d.title}</span>
                </p>

                <p>
                  Description:
                  <span className='font-semibold '> {d.description}</span>
                </p>
                <p>
                  Link:{' '}
                  <span className='font-semibold text-wrap'>
                    <a href={d.urlRedirectLink} target='_blank'>
                      {formatString.wordWrap(d?.urlRedirectLink!, 24)}
                    </a>
                  </span>
                </p>
                <p>
                  Button Label:
                  <span className='font-semibold'> {d.buttonLabel}</span>
                </p>
                <div className='flex gap-8 mt-4'>
                  <button
                    className={`bg-blue-500
                     hover:bg-blue-700
                     text-white 
                    font-bold 
                    py-2 
                    px-4 
                    rounded 
                    focus:outline-none 
                    focus:shadow-outline ${isEditing && 'cursor-not-allowed'}`}
                    disabled={isEditing}
                    onClick={() => {
                      setIsEditing(true);
                      setDocToEdit(d);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                    onClick={() => {
                      handleDeleteInfo(d.id!);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
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
                {isEditing ? (
                  <EditForm
                    doc={toastifyBannerInfo as any}
                    setIsEditing={setIsEditing}
                    getAndUpdateBannerMsg={getAndUpdateBannerMsg}
                  />
                ) : (
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
                        className='w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500'
                        disabled={isSending}
                        {...register('title', {
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
                        htmlFor='urlRedirectLink'
                        className='block text-gray-700 text-sm font-bold mb-2'
                      >
                        Url link for redirect
                      </label>
                      <input
                        type='text'
                        id='urlRedirectLink'
                        placeholder='Enter link for redirect'
                        disabled={isSending}
                        className='w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500'
                        {...register('urlRedirectLink', {
                          required: 'Link is required',
                        })}
                        aria-invalid={errors.urlRedirectLink ? 'true' : 'false'}
                      />
                      {errors.urlRedirectLink?.message && (
                        <p role='alert' style={{ color: 'red' }}>
                          {errors.urlRedirectLink?.message}
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
                        id='buttonLabel'
                        placeholder='Enter label name of the button'
                        disabled={isSending}
                        className='w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500'
                        {...register('buttonLabel', {
                          required: 'Button label is required',
                        })}
                        aria-invalid={errors.buttonLabel ? 'true' : 'false'}
                      />
                      {errors.buttonLabel?.message && (
                        <p role='alert' style={{ color: 'red' }}>
                          {errors.buttonLabel?.message}
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
                        {isSending ? 'Creating...' : 'Create'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          <div className='bg-gray-200 p-4 m-2 md:w-1/2'>
            <div className='p-6'>
              <h2 className='text-xl font-semibold text-gray-800 mb-2'>
                Current Notification Banner info
              </h2>
              <div className='mt-12 flex justify-center content-center mx-auto'>
                {isFetching ? <Spinner className='mt-4' /> : handleParsedData()}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

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
            <span className='text-gray-700 text-sm font-bold'>{e.message}</span>
          </p>
          <p>
            Path:{' '}
            <span className='text-gray-700 text-sm font-bold'>{e.path[i]}</span>
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

type EditFormProps = {
  doc: BannerMessageType[];
  setIsEditing: (arg: boolean) => void;
  getAndUpdateBannerMsg: () => void;
};
const EditForm = (props: EditFormProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { id, title, buttonLabel, description, urlRedirectLink } = props.doc[0];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormDataType>();

  const handleOnSubmitEditInfo = async (data: any) => {
    try {
      const encodeData = encodeURIComponent(JSON.stringify(data)).split('Z');
      setIsUpdating(true);

      await updateBannerMessage(id!, encodeData);

      setIsUpdating(false);
      props.getAndUpdateBannerMsg();
      props.setIsEditing(false);

      toast.success('Successful update', {
        position: 'bottom-center',
      });
    } catch (err) {
      setIsUpdating(false);

      if (err instanceof ZodError) {
        toast.error(ErrorToast(err), {
          closeButton: true,
          position: 'bottom-center',
        });
      } else {
        toast.error('Failed to update data', {
          closeButton: true,
          position: 'bottom-center',
        });
      }
    }
  };

  return (
    <>
      <form
        className='flex flex-col gap-4'
        onSubmit={handleSubmit(handleOnSubmitEditInfo)}
        id='notificationFormEdit'
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
            disabled={isUpdating}
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
            id='description'
            placeholder='Enter description'
            disabled={isUpdating}
            className='w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500'
            {...register('description', {
              value: description,
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
            htmlFor='urlRedirectLink'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            Url link for redirect
          </label>
          <input
            type='text'
            id='urlRedirectLink'
            placeholder='Enter link for redirect'
            disabled={isUpdating}
            className='w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500'
            {...register('urlRedirectLink', {
              value: urlRedirectLink,
              required: 'Link is required',
            })}
            aria-invalid={errors.urlRedirectLink ? 'true' : 'false'}
          />
          {errors.urlRedirectLink?.message && (
            <p role='alert' style={{ color: 'red' }}>
              {errors.urlRedirectLink?.message}
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
            disabled={isUpdating}
            className='w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500'
            {...register('buttonLabel', {
              value: buttonLabel,
              required: 'Button label is required',
            })}
            aria-invalid={errors.buttonLabel ? 'true' : 'false'}
          />
          {errors.buttonLabel?.message && (
            <p role='alert' style={{ color: 'red' }}>
              {errors.buttonLabel.message}
            </p>
          )}
        </div>
        <div className='flex space-x-10'>
          {/* <!-- Submit Button --> */}
          <button
            type='submit'
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              isUpdating && 'cursor-not-allowed'
            }`}
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Update'}
          </button>
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
            disabled={isUpdating}
            onClick={() => {
              console.log('cancelled .....');
              reset();
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
};

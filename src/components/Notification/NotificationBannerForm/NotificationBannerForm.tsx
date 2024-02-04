'use client';

import { getBannerMessage, saveBannerMessage } from '@/app/actions';
import { formatString } from '@/lib/helpers';
import { useEffect, useState } from 'react';
import { z } from 'zod';

type NotificationBannerFormProps = {
  formAction: (data: FormData) => void;
};

export type FormStateData = {
  title?: string;
  description?: string;
  image_src?: string;
  link?: string;
  send_btn_label?: string;
  [index: string]: any;
};

export function NotificationBannerForm(props: NotificationBannerFormProps) {
  const [formFields, setFormFields] = useState<FormStateData>({});
  const [isSending, setIsSending] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<FormStateData>();

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

  const handleChange = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    e.preventDefault();

    const target = e.currentTarget;
    const name = target.name;
    const value = target.value;
    setFormFields((formFields) => ({ ...formFields, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const schema = z.object({
      title: z.string().min(2),
      description: z.string().min(2),
      image_src: z.string(),
      link: z.string().min(5),
      send_btn_label: z.string().min(2),
    });

    const validatedFields = schema.parse(formFields);

    Object.keys(formFields).forEach((k, i) => {
      formFields[k] = formatString.titleCase(Object.values(formFields)[i]);
    });

    try {
      setIsSending(true);
      await saveBannerMessage(validatedFields);

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
    // props.onClose();
  };

  const handleParseData = () => {
    if (data != undefined) {
      return (
        <div className='my-4 p-4 border rounded-md shadow-md'>
          <p className='text-xl font-semibold mb-2'>Title: {data.title}</p>
          <p className='text-gray-600 mb-2'>Description: {data.description}</p>
          <p className='text-gray-600 mb-2'>
            Link:
            <a href={data.link}></a>
          </p>
          <p className='text-gray-600 mb-2'>
            Send button label: {data.send_btn_label}
          </p>
        </div>
      );
    } else {
      return (
        <div className='my-4 p-4 border rounded-md shadow-md'>
          <p className='text-xl font-semibold mb-2'>No info found!</p>
        </div>
      );
    }
  };
  return (
    <div className='bg-gray-100 min-h-screen flex '>
      <div className='bg-white max-w-md p-8 rounded-md shadow-md'>
        {/* <!-- Form Title --> */}
        <h2 className='text-2xl font-semibold mb-4'>Simple Form</h2>

        {/* <!-- Form Inputs --> */}
        <form
          id='notificationForm'
          name='notificationForm'
          onSubmit={handleFormSubmit}
        >
          {/* <!-- Input 1: Title --> */}
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
              name='title'
              placeholder='title'
              className='w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500'
              value={formFields.title}
              onChange={handleChange}
              required
              disabled={isSending}
            />
          </div>
          {/* <!-- Input 2: Description --> */}
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
              name='description'
              placeholder='description'
              className='w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500'
              value={formFields.description}
              onChange={handleChange}
              required
              disabled={isSending}
            />
          </div>
          {/* <!-- Input 3: Image src --> */}
          <div className='mb-4'>
            <label
              htmlFor='image_src'
              className='block text-gray-700 text-sm font-bold mb-2'
            >
              Image Src
            </label>
            <input
              type='text'
              id='image_src'
              name='image_src'
              placeholder='Link to image'
              className='w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500'
              value={formFields.image_src}
              onChange={handleChange}
              required
              disabled={isSending}
            />
          </div>
          {/* <!-- Input 4: Link --> */}
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
              name='link'
              placeholder='Link for redirect'
              className='w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500'
              value={formFields.link}
              onChange={handleChange}
              required
              disabled={isSending}
            />
          </div>

          {/* <!-- Input 5: send_btn_label --> */}
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
              name='send_btn_label'
              placeholder='Label name of the button'
              className='w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500'
              value={formFields.send_btn_label}
              onChange={handleChange}
              required
              disabled={isSending}
            />
          </div>

          <div className='flex space-x-10'>
            {/* <!-- Submit Button --> */}
            <button
              className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
              disabled={isSending}
            >
              {isSending ? 'Sending...' : 'Send'}
            </button>
            <button
              className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600'
              type='button'
              onClick={handleFormReset}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <div className='p-12'>
        <h2>Current Notification Banner info:</h2>
        {isFetching ? <p>Loading....</p> : handleParseData()}
      </div>
    </div>
  );
}

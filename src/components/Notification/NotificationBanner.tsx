'use client';
import { BannerMessageType } from '@/app/actions';
import { formatString } from '@/lib/helpers';
import { useEffect, useState } from 'react';
import { Slide, ToastContainer, toast } from 'react-toastify';
import './NotificationBanner.css';

const toastId = 'custom-id-to-prevent-duplicate';
export const NotificationBanner = () => {
  const [data, setData] = useState<BannerMessageType>();

  useEffect(() => {
    async function getData() {
      try {
        const res = await fetch(
          '/site/toastify-banner-notification/banner-notification.json'
        );
        const data: BannerMessageType[] = await res.json();
        console.log('data: ', data[0]);
        setData(data[0]);
      } catch (err: any) {
        console.error(err.message);
        toast.error(
          <div className='notification-banner'>
            <p>{`Error fetching data...`}</p>
          </div>,
          {
            position: 'top-right',
            autoClose: 8000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            transition: Slide,
            toastId: 'custom-error-id-to-prevent-duplicate',
            progressClassName: 'toast-progress-bar',
            className: 'toast-message',
          }
        );
      }
    }
    getData();

    toast(
      <div className='notification-banner'>
        {data?.title && (
          <>
            <h1>{formatString.titleCase(data?.title!)}</h1>
            <p>{formatString.titleCase(data?.description!)}</p>
            <a href={data?.urlRedirectLink} target='_blank' className='btn'>
              {formatString.titleCase(data?.buttonLabel!)}
            </a>
          </>
        )}
      </div>,
      {
        position: 'top-right',
        autoClose: 8000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        transition: Slide,
        toastId: toastId,
        progressClassName: 'toast-progress-bar',
        className: 'toast-message',
      }
    );
  }, [
    data?.buttonLabel,
    data?.description,
    data?.title,
    data?.urlRedirectLink,
  ]);

  return (
    <>
      <ToastContainer containerId={toastId} />
    </>
  );
};

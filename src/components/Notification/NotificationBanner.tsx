'use client';
import { BannerMessageType } from '@/app/actions';
import { useEffect, useState } from 'react';
import { Slide, ToastContainer, toast } from 'react-toastify';
import './NotificationBanner.css';

export type NotificationBannerProps = {
  bannerMsg: {
    data: BannerMessageType[];
    error: string;
  };
};

const toastId = 'custom-id-to-prevent-duplicate';
export const NotificationBanner = (props: NotificationBannerProps) => {
  // const { buttonLabel, description, title, urlRedirectLink } =
  //   props.bannerMsg?.data[0];
  const [data, setData] = useState<BannerMessageType>();

  useEffect(() => {
    async function getData() {
      try {
        const res = await fetch(
          '/site/toastify-banner-notification/banner-notification.json'
        );
        const data = await res.json();
        console.log('data: ', data);
        setData(data);
      } catch (err) {
        console.error(err);
        toast.error(
          <div className='notification-banner'>
            <p>{'Error fetching data...'}</p>
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
        <h1>{data?.title}</h1>
        <p>{data?.description}</p>
        <a href={data?.urlRedirectLink} target='_blank' className='btn'>
          {data?.buttonLabel}
        </a>
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
    data?.title,
    data?.buttonLabel,
    data?.description,
    data?.urlRedirectLink,
  ]);

  return (
    <>
      <ToastContainer containerId={toastId} />
    </>
  );
};

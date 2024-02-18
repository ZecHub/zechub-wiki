'use client';
import { BannerMessageType } from '@/app/actions';
import { useCallback, useEffect } from 'react';
import { Slide, ToastContainer, toast } from 'react-toastify';
import './NotificationBanner.css';

export type NotificationBannerProps = {
  bannerMsg: {
    data: BannerMessageType[];
    error: string;
  };
};

const customId = 'custom-id-to-prevent-duplicate';

export const NotificationBanner = (props: NotificationBannerProps) => {
  const { buttonLabel, description, title, urlRedirectLink } =
    props.bannerMsg?.data[0];

  useEffect(() => {
    displayToast();
  });

  const displayToast = useCallback(() => {
    toast(
      <div className='notification-banner'>
        <h1>{title}</h1>
        <p>{description}</p>
        <a href={urlRedirectLink} target='_blank' className='btn'>
          {buttonLabel}
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
        toastId: customId,
        progressClassName: 'toast-progress-bar',
        className: 'toast-message',
      }
    );
  }, [buttonLabel, description, title, urlRedirectLink]);

  return (
    <>
      <ToastContainer />
    </>
  );
};

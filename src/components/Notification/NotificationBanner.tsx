'use client';
import Image from 'next/image';
import { useEffect } from 'react';
import { Slide, ToastContainer, toast } from 'react-toastify';
import './NotificationBanner.css';

export type Post = {
  title: string;
  description: string;
  image_src: string;
  link: string;
  link_name: string;
};

type NotificationBannerProps = {
  post: Post;
};

const customId = 'custom-id-to-prevent-duplicate';

export const NotificationBanner = (props: NotificationBannerProps) => {
  useEffect(() => {
    displayToast();
  }, [props.post.title]);

  const Read = () => {
    return (
      <div className='notification-banner'>
        <h1>{props.post.title}</h1>
        <p>{props.post.description}</p>
        <a href={props.post.link} target='_blank' className='btn'>
          {props.post.link_name}
        </a>
      </div>
    );
  };

  const displayToast = () => {
    toast(<Read />, {
      icon: props.post?.image_src
        ? () => (
            <Image
              width={40}
              height={40}
              src={props.post.image_src}
              alt={props.post.title}
              className='img'
            />
          )
        : undefined,
      position: 'top-right',
      autoClose: 10000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      transition: Slide,
      toastId: customId,
      progressClassName: 'toast-progress-bar',
      className: 'toast-message',
    });
  };

  return (
    <>
      <ToastContainer />
    </>
  );
};

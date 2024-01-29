'use client';

import { getSubscriberWelcomeMessage } from '@/app/actions';
import { NOTIFICATION_PERMISSION } from '@/config';
import { logger } from '@/lib/helpers';
import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import {
  registerServiceWorker,
  requestPermissionForNotification,
  subscribeToPushNotification,
  unsubscribeToPushNotification,
} from '../lib/push-notification/pushHelpers';

import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type AppProviderProps = {
  children: React.ReactNode;
};
/**
 * This is Component serves as the root for every provider
 * required in this app
 * @param props React.ReactNode
 */
export function AppProvider(props: AppProviderProps) {
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>('default');

  const { user, error, isLoading } = useUser();

  useEffect(() => {
    const notificationPermission = localStorage.getItem(
      NOTIFICATION_PERMISSION
    );

    if (notificationPermission === 'granted') {
      setNotificationPermission(notificationPermission);
    }

    logger({
      description: 'notificationPermission: ',
      data: notificationPermission,
      type: 'log',
    });
  }, []);

  useEffect(() => {
    navigator.serviceWorker.addEventListener('message', (e) => {
      // handle the notification
      logger({
        description: 'Notification received',
        data: e.data,
        type: 'log',
      });
    });
  });

  const getProfile = () => {
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;

    if (user) {
      return (
        <div
          style={{
            padding: '12px',
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
          }}
        >
          <Image
            width={40}
            height={40}
            src={user.picture!}
            alt={user.name!}
            style={{ borderRadius: '50%', fontWeight: 700 }}
          />
          <h2>{user.email}</h2>
        </div>
      );
    }
  };

  /**
   * This function activates the push notification
   */
  const handleSubscribePushNotification = async () => {
    if (!('Notification' in window)) {
      toast.info('No support for Notification API!', {
        position: 'bottom-center',
        autoClose: 3000,
        hideProgressBar: false,
        pauseOnHover: true,
        progress: undefined,
        theme: 'colored',
        transition: Bounce,
      });
    }

    const notificationPermission = localStorage.getItem(
      NOTIFICATION_PERMISSION
    );

    if (notificationPermission === 'granted') {
      registerServiceWorker();
      await subscribeToPushNotification();

      const { data } = await getSubscriberWelcomeMessage();

      if (Array.isArray(data)) {
        navigator.serviceWorker.ready.then((reg) => {
          reg.showNotification(data[0].title, {
            body: data[0].body,
            icon: data[0].icon,
            image: data[0].image,
          });
        });
      }
    } else if (notificationPermission != 'denied') {
      try {
        const permission = await requestPermissionForNotification();
        if (permission === 'granted') {
          localStorage.setItem(NOTIFICATION_PERMISSION, permission);
          setNotificationPermission(permission);
          await handleSubscribePushNotification();
        }
      } catch (err: any) {
        logger({
          description: 'Push Permission not granted!',
          data: err,
          type: 'error',
        });
      }
    }
  };

  const handleUnsubscribePushNotification = async () => {
    await unsubscribeToPushNotification();

    // unregister serviceWorker
    const swReg = await navigator.serviceWorker.getRegistration();
    if (swReg?.active?.state === 'activated') {
      await swReg.unregister();

      localStorage.removeItem(NOTIFICATION_PERMISSION);
      setNotificationPermission('default');
    }
  };

  const handleAuthDisplay = () => {
    return (
      <div style={{ margin: '16px 0' }}>
        {user && user.name && getProfile()}

        {user && user.name ? (
          <a
            href='/api/auth/logout'
            style={{ backgroundColor: 'gray', padding: '12px' }}
          >
            Logout
          </a>
        ) : (
          <a
            href='/api/auth/login'
            style={{ backgroundColor: 'green', padding: '12px' }}
          >
            Login
          </a>
        )}
        <br />
      </div>
    );
  };

  const subscriptionButtons = () => {
    console.log(
      'notificationPermission === granted',
      notificationPermission === 'granted'
    );

    return notificationPermission === 'granted' ? (
      <button
        onClick={handleUnsubscribePushNotification}
        style={{
          backgroundColor: 'red',
          padding: '12px',
          color: '#ffffff',
        }}
      >
        Unsubscribe Notifications
      </button>
    ) : (
      <button
        onClick={async () => handleSubscribePushNotification()}
        style={{
          backgroundColor: 'green',
          padding: '12px',
          color: '#ffffff',
        }}
      >
        Subscribe Notifications
      </button>
    );
  };

  return (
    <>
      {handleAuthDisplay()}
      {subscriptionButtons()}
      {props.children}
      <ToastContainer
        position='bottom-center'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={'colored'}
        transition={Bounce}
      />
    </>
  );
}

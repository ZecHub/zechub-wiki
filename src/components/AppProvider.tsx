'use client';

import {
  SubscriberWelcomeMessageType,
  getSubscriberWelcomeMessage,
} from '@/app/actions';
import { NOTIFICATION_PERMISSION } from '@/config';
import { SessionProvider } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import {
  registerServiceWorker,
  requestPermissionForNotification,
  subscribeToPushNotification,
  unsubscribeToPushNotification,
} from '../lib/push-notification/pushHelpers';

import { Tooltip } from 'flowbite-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NotificationIcon } from './ui/NotificationIcon';

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

  useEffect(() => {
    const notifyPermission = localStorage.getItem(NOTIFICATION_PERMISSION);

    if (notifyPermission === 'granted') {
      setNotificationPermission(notifyPermission);
    }
  }, [notificationPermission]);

  useEffect(() => {
    navigator.serviceWorker.addEventListener('message', (e) => {
      // handle the notification
    });
  });

  const showNotification = (data: string | SubscriberWelcomeMessageType[]) => {
    if (Array.isArray(data)) {
      navigator.serviceWorker.ready.then(async (reg) => {
        await reg.showNotification(data[0].title, {
          body: data[0].body,
          icon: data[0].icon,
          image: data[0].image,
        });
      });
    }
  };

  const registerPushAndShowNotification = async (
    data: string | SubscriberWelcomeMessageType[]
  ) => {
    await registerServiceWorker();
    await subscribeToPushNotification();
    showNotification(data);
  };

  /**
   * This function activates the push notification
   */
  const handleSubscribePushNotification = async () => {
    if (!('Notification' in window)) {
      toast.info('No support for Notification API!');
    }

    const { data } = await getSubscriberWelcomeMessage();

    if (notificationPermission === 'granted') {
      await registerPushAndShowNotification(data);
      return;
    }

    if (notificationPermission != 'denied') {
      try {
        const permission = await requestPermissionForNotification();
        if (permission === 'granted') {
          await registerPushAndShowNotification(data);
          localStorage.setItem(NOTIFICATION_PERMISSION, permission);
          setNotificationPermission(permission);
        }
      } catch (err: any) {
        console.error('Push Permission not granted!', err);
      }
    }
  };

  const handleUnsubscribePushNotification = async () => {
    try {
      // unregister serviceWorker
      const { sub, response, swRegistration } =
        await unsubscribeToPushNotification();

      if (response.status === 200) {
        await sub?.unsubscribe();

        localStorage.removeItem(NOTIFICATION_PERMISSION);

        setNotificationPermission('default');
        await swRegistration?.unregister();

        toast.success("You've have unsubscribed!");
      }
    } catch (err: any) {
      console.error('Failed to unsubscribe to Push Notification!', err.message);
      toast.error('Failed to unsubscribe!');
    }
  };

  /**
   * @dev Push Subscription that triggers the permission
   * for sending a user Push Notification
   * @returns React.ReactNode
   */
  const handleSubscriptionButtons = () => {
    return (
      <div
        className='notification'
        style={{
          position: 'fixed',
          bottom: '120px',
          right: '30px',
          cursor: 'pointer',
        }}
      >
        {notificationPermission === 'granted' ? (
          <div className='flex gap-2'>
            <Tooltip content=' Unsubscribe Notifications' placement='left'>
              <NotificationIcon
                fillColor='red'
                path='
              M17.1 12.6v-1.8A5.4 5.4 0 0 0 13 5.6V3a1 1 0 0 0-2 0v2.4a5.4 5.4 0 0 0-4 5.5v1.8c0 2.4-1.9 3-1.9 4.2 0 .6 0 1.2.5 1.2h13c.5 0 .5-.6.5-1.2 0-1.2-1.9-1.8-1.9-4.2Zm-13.2-.8a1 1 0 0 1-1-1c0-2.3.9-4.6 2.5-6.4a1 1 0 1 1 1.5 1.4 7.4 7.4 0 0 0-2 5 1 1 0 0 1-1 1Zm16.2 0a1 1 0 0 1-1-1c0-1.8-.7-3.6-2-5a1 1 0 0 1 1.5-1.4c1.6 1.8 2.5 4 2.5 6.4a1 1 0 0 1-1 1ZM8.8 19a3.5 3.5 0 0 0 6.4 0H8.8Z                
             '
                handleOnClick={handleUnsubscribePushNotification}
              />
            </Tooltip>
          </div>
        ) : (
          <div className='flex gap-2'>
            <Tooltip content=' Subscribe Notifications' placement='left'>
              <NotificationIcon
                fillColor='green'
                path=' M17.1 12.6v-1.8A5.4 5.4 0 0 0 13 5.6V3a1 1 0 0 0-2 0v2.4a5.4 5.4 0 0 0-4 5.5v1.8c0 2.4-1.9 3-1.9 4.2 0 .6 0 1.2.5 1.2h13c.5 0 .5-.6.5-1.2 0-1.2-1.9-1.8-1.9-4.2ZM8.8 19a3.5 3.5 0 0 0 6.4 0H8.8Z'
                handleOnClick={handleSubscribePushNotification}
              />
            </Tooltip>
          </div>
        )}
      </div>
    );
  };

  return (
    <SessionProvider>
      {/* {handleSubscriptionButtons()} */}
      {props.children}
      <ToastContainer />
    </SessionProvider>
  );
}

'use client';

import { getSubscriberWelcomeMessage } from '@/app/actions';
import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import {
  registerServiceWorker,
  subscribeToPushNotification,
} from '../lib/push-notification/pushHelpers';

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
    useState<NotificationPermission>();

  const { user, error, isLoading } = useUser();

  useEffect(() => {
    navigator.serviceWorker.addEventListener('message', (e) => {
      // handle the notification
      console.log('Notification received: ', e.data);
    });
  });

  useEffect(() => {
    registerServiceWorker();
  }, [notificationPermission, isLoading]);

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
  const handleShowNotification = async () => {
    if (!('Notification' in window)) {
      throw new Error('No support for Notification API');
    }

    if (Notification.permission === 'granted') {
      subscribeToPushNotification();
      const { data } = await getSubscriberWelcomeMessage();

      if (Array.isArray(data)) {
        navigator.serviceWorker.ready.then((reg) => {
          reg.showNotification(data[0].title, {
            body: data[0].body, // 'This is a notification from your ZecHub!',
            icon: data[0].icon, // 'https://i.ibb.co/ysPDS9Q/Zec-Hub-blue-globe.png',
            image: data[0].image, // 'https://i.ibb.co/ysPDS9Q/Zec-Hub-blue-globe.png',
          });
        });
      }
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          setNotificationPermission(permission);
          handleShowNotification();
        }
      });
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
    return notificationPermission === 'granted' ? (
      <button
        onClick={handleShowNotification}
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
        onClick={handleShowNotification}
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
    </>
  );
}

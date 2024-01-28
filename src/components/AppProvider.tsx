'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import React, { useEffect, useState } from 'react';
import {
  registerServiceWorker,
  subscribeToPushNotification,
} from '../lib/push-notification/helpers';
type AppProviderProps = {
  children: React.ReactNode;
};
/**
 * This is Component serves as the root for every provider
 * required in this app
 * @param props React.ReactNode
 */
export function AppProvider(props: AppProviderProps) {
  const [notificationPermission, setNotificationPermission] = useState(false);

  const { user, error, isLoading } = useUser();

  useEffect(() => {
    navigator.serviceWorker.addEventListener('message', (e) => {
      // handle the notification
      console.log('Notification received: ', e.data);
    });
  });

  useEffect(() => {
    registerServiceWorker();
  }, [notificationPermission]);

  const getProfile = () => {
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;

    if (user) {
      return (
        <div style={{ padding: '12px' }}>
          <img src={user.picture!} alt={user.name!} />
          <h2>{user.name}</h2>
        </div>
      );
    }
  };
  /**
   * This function activates the push notification
   */
  const handleShowNotification = () => {
    if (!('Notification' in window)) {
      throw new Error('No support for Notification API');
    }

    if (Notification.permission === 'granted') {
      subscribeToPushNotification();

      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification('ZecHub Notification', {
          body: 'This is a notification from your ZecHub!',
          icon: '../lib/push-notification/icon/zechubLogo.jpg',
        });
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          setNotificationPermission(true);
          handleShowNotification();
        }
      });
    }
  };

  return (
    <>
      <div>
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
        <button
          onClick={handleShowNotification}
          style={{
            backgroundColor: notificationPermission ? 'green' : 'red',
            padding: '12px',
          }}
        >
          Show Notification
        </button>
      </div>
      {props.children}
    </>
  );
}

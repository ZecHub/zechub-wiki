'use client';

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

  useEffect(() => {
    navigator.serviceWorker.addEventListener('message', (e) => {
      // handle the notification
      console.log('Notification received: ', e.data);
    });
  });

  useEffect(() => {
    registerServiceWorker();
  }, [notificationPermission]);

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
      {/* {permission && (
        <div className='static'>
          <button onClick={async () => await initPushNotification()}>
            Subscribe to the latest events
          </button>
        </div>
      )} */}
      <div>
        <br />
        <button
          onClick={handleShowNotification}
          style={{ backgroundColor: notificationPermission ? 'green' : 'red' }}
        >
          Show Notification
        </button>
      </div>
      {props.children}
    </>
  );
}

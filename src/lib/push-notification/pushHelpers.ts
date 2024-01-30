import { PUSH_NOTIFICATION_API, WEB_PUSH_VAPID_PUBLIC_KEY } from '@/config';
import { logger } from '../helpers';
import { Subscriber } from '@/components/push-notification/ListOfSubscribers/ListOfSubscribers';

/**
 * Thi registers the service worker
 * @returns Promise[ServiceWorkerRegistration] which is used to acces the
 * PushManagerAPI
 */
export const registerServiceWorker = () => {
  if (!('serviceWorker' in navigator)) {
    throw Error('No support for service worker');
  }

  // return navigator.serviceWorker
  //   .register('./sw.js', {
  //     scope: './', // TODO: come back to this and remove scope
  //   })
  //   .then((swReg) => {
  //     console.log('Service Worker registered with scope: ', swReg.scope);
  //     return swReg;
  //   })
  // .catch((err) => {
  // });

  try {
    const swReg = navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });
    return swReg;
  } catch (err) {
    console.error('Service Worker registration failed:', err);
    // throw err;
  }
};

export const requestPermissionForNotification = async () => {
  const permission = await Notification.requestPermission();

  if (permission !== 'granted') {
    throw new Error('Notification permission not granted');
  }

  return permission;
};

export const subscribeToPushNotification = async () => {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlB64ToUint8Array(WEB_PUSH_VAPID_PUBLIC_KEY),
    });

    // Send the subscription to your server for future use
    await sendToServer({
      method: 'POST',
      url: PUSH_NOTIFICATION_API.url.subscription,
      subscribers: subscription,
      payload: {},
    });
  } catch (error) {
    throw error;
  }
};

export const unsubscribeToPushNotification = async (): Promise<{
  sub: PushSubscription | null | undefined;
  response: Response;
  swRegistration: ServiceWorkerRegistration | undefined;
}> => {
  try {
    const swRegistration = await navigator.serviceWorker.getRegistration();
    const sub = await swRegistration?.pushManager.getSubscription();
    logger({ description: 'subscription: ', data: sub, type: 'log' });

    let response: Response = {} as any;

    if (sub?.endpoint) {
      // Send the subscription to your server to delete client from db
      response = await sendToServer({
        url: PUSH_NOTIFICATION_API.url.removeSubscription,
        method: 'DELETE',
        payload: { endpoint: sub?.endpoint },
      });
    }

    return { sub, response, swRegistration };
  } catch (err) {
    logger({
      description: 'Error unsubscribing from push notifications:',
      data: err,
      type: 'error',
    });
    throw err;
  }
};

type NotificationTypes = {
  payload: Record<string, any>;
  subscribers?: Record<string, any> | Record<string, any>[];
};
type SendToServerTypes = {
  url: string;
  method: 'POST' | 'GET' | 'UPDATE' | 'OPTION' | 'DELETE';
} & NotificationTypes;

export async function sendToServer(args: SendToServerTypes) {
  try {
    logger({ description: 'sendToServer...', data: args, type: 'log' });
    const res = await fetch(args.url, {
      method: args.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ payload: args.payload, sub: args.subscribers }),
    });

    return res;
  } catch (err) {
    throw err;
  }
}

export async function sendNotifications(
  subscribers: Subscriber[] | Subscriber,
  payload: Record<string, any>
) {
  await sendToServer({
    method: 'POST',
    url: PUSH_NOTIFICATION_API.url.notify.one,
    payload,
    subscribers,
  });
}

export async function sendNotificationToOne(
  subscribers: Record<string, any> | Record<string, any>[],
  payload: Record<string, any>
) {
  await sendToServer({
    method: 'POST',
    url: PUSH_NOTIFICATION_API.url.notify.one,
    payload,
    subscribers,
  });
}

export async function sendNotificationToAll({
  subscribers,
  payload,
}: NotificationTypes) {
  sendToServer({
    method: 'POST',
    url: PUSH_NOTIFICATION_API.url.notify.all,
    payload,
    subscribers,
  });
}

/**
 * This function check is a window client is the currently focus (active)
 * window the user is on
 * @returns boolean
 */
// export function windowIsFocused(clients: Window[]): Promise<boolean> {
//   return clients
//     .matchAll({ type: 'window', includeUncontrolled: true })
//     .then((winClients) => {
//       let isFocused = false;

//       for (let i = 0; i < winClients.length; i++) {
//         const winClient = winClients[i];
//         if (winClient.focused) {
//           isFocused = true;
//           break;
//         }
//       }

//       return isFocused;
//     });
// }

/**
 * Exception Rule of `Sending Notification`
 * The one scenario where you don't have to show a notification is when the user has your site open and focused.
 */
// function sendNotificationWhenNotActiveWindow() {
//   const p = windowIsFocused(self).then((isFocused) => {
//     if (isFocused) {
//       console.log('Window is already focused; no need to show notification');
//       return;
//     }

//     // if not
//     return self.registration.showNotification('Had to show a notification.');
//   });
// }

// const skipWait = async () => {
//   const reg = await navigator.serviceWorker.getRegistration();

//   if (!reg || !reg.waiting) return;

//   reg.waiting.postMessage('skip-waiting');
// };


/* Utility functions. */

// Convert a base64 string to Uint8Array.
// Must do this so the server can understand the VAPID_PUBLIC_KEY.
export const urlB64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

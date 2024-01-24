import { WEB_PUSH_VAPID_PUBLIC_KEY } from '@/config';

/**
 * Thi registers the service worker
 * @returns Promise[ServiceWorkerRegistration] which is used to acces the
 * PushManagerAPI
 */
export const registerServiceWorker = () => {
  if (!('serviceWorker' in navigator)) {
    throw new Error('No support for service worker');
  }

  navigator.serviceWorker
    .register('sw.js')
    .then((swReg) => {
      console.log('Service Worker registered with scope: ', swReg.scope);
    })
    .catch((err) => {
      console.log('Service Worker registration failed:', err);
    });
};

export const requestPermissionForNotification = async () => {
  const permission = await Notification.requestPermission();

  if (permission !== 'granted') {
    throw new Error('Notification permission not granted');
  } else {
    return permission;
  }
};

export const subscribeToPushNotification = async () => {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlB64ToUint8Array(WEB_PUSH_VAPID_PUBLIC_KEY),
    });

    console.log('Push subscription:', JSON.stringify(subscription));

    // Send the subscription to your server for future use
    // Example: Send subscription to your backend
    // axios.post('/api/subscribe', { subscription });
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
  }
};

 
// export async function sendNotifications(subscribers: any[]) {
//   // Create notification content
//   const notification = JSON.stringify({
//     title: 'Hello, Notification',
//     options: {
//       body: `ID: ${Math.floor(Math.random() * 100)}`,
//     },
//   });

//   try {
//     // send push message to client in the subscribers array
//     subscribers.forEach(async (sub) => {
//       const endpoint = String(sub.endpoint);
//       const id = endpoint.substring(endpoint.length - 8, endpoint.length);

//       const res = await webpush.sendNotification(sub, notification, {
//         TTL: 1000,
//         vapidDetails: {
//           subject: `mailto:${WEB_PUSH_VAPID_SUBJECT}`,
//           publicKey: WEB_PUSH_VAPID_PUBLIC_KEY,
//           privateKey: WEB_PUSH_VAPID_PRIVATE_KEY,
//         },
//       });

//       console.log(`Endpoint ID: ${id}`);
//       console.log(`Result: ${res.statusCode}`);
//     });
//   } catch (err) {
//     console.error(err);
//   }
// }

// export function sendSubToSever(sub: PushSubscription, serverURL: string) {
//   return fetch('serverURL', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(sub),
//   })
//     .then((res) => {
//       if (!res.ok) {
//         throw new Error('Post not successful...');
//       }

//       return res.json();
//     })
//     .then((d) => {
//       if (!(d.data && d.data.success)) {
//         throw new Error('No response!');
//       }
//     });
// }

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

// notify?.addEventListener('click', (e) => {
//   console.log(e);
// });
// notify?.addEventListener('show', (e) => {
//   console.log(e);
// });
// notify?.addEventListener('close', (e) => {
//   console.log(e);
// });
// notify?.addEventListener('error', (e) => {
//   console.log(e);
// });

// self.addEventListener('push', (e) => {
//   if (e.data) {
//     console.log('has data');
//   }

//   const p = self.registration.show('hello worl');
//   e.waitUntil(p);
// });

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

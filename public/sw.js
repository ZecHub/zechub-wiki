self.addEventListener('install', () => {
  console.log('Service Worker installed');
});

self.addEventListener('push', (event) => {
  const data = event.data.json();

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
    })
  );
});

/**
 * Exception Rule of `Sending Notification`
 * The one scenario where you don't have to show a notification is when the user has your site open and focused.
 */
self.addEventListener('push', (event) => {
  const data = event.data.json();

  windowIsFocused(self).then((isFocused) => {
    if (isFocused) {
      console.log('Window is already focused; no need to show notification');
      return;
    }

    // if not
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: data.icon,
      })
    );
  });
});

// TODO: Write callback function for each of this events

self.addEventListener('notificationclick', (e) => {
  console.log('clicker here');
  console.log(e);
});

self.addEventListener('show', (e) => {
  console.log(e);
});

self.addEventListener('close', (e) => {
  console.log(e);
});

self.addEventListener('error', (e) => {
  console.log(e);
});

// self.addEventListener('notificationclick', function (event: any) {
//   console.log('Notification clicked: ', event.notification.tag);
//   event.notification.close();

//   event.waitUntil(
//     self.clients
//       .matchAll({
//         type: 'window',
//       })
//       .then(function (clientList) {
//         for (var i = 0; i < clientList.length; i++) {
//           var client = clientList[i];
//           if (client.url == '/' && 'focus' in client) {
//             return client.focus();
//           }
//         }
//         if (clients.openWindow) {
//           return clients.openWindow('/');
//         }
//       })
//   );
// });

// return () => {
//   self.removeEventListener('notificationclick',()=>{
//     console.log('notificationclick::listener');
//   })
// };


///////////////
/// helpers ///
///////////////

/**
 * This function check is a window client is the currently focus (active)
 * window the user is on
 * @returns boolean
 */
function windowIsFocused(clients) {
  return clients
    .matchAll({ type: 'window', includeUncontrolled: true })
    .then((winClients) => {
      let isFocused = false;

      for (let i = 0; i < winClients.length; i++) {
        const winClient = winClients[i];
        if (winClient.focused) {
          isFocused = true;
          break;
        }
      }

      return isFocused;
    });
}

/**
 * function to skip waiting
 */
async function skipWait() {
  const reg = await navigator.serviceWorker.getRegistration();

  if (!reg || !reg.waiting) return;

  reg.waiting.postMessage('skip-waiting');
}

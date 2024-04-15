import {
  WEB_PUSH_VAPID_PRIVATE_KEY,
  WEB_PUSH_VAPID_PUBLIC_KEY,
  WEB_PUSH_VAPID_SUBJECT,
} from '@/config';
import webpush from 'web-push';

type SendNotificationsType = {
  subscribers: PushSubscription[];
  payload: any;
};

export const sendNotifications = async ({
  subscribers,
  payload,
}: SendNotificationsType) => {

  console.log('payload', payload);

  try {
    // Send a push message to each client specified in the subscriptions array.
    subscribers.forEach(async (sub: PushSubscription & any) => {
      console.log('sub: ', sub);

      const res = await webpush.sendNotification(
        sub as any,
        JSON.stringify(payload),
        {
          TTL: 10000,
          vapidDetails: {
            subject: WEB_PUSH_VAPID_SUBJECT,
            privateKey: WEB_PUSH_VAPID_PRIVATE_KEY,
            publicKey: WEB_PUSH_VAPID_PUBLIC_KEY,
          },
        }
      );

      console.log(`Endpoing ID: ${res.body}`);
      console.log(`Result: ${res.statusCode}`);

      return res.statusCode;
    });
  } catch (err) {
    console.log(`Error 101: ${err} `);
    throw err;
  }
};

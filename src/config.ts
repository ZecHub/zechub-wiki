// Web Push
const WEB_PUSH_VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_WEB_PUSH_VAPID_PUBLIC_KEY || '';
const WEB_PUSH_VAPID_PRIVATE_KEY = process.env.WEB_PUSH_VAPID_PRIVATE_KEY || '';
const WEB_PUSH_VAPID_SUBJECT = process.env.WEB_PUSH_VAPID_SUBJECT || '';

// MONGO_DB
const MONGO_DB_CONNECTION_STRING_DEV =
  process.env.MONGO_DB_CONNECTION_STRING_DEV || '';
const MONGO_DB_CONNECTION_STRING_PROD =
  process.env.MONGO_DB_CONNECTION_STRING_PROD || '';

const GITHUB_ID = process.env.GITHUB_ID;
const GITHUB_SECRET = process.env.GITHUB_SECRET;
// PUSH NOTIFICATION
const PUSH_NOTIFICATION_API = {
  url: {
    subscription: '/admin/push-notification/api/subscription',
    notify: {
      one: '/admin/push-notification/api/notify/one',
      all: '/admin/push-notification/api/notify/all',
    },
  },
};

export {
  GITHUB_ID,
  GITHUB_SECRET,
  MONGO_DB_CONNECTION_STRING_DEV,
  MONGO_DB_CONNECTION_STRING_PROD,
  PUSH_NOTIFICATION_API,
  WEB_PUSH_VAPID_PRIVATE_KEY,
  WEB_PUSH_VAPID_PUBLIC_KEY,
  WEB_PUSH_VAPID_SUBJECT,
};

// Web Push
const WEB_PUSH_VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_WEB_PUSH_VAPID_PUBLIC_KEY || '';
const WEB_PUSH_VAPID_PRIVATE_KEY = process.env.WEB_PUSH_VAPID_PRIVATE_KEY || '';
const WEB_PUSH_VAPID_SUBJECT = process.env.WEB_PUSH_VAPID_SUBJECT || '';
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || '';

// MONGO_DB
const MONGO_DB_CONNECTION_STRING_DEV =
  process.env.MONGO_DB_CONNECTION_STRING_DEV || '';
const MONGO_DB_CONNECTION_STRING_PROD =
  process.env.MONGO_DB_CONNECTION_STRING_PROD || '';

const MONGO_DB_URI =
  MONGO_DB_CONNECTION_STRING_DEV || MONGO_DB_CONNECTION_STRING_PROD;

const GITHUB_ID = process.env.GITHUB_ID || '';
const GITHUB_SECRET = process.env.GITHUB_SECRET || '';
const NEXTAUTH_URL =
  process.env.NODE_ENV !== 'production'
    ? process.env.NEXTAUTH_URL_DEV
    : process.env.NEXTAUTH_URL_PROD;

// PUSH NOTIFICATION
const PUSH_NOTIFICATION_API = {
  url: {
    subscription: '/admin/push-notification/api/subscription',
    removeSubscription: '/admin/push-notification/api/remove-subscription',
    subscriptionWelcomeMsgs:
      '/admin/push-notification/api/subscription/welcome-message',
    notify: {
      one: '/admin/push-notification/api/notify/one',
      all: '/admin/push-notification/api/notify/all',
    },
  },
};

const NOTIFICATION_PERMISSION = 'zechub-wiki-notification-permission';
export {
  GITHUB_ID,
  GITHUB_SECRET,
  MONGO_DB_CONNECTION_STRING_DEV,
  MONGO_DB_CONNECTION_STRING_PROD,
  MONGO_DB_URI,
  NEXTAUTH_SECRET,
  NEXTAUTH_URL,
  NOTIFICATION_PERMISSION,
  PUSH_NOTIFICATION_API,
  WEB_PUSH_VAPID_PRIVATE_KEY,
  WEB_PUSH_VAPID_PUBLIC_KEY,
  WEB_PUSH_VAPID_SUBJECT,
};

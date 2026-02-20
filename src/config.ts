// Web Push
const WEB_PUSH_VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_WEB_PUSH_VAPID_PUBLIC_KEY || "";
const WEB_PUSH_VAPID_PRIVATE_KEY = process.env.WEB_PUSH_VAPID_PRIVATE_KEY || "";
const WEB_PUSH_VAPID_SUBJECT = process.env.WEB_PUSH_VAPID_SUBJECT || "";
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "";

// MONGO_DB
const MONGO_DB_CONNECTION_STRING_DEV =
  process.env.MONGO_DB_CONNECTION_STRING_DEV || "";
const MONGO_DB_CONNECTION_STRING_PROD =
  process.env.MONGO_DB_CONNECTION_STRING_PROD || "";

const MONGO_DB_URI =
  MONGO_DB_CONNECTION_STRING_DEV || MONGO_DB_CONNECTION_STRING_PROD;

const GITHUB_ID = process.env.GITHUB_ID || "";
const GITHUB_SECRET = process.env.GITHUB_SECRET || "";
const NEXTAUTH_URL =
  process.env.NODE_ENV !== "production"
    ? process.env.NEXTAUTH_URL_DEV
    : process.env.NEXTAUTH_URL_PROD;

// PUSH NOTIFICATION
const PUSH_NOTIFICATION_API = {
  url: {
    subscription: "/admin/push-notification/api/subscription",
    removeSubscription: "/admin/push-notification/api/remove-subscription",
    subscriptionWelcomeMsgs:
      "/admin/push-notification/api/subscription/welcome-message",
    notify: {
      one: "/admin/push-notification/api/notify/one",
      all: "/admin/push-notification/api/notify/all",
    },
  },
};

const NOTIFICATION_PERMISSION = "zechub-wiki-notification-permission";

// Zcash Improvement Proposals and Grants
const ZIPs_RAW_URL =
  "https://raw.githubusercontent.com/zcash/zips/main/README.rst";
const ZIPs_URL = "https://github.com/zcash/zips/blob/main/";
// const SPREADSHEET_ID = "1FQ28rDCyRW0TiNxrm3rgD8ai2KGUsXAjPieQmI1kKKg";
// const SHEET_ID = "803214474";
// const ZCG_GRANTS_GOOGLE_SHEET_URL =
//   `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit?gid=${SHEET_ID}#gid=${SHEET_ID}`;

const GOOGLE_ZCG_API_KEY = process.env.GOOGLE_ZCG_API_KEY;
const GOOGLE_ZCG_SERVICE_ACCOUNT_EMAIL =
  process.env.GOOGLE_ZCG_SERVICE_ACCOUNT_EMAIL;
const GOOGLE_ZCG_OAUTH_CLIENT_SECRET =
  process.env.GOOGLE_ZCG_OAUTH_CLIENT_SECRET;
const GOOGLE_ZCG_OAUTH_CLIENT_ID = process.env.GOOGLE_ZCG_OAUTH_CLIENT_ID;
const GOOGLE_ZCG_SPREADSHEET_ID = process.env.GOOGLE_ZCG_SPREADSHEET_ID;
const GOOGLE_ZCG_SHEET_ID = process.env.GOOGLE_ZCG_SHEET_ID;

export {
  GITHUB_ID,
  GITHUB_SECRET,
  GOOGLE_ZCG_API_KEY,
  GOOGLE_ZCG_OAUTH_CLIENT_ID,
  GOOGLE_ZCG_OAUTH_CLIENT_SECRET,
  GOOGLE_ZCG_SERVICE_ACCOUNT_EMAIL,
  GOOGLE_ZCG_SHEET_ID,
  GOOGLE_ZCG_SPREADSHEET_ID,
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
  ZIPs_RAW_URL,
  ZIPs_URL,
};

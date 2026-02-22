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
 const ZIPs_URL_PATH = `${ZIPs_URL}/README.rst`;

const GOOGLE_ZCG_SPREADSHEET_URL =
  "https://docs.google.com/spreadsheets/d/1FQ28rDCyRW0TiNxrm3rgD8ai2KGUsXAjPieQmI1kKKg/edit?gid=803214474#gid=803214474";

const GOOGLE_ZCG_SERVICE_ACCOUNT_CLIENT_EMAIL =
  process.env.GOOGLE_ZCG_SERVICE_ACCOUNT_CLIENT_EMAIL;
 
const GOOGLE_ZCG_SPREADSHEET_ID = process.env.GOOGLE_ZCG_SPREADSHEET_ID;
const GOOGLE_ZCG_SHEET_RANGE = process.env.GOOGLE_ZCG_SHEET_RANGE;
const GOOGLE_ZCG_SPREADSHEET_SCOPE = String(
  process.env.GOOGLE_ZCG_SPREADSHEET_SCOPE,
);

export {
  GITHUB_ID,
  GITHUB_SECRET,
  GOOGLE_ZCG_SERVICE_ACCOUNT_CLIENT_EMAIL,
  GOOGLE_ZCG_SHEET_RANGE,
  GOOGLE_ZCG_SPREADSHEET_ID,
  GOOGLE_ZCG_SPREADSHEET_SCOPE,
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
  GOOGLE_ZCG_SPREADSHEET_URL,
  ZIPs_URL_PATH,
};

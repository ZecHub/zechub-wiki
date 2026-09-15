export const config = {
  ZCASH_PAYMENT_WIDGET_TARGET: "#zcash-payment-widget-target",
  ZCASH_PAYMENT_WIDGET_EVENT_ENDPOINT: "/api/payment-request-uri",
  env: {
    // `?? ""` rather than String(...): a missing env var must resolve to an
    // empty string, not the literal string "undefined".
    ACCESS_CONTROL_ALLOW_ORIGIN: process.env.ACCESS_CONTROL_ALLOW_ORIGIN ?? "",
    NEXT_PUBLIC_WIDGET_API_BASE_URL:
      process.env.NEXT_PUBLIC_WIDGET_API_BASE_URL ?? "",
    NEXT_PUBLIC_API_BASE_URL_EMBED_CODE:
      process.env.NEXT_PUBLIC_API_BASE_URL_EMBED_CODE ?? "",
  },
};

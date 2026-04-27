export const config = {
  ZCASH_PAYMENT_WIDGET_TARGET: "#zcash-payment-widget-target",
  ZCASH_PAYMENT_WIDGET_EVENT_ENDPOINT: "/api/payment-request-uri",
  env: {
    ACCESS_CONTROL_ALLOW_ORIGIN: String(
      process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
    ),
    NEXT_PUBLIC_WIDGET_API_BASE_URL: String(
      process.env.NEXT_PUBLIC_WIDGET_API_BASE_URL,
    ),
    NEXT_PUBLIC_API_BASE_URL_EMBED_CODE: String(
      process.env.NEXT_PUBLIC_API_BASE_URL_EMBED_CODE,
    ),
  },
};

export const config = {
  WIDGET_CONTAINER: "#payment-request-container",
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

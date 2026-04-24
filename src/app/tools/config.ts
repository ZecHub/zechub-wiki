export const config = {
  env: {
    NEXT_PUBLIC_WIDGET_API_BASE_URL:
      String(process.env.NEXT_PUBLIC_WIDGET_API_BASE_URL),
    NEXT_PUBLIC_API_BASE_URL_EMBED_CODE:
      process.env.NEXT_PUBLIC_API_BASE_URL_EMBED_CODE,
  },
};

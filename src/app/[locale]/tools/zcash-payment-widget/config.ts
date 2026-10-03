// Takes the value, not the variable name: Next.js inlines NEXT_PUBLIC_* only
// where the code spells out process.env.NEXT_PUBLIC_..., so looking one up
// by a computed key is always undefined in the browser and fell back here.
function publicEnv(value: string | undefined, fallback: string): string {
  if (!value || value === "undefined" || value === "null") {
    return fallback;
  }
  return value;
}

export const config = {
  ZCASH_PAYMENT_WIDGET_TARGET: "#zcash-payment-widget-target",
  ZCASH_PAYMENT_WIDGET_EVENT_ENDPOINT: "/api/payment-request-uri/widget-telemetry",
  env: {
    ACCESS_CONTROL_ALLOW_ORIGIN: String(
      process.env.ACCESS_CONTROL_ALLOW_ORIGIN ?? "",
    ),
    NEXT_PUBLIC_WIDGET_API_BASE_URL: publicEnv(
      process.env.NEXT_PUBLIC_WIDGET_API_BASE_URL,
      "/api",
    ),
    NEXT_PUBLIC_API_BASE_URL_EMBED_CODE: publicEnv(
      process.env.NEXT_PUBLIC_API_BASE_URL_EMBED_CODE,
      "/zcash-payment-request-widget.embed.v2.js",
    ),
  },
};

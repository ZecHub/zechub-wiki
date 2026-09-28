import type { ZcashPaymentURIConfig, ZcashPaymentURIInstance } from "../types";

export {};

declare global {
  interface Window {
    renderZcashButton: (
      selector: string,
      opts: ZcashPaymentURIConfig,
    ) => Promise<ZcashPaymentURIInstance | null | undefined>;
  }
}

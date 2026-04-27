export interface ZcashPaymentURIConfig {
  address: string;
  amount: string | number;
  label?: string;
  theme?: "light" | "dark";
  memo?: string;
  apiBase: string;
  disabled?: boolean;
  target: string;
}

export interface ZcashPaymentURIInstance {
  open: () => void;
  close: () => void;
  destroy: () => void;
}

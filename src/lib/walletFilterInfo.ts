export type WalletFilterCategory =
  | "Devices"
  | "Operating System"
  | "Pools"
  | "Wallet Support"
  | "Features"
  | "Stage"
  | "Nym Mixnet"
  | "Source"
  | "NU7";

export type WalletFilterDescriptions = Partial<
  Record<WalletFilterCategory, string>
>;

export type WalletFilterItemDescriptions = Partial<
  Record<WalletFilterCategory, Partial<Record<string, string>>>
>;

export const walletFilterInfo: WalletFilterDescriptions = {};
export const walletFilterItemInfo: WalletFilterItemDescriptions = {};

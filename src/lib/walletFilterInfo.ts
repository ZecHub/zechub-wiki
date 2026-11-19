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

export const walletFilterInfo: WalletFilterDescriptions = {};

export interface PoolStageData {
    type?: 'pool';
    title: string;
    description: string;
    addressExample: string;
    privacy: string;
    color: string;
    icon: string;
    features: string[];
  }
  
  export interface TransactionStageData {
    type: 'transaction';
    title: string;
    description: string;
    from: string;
    to: string;
    amount: string;
    privacy: string;
    shielded: boolean;
    color: string;
  }
  
  export type StageData = PoolStageData | TransactionStageData;
  
  export const stages: StageData[] = [
    {
      title: "Transparent Pool (t-address)",
      description: "Public addresses similar to Bitcoin. All transaction details are visible on the blockchain.",
      addressExample: "t1ZEC...",
      privacy: "Very Low",
      color: "red",
      icon: "👁️",
      features: [
        "Starts with 't'",
        "Fully public",
        "Multi-signature support",
        "Used by exchanges"
      ]
    },
    {
      title: "Sprout Pool (zc-address)",
      description: "First zero-knowledge privacy protocol launched October 28, 2016. Legacy shielded pool.",
      addressExample: "zc...",
      privacy: "High",
      color: "blue",
      icon: "🌱",
      features: [
        "Starts with 'zc'",
        "First ZK protocol",
        "Limited efficiency",
        "Legacy pool"
      ]
    },
    {
      title: "Sapling Pool (zs-address)",
      description: "Major upgrade launched October 28, 2018. Fast and efficient shielded transactions.",
      addressExample: "zs...",
      privacy: "Very High",
      color: "green",
      icon: "🌿",
      features: [
        "Starts with 'zs'",
        "Fast transactions",
        "Improved viewing keys",
        "Hardware wallet support"
      ]
    },
    {
      title: "Orchard Pool (Unified Address)",
      description: "Most advanced pool launched May 31, 2022. No trusted setup required.",
      addressExample: "u1...",
      privacy: "Maximum",
      color: "purple",
      icon: "🌳",
      features: [
        "Unified addresses",
        "No trusted setup",
        "Best privacy",
        "Reduces metadata"
      ]
    },
    {
      type: "transaction",
      title: "Transaction: t→t (Public)",
      description: "Sending ZEC between transparent addresses. Fully visible like Bitcoin transactions.",
      from: "t-address",
      to: "t-address",
      amount: "10 ZEC",
      privacy: "No Privacy",
      shielded: false,
      color: "red"
    },
    {
      type: "transaction",
      title: "Transaction: t→z (Shielding)",
      description: "Moving ZEC from transparent to shielded pool. Increases privacy but source is visible.",
      from: "t-address",
      to: "z-address",
      amount: "10 ZEC",
      privacy: "Medium Privacy",
      shielded: true,
      color: "yellow"
    },
    {
      type: "transaction",
      title: "Transaction: z→z (Private)",
      description: "Fully shielded transaction. Amount, sender, and receiver are all private. RECOMMENDED!",
      from: "z-address",
      to: "z-address",
      amount: "??? ZEC",
      privacy: "Maximum Privacy",
      shielded: true,
      color: "green"
    }
  ];
import type { QuizQuestion } from "./QuizModule";

export const QUIZ_BEGINNER: QuizQuestion[] = [
  {
    question: "What do Zcash wallets provide for users?",
    options: [
      "Only transparent addresses",
      "Shielded functionality",
      "Mining only",
      "Exchange listing",
    ],
    correctIndex: 1,
  },
  {
    question: "How can you get ZEC in a permissionless way?",
    options: [
      "Only from banks",
      "Through centralized exchanges only",
      "Using decentralized exchanges (DEX)",
      "ZEC cannot be bought",
    ],
    correctIndex: 2,
  },
  {
    question: "Which shielded pool was introduced with Zcash NU6.3?",
    options: ["Transparent", "Sapling", "Orchard", "Ironwood"],
    correctIndex: 3,
  },
  {
    question:
      "What does a zk-SNARK proof demonstrate in a shielded transaction?",
    options: [
      "The transaction amount publicly",
      "Valid ownership without revealing details",
      "Only the sender address",
      "Mining reward",
    ],
    correctIndex: 1,
  },
  {
    question: "Where can you typically use ZEC for payments?",
    options: [
      "Only on one website",
      "Nowhere",
      "At merchants and services that accept ZEC",
      "Only in mining",
    ],
    correctIndex: 2,
  },
  {
    question: "What does Zcash infrastructure refer to?",
    options: [
      "Only one server",
      "How nodes, wallets, and network components work together",
      "Only websites",
      "Only mining pools",
    ],
    correctIndex: 1,
  },
];

export const QUIZ_INTERMEDIATE: QuizQuestion[] = [
  {
    question: "What is Halo 2 used for in Zcash?",
    options: [
      "Mining only",
      "Recursive zero-knowledge proofs",
      "Wallet storage",
      "Exchange trading",
    ],
    correctIndex: 1,
  },
  {
    question: "What are privacy use cases on Zcash?",
    options: [
      "Only personal use",
      "Real-world applications of privacy technology",
      "Only for miners",
      "There are none",
    ],
    correctIndex: 1,
  },
  {
    question: "How is Zcash development funded?",
    options: [
      "Only by one company",
      "Through governance and the Dev Fund",
      "Only by miners",
      "Exchanges only",
    ],
    correctIndex: 1,
  },
  {
    question: "What role do hash functions play in Zcash?",
    options: [
      "Mining rewards only",
      "Integrity, commitments, and binding data",
      "Only for addresses",
      "Display names",
    ],
    correctIndex: 1,
  },
  {
    question:
      "In a shielded Zcash transaction, what does the zk-SNARK proof allow a sender to demonstrate?",
    options: [
      "Their full wallet balance to the recipient",
      "Valid ownership and transaction correctness without revealing private inputs",
      "The memo contents to all network observers",
      "Which pool the funds originated from",
    ],
    correctIndex: 1,
  },
  {
    question:
      "What changed for the Orchard pool after NU6.3 activated?",
    options: [
      "Orchard became the only shielded pool that can receive new value",
      "New value can no longer enter Orchard, while funds can move out toward Ironwood",
      "Orchard became a transparent value pool",
      "All Orchard funds were automatically moved to Ironwood at activation",
    ],
    correctIndex: 1,
  },
  {
    question:
      "In a FROST t-of-n threshold signature scheme, how many participants must cooperate to produce a valid signature?",
    options: [
      "All n participants every time",
      "At least t participants",
      "Exactly one trusted coordinator",
      "A simple majority, regardless of t",
    ],
    correctIndex: 1,
  },
  {
    question: "What makes a FROST signature private on Zcash?",
    options: [
      "It hides the transaction amount on its own",
      "It is indistinguishable from an ordinary single-key Schnorr signature, so observers can't tell a group signed",
      "It publishes each signer's share on-chain",
      "It only works with transparent addresses",
    ],
    correctIndex: 1,
  },
  {
    question: "What does a value pool turnstile reveal?",
    options: [
      "The sender and receiver of every transaction",
      "Nothing at all — it is fully shielded",
      "The amount of value crossing between pools, while sender and receiver stay private",
      "Each user's total balance",
    ],
    correctIndex: 2,
  },
  {
    question: "Why was the Ironwood pool introduced in NU6.3?",
    options: [
      "To lower transaction fees",
      "To open a clean pool and seal Orchard behind a turnstile so supply can be audited after the circuit bug",
      "To replace proof-of-work with proof-of-stake",
      "To remove shielded transactions entirely",
    ],
    correctIndex: 1,
  },
];

export const QUIZ_CONTRIBUTORS: QuizQuestion[] = [
  {
    question: "How can you earn ZEC through ZecHub?",
    options: [
      "Only by mining",
      "By completing bounties and contributing",
      "By buying only",
      "ZecHub does not offer ZEC",
    ],
    correctIndex: 1,
  },
  {
    question: "What are Zcash Community Grants for?",
    options: [
      "Personal use",
      "Funding ecosystem projects and development",
      "Only for miners",
      "Exchange fees",
    ],
    correctIndex: 1,
  },
  {
    question: "Who directs Coinholder Directed Grants?",
    options: [
      "A single company",
      "ZEC holders (retroactive funding)",
      "Only developers",
      "Exchanges only",
    ],
    correctIndex: 1,
  },
  {
    question: "How do nodes in the Zcash network agree on the chain?",
    options: [
      "By voting on a leader",
      "Through consensus rules",
      "Only miners decide",
      "There is no agreement",
    ],
    correctIndex: 1,
  },
  {
    question: "What are Zcash keys used for?",
    options: [
      "Only for logging in",
      "Sending, receiving, and proving ownership of funds",
      "Mining only",
      "Website passwords",
    ],
    correctIndex: 1,
  },
  {
    question: "How can you contribute to Zcash open source?",
    options: [
      "Only by donating money",
      "Through code, docs, and repos listed in the visualizer",
      "Only by mining",
      "You cannot contribute",
    ],
    correctIndex: 1,
  },
  {
    question: "Where are ZecHub bounties managed?",
    options: [
      "A public Google Sheet",
      "ZEC Bounties at bounties.zechub.wiki",
      "Only in Discord threads",
      "By emailing the ZecHub team",
    ],
    correctIndex: 1,
  },
  {
    question: "How do you tell ZEC Bounties where to send your reward?",
    options: [
      "Post your address in Discord",
      "Rewards are sent to an exchange account",
      "Save a Unified Address (u1...) on your ZEC Bounties profile",
      "Rewards are claimed in person at an event",
    ],
    correctIndex: 2,
  },
  {
    question: "What does the ZKAV Club offer contributors?",
    options: [
      "Mining hardware rentals",
      "Paid audiovisual gigs and coordinator roles for documenting communities",
      "Exchange listings",
      "Free ZEC airdrops",
    ],
    correctIndex: 1,
  },
];

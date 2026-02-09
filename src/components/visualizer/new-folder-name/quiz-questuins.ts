import { QuizQuestion } from "./quiz-module";

// Beginner Section Quiz (Wallets, DEX, Pools, Pay with Zcash, zkProofs, Infrastructure)
export const beginnerQuizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question:
      "What is the primary purpose of shielded addresses in Zcash wallets?",
    options: [
      "To make transactions faster",
      "To protect transaction privacy by hiding sender, receiver, and amount",
      "To reduce transaction fees",
      "To increase mining rewards",
    ],
    correctAnswer: 1,
    explanation:
      "Shielded addresses use zero-knowledge proofs to hide transaction details including sender, receiver, and amount, providing strong privacy guarantees.",
  },
  {
    id: "q2",
    question:
      "What does DEX stand for in the context of cryptocurrency exchanges?",
    options: [
      "Digital Exchange eXperience",
      "Decentralized Exchange",
      "Direct Exchange",
      "Double Exchange",
    ],
    correctAnswer: 1,
    explanation:
      "DEX stands for Decentralized Exchange, which allows peer-to-peer trading without a centralized intermediary.",
  },
  {
    id: "q3",
    question: "Which Zcash pool provides the strongest privacy guarantees?",
    options: [
      "Transparent Pool",
      "Sprout Pool",
      "Sapling Pool",
      "Orchard Pool",
    ],
    correctAnswer: 3,
    explanation:
      "The Orchard Pool is the latest and most advanced shielded pool in Zcash, offering the strongest privacy guarantees with improved performance.",
  },
  {
    id: "q4",
    question: "What does zk-SNARK stand for?",
    options: [
      "Zero-Knowledge Succinct Non-Interactive Argument of Knowledge",
      "Zcash Knowledge Secure Network Authentication Reference Kit",
      "Zero-Key System for Network Authentication and Recognition",
      "Zcash Kernel Secure Network Application Resource Kit",
    ],
    correctAnswer: 0,
    explanation:
      "zk-SNARK stands for Zero-Knowledge Succinct Non-Interactive Argument of Knowledge. It's the cryptographic technology that enables private transactions on Zcash.",
  },
  {
    id: "q5",
    question:
      "What is the main advantage of using Zcash for payments compared to transparent cryptocurrencies?",
    options: [
      "Lower transaction fees",
      "Faster confirmation times",
      "Financial privacy protection",
      "Higher transaction throughput",
    ],
    correctAnswer: 2,
    explanation:
      "The main advantage of Zcash is its ability to protect financial privacy through shielded transactions, keeping transaction details confidential.",
  },
  {
    id: "q6",
    question:
      "Which component validates transactions and maintains consensus in the Zcash network?",
    options: ["Wallets", "Full nodes", "Light clients", "Block explorers"],
    correctAnswer: 1,
    explanation:
      "Full nodes validate all transactions and blocks, maintaining consensus and security in the Zcash network.",
  },
  {
    id: "q7",
    question: "What type of address starts with 'z' in Zcash?",
    options: [
      "Transparent address",
      "Shielded address",
      "Mining address",
      "Exchange address",
    ],
    correctAnswer: 1,
    explanation:
      "Shielded addresses in Zcash start with 'z' and provide privacy protection for transactions.",
  },
  {
    id: "q8",
    question:
      "Can you send ZEC from a shielded address to a transparent address?",
    options: [
      "No, it's not technically possible",
      "Yes, but the receiving amount becomes public",
      "Yes, and the transaction remains completely private",
      "Only with special permission from miners",
    ],
    correctAnswer: 1,
    explanation:
      "You can send from shielded to transparent addresses, but the receiving address and amount become visible on the transparent chain.",
  },
];

// Intermediate Section Quiz (Mining/Halo, Privacy Use Cases, Governance, Hash Functions)
export const intermediateQuizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "What is the mining algorithm used by Zcash?",
    options: ["SHA-256", "Scrypt", "Equihash", "Ethash"],
    correctAnswer: 2,
    explanation:
      "Zcash uses Equihash, a memory-hard Proof-of-Work algorithm designed to be ASIC-resistant initially.",
  },
  {
    id: "q2",
    question: "What is the key innovation of Halo 2 in Zcash?",
    options: [
      "Faster transaction speeds",
      "Recursive zero-knowledge proofs without a trusted setup",
      "Lower mining difficulty",
      "Built-in smart contracts",
    ],
    correctAnswer: 1,
    explanation:
      "Halo 2 enables recursive zero-knowledge proofs without requiring a trusted setup ceremony, making the system more secure and scalable.",
  },
  {
    id: "q3",
    question: "Which of these is NOT a valid privacy use case for Zcash?",
    options: [
      "Protecting personal financial data from surveillance",
      "Enabling confidential business transactions",
      "Anonymous voting in organizations",
      "Evading all legal tax obligations",
    ],
    correctAnswer: 3,
    explanation:
      "While Zcash provides privacy, it should be used responsibly and legally. Privacy is for protection, not for illegal tax evasion.",
  },
  {
    id: "q4",
    question: "How is the Zcash development fund governed?",
    options: [
      "Solely by the Electric Coin Company",
      "By a single foundation",
      "Through community consensus and coinvoting",
      "By miners only",
    ],
    correctAnswer: 2,
    explanation:
      "Zcash governance involves community consensus mechanisms including coinvoting, where ZEC holders can participate in funding decisions.",
  },
  {
    id: "q5",
    question:
      "What percentage of block rewards goes to the Zcash development fund?",
    options: ["0% - all goes to miners", "10%", "20%", "50%"],
    correctAnswer: 2,
    explanation:
      "Currently, 20% of block rewards go to the Zcash development fund, which supports ongoing development and ecosystem growth.",
  },
  {
    id: "q6",
    question:
      "What is a hash function's most important property for blockchain security?",
    options: [
      "It produces the same output every time for the same input",
      "It's computationally infeasible to reverse (find input from output)",
      "It runs very quickly",
      "It produces short outputs",
    ],
    correctAnswer: 1,
    explanation:
      "The one-way property (pre-image resistance) is crucial - it should be computationally infeasible to determine the input from the hash output.",
  },
  {
    id: "q7",
    question:
      "What makes Zcash suitable for confidential business transactions?",
    options: [
      "Transactions are completely untraceable by anyone",
      "Selective disclosure allows proving transaction details when needed",
      "All transactions are automatically public for auditing",
      "Only businesses can use shielded transactions",
    ],
    correctAnswer: 1,
    explanation:
      "Zcash supports selective disclosure, allowing users to prove specific transaction details to chosen parties (like auditors) while maintaining privacy from others.",
  },
  {
    id: "q8",
    question: "What is the significance of Zcash's halving events?",
    options: [
      "Transaction fees are cut in half",
      "Block rewards are reduced by 50%",
      "The development fund doubles",
      "Mining difficulty increases by 2x",
    ],
    correctAnswer: 1,
    explanation:
      "Like Bitcoin, Zcash has halving events approximately every 4 years where block rewards are cut in half, controlling the supply inflation rate.",
  },
];

// Contributors Section Quiz (Blockchain Foundation, Consensus, Keys, ZecHub, Grants, Repos)
export const contributorsQuizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "What consensus mechanism does Zcash use?",
    options: [
      "Proof of Stake (PoS)",
      "Proof of Work (PoW)",
      "Delegated Proof of Stake (DPoS)",
      "Proof of Authority (PoA)",
    ],
    correctAnswer: 1,
    explanation:
      "Zcash uses Proof of Work (PoW) with the Equihash algorithm for achieving network consensus.",
  },
  {
    id: "q2",
    question:
      "How many nodes need to agree to achieve consensus in a decentralized network?",
    options: [
      "Just one node decides for everyone",
      "Exactly 50% of nodes",
      "A majority of nodes following the same rules",
      "All nodes must agree unanimously",
    ],
    correctAnswer: 2,
    explanation:
      "Consensus is achieved when a majority of honest nodes following the protocol rules agree on the state of the blockchain.",
  },
  {
    id: "q3",
    question: "What is a viewing key in Zcash?",
    options: [
      "A key that allows spending funds",
      "A key that allows viewing transaction details without spending ability",
      "A key used for mining",
      "A key that creates new addresses",
    ],
    correctAnswer: 1,
    explanation:
      "A viewing key allows someone to view shielded transaction details (like an auditor) without the ability to spend the funds.",
  },
  {
    id: "q4",
    question: "What are ZecHub bounties?",
    options: [
      "Mining rewards for finding blocks",
      "Rewards for contributing content, tutorials, and improvements to Zcash education",
      "Bug bounties for security vulnerabilities only",
      "Staking rewards for holding ZEC",
    ],
    correctAnswer: 1,
    explanation:
      "ZecHub bounties reward community members for creating educational content, tutorials, documentation, and other contributions to the Zcash ecosystem.",
  },
  {
    id: "q5",
    question: "What is the purpose of Zcash Community Grants (ZCG)?",
    options: [
      "To provide loans to businesses",
      "To fund development, research, and ecosystem projects",
      "To distribute mining rewards",
      "To pay for marketing only",
    ],
    correctAnswer: 1,
    explanation:
      "Zcash Community Grants funds projects that advance the Zcash ecosystem, including development, research, infrastructure, and adoption efforts.",
  },
  {
    id: "q6",
    question: "What makes Coinholder Directed Grants unique?",
    options: [
      "They're larger than other grants",
      "ZEC holders vote on which projects receive retroactive funding",
      "They only fund mining operations",
      "They're distributed automatically",
    ],
    correctAnswer: 1,
    explanation:
      "Coinholder Directed Grants allow ZEC holders to vote on retroactive funding for completed work that benefited the Zcash ecosystem.",
  },
  {
    id: "q7",
    question: "What is the primary purpose of a blockchain explorer?",
    options: [
      "To mine new blocks",
      "To view and search blockchain data (transactions, blocks, addresses)",
      "To create new wallets",
      "To validate transactions",
    ],
    correctAnswer: 1,
    explanation:
      "A blockchain explorer is a tool that allows users to view, search, and analyze on-chain data like transactions, blocks, and addresses.",
  },
  {
    id: "q8",
    question:
      "Why is contributing to open-source Zcash repositories important?",
    options: [
      "It's required to use Zcash",
      "It helps improve, secure, and decentralize the protocol and ecosystem",
      "Contributors automatically receive mining rewards",
      "It's only important for developers at Electric Coin Co.",
    ],
    correctAnswer: 1,
    explanation:
      "Open-source contributions strengthen Zcash by improving code quality, adding features, fixing bugs, and decentralizing development efforts.",
  },
  {
    id: "q9",
    question:
      "What requirement exists for Coinholder Grant proposals over $50,000?",
    options: [
      "Must be submitted in person",
      "Requires KYC (Know Your Customer) verification",
      "Must be approved by miners",
      "Can only be requested by companies",
    ],
    correctAnswer: 1,
    explanation:
      "For compliance reasons, coinholder grant recipients requesting over $50,000 must complete KYC verification.",
  },
  {
    id: "q10",
    question:
      "What is the minimum quorum required for Coinholder Grant voting?",
    options: ["100,000 ZEC", "250,000 ZEC", "420,000 ZEC", "1,000,000 ZEC"],
    correctAnswer: 2,
    explanation:
      "Coinholder Grant voting requires a minimum quorum of 420,000 ZEC participating to ensure sufficient community engagement in funding decisions.",
  },
];

// components/ProjectGrid.tsx
import React from "react";
import ProjectCards from "../PrivacySet/ProjectCards/ProjectCards";
import styles from "./Grid.module.css";

const projects = [
  {
    title: "Maya Protocol",
    description:
      "Maya is a decentralized exchange (DEX) system that enables trading of cryptocurrencies across different blockchains",
    link: "https://zechub.wiki/guides/maya-protocol",
    imageUrl:
      "/content-images/GL3-I-yn-Wo-AAQc-Oi-23cd8178d9.webp",
  },
  {
    title: "Zcash Avalanche Redbridge",
    description: "The Zcash-Avalanche Red-Bridge is a decentralized bridge that enables interoperability between the Zcash (ZEC) and Avalanche (AVAX) blockchains",
    link: "https://zechub.wiki/guides/Avalanche-RedBridge#content",
    imageUrl:
      "/content-images/AVAX-TokenLaunch-Blog-Header-01b548a89a.webp",
  },
  {
    title: "Zaino Indexer",
    description: "Zaino is an Indexer, developed in Rust by the Zingo team, that aims to replace lightwalletd and to push forward the zcashd deprecation project",
    link: "https://zechub.wiki/zcash-tech/zaino#content",
    imageUrl:
      "https://zechub.wiki/_next/image?url=%2Fcontent-banners%2Fbannertech.png&w=1920&q=75",
  },
  {
    title: "FROST for Zcash",
    description: "FROST improves upon the state of the art in Schnorr threshold signature protocols, as it can be safely used without limiting concurrency of signing operations",
    link: "https://zfnd.org/frost/",
    imageUrl:
      "/content-images/image-2025-01-02-183754891-54bdc98463.webp",
  },
  {
    title: "Zcash Shielded Assets",
    description:
      "Zcash Shielded Assets (ZSA) are a proposed improvement to the the Zcash protocol that would enable the creation ",
    link: "https://zechub.wiki/zcash-tech/zcash-shielded-assets#content",
    imageUrl: "/content-images/image-2023-11-18-160742427-658dda69c0.webp",
  },
  {
    title: "Hybrid Proof of Stake (Crosslink)",
    description:
      "The Crosslink protocol is a proposed design for Zcash hybrid Proof-of-Work/Proof-of-Stake (PoW/PoS) stage",
    link: "https://zechub.wiki/zcash-tech/crosslink-protocol#content",
    imageUrl: "/content-images/image-2025-01-01-141008115-eec6ada37f.webp",
  },
  {
    title: "Metamask Shielded Snap",
    description:
      "The ongoing maintenance and support of the WebZJS library, Metamask Snap and associated browser wallet (soon in production)",
    link: "https://forum.zcashcommunity.com/t/webzjs-browser-library-and-browser-wallet-maintenance/49717",
    imageUrl: "/content-images/metamask-234363-555-e98aefe070.webp",
  },
  {
    title: "Brave Browser Shielded Wallet & Messaging Protocol",
    description:
      "Brave, Electric Coin Co. (ECC), and Filecoin Foundation announced that they are teaming up to bring innovative new privacy features to the Brave browser and its integrated Web3 wallet",
    link: "https://brave.com/blog/web3-privacy/",
    imageUrl: "/content-images/bravezcash-026d3ef54e.webp",
  },
  {
    title: "Nym Mixnet Network Privacy",
    description:
      "With this Nym integration, Zcash is moving to ensure that transactions are fully protected, even while in transit, by obscuring metadata and patterns of transactions",
    link: "https://blog.nymtech.net/zcash-nym-one-step-closer-to-a-full-privacy-payment-network-8b2276e7a55b",
    imageUrl: "/content-images/0-nj-QT1k62y3n-QYfwb-32815d7b1e.webp",
  },
  {
    title: "Project Tachyon",
    description: 
  "Project Tachyon is a major initiative to dramatically scale Zcash shielded transactions using proof-carrying wallets, oblivious synchronization, and transaction aggregation — enabling faster, lighter, and more private payments.",
    link: "https://hackmd.io/@RhipperBoy/HyRI_UT1gx",
    imageUrl: "/content-images/file_0000000006a462469eefcc3a38630375_co-77bb08f2ca.webp",
  },
  {
    title: "ZeWIF",
    description:
      "Zcash Extensible Wallet Interchange Format (ZeWIF) is a collaborative project by Zingo Labs and Blockchain Commons to improve Zcash wallet compatibility and interoperability.",
    link: "https://forum.zcashcommunity.com/t/zewif-is-ready-for-testing/50782",
    imageUrl: "/content-images/ZeWIF-a971bcb63c.webp",
    
  }
];

const Grid: React.FC = () => {
  return (
    <div className={styles.project_grid}>
      {projects.map((project, index) => (
        <ProjectCards
          key={index}
          title={project.title}
          description={project.description}
          link={project.link}
          imageSrc={project.imageUrl}
        />
      ))}
    </div>
  );
};

export default Grid;
